import { randomId } from './util'

const currentSessionId = randomId()

/**
 * Navigation state type
 */
export type NavigationState = { index: number; session: string }

/**
 * Router stack - stores generic app instances
 */
const routerStack: any[] = []

// Current state
let currentState: NavigationState | undefined = undefined
const setCurrentState = (state?: NavigationState) => (currentState = state)
const getCurrentState = () => currentState

let lastBackHookId: string | undefined = undefined
const setLastBackHookId = (id: typeof lastBackHookId) => (lastBackHookId = id)
const getLastBackHookId = () => lastBackHookId

const getLastApp = () => routerStack[routerStack.length - 1]

const backHooks: Record<string, () => void> = {}
const setBackHook = (id: string, resolve: () => void) => {
  setLastBackHookId(id)
  backHooks[id] = () => {
    delete backHooks[id]
    lastBackHookId = undefined
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
