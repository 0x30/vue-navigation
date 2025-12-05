import {
  currentSessionId,
  routerStack,
  setBackHook,
  setCurrentState,
  pushRouterItem,
  spliceRouterItems,
  type RouterStackItem,
} from './state'
import { startBlackBack } from './back'
import { disableBodyPointerEvents, enableBodyPointerEvents } from './pointer-events'
import { randomId } from './utils'

/**
 * Mount 回调类型 - 由框架层实现
 */
export type MountCallback = (
  replace: boolean
) => Promise<RouterStackItem>

let mountCallback: MountCallback | undefined

/**
 * 注册 mount 回调
 */
export const registerMountCallback = (callback: MountCallback) => {
  mountCallback = callback
}

/**
 * 前进方法
 */
export const push = async () => {
  if (!mountCallback) {
    throw new Error('Mount callback not registered. Please use framework-specific navigation package.')
  }

  disableBodyPointerEvents()
  const item = await mountCallback(false)
  
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
export const replace = async () => {
  if (!mountCallback) {
    throw new Error('Mount callback not registered. Please use framework-specific navigation package.')
  }

  disableBodyPointerEvents()
  const item = await mountCallback(true)
  
  // 替换时移除倒数第二个
  if (routerStack.length > 0) {
    spliceRouterItems(routerStack.length - 1, 1)
  }
  
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
