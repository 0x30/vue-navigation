import {
  getCurrentInstance,
  type AppContext,
  onActivated,
  onDeactivated,
} from 'vue'
import { applyFuns } from './util'

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
  onDeactivated = '_vn_oda',
  cancelBatchId = '_vn_cbi',
  onEnterFinish = '_vn_oef',
  onLeaveFinish = '_vn_olf',
  ExtData = '_vn_ed',
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

/**
 * 在页面即将返回的时候，会调用hook方法，返回是否可以返回
 * 该方法，如果在某个页面多次注册，会覆盖请注意
 */
const useLeaveBefore = (hook: () => boolean | Promise<boolean>) => {
  setValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onLeaveBefore,
    hook
  )
}

export type TransitionAmimatorHook = (
  elements: {
    from?: Element
    to?: Element
  },
  done: () => void
) => void

/**
 * 在页面进入时设置 动画执行方法
 * 请保证该方法只被注册一次,多次注册将覆盖
 */
const useTransitionEnter = (hook: TransitionAmimatorHook) => {
  setValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onEnter,
    hook
  )
}

/**
 * 页面动画执行完毕
 * 该方法 是 hook 方法,用户 组件内部 监听 当前页面是否动画执行完毕 进入页面
 */
const useTransitionEnterFinish = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onEnterFinish,
    hook
  )
}

const tiggleTransitionEnterFinish = (context?: AppContext) => {
  const hooks = getValueFromAppContext<(() => void)[]>(
    context,
    ExtensionHooks.onEnterFinish
  )
  applyFuns(hooks)
}

const tiggleOnActivated = (context?: AppContext) => {
  const hooks = getValueFromAppContext<(() => void)[]>(
    context,
    ExtensionHooks.onActivated
  )
  applyFuns(hooks)
}

const tiggleOnLeaveFinish = (target?: AppContext) => {
  const hooks = getValueFromAppContext<(() => void)[]>(
    target,
    ExtensionHooks.onLeaveFinish
  )
  applyFuns(hooks)
}

/**
 * 根据 提供的 appContext 获取吗，该上下文中所有的应用进入非活跃的hook方法
 * @param context App Context
 * @returns hooks 方法
 */
const tiggleOnDeactivated = (context: AppContext | undefined) => {
  const hooks = getValueFromAppContext<(() => void)[]>(
    context,
    ExtensionHooks.onDeactivated
  )
  applyFuns(hooks)
}

/// tigger activated hooks

/**
 * 在页面离开时设置 动画执行方法
 * 请保证该方法只被注册一次,多次注册将覆盖
 */
const useTransitionLeave = (hook: TransitionAmimatorHook) => {
  setValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onLeave,
    hook
  )
}

/**
 * 页面动画执行完毕
 * 该方法 是 hook 方法,用户 组件内部 监听 当前页面是否动画执行完毕 进入页面
 */
const useTransitionLeaveFinish = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onLeaveFinish,
    hook
  )
}

/**
 * use activeated 活跃的时候 hook
 */
const useActivated = (hook: () => void) => {
  onActivated(hook)
  useTransitionEnterFinish(hook)
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onActivated,
    hook
  )
}

/**
 * use activeated 非活跃的时候 hook
 */
const useDeactivated = (hook: () => void) => {
  onDeactivated(hook)
  useTransitionLeaveFinish(hook)
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onDeactivated,
    hook
  )
}

/**
 * 页面 除第一次显示
 */
const onReAppear = (hook: () => void) => {
  onActivated(hook)
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onActivated,
    hook
  )
}

const setCancelBatchId = (context: AppContext | undefined, batchId: string) => {
  setValueToAppContext(context, ExtensionHooks.cancelBatchId, batchId)
  return batchId
}

const getCancelBatchId = (context: AppContext | undefined) => {
  return getValueFromAppContext<string>(context, ExtensionHooks.cancelBatchId)
}

const getLeaveBefore = (context: AppContext | undefined) =>
  getValueFromAppContext<() => boolean | Promise<boolean>>(
    context,
    ExtensionHooks.onLeaveBefore
  )

