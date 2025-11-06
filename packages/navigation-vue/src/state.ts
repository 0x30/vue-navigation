import { type App } from 'vue'
import {
  randomId,
  routerStack as coreRouterStack,
  setBackHook,
  getLastBackHookId,
  setLastBackHookId,
} from '@0x30/navigation-core'

/**
 * Re-export routerStack for internal use
 */
const routerStack = coreRouterStack

/**
 * Get the last Vue app from the router stack
 */
const getLastApp = () => routerStack[routerStack.length - 1] as App | undefined

/**
 * Navigate back wrapper for Vue
 * @param delta Number of steps to go back
 * @returns Promise that resolves when navigation is complete
 */
const goBack = (delta: number = 1) => {
  return new Promise<void>((resolve) => {
    setBackHook(randomId(), resolve)
    const d = typeof delta === 'number' ? delta : 1
    window.history.go(-Math.abs(d))
  })
}

/**
 * Go back one step
 */
const back = () => goBack(1)

/**
 * Go back to the home page
 */
const backToHome = async () => {
  await goBack(routerStack.length - 1)
}

export {
  routerStack,
  getLastApp,
  goBack,
  back,
  backToHome,
  getLastBackHookId,
  setLastBackHookId,
}
