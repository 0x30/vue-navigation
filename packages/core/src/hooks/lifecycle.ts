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
const onWillAppear = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onWillActivated,
    hook,
  )
}

const triggerWillAppear = (context: AppContext | undefined) => {
  const hooks = getValueFromAppContext<(() => void)[]>(
    context,
    ExtensionHooks.onWillActivated,
  )
  applyFuns(hooks)
}

/**
 * 页面即将消失hook
 * 执行动画前
 * @param hook
 */
const onWillDisappear = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onWillDeactivated,
    hook,
  )
}

const triggerWillDisappear = (context: AppContext | undefined) => {
  const hooks = getValueFromAppContext<(() => void)[]>(
    context,
    ExtensionHooks.onWillDeactivated,
  )
  applyFuns(hooks)
}

/**
 * 页面即将展示hook
 * 执行动画后
 */
const onDidAppear = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onActivated,
    hook,
  )
}

const triggerDidAppear = (context: AppContext | undefined) => {
  const hooks = getValueFromAppContext<(() => void)[]>(
    context,
    ExtensionHooks.onActivated,
  )
  applyFuns(hooks)
}

/**
 * 页面即将消失hook
 * 执行动画后
 */
const onDidDisappear = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onDeactivated,
    hook,
  )
}

/**
 * 根据 提供的 appContext 获取吗，该上下文中所有的应用进入非活跃的hook方法
 * @param context App Context
 * @returns hooks 方法
 */
const triggerDidDisappear = (context: AppContext | undefined) => {
  const hooks = getValueFromAppContext<(() => void)[]>(
    context,
    ExtensionHooks.onDeactivated,
  )
  applyFuns(hooks)
}

export {
  useQuietPage,
  getIsQuietPage,
  onWillAppear,
  triggerWillAppear,
  onWillDisappear,
  triggerWillDisappear,
  onDidAppear,
  triggerDidAppear,
  onDidDisappear,
  triggerDidDisappear,
}
