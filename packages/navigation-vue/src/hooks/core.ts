import { type AppContext } from 'vue'

/**
 * Vue App 扩展属性枚举
 */
export enum ExtensionHooks {
  // 页面进入的时候，执行的动画方法
  onEnter = '_vn_oe',
  // 页面退出的时候，执行的动画方法
  onLeave = '_vn_ol',
  // 存储 close 方法，在需要关闭的时候，手动调用该方法完成关闭
  close = '_vn_c',
  // 当页面离开前调用，询问组件是否想要返回
  onLeaveBefore = '_vn_olb',

  // 页面执行逻辑
  onWillAppear = '_vn_owa',
  onWillDisappear = '_vn_owd',
  onDidAppear = '_vn_oda',
  onDidDisappear = '_vn_odd',

  cancelBatchId = '_vn_cbi',

  ExtData = '_vn_ed',

  // 动画执行 hooks
  onAfterEnter = '_vn_oae',
  onAfterLeave = '_vn_oal',
  onBeforeEnter = '_vn_obe',
  onBeforeLeave = '_vn_obl',

  // 进度退出动画
  ProgressExitAnimated = '_vn_p_e_a',
}

export const setValueToAppContext = (
  target: AppContext | undefined,
  type: ExtensionHooks,
  hook: any
) => {
  if (target) {
    ;(target as any)[type] = hook
  }
}

export const addValueToAppContext = (
  target: AppContext | undefined,
  type: ExtensionHooks,
  hook: any | undefined
) => {
  if (target) {
    const hooks = (target as any)[type] ?? []
    ;(target as any)[type] = [...hooks, hook]
  }
}

export const getValueFromAppContext = <T>(
  target: AppContext | undefined,
  type: ExtensionHooks
): T | undefined => {
  if (target) {
    return (target as any)[type] as T
  }
  return undefined
}

export const setExtData = (
  target: AppContext | undefined,
  params: Record<string, any>
) => {
  const oldParams = getExtData(target) ?? {}
  setValueToAppContext(target, ExtensionHooks.ExtData, {
    ...oldParams,
    ...params,
  })
}

export const getExtData = <T>(target: AppContext | undefined) => {
  return getValueFromAppContext(target, ExtensionHooks.ExtData) as T | undefined
}
