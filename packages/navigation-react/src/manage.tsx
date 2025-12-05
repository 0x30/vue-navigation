import React, {
  type ReactElement,
  useState,
  useCallback,
  useEffect,
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
 * 获取容器的第一个子元素
 */
const getChildren = (ele?: HTMLElement): Element | undefined => {
  if (ele?.childElementCount === 1) return ele.children[0]
  return ele
}

/**
 * 页面包装组件
 */
interface PageWrapperProps {
  item: ReactRouterStackItem
  children: ReactElement
  onMounted: () => void
  onUnmounting: (done: () => void) => void
  isLeaving: boolean
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  item,
  children,
  onMounted,
  onUnmounting,
  isLeaving,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasEntered = useRef(false)

  const updateHooks = useCallback(
    (hooks: Partial<ReactRouterStackItem['hooks']>) => {
      Object.assign(item.hooks, hooks)
    },
    [item]
  )

  // 进入动画
  useEffect(() => {
    if (hasEntered.current) return
    hasEntered.current = true

    setIsVisible(true)

    // 获取上一个页面的元素
    const lastItem = routerStack[routerStack.length - 2] as ReactRouterStackItem | undefined
    const from = getChildren(lastItem?.container)
    const to = containerRef.current?.children[0]

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
    const from = containerRef.current?.children[0]
    const to = getChildren(nextItem?.container)

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
      onUnmounting(() => {
        setIsVisible(false)
      })
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
      <div ref={containerRef} style={{ display: isVisible ? 'block' : 'none' }}>
        {children}
      </div>
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

    // 使用一个包装组件来管理状态
    const App = () => {
      const [leaving] = useState(false)

      return (
        <PageWrapper
          item={item}
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

  if (needAnimated && item.hooks.onClose) {
    item.hooks.onClose(doUnmount)
  } else {
    doUnmount()
  }
}
