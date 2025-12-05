import { getCurrentInstance } from 'vue'
import {
  ExtensionHooks,
  getValueFromAppContext,
  setValueToAppContext,
} from './core'
import { routerStack, type RouterStackItem } from '@0x30/navigation-core'

export type ProgressExitAnimatedHandler = (
  elements: { from?: Element; to?: Element },
  progress: number,
  isFinish?: boolean
) => void

/**
 * 当接收到滑动手势渐进式返回执行动画时
 */
export const useProgressExitAnimated = (hook: ProgressExitAnimatedHandler) => {
  setValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.ProgressExitAnimated,
    hook
  )
}

/**
 * 获取进度退出动画 handler
 */
export const getProgressExitAnimated = (
  item: RouterStackItem & { context: { _context: any } }
) => {
  return getValueFromAppContext<ProgressExitAnimatedHandler>(
    item?.context?._context,
    ExtensionHooks.ProgressExitAnimated
  )
}

/**
 * 执行渐进式动画
 */
export const execProgressExitAnimated = (
  elements: { from?: Element; to?: Element },
  progress: number,
  isFinish?: boolean
) => {
  const lastItem = routerStack[routerStack.length - 1] as
    | (RouterStackItem & { context: { _context: any } })
    | undefined
  if (!lastItem) return

  const hook = getProgressExitAnimated(lastItem)
  hook?.(elements, progress, isFinish)
}
