import { randomId } from './utils'

/**
 * 当前会话 ID，用于区分页面刷新
 */
export const currentSessionId = randomId()

/**
 * 路由堆栈，存储页面实例
 * 使用泛型让框架层自己决定存储什么类型
 */
export interface RouterStackItem {
  id: string
  context: any
  container: HTMLElement
}

export const routerStack: RouterStackItem[] = []

/**
 * History State
 */
export interface HistoryState {
  index: number
  session: string
}

let currentState: HistoryState | undefined = undefined

export const setCurrentState = (state?: HistoryState) => {
  currentState = state
  return state
}

export const getCurrentState = () => currentState

/**
 * Back Hook 管理
 * 用于在返回操作完成后执行回调
 */
let lastBackHookId: string | undefined = undefined

export const setLastBackHookId = (id: typeof lastBackHookId) => {
  lastBackHookId = id
}

export const getLastBackHookId = () => lastBackHookId

const backHooks: Record<string, () => void> = {}

export const setBackHook = (id: string, resolve: () => void) => {
  setLastBackHookId(id)
  backHooks[id] = () => {
    delete backHooks[id]
    lastBackHookId = undefined
    resolve()
  }
}

export const applyBackHook = (id?: string) => {
  if (id) backHooks[id]?.()
}

/**
 * 获取最后一个路由项
 */
export const getLastRouterItem = () => routerStack[routerStack.length - 1]

/**
 * 获取指定索引的路由项
 */
export const getRouterItem = (index: number) => routerStack[index]

/**
 * 添加路由项
 */
export const pushRouterItem = (item: RouterStackItem) => {
  routerStack.push(item)
}

/**
 * 移除路由项
 */
export const popRouterItem = () => {
  return routerStack.pop()
}

/**
 * 移除指定范围的路由项
 */
export const spliceRouterItems = (start: number, deleteCount: number) => {
  return routerStack.splice(start, deleteCount)
}
