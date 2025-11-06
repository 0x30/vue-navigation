/* eslint-disable  */
import {
  type App,
  getCurrentInstance,
  onMounted,
  defineComponent,
  type VNode,
  Plugin,
  type Component,
} from 'vue'
import {
  disableBodyPointerEvents,
  enableBodyPointerEvents,
} from './util'
import { randomId, setBackHook, routerStack } from '@0x30/navigation-core'
import { type LifeCycleHooks, mounted } from './manage'
import { listenPopState, startBlackBack } from './back'
import { startScreenEdgePanGestureRecognizer } from './hooks/progressExitAnimated'
import { goBack, back, backToHome } from './state'

/**
 * Push method
 *
 * ```tsx
 * import Component from "./component"
 *
 * push(<Component prop1={1} />)
 * ```
 *
 * For async component loading, use Vue's built-in `defineAsyncComponent`
 *
 * ```tsx
 * const Component = defineAsyncComponent(() => import("./component"));
 * push(<Component prop1={1} />);
 * ```
 *
 * Returns `Promise<void>`, resolves after page transition completes
 *
 * Component can use `useTransitionEnter` to set page animation, if animation is set, `promise.resolve` after animation completes
 *
 * @param component Component
 * @param hooks Lifecycle hooks
 */
const push = async (component: Component | VNode, hooks?: LifeCycleHooks) => {
  disableBodyPointerEvents()
  const app = await mounted(component, false, hooks)
  enableBodyPointerEvents()
  return app
}

/**
 * Replace method
 *
 * ```tsx
 * import Component from "./component"
 *
 * replace(<Component prop1={1} />)
 * ```
 *
 * For async component loading, use Vue's built-in `defineAsyncComponent`
 *
 * ```tsx
 * const Component = defineAsyncComponent(() => import("./component"));
 * replace(<Component prop1={1} />);
 * ```
 *
 * Returns `Promise<void>`, resolves after page transition completes
 *
 * Component can use `useTransitionEnter` to set page animation, if animation is set, `promise.resolve` after animation completes
 *
 * @param component Component
 * @param hooks Lifecycle hooks
 */
const replace = async (component: Component | VNode, hooks?: LifeCycleHooks) => {
  disableBodyPointerEvents()
  const app = await mounted(component, true, hooks)
  enableBodyPointerEvents()
  return app
}

/**
 * Navigate to page
 * @param isReplace Whether to navigate with replace
 */
const to = (isReplace: boolean) => (isReplace ? replace : push)

/**
 * Black box back
 *
 * Scenario:
 * For example, current page stack is: `a -> b -> c -> d`
 * ```js
 * /// Call this method
 * blackBoxBack(2)
 * ```
 * Then page stack will be modified to a -> d
 */
const blackBoxBack = async (delta: number) => {
  startBlackBack()
  await goBack(delta)
}

const Navigator = defineComponent({
  name: 'NavigatorController',
  setup: (_, { slots }) => {
    const { add } = listenPopState(getCurrentInstance()!.appContext.app, true)
    onMounted(add)
    onMounted(startScreenEdgePanGestureRecognizer)
    return () => slots.default?.()
  },
})

/**
 * Example
 ````ts
 import { createApp } from 'vue'
 
 const app = createApp({
   // ...
 })
 
 app.use(navigation)
 ````
 
 After app is created, use this plugin
  */
const navigation: Plugin = {
  install(app: App) {
    const { add } = listenPopState(app, true)
    add()
    startScreenEdgePanGestureRecognizer()
  },
}

export {
  to,
  push,
  replace,
  back,
  goBack,
  backToHome,
  blackBoxBack,
  Navigator,
  navigation,
}
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
} from './hooks'

export { useProgressExitAnimated, useAppBeforeMount } from './hooks'
export { disableBodyPointerEvents, enableBodyPointerEvents }
