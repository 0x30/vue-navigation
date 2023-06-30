import { type App } from 'vue'
import { randomId } from './util'

const currentSessionId = randomId()

/**
 * 路由堆栈,存储 app stacks
 */
const routerStack: App[] = []
// 当前的 state
let currentState: { index: number; session: string } | undefined = undefined
const setCurrentState = (state?: typeof currentState) => (currentState = state)
const getCurrentState = () => currentState

let lastBackHookId: string | undefined = undefined
const setLastBackHookId = (id: typeof lastBackHookId) => (lastBackHookId = id)
const getLastBackHookId = () => lastBackHookId

const getLastApp = () => routerStack[routerStack.length - 1]

const backHooks: Record<string, () => void> = {}
const setBackHook = (id: string, resolve: () => void) => {
  setLastBackHookId(id)
  backHooks[id] = () => {
    if (lastBackHookId) {
      delete backHooks[lastBackHookId]
      lastBackHookId = undefined
    }
    resolve()
  }
}
const applyBackHook = (id?: string) => {
  if (id) backHooks[id]?.apply(null)
}

export {
  routerStack,
  currentSessionId,
  setBackHook,
  applyBackHook,
  getCurrentState,
  setCurrentState,
  setLastBackHookId,
  getLastBackHookId,
  getLastApp,
}
