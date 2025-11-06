import {
  currentSessionId,
  getCurrentState,
  getLastBackHookId,
  routerStack,
  setCurrentState,
} from './state'

/**
 * Callback for checking if back navigation should proceed
 */
export type BackCheckCallback = (
  deltaCount: number,
  backHookId?: string,
) => Promise<void>

/**
 * Callback for unmounting an app
 */
export type UnmountCallback = (
  needAnimated: boolean,
  needApplyBackHook: boolean,
  app?: any,
  backHookId?: string,
) => void

/**
 * Callback for canceling batch operations
 */
export type CancelBatchIdCallback = (instance: any, batchId: string) => string
export type GetCancelBatchIdCallback = (instance: any) => string | undefined

/**
 * Browser back state management
 */
let currentBackIsBlackBack = false

const startBlackBack = () => {
  currentBackIsBlackBack = true
}

/**
 * Create a popstate listener with custom callbacks
 * @param isReplace Whether to replace the current state
 * @param backCheckCallback Callback to check if back navigation should proceed
 * @param unmountCallback Callback to unmount apps
 * @returns Object with add and remove functions for the listener
 */
const createPopstateListener = (
  isReplace: boolean,
  backCheckCallback: BackCheckCallback,
  unmountCallback: UnmountCallback,
) => {
  routerStack.push(null) // Placeholder for initial app
  const currentState = setCurrentState({ index: 0, session: currentSessionId })
  if (isReplace) window.history.replaceState(currentState, '')
  else window.history.pushState(currentState, '')

  const handler = async (event: PopStateEvent) => {
    const currentState = getCurrentState()

    if (!currentState) return

    // If session is different, it means the page was refreshed
    if (event.state.session !== currentState.session) return
    const diffValue = event.state.index - currentState.index
    // If equal, no need to process
    if (diffValue === 0) return
    // If page moves forward, go back
    if (diffValue > 0) return window.history.go(-diffValue)

    // Get the last backHookId
    const localLastBackHookId = getLastBackHookId()

    if (currentBackIsBlackBack) {
      currentBackIsBlackBack = false
      // [1,2,3,4] -> 2 -> [1,4]
      const deleteCount = Math.abs(diffValue)
      const startIdx = routerStack.length - deleteCount - 1
      const apps = routerStack.splice(startIdx, deleteCount)

      apps.forEach((app, index, array) => {
        unmountCallback(false, index === array.length - 1, app, localLastBackHookId)
      })
    } else {
      // Check if can go back
      await backCheckCallback(-diffValue, localLastBackHookId)
      const apps = routerStack.splice(routerStack.length - Math.abs(diffValue))
      apps.forEach((app, index, array) => {
        const isLast = index === array.length - 1
        unmountCallback(isLast, isLast, app, localLastBackHookId)
      })
    }

    // Destroy component
    if (routerStack.length === 0) setCurrentState()
    else setCurrentState(window.history.state)
  }

  return {
    add: () => window.addEventListener('popstate', handler),
    remove: () => window.removeEventListener('popstate', handler),
  }
}

/**
 * Push a new state to history
 */
const pushHistoryState = () => {
  window.history.pushState(
    setCurrentState({
      index: routerStack.length,
      session: currentSessionId,
    }),
    '',
  )
}

/**
 * Navigate back by delta
 * @param delta Number of steps to go back
 */
const navigateBack = (delta: number) => {
  window.history.go(-Math.abs(delta))
}

/**
 * Get the current router stack length
 */
const getRouterStackLength = () => routerStack.length

/**
 * Add app to router stack
 */
const addToRouterStack = (app: any) => {
  routerStack.push(app)
}

/**
 * Update app in router stack at index
 */
const updateRouterStack = (index: number, app: any) => {
  routerStack[index] = app
}

export {
  startBlackBack,
  createPopstateListener,
  pushHistoryState,
  navigateBack,
  getRouterStackLength,
  addToRouterStack,
  updateRouterStack,
}
