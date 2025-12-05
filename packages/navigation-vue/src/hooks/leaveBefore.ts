import { type AppContext, getCurrentInstance, onUnmounted } from 'vue'
import {
  ExtensionHooks,
  getValueFromAppContext,
  setValueToAppContext,
} from './core'

export type LeaveBeforeHook = () => boolean | Promise<boolean>

/**
 * 在页面即将返回的时候，会调用 hook 方法，返回是否可以返回
 * 该方法如果在某个页面多次注册，会覆盖请注意
 */
export const useLeaveBefore = (hook: LeaveBeforeHook) => {
  setLeaveBefore(getCurrentInstance()?.appContext, hook)
  onUnmounted(() => {
    setLeaveBefore(getCurrentInstance()?.appContext, undefined)
  })
}

export const getLeaveBefore = (context: AppContext | undefined) =>
  getValueFromAppContext<LeaveBeforeHook>(context, ExtensionHooks.onLeaveBefore)

export const setLeaveBefore = (
  context: AppContext | undefined,
  func?: LeaveBeforeHook
) => setValueToAppContext(context, ExtensionHooks.onLeaveBefore, func)
