import {
  type App,
  Transition,
  createApp,
  getCurrentInstance,
  onMounted,
  ref,
  cloneVNode,
  type VNode,
  type BaseTransitionProps,
} from 'vue'
import {
  applyBackHook,
  currentSessionId,
  getLastApp,
  routerStack,
  setCurrentState,
} from './state'
import {
  execEnterAnimator,
  execLeaveAnimator,
  getClose,
  getIsQuietPage,
  setClose,
  trigglePageChange,
  triggerWillDisAppear,
  triggerWillAppear,
  triggerDidAppear,
  triggerDisappear,
  triggerTransitionEnterFinish,
  triggerTransitionLeaveFinish,
} from './hooks'
import { disableBodyPointerEvents, enableBodyPointerEvents } from './util'

export type LifeCycleHooks = Pick<
  BaseTransitionProps,
  | 'onBeforeEnter'
  | 'onAfterEnter'
  | 'onEnterCancelled'
  | 'onBeforeLeave'
  | 'onAfterLeave'
  | 'onLeaveCancelled'
  | 'onBeforeAppear'
  | 'onAfterAppear'
  | 'onAppearCancelled'
>

/**
 * 销毁 app
 * @param needAnimated 是否本次销毁需要执行 动画
 * @param needApplyBackHook 是否需要 调用 backHook 方法
 * @param isBack 当前销毁 是否是由于 返回导致的
 * @param app 要销毁的 app
 * @param backHookId 调用的 backHook
 */
const unmounted = (
  needAnimated: boolean,
  needApplyBackHook: boolean,
  isBack: boolean,
  app?: App,
  backHookId?: string
) => {
  if (app === undefined) return

  const _unmounted = () => {
    app.unmount()
    if (app._container instanceof Element) {
      app._container.parentElement?.removeChild(app._container)
    }

    triggerTransitionLeaveFinish(isBack, app?._context)

    if (!needApplyBackHook) return
    enableBodyPointerEvents()
    applyBackHook(backHookId)
  }

  if (!needAnimated) return _unmounted()

  getClose(app._context)?.(() => {
    _unmounted()
    if (!getIsQuietPage(app._context)) {
      triggerDidAppear(getLastApp()?._context)
      triggerDisappear(app._context)
      trigglePageChange(app._context, getLastApp()._context)
    }
  })
}

/**
 * 获取 APP 下的 子node, 用于 执行 动画
 */
const getChildren = (ele?: HTMLElement) => {
  if (ele?.childElementCount === 1) return ele.children[0]
  return ele
}

const mounted = (compoent: VNode, replace: boolean, hooks?: LifeCycleHooks) => {
  return new Promise<App<Element>>((resolve) => {
    // 创建 container
    const container = document.createElement('div')
    document.body.appendChild(container)

    /// 在页面 replace 动画执行完成后 unmounted 倒数第二个 app
    const replaceDone = () => {
      if (replace === false) return
      unmounted(
        false,
        false,
        false,
        routerStack.splice(routerStack.length - 2, 1)[0]
      )
    }

    /// 出发页面的 deactived
    const lastAppContext = getLastApp()?._context

    /// clone component
    const nComponent = cloneVNode(compoent)

    // 创建 app
    const app = createApp({
      setup: () => {
        const isShow = ref(true)
        /// 关闭方法,在动画执行完成后 调用 销毁 app
        let closeDone: (() => void) | undefined = undefined

        /// 暂存 target , 由于 transtion onEnter 和 onLeave 获取不到 instance
        let target = getCurrentInstance()
        onMounted(() => {
          target = getCurrentInstance()
          setClose(target?.appContext, (done) => {
            closeDone = done
            isShow.value = false
          })
        })

        return () => {
          return (
            <Transition
              appear
              onEnter={async (el, done) => {
                const isNeedTriggle = !getIsQuietPage(target?.appContext)

                /// 执行 进入动画
                const from = getChildren(lastAppContext.app._container)

                if (isNeedTriggle) {
                  triggerWillDisAppear(lastAppContext)
                  triggerWillAppear(target?.appContext)
                }

                await execEnterAnimator(target?.appContext, from, el)

                done()
                replaceDone()
                resolve(app)

                if (isNeedTriggle) {
                  triggerDidAppear(target?.appContext)
                  triggerDisappear(lastAppContext)

                  /// 触发页面 变动
                  trigglePageChange(lastAppContext, target?.appContext)
                }
                /// 动画执行完 事件
                triggerTransitionEnterFinish(target?.appContext)
              }}
              onLeave={async (el, done) => {
                disableBodyPointerEvents()
                const to = getChildren(getLastApp()._container)

                const isNeedTriggle = !getIsQuietPage(target?.appContext)

                if (isNeedTriggle) {
                  triggerWillDisAppear(target?.appContext)
                  triggerWillAppear(getLastApp()?._context)
                }

                /// 执行 退出动画
                await execLeaveAnimator(target?.appContext, el, to)
                /// 没有动画

                done()

                /// 如果 不能 close Done 手动 enable body 可操作
                if (closeDone) closeDone()
                else enableBodyPointerEvents()
              }}
              {...hooks}
            >
              {isShow.value ? nComponent : null}
            </Transition>
          )
        }
      },
    })
    app.mount(container)

    if (replace === false) {
      // 维护 history state
      window.history.pushState(
        setCurrentState({
          index: routerStack.length,
          session: currentSessionId,
        }),
        ''
      )
    }

    // push 方法滞后,保持 index
    routerStack.push(app)
  })
}

export { mounted, unmounted }
