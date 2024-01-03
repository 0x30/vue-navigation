import { type AppContext, getCurrentInstance } from 'vue'

import {
  ExtensionHooks,
  addValueToAppContext,
  getExtData,
  getValueFromAppContext,
  setExtData,
} from './core'
import { applyFuns } from '../util'

/**
 * 该项目在有新的页面
 * 1. 进入的时候，触发上一个页面的 onDeactivate
 * 2. 离开的时候，触发上一个页面的 onActivate 事件
 * 当你写了一个 Loading 加载中组件，当作一个页面,那么 你可以将它设置为 安静的页面;
 * 那么在他出现的时候，不会触发上一个页面的 deactived,在 Loading 页面消失之后， 也不会触发上一个页面的 actived 页面
 */
const useQuietPage = () => {
  setExtData(getCurrentInstance()?.appContext, { __is_quiet_page: true })
}

const getIsQuietPage = (context: AppContext | undefined) => {
  return (
    getExtData<{
      __is_quiet_page: boolean | undefined
    }>(context)?.__is_quiet_page === true
  )
}

/**
 * 页面即将展示hook
 * 执行动画前
 * @param hook
 */
const onWillAppear = (hook: (isFirst: boolean) => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onWillAppear,
    hook,
  )
}

/**
 * 页面即将消失hook
 * 执行动画前
 * @param hook
 */
const onWillDisappear = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onWillDisappear,
    hook,
  )
}

/**
 * 页面即将展示hook
 * 执行动画后
 */
const onDidAppear = (hook: (isFirst: boolean) => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onDidAppear,
    hook,
  )
}
/**
 * 页面即将消失hook
 * 执行动画后
 */
const onDidDisappear = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onDidDisappear,
    hook,
  )
}

const triggerPageAppearHooks = (
  context: AppContext | undefined,
  type:
    | ExtensionHooks.onWillAppear
    | ExtensionHooks.onWillDisappear
    | ExtensionHooks.onDidAppear
    | ExtensionHooks.onDidDisappear,
  isFirst?: boolean,
) => {
  const hooks = getValueFromAppContext<((isFirst: boolean) => void)[]>(
    context,
    type,
  )
  applyFuns(hooks, [isFirst])
}

export {
  useQuietPage,
  getIsQuietPage,
  onWillAppear,
  onWillDisappear,
  onDidAppear,
  onDidDisappear,
  triggerPageAppearHooks,
}
