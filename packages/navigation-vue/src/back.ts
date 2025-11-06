import { type App } from 'vue'
import {
  getCancelBatchId,
  getLeaveBefore,
  setCancelBatchId,
  setLeaveBefore,
} from './hooks'
import {
  getCurrentState,
  setCurrentState,
  randomId,
  createPopstateListener,
  startBlackBack as coreStartBlackBack,
} from '@0x30/navigation-core'
import { getLastApp, getLastBackHookId, setLastBackHookId } from './state'
import { initDisableAllPointerEvents } from './util'
import { unmounted } from './manage'

/**
 * Back check logic
 *
 * Get the current app instance and check if leaveBefore exists
 * 1. If it doesn't exist, return directly
 * 2. If it exists, handle the leaveBefore result
 *  1. If the result is true/false, continue processing
 *  2. If it's a promise, wait for the result, and restore state early to prevent multiple back triggers
 *
 * @param deltaCount Number of pages to go back
 * @param backHid Back hook ID
 * @returns
 */
const backCheck = (deltaCount: number, backHid?: string) => {
  const app = getLastApp()
  const instance = app?._context

  // Generate a batch id
  const batchId = setCancelBatchId(instance, randomId())
  // Check if it's still the same batch
  const isSampleBatchId = () => getCancelBatchId(instance) === batchId
  // Get the leave before hook
  const hook = getLeaveBefore(instance)
  if (hook === undefined) return Promise.resolve()

  // Restore state early to prevent multiple back triggers
  const { index, session } = getCurrentState()!
  const start = index - deltaCount + 1
  for (let i = 0; i < deltaCount; i++) {
    window.history.pushState(setCurrentState({ index: start + i, session }), '')
  }

  return new Promise<void>(async () => {
    const reBack = () => {
      // Set the back id again when going back
      setLastBackHookId(backHid)
      setLeaveBefore(instance, undefined)
      window.history.go(-deltaCount)
    }

    const result = hook()
    if (typeof result === 'boolean') {
      if (result && isSampleBatchId()) reBack()
    } else {
      if ((await result) === true && isSampleBatchId()) reBack()
    }
  })
}

/**
 * Start black box back mode
 */
const startBlackBack = () => {
  coreStartBlackBack()
}

/**
 * Listen to popstate events for Vue apps
 * @param app Vue app instance
 * @param isReplace Whether to replace the current state
 * @returns Object with add and remove functions
 */
const listenPopState = (app: App, isReplace = false) => {
  initDisableAllPointerEvents()

  return createPopstateListener(
    isReplace,
    backCheck,
    (needAnimated, needApplyBackHook, vueApp, backHookId) => {
      unmounted(needAnimated, needApplyBackHook, vueApp as App, backHookId)
    },
  )
}

export { listenPopState, startBlackBack }
