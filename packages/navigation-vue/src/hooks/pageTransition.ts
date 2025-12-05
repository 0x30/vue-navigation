import { getCurrentInstance, type AppContext } from 'vue'
import {
  ExtensionHooks,
  getValueFromAppContext,
  setValueToAppContext,
} from './core'

export type TransitionAnimatorHook = (
  elements: { from?: Element; to?: Element },
  done: () => void
) => void

/**
 * 在页面进入时设置动画执行方法
 * 请保证该方法只被注册一次，多次注册将覆盖
 */
export const useTransitionEnter = (hook: TransitionAnimatorHook) => {
  setValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onEnter,
    hook
  )
}

/**
 * 在页面离开时设置动画执行方法
 * 请保证该方法只被注册一次，多次注册将覆盖
 */
export const useTransitionLeave = (hook: TransitionAnimatorHook) => {
  setValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onLeave,
    hook
  )
}

export const setClose = (
  context: AppContext | undefined,
  hook: (done: () => void) => void
) => {
  setValueToAppContext(context, ExtensionHooks.close, hook)
}

export const getClose = (context: AppContext | undefined) => {
  return getValueFromAppContext<(done: () => void) => void>(
    context,
    ExtensionHooks.close
  )
}

const execAnimator = (
  type: ExtensionHooks,
  context: AppContext | undefined,
  from?: Element,
  to?: Element
) => {
  return new Promise<void>((resolve) => {
    const hook = getValueFromAppContext<TransitionAnimatorHook>(context, type)
    if (hook) {
      hook({ from, to }, resolve)
    } else {
      resolve()
    }
  })
}

export const execEnterAnimator = (
  context: AppContext | undefined,
  from?: Element,
  to?: Element
) => execAnimator(ExtensionHooks.onEnter, context, from, to)

export const execLeaveAnimator = (
  context: AppContext | undefined,
  from?: Element,
  to?: Element
) => execAnimator(ExtensionHooks.onLeave, context, from, to)

/**
 * Cancel Batch ID 管理
 */
export const setCancelBatchId = (
  context: AppContext | undefined,
  batchId: string
) => {
  setValueToAppContext(context, ExtensionHooks.cancelBatchId, batchId)
  return batchId
}

export const getCancelBatchId = (context: AppContext | undefined) => {
  return getValueFromAppContext<string>(context, ExtensionHooks.cancelBatchId)
}
