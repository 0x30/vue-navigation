import { type App } from 'vue'
import {
  getCancelBatchId,
  getLeaveBefore,
  setCancelBatchId,
  setLeaveBefore,
} from './hooks'
import {
  currentSessionId,
  getCurrentState,
  getLastApp,
  getLastBackHookId,
  routerStack,
  setCurrentState,
  setLastBackHookId,
} from './state'
import { randomId } from './util'
import { unmounted } from './manage'

/**
 * 返回页面判断
 *
 * 获取当前的 app 实例, 判断当前的 实例,是否存在 leaveBefore
 * 1. 如果不存在,则直接返回
 * 2. 如果存在,则处理 leaveBefore 的结果
 *  1. 如果 leaveBefore 的结果直接是 true false,则继续处理
 *  2. 如果是 promise, 则等待结果,等待结果期间,为了防止多次触发返回,提前恢复状态
 *
 * @param instance 对象实例
 * @param batchId 批次id 可能存在多次返回的情况,用于区分批次
 * @param deltaCount 页面返回个数
 * @returns
 */
const backCheck = (deltaCount: number, backHid?: string) => {
  const app = getLastApp()
  const instance = app?._context

  /// 生成一个 批次 id
  const batchId = setCancelBatchId(instance, randomId())
  /// 比对当前 是不是还是一个批次
  const isSampleBatchId = () => getCancelBatchId(instance) === batchId
  /// 获取拦截返回方法
  const hook = getLeaveBefore(instance)
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
      setLastBackHookId(backHid)
      setLeaveBefore(instance)
      window.history.go(-deltaCount)
    }

    const result = hook()
    if (result instanceof Promise) {
      if ((await result) === true && isSampleBatchId()) reBack()
    } else {
      if (result && isSampleBatchId()) reBack()
    }
  })
}

const listenPopState = (app: App, isReplace = false) => {
  routerStack.push(app)
  const currentState = setCurrentState({ index: 0, session: currentSessionId })
  if (isReplace) window.history.replaceState(currentState, '')
  else window.history.pushState(currentState, '')

  const handler = async (event: PopStateEvent) => {
    const currentState = getCurrentState()

    if (!currentState) return

    // 如果 session 和 当前 state session 不一样了,则说明 是在页面 刷新了
    if (event.state.session !== currentState.session) return
    const diffValue = event.state.index - currentState.index

    /// 如果相等 无需处理
    if (diffValue === 0) return
    /// 如果发现页面前进 重新返回
    if (diffValue > 0) return window.history.go(-diffValue)

    /// 获取最后一个 backHookId
    const localLastBackHookId = getLastBackHookId()
    /// 检查 是否可以返回
    await backCheck(-diffValue, localLastBackHookId)

    /// 销毁 组件
    const apps = routerStack.splice(routerStack.length - Math.abs(diffValue))

    apps.forEach((app, index, array) => {
      unmounted(index === array.length - 1, app, localLastBackHookId)
    })

    if (routerStack.length === 0) setCurrentState()
    else setCurrentState(window.history.state)
  }

  return {
    add: () => window.addEventListener('popstate', handler),
    remove: () => window.removeEventListener('popstate', handler),
  }
}

export { listenPopState }
