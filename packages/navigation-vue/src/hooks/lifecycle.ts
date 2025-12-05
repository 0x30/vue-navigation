import { type AppContext, getCurrentInstance } from 'vue'
import { applyFuns } from '@0x30/navigation-core'
import {
  ExtensionHooks,
  addValueToAppContext,
  getExtData,
  getValueFromAppContext,
  setExtData,
} from './core'

/**
 * 当你写了一个 Loading 加载中组件当作一个页面时，可以将它设置为安静的页面
 * 那么在它出现的时候，不会触发上一个页面的 deactivated
 * 在 Loading 页面消失之后，也不会触发上一个页面的 activated
 */
export const useQuietPage = () => {
  setExtData(getCurrentInstance()?.appContext, { __is_quiet_page: true })
}

export const getIsQuietPage = (context: AppContext | undefined) => {
  return (
    getExtData<{ __is_quiet_page: boolean | undefined }>(context)
      ?.__is_quiet_page === true
  )
}

/**
 * 页面即将展示 hook（执行动画前）
 */
export const onWillAppear = (hook: (isFirst: boolean) => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onWillAppear,
    hook
  )
}

/**
 * 页面即将消失 hook（执行动画前）
 */
export const onWillDisappear = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onWillDisappear,
    hook
  )
}

/**
 * 页面已经展示 hook（执行动画后）
 */
export const onDidAppear = (hook: (isFirst: boolean) => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onDidAppear,
    hook
  )
}

/**
 * 页面已经消失 hook（执行动画后）
 */
export const onDidDisappear = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onDidDisappear,
    hook
  )
}

export const triggerPageAppearHooks = (
  context: AppContext | undefined,
  type:
    | ExtensionHooks.onWillAppear
    | ExtensionHooks.onWillDisappear
    | ExtensionHooks.onDidAppear
    | ExtensionHooks.onDidDisappear,
  isFirst?: boolean
) => {
  const hooks = getValueFromAppContext<((isFirst: boolean) => void)[]>(
    context,
    type
  )
  applyFuns(hooks, [isFirst])
}
