/* eslint-disable  */
import {
  type App,
  getCurrentInstance,
  onMounted,
  defineComponent,
  type VNode,
} from 'vue'
import {
  disableBodyPointerEvents,
  enableBodyPointerEvents,
  randomId,
} from './util'
import { mounted } from './manage'
import { routerStack, setBackHook } from './state'
import { listenPopState, startBlackBack } from './back'
import { startScreenEdgePanGestureRecognizer } from './event'

/**
 * 前进方法
 *
 * ```tsx
 * import Component from "./component"
 *
 * push(<Component prop1={1} />)
 * ```
 *
 * 异步加载组件使用 vue 自带的 `defineAsyncComponent`
 *
 * ```tsx
 * const Component = defineAsyncComponent(() => import("./component"));
 * push(<Component prop1={1} />);
 * ```
 *
 * 方法返回 `Promise<void>`, 在页面完成跳转后 `promise.reslove`
 *
 * 组件可以通过设置 `useTransitionEnter` 设置页面动画,如果设置动画则会在动画执行完成后, `promise.reslove`
 *
 * @param component 组件
 * @param params 页面的参数, 在页面发上变化的时候 这些参数会被携带
 */
const push = async (component: VNode) => {
  disableBodyPointerEvents()
  await mounted(component, false)
  enableBodyPointerEvents()
}

/**
 * 替换方法
 *
 * ```tsx
 * import Component from "./component"
 *
 * replace(<Component prop1={1} />)
 * ```
 *
 * 异步加载组件使用 vue 自带的 `defineAsyncComponent`
 *
 * ```tsx
 * const Component = defineAsyncComponent(() => import("./component"));
 * replace(<Component prop1={1} />);
 * ```
 *
 * 方法返回 `Promise<void>`, 在页面完成跳转后 `promise.reslove`
 *
 * 组件可以通过设置 `useTransitionEnter` 设置页面动画,如果设置动画则会在动画执行完成后, `promise.reslove`
 *
 * @param component 组件
 */
const replace = async (component: VNode) => {
  disableBodyPointerEvents()
  await mounted(component, true)
  enableBodyPointerEvents()
}

/**
 * 返回当前最顶部页面方法
 *
 * 方法返回 `Promise<void>`, 在页面完成跳转后 `promise.reslove`
 *
 * 组件可以通过设置 `useTransitionLeave` 设置页面离开动画,如果设置动画则会在动画执行完成后, `promise.reslove`
 *
 * @param delta 返回次数 uint
 */
const goBack = (delta: number = 1) => {
  disableBodyPointerEvents()
  return new Promise<void>((resolve) => {
    setBackHook(randomId(), resolve)
    const d = typeof delta === 'number' ? delta : 1
    window.history.go(-Math.abs(d))
  })
}

/// 固定返回一次
const back = () => goBack(1)

/**
 * 前往页面
 * @param isReplace  是否以替换的方式前往
 */
const to = (isReplace: boolean) => (isReplace ? replace : push)

/**
 * 黑箱返回
 * 比如 a -> b -> c -> d
 * 调用 该 函数 2
 * 那么 页面 堆栈 会修改为  a -> d
 */
const blackBoxBack = async (delta: number) => {
  startBlackBack()
  await goBack(delta)
}

/**
 * 返回到 最首页
 */
const backToHome = async () => {
  await goBack(routerStack.length - 1)
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
   * 示例
  ````ts
  import { createApp } from 'vue'
  
  const app = createApp({
    // ...
  })
  
  app.use(navigation())
  ````
  
  在 app,创建后 use 开始启用 该插件
   */
const navigation = () => {
  return {
    install(app: App) {
      const { add } = listenPopState(app, true)
      add()

      startScreenEdgePanGestureRecognizer()
    },
  }
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
  useTransitionEnterFinish as onEnterFinish,
  useTransitionLeaveFinish as onLeaveFinish,
  onReAppear,
  useActivated as onAppear,
  useDeactivated as onDisAppear,
  onWillAppear,
  onWillDisAppear,
} from './hooks'
