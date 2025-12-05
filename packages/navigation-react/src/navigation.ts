import type { ReactElement } from 'react'
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
  initDisableAllPointerEvents,
} from '@0x30/navigation-core'
import { mounted, unmounted } from './manage'
import type { ReactRouterStackItem } from './state'

/**
 * 设置 React 相关的回调
 */
const setupReactCallbacks = () => {
  // 注册 unmount 回调
  registerUnmountCallback((item, needAnimated, needApplyBackHook, backHookId) => {
    const reactItem = item as ReactRouterStackItem
    unmounted(needAnimated, needApplyBackHook, reactItem, backHookId)
  })

  // 注册 leaveBefore hooks
  registerLeaveBeforeHooks(
    (item) => {
      const reactItem = item as ReactRouterStackItem
      return reactItem.hooks?.leaveBefore
    },
    (item, hook) => {
      const reactItem = item as ReactRouterStackItem
      if (reactItem.hooks) {
        reactItem.hooks.leaveBefore = hook as (() => boolean | Promise<boolean>) | undefined
      }
    }
  )

  // 注册手势相关 hooks
  registerGestureHooks(
    (item) => {
      const reactItem = item as ReactRouterStackItem
      return reactItem.hooks?.progressExitAnimated
    },
    (item) => {
      const reactItem = item as ReactRouterStackItem
      return reactItem.hooks?.leaveBefore
    }
  )
}

let isInitialized = false

/**
 * 初始化导航系统
 */
export const initNavigation = () => {
  if (isInitialized) return
  isInitialized = true

  setupReactCallbacks()
  initDisableAllPointerEvents()

  const { add } = listenPopState(true)
  add()
  startScreenEdgePanGestureRecognizer()
}

/**
 * 前进方法
 */
export const push = async (element: ReactElement) => {
  initNavigation()
  
  disableBodyPointerEvents()
  const item = await mounted(element, false)

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
  return item
}

/**
 * 替换方法
 */
export const replace = async (element: ReactElement) => {
  initNavigation()
  
  disableBodyPointerEvents()
  const item = await mounted(element, true)

  pushRouterItem(item)
  enableBodyPointerEvents()
  return item
}

/**
 * 返回方法
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