const setLeaveBefore = (context: AppContext | undefined, func?: () => void) =>
  setValueToAppContext(context, ExtensionHooks.onLeaveBefore, func)

const setClose = (
  context: AppContext | undefined,
  hook: (done: () => void) => void
) => {
  setValueToAppContext(context, ExtensionHooks.close, hook)
}

const getClose = (context?: AppContext) => {
  return getValueFromAppContext<(done: () => void) => void>(
    context,
    ExtensionHooks.close
  )
}

const execAnimator = (
  type: ExtensionHooks,
  from?: Element,
  to?: Element,
  context?: AppContext
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
  context?: AppContext,
  from?: Element,
  to?: Element
) => execAnimator(ExtensionHooks.onEnter, from, to, context)

const execLeaveAnimator = (
  context?: AppContext,
  from?: Element,
  to?: Element
) => execAnimator(ExtensionHooks.onLeave, from, to, context)

/**
 * 当你写了一个 Loading 加载中组件，当作一个页面,那么 你可以将它设置为 安静的页面;
 * 那么在他出现的时候，不会触发上一个页面的 deactived,在 Loading 页面消失之后， 也不会触发上一个页面的 actived 页面
 */
const useQuietPage = () => {
  setExtData(getCurrentInstance()?.appContext, { __is_quiet_page: true })
}

const getIsQuietPage = (context?: AppContext) => {
  return (
    getExtData<{
      __is_quiet_page: boolean | undefined
    }>(context)?.__is_quiet_page === true
  )
}

interface PageMate {
  id?: string
  name?: string
  [key: string]: any
}

const usePageMate = (mate: PageMate) => {
  const context = getCurrentInstance()?.appContext
  const info = getPageMate(context) ?? {}
  setExtData(context, { __pageMateInfo: { ...info, ...mate } })
}

const getPageMate = (context?: AppContext) => {
  return getExtData<{ __pageMateInfo: PageMate }>(context)?.__pageMateInfo
}

/// page change hooks set
type PageChangeHook = (from?: PageMate, to?: PageMate) => void
type PageChangeConfig = {
  /**
   * 是不是每一个 页面切换都监听到
   * 默认为 false:
   * * true: 每一次页面变动的时候 都会触发
   * * false: 只有存在 mateInfo 并且 没有设置为 useQuietPage 的页面 会触发
   */
  isEvery: boolean
}
const pageChangeSet = new Set<
  readonly [PageChangeHook, Partial<PageChangeConfig> | undefined]
>()

/// 当页面 出现变化的时候
const onPageChange = (
  func: PageChangeHook,
  config?: Partial<PageChangeConfig>
) => {
  const val = [func, config] as const
  pageChangeSet.add(val)
  return () => pageChangeSet.delete(val)
}

const tigglePageChange = (from?: AppContext, to?: AppContext) => {
  pageChangeSet.forEach(([hook, config]) => {
    const fM = getPageMate(from)
    const tM = getPageMate(to)
    const isE = config?.isEvery ?? false
    if (
      isE || /// 如果任何页面都收集
      (fM !== undefined && tM !== undefined && !getIsQuietPage(from)) // 其他情况 必须 fromPage mate 有值 以及 toPage mate 有值 以及 fromPage 不能是 quietPage
    ) {
      hook.apply(null, [fM, tM])
    }
  })
}

export {
  usePageMate,
  onPageChange,
  tigglePageChange,
  setExtData,
  getExtData,
  useQuietPage,
  getIsQuietPage,
  execEnterAnimator,
  execLeaveAnimator,
  setClose,
  getClose,
  setCancelBatchId,
  getCancelBatchId,
  getLeaveBefore,
  setLeaveBefore,
  addValueToAppContext,
  setValueToAppContext,
  getValueFromAppContext,
  onReAppear,
  useDeactivated,
  useActivated,
  tiggleOnLeaveFinish,
  tiggleOnDeactivated,
  tiggleOnActivated,
  tiggleTransitionEnterFinish,
  useLeaveBefore,
  useTransitionEnter,
  useTransitionEnterFinish,
  useTransitionLeave,
  useTransitionLeaveFinish,
}
