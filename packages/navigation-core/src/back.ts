import {
  currentSessionId,
  getCurrentState,
  getLastBackHookId,
  getLastRouterItem,
  routerStack,
  setCurrentState,
  setLastBackHookId,
  spliceRouterItems,
  type RouterStackItem,
} from './state'
import { initDisableAllPointerEvents } from './pointer-events'
import { randomId } from './utils'

/**
 * Leave Before Hook 类型
 */
export type LeaveBeforeHook = () => boolean | Promise<boolean>

/**
 * 获取 leaveBefore hook 的方法 - 由框架层实现
 */
let getLeaveBeforeHook:
  | ((item: RouterStackItem) => LeaveBeforeHook | undefined)
  | undefined

/**
 * 设置 leaveBefore hook - 由框架层实现
 */
let setLeaveBeforeHook:
  | ((item: RouterStackItem, hook: LeaveBeforeHook | undefined) => void)
  | undefined

/**
 * 注册 leaveBefore hook 的获取和设置方法
 */
export const registerLeaveBeforeHooks = (
  getter: (item: RouterStackItem) => LeaveBeforeHook | undefined,
  setter: (item: RouterStackItem, hook: LeaveBeforeHook | undefined) => void
) => {
  getLeaveBeforeHook = getter
  setLeaveBeforeHook = setter
}

/**
 * unmount 回调 - 由框架层实现
 */
let unmountCallback:
  | ((
      item: RouterStackItem,
      needAnimated: boolean,
      needApplyBackHook: boolean,
      backHookId?: string
    ) => void)
  | undefined

/**
 * 注册 unmount 回调
 */
export const registerUnmountCallback = (callback: typeof unmountCallback) => {
  unmountCallback = callback
}

/**
 * Cancel Batch ID 管理
 */
const cancelBatchIds = new WeakMap<RouterStackItem, string>()

const setCancelBatchId = (
  item: RouterStackItem | undefined,
  batchId: string
) => {
  if (item) {
    cancelBatchIds.set(item, batchId)
  }
  return batchId
}

const getCancelBatchId = (item: RouterStackItem | undefined) => {
  return item ? cancelBatchIds.get(item) : undefined
}

/**
 * 返回页面判断
 *
 * 获取当前的 app 实例, 判断当前的 实例,是否存在 leaveBefore
 * 1. 如果不存在,则直接返回
 * 2. 如果存在,则处理 leaveBefore 的结果
 *  1. 如果 leaveBefore 的结果直接是 true false,则继续处理
 *  2. 如果是 promise, 则等待结果,等待结果期间,为了防止多次触发返回,提前恢复状态
 *
 * @param deltaCount 页面返回个数
 * @param backHookId 批次id
 * @returns
 */
const backCheck = (deltaCount: number, backHookId?: string) => {
  const routerItem = getLastRouterItem()

  /// 生成一个 批次 id
  const batchId = setCancelBatchId(routerItem, randomId())
  /// 比对当前 是不是还是一个批次
  const isSameBatchId = () => getCancelBatchId(routerItem) === batchId
  /// 获取拦截返回方法
  const hook = getLeaveBeforeHook?.(routerItem!)
  if (hook === undefined) return Promise.resolve()

  /// 为了防止多次返回 提前返回
  const { index, session } = getCurrentState()!
  const start = index - deltaCount + 1
  for (let i = 0; i < deltaCount; i++) {
    window.history.pushState(setCurrentState({ index: start + i, session }), '')
  }

  return new Promise<void>(async () => {
    const reBack = () => {
      /// 再次返回的时候 设置 重新设置 back id
      setLastBackHookId(backHookId)
      setLeaveBeforeHook?.(routerItem!, undefined)
      window.history.go(-deltaCount)
    }

    const result = hook()

    if (typeof result === 'boolean') {
      if (result && isSameBatchId()) reBack()
    } else {
      if ((await result) === true && isSameBatchId()) reBack()
    }
  })
}

let currentBackIsBlackBack = false

export const startBlackBack = () => {
  currentBackIsBlackBack = true
}

export const listenPopState = (isReplace = false) => {
  initDisableAllPointerEvents()

  const currentState = setCurrentState({
    index: routerStack.length - 1,
    session: currentSessionId,
  })
  if (isReplace) window.history.replaceState(currentState, '')
  else window.history.pushState(currentState, '')

  const handler = async (event: PopStateEvent) => {
    const currentState = getCurrentState()

    if (!currentState) return

    // 如果 session 和 当前 state session 不一样了,则说明 是在页面 刷新了
    if (event.state?.session !== currentState.session) return
    const diffValue = event.state.index - currentState.index
    /// 如果相等 无需处理
    if (diffValue === 0) return
    /// 如果发现页面前进 重新返回
    if (diffValue > 0) return window.history.go(-diffValue)

    /// 获取最后一个 backHookId
    const localLastBackHookId = getLastBackHookId()

    if (currentBackIsBlackBack) {
      currentBackIsBlackBack = false
      /// [1,2,3,4] -> 2 -> [1,4]
      const deleteCount = Math.abs(diffValue)
      const startIdx = routerStack.length - deleteCount - 1
      const items = spliceRouterItems(startIdx, deleteCount)

      items.forEach((item, index, array) => {
        unmountCallback?.(
          item,
          false,
          index === array.length - 1,
          localLastBackHookId
        )
      })
    } else {
      await backCheck(-diffValue, localLastBackHookId)
      const items = spliceRouterItems(
        routerStack.length - Math.abs(diffValue),
        Math.abs(diffValue)
      )
      items.forEach((item, index, array) => {
        const isLast = index === array.length - 1
        unmountCallback?.(item, isLast, isLast, localLastBackHookId)
      })
    }

    /// 销毁 组件

    if (routerStack.length === 0) setCurrentState()
    else setCurrentState(window.history.state)
  }

  return {
    add: () => window.addEventListener('popstate', handler),
    remove: () => window.removeEventListener('popstate', handler),
  }
}
