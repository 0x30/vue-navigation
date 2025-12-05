/**
 * 页面切换的时候 进行执行动画
 */

import { getCurrentInstance, type AppContext } from 'vue'
import {
  ExtensionHooks,
  getValueFromAppContext,
  setValueToAppContext,
} from './core'

type TransitionAmimatorHook = (
  elements: {
    from?: Element
    to?: Element
  },
  done: () => void,
) => void

/**
 * private: 私有方法
 * @param context
 * @param batchId
 * @returns
 */
const setCancelBatchId = (context: AppContext | undefined, batchId: string) => {
  setValueToAppContext(context, ExtensionHooks.cancelBatchId, batchId)
  return batchId
}

const getCancelBatchId = (context: AppContext | undefined) => {
  return getValueFromAppContext<string>(context, ExtensionHooks.cancelBatchId)
}

/**
 * 在页面进入时设置 动画执行方法
 * 请保证该方法只被注册一次,多次注册将覆盖
 */
const useTransitionEnter = (hook: TransitionAmimatorHook) => {
  setValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onEnter,
    hook,
  )
}

/**
 * 在页面离开时设置 动画执行方法
 * 请保证该方法只被注册一次,多次注册将覆盖
 */
const useTransitionLeave = (hook: TransitionAmimatorHook) => {
  setValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onLeave,
    hook,
  )
}

const setClose = (
  context: AppContext | undefined,
  hook: (done: () => void) => void,
) => {
  setValueToAppContext(context, ExtensionHooks.close, hook)
}

const getClose = (context: AppContext | undefined) => {
  return getValueFromAppContext<(done: () => void) => void>(
    context,
    ExtensionHooks.close,
  )
}

const execAnimator = (
  type: ExtensionHooks,
  context: AppContext | undefined,
  from?: Element,
  to?: Element,
) => {
  return new Promise<void>((reslove) => {
    const hook = getValueFromAppContext<TransitionAmimatorHook>(context, type)
    if (hook) {
      hook?.apply(null, [{ from, to }, reslove])
    } else {
      reslove()
    }
  })
}

const execEnterAnimator = (
  context: AppContext | undefined,
  from?: Element,
  to?: Element,
) => execAnimator(ExtensionHooks.onEnter, context, from, to)

const execLeaveAnimator = (
  context: AppContext | undefined,
  from?: Element,
  to?: Element,
) => execAnimator(ExtensionHooks.onLeave, context, from, to)

export {
  type TransitionAmimatorHook,
  setCancelBatchId,
  getCancelBatchId,
  setClose,
  getClose,
  execEnterAnimator,
  execLeaveAnimator,
  useTransitionEnter,
  useTransitionLeave,
}
