/**
 * @0x30/navigation-vue
 * Vue navigation components and animation management
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
  Navigator,
} from './navigation'

// Manage
export { mounted, unmounted, type LifeCycleHooks, type VueRouterStackItem } from './manage'

// Hooks
export {
  useQuietPage,
  useLeaveBefore,
  useTransitionEnter,
  useTransitionLeave,
  onDidAppear,
  onDidDisappear,
  onWillAppear,
  onWillDisappear,
  onPageAfterEnter,
  onPageAfterLeave,
  onPageBeforeEnter,
  onPageBeforeLeave,
  usePageMate,
  getCurrentPageMate,
  onPageChange,
  useProgressExitAnimated,
  useAppBeforeMount,
  useHero,
  type PageMate,
  type TransitionAnimatorHook,
  type ProgressExitAnimatedHandler,
  type LeaveBeforeHook,
  type HeroAnimationContext,
  type HeroEnterHandler,
  type HeroLeaveHandler,
  type UseHeroOptions,
  type UseHeroResult,
} from './hooks'

// Components
export { default as NavPage } from './components/NavPage'
export { default as Page } from './components/Page'
export * from './components/Safearea'
export { default as SidePage, type SidePageAnimationContext, type SidePageAnimationHandler } from './components/SidePage'
export * from './components/Loading'
export * from './components/Toast'

// Utils
export { Popup, wait } from './utils'

// Re-export from core
export {
  disableBodyPointerEvents,
  enableBodyPointerEvents,
  routerStack,
  getHeroAnimate,
  type HeroConfig,
  type HeroTransform,
  type HeroAnimate,
  type HeroEnterParams,
  type HeroLeaveParams,
} from '@0x30/navigation-core'
