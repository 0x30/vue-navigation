/**
 * @0x30/navigation-core
 * Framework-agnostic navigation/router core
 */

// State
export {
  currentSessionId,
  routerStack,
  getCurrentState,
  setCurrentState,
  getLastRouterItem,
  getRouterItem,
  pushRouterItem,
  popRouterItem,
  spliceRouterItems,
  setBackHook,
  applyBackHook,
  setLastBackHookId,
  getLastBackHookId,
  type RouterStackItem,
  type HistoryState,
} from './state'

// Navigation
export {
  push,
  replace,
  back,
  goBack,
  to,
  blackBoxBack,
  backToHome,
  registerMountCallback,
  type MountCallback,
} from './navigation'

// Back
export {
  listenPopState,
  startBlackBack,
  registerLeaveBeforeHooks,
  registerUnmountCallback,
  setCancelBatchId,
  getCancelBatchId,
  type LeaveBeforeHook,
} from './back'

// Gesture
export {
  startScreenEdgePanGestureRecognizer,
  registerGestureHooks,
  GestureState,
  type GestureEventData,
  type ProgressExitAnimatedHandler,
} from './gesture'

// Pointer Events
export {
  disableBodyPointerEvents,
  enableBodyPointerEvents,
  initDisableAllPointerEvents,
} from './pointer-events'

// Utils
export { randomId, applyFuns } from './utils'
