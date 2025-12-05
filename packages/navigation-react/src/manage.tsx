import React, {
  type ReactElement,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import { createRoot } from 'react-dom/client'
import {
  routerStack,
  spliceRouterItems,
  applyBackHook,
  enableBodyPointerEvents,
} from '@0x30/navigation-core'
import { PageContext } from './context'
import {
  type ReactRouterStackItem,
  createReactRouterItem,
  getLastReactItem,
} from './state'
import {
  triggerWillAppear,
  triggerDidAppear,
  triggerWillDisappear,
  triggerDidDisappear,
  cleanupLifecycleCallbacks,
} from './hooks'

/**
 * 获取容器的页面内容元素
 * container 的第一个子元素就是实际的页面内容
 */
const getPageElement = (container?: HTMLElement): Element | undefined => {
  if (container?.childElementCount === 1) {
    return container.children[0]
  }
  return container
}

/**
 * 页面包装组件
 */
interface PageWrapperProps {
  item: ReactRouterStackItem
  lastItem: ReactRouterStackItem | undefined
  children: ReactElement
  onMounted: () => void
  onUnmounting: (done: () => void) => void
  isLeaving: boolean
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  item,
  lastItem,
  children,
  onMounted,
  onUnmounting,
  isLeaving,
}) => {
  const hasEntered = useRef(false)

  const updateHooks = useCallback(
    (hooks: Partial<ReactRouterStackItem['hooks']>) => {
      Object.assign(item.hooks, hooks)
    },
    [item]
  )

  // 进入动画 - 使用 useLayoutEffect 确保在子组件渲染后、浏览器绑制前执行
  useLayoutEffect(() => {
    if (hasEntered.current) return
    hasEntered.current = true

    // 获取上一个页面的元素（使用传入的 lastItem，而不是从 routerStack 获取）
    const from = getPageElement(lastItem?.container)
    const to = getPageElement(item.container)

    // 触发生命周期
    if (!item.hooks.isQuietPage && lastItem) {
      triggerWillDisappear(lastItem.id)
    }
    triggerWillAppear(item.id, true)

    const complete = () => {
      if (!item.hooks.isQuietPage && lastItem) {
        triggerDidDisappear(lastItem.id)
      }
      triggerDidAppear(item.id, true)
      onMounted()
    }

    // 执行进入动画
    if (item.hooks.transitionEnter && to) {
      item.hooks.transitionEnter({ from, to }, complete)
    } else {
      complete()
    }
  }, [item, onMounted])

  // 离开动画
  useEffect(() => {
    if (!isLeaving) return

    const nextItem = getLastReactItem()
    const from = getPageElement(item.container)
    const to = getPageElement(nextItem?.container)

    // 触发生命周期
    triggerWillDisappear(item.id)
    if (!item.hooks.isQuietPage && nextItem) {
      triggerWillAppear(nextItem.id, false)
    }

    const complete = () => {
      triggerDidDisappear(item.id)
      if (!item.hooks.isQuietPage && nextItem) {
        triggerDidAppear(nextItem.id, false)
      }
      // 调用离开完成回调
      if (item.hooks.onLeaveComplete) {
        item.hooks.onLeaveComplete()
      }
      onUnmounting(() => {})
    }

    // 执行离开动画
    if (item.hooks.transitionLeave && from) {
      item.hooks.transitionLeave({ from, to }, complete)
    } else {
      complete()
    }
  }, [isLeaving, item, onUnmounting])

  // 设置 close 回调
  useEffect(() => {
    item.hooks.onClose = (done) => {
      onUnmounting(done)
    }
  }, [item, onUnmounting])

  return (
    <PageContext.Provider value={{ item, updateHooks }}>
      {children}
    </PageContext.Provider>
  )
}

/**
 * 挂载页面
 */
export const mounted = (
  element: ReactElement,
  replace: boolean
): Promise<ReactRouterStackItem> => {
  return new Promise((resolve) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const root = createRoot(container)
    const item = createReactRouterItem(element, container, root)

    // 在渲染前获取上一个页面，和 Vue 保持一致
    const lastItem = getLastReactItem()

    // 用于触发离开动画的回调
    let setLeavingCallback: ((leaving: boolean) => void) | null = null

    const onMounted = () => {
      // 替换模式：移除倒数第二个页面
      if (replace && routerStack.length > 1) {
        const removedItems = spliceRouterItems(routerStack.length - 2, 1) as ReactRouterStackItem[]
        removedItems.forEach((removedItem) => {
          unmounted(false, false, removedItem)
        })
      }
      resolve(item)
    }

    const onUnmounting = (done: () => void) => {
      done()
    }

    // 设置触发离开动画的方法
    item.hooks.triggerLeave = (done: () => void) => {
      if (setLeavingCallback) {
        // 存储 done 回调
        item.hooks.onLeaveComplete = done
        setLeavingCallback(true)
      } else {
        done()
      }
    }

    // 使用一个包装组件来管理状态
    const App = () => {
      const [leaving, setLeaving] = useState(false)
      
      // 保存 setLeaving 的引用
      useEffect(() => {
        setLeavingCallback = setLeaving
        return () => {
          setLeavingCallback = null
        }
      }, [])

      return (
        <PageWrapper
          item={item}
          lastItem={lastItem}
          onMounted={onMounted}
          onUnmounting={onUnmounting}
          isLeaving={leaving}
        >
          {element}
        </PageWrapper>
      )
    }

    root.render(<App />)
  })
}

/**
 * 卸载页面
 */
export const unmounted = (
  needAnimated: boolean,
  needApplyBackHook: boolean,
  item?: ReactRouterStackItem,
  backHookId?: string
) => {
  if (!item) return

  const doUnmount = () => {
    cleanupLifecycleCallbacks(item.id)
    item.root.unmount()
    item.container.parentElement?.removeChild(item.container)

    if (needApplyBackHook) {
      enableBodyPointerEvents()
      applyBackHook(backHookId)
    }
  }

  if (needAnimated && item.hooks.triggerLeave) {
    // 触发离开动画
    item.hooks.triggerLeave(doUnmount)
  } else if (needAnimated && item.hooks.onClose) {
    // 兼容旧方式
    item.hooks.onClose(doUnmount)
  } else {
    doUnmount()
  }
}
