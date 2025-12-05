import {
  type App,
  getCurrentInstance,
  onMounted,
  defineComponent,
  type VNode,
  type Plugin,
  type Component,
} from 'vue'
import {
  disableBodyPointerEvents,
  enableBodyPointerEvents,
  randomId,
  setBackHook,
  routerStack,
  listenPopState,
  startScreenEdgePanGestureRecognizer,
  registerUnmountCallback,
  registerLeaveBeforeHooks,
  registerGestureHooks,
  startBlackBack,
  pushRouterItem,
  currentSessionId,
  setCurrentState,
} from '@0x30/navigation-core'
import { mounted, unmounted, type LifeCycleHooks, type VueRouterStackItem } from './manage'
import { getLeaveBefore, setLeaveBefore } from './hooks/leaveBefore'
import { getProgressExitAnimated } from './hooks/progressExitAnimated'

// 注册 Vue 相关的回调
const setupVueCallbacks = () => {
  // 注册 unmount 回调
  registerUnmountCallback((item, needAnimated, needApplyBackHook, backHookId) => {
    const vueItem = item as VueRouterStackItem
    unmounted(needAnimated, needApplyBackHook, vueItem.context, backHookId)
  })

  // 注册 leaveBefore hooks
  registerLeaveBeforeHooks(
    (item) => {
      const vueItem = item as VueRouterStackItem
      return getLeaveBefore(vueItem.context?._context)
    },
    (item, hook) => {
      const vueItem = item as VueRouterStackItem
      setLeaveBefore(vueItem.context?._context, hook as any)
    }
  )

  // 注册手势相关 hooks
  registerGestureHooks(
    (item) => getProgressExitAnimated(item),
    (item) => {
      const vueItem = item as VueRouterStackItem
      return getLeaveBefore(vueItem.context?._context)
    }
  )
}

/**
 * 前进方法
 */
export const push = async (component: Component | VNode, hooks?: LifeCycleHooks) => {
  disableBodyPointerEvents()
  const item = await mounted(component, false, hooks)

  // 维护 history state
  window.history.pushState(
    setCurrentState({
      index: routerStack.length,
      session: currentSessionId,
    }),
    ''
  )

  pushRouterItem(item)
  enableBodyPointerEvents()
  return item.context
}

/**
 * 替换方法
 */
export const replace = async (component: Component | VNode, hooks?: LifeCycleHooks) => {
  disableBodyPointerEvents()
  const item = await mounted(component, true, hooks)

  pushRouterItem(item)
  enableBodyPointerEvents()
  return item.context
}

/**
 * 返回当前最顶部页面方法
 */
export const goBack = (delta: number = 1) => {
  disableBodyPointerEvents()
  return new Promise<void>((resolve) => {
    setBackHook(randomId(), resolve)
    const d = typeof delta === 'number' ? delta : 1
    window.history.go(-Math.abs(d))
  })
}

/**
 * 固定返回一次
 */
export const back = () => goBack(1)

/**
 * 前往页面
 */
export const to = (isReplace: boolean) => (isReplace ? replace : push)

/**
 * 黑箱返回
 * 场景: 页面堆栈为 a -> b -> c -> d，调用 blackBoxBack(2) 后变为 a -> d
 */
export const blackBoxBack = async (delta: number) => {
  startBlackBack()
  await goBack(delta)
}

/**
 * 返回到首页
 */
export const backToHome = async () => {
  await goBack(routerStack.length - 1)
}

/**
 * Navigator 组件
 */
export const Navigator = defineComponent({
  name: 'NavigatorController',
  setup: (_, { slots }) => {
    setupVueCallbacks()

    const currentApp = getCurrentInstance()!.appContext.app

    // 将当前 app 添加到路由栈
    const container = currentApp._container as HTMLElement
    const item: VueRouterStackItem = {
      id: randomId(),
      context: currentApp,
      container,
    }
    pushRouterItem(item)

    const { add } = listenPopState(true)
    onMounted(add)
    onMounted(startScreenEdgePanGestureRecognizer)

    return () => slots.default?.()
  },
})

/**
 * Vue Plugin
 */
export const navigation: Plugin = {
  install(app: App) {
    setupVueCallbacks()

    // 将当前 app 添加到路由栈
    const container = app._container as HTMLElement
    const item: VueRouterStackItem = {
      id: randomId(),
      context: app,
      container,
    }
    pushRouterItem(item)

    const { add } = listenPopState(true)
    add()
    startScreenEdgePanGestureRecognizer()
  },
}
