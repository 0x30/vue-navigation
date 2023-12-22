import { type AppContext } from 'vue'

/// 页面 新增的 App 扩展属性
enum ExtensionHooks {
  // 页面进入的时候，执行的动画方法
  onEnter = '_vn_oe',
  // 页面推出的时候，执行的动画方法
  onLeave = '_vn_ol',
  // 存储 close 方法，在需要关闭的时候，手动调用该方法 完成关闭
  close = '_vn_c',
  // 当页面 离开前调用 询问组件 是否想要返回
  onLeaveBefore = '_vn_olb',
  onActivated = '_vn_oa',
  onWillActivated = '_vn_owa',
  onDeactivated = '_vn_oda',
  onWillDeactivated = '_vn_owda',
  cancelBatchId = '_vn_cbi',
  onEnterFinish = '_vn_oef',
  onLeaveFinish = '_vn_olf',
  ExtData = '_vn_ed',

  /// 进度退出动画
  ProgressExitAnimated = '_vn_p_e_a',
}

const setValueToAppContext = (
  target: AppContext | undefined,
  type: ExtensionHooks,
  hook: any
) => {
  if (target) {
    ;(target as any)[type] = hook
  }
}

const addValueToAppContext = (
  target: AppContext | undefined,
  type: ExtensionHooks,
  hook: any | undefined
) => {
  if (target) {
    const hooks = (target as any)[type] ?? []
    ;(target as any)[type] = [...hooks, hook]
  }
}

const getValueFromAppContext = <T>(
  target: AppContext | undefined,
  type: ExtensionHooks
) => {
  if (target) {
    return (target as any)[type] as T
  }
  return undefined
}

const setExtData = (
  target: AppContext | undefined,
  params: Record<string, any>
) => {
  const oldParams = getExtData(target) ?? {}
  setValueToAppContext(target, ExtensionHooks.ExtData, {
    ...oldParams,
    ...params,
  })
}

const getExtData = <T>(target: AppContext | undefined) => {
  return getValueFromAppContext(target, ExtensionHooks.ExtData) as T | undefined
}

export {
  ExtensionHooks,
  setExtData,
  getExtData,
  getValueFromAppContext,
  addValueToAppContext,
  setValueToAppContext,
}
