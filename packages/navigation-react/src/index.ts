/**
 * @0x30/navigation-react
 * React navigation components and animation management
 */

// Navigation
export {
  push,
  replace,
  back,
  goBack,
  to,
  blackBoxBack,
  backToHome,
  initNavigation,
} from './navigation'

// Components
export { Page, NavPage, SidePage } from './components'
export {
  LoadingContainer,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  useLoading,
  setLoadingConfig,
} from './components'
export { ToastContainer, showToast, useToast } from './components'
export { SafeBottomSpace, SafeTopSpace, SafeLeftSpace, SafeRightSpace } from './components'

// Hooks
export {
  useQuietPage,
  useLeaveBefore,
  useTransitionEnter,
  useTransitionLeave,
  useProgressExitAnimated,
  usePageMate,
  useCurrentPageMate,
  onWillAppear,
  onDidAppear,
  onWillDisappear,
  onDidDisappear,
} from './hooks'

// Context
export { usePageContext, usePageContextSafe, PageContext } from './context'

// State
export type {
  ReactRouterStackItem,
  TransitionAnimatorHook,
  ProgressExitAnimatedHandler,
  PageMate,
} from './state'

// Re-export from core
export {
  disableBodyPointerEvents,
  enableBodyPointerEvents,
  routerStack,
} from '@0x30/navigation-core'
