import {
  type App,
  Transition,
  createApp,
  getCurrentInstance,
  onMounted,
  ref,
  type VNode,
  type RendererElement,
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
  setClose,
  trigglePageChange,
  triggerWillDisappear,
  triggerWillAppear,
  triggerDidAppear,
  triggerDidDisappear,
  getIsQuietPage,
} from './hooks'
import { disableBodyPointerEvents, enableBodyPointerEvents } from './util'

export type LifeCycleHooks = {
  onBeforeEnter?: (el: RendererElement) => void
  onAfterEnter?: (el: RendererElement) => void
  onEnterCancelled?: (el: RendererElement) => void
  onBeforeLeave?: (el: RendererElement) => void
  onAfterLeave?: (el: RendererElement) => void
  onLeaveCancelled?: (el: RendererElement) => void
  onBeforeAppear?: (el: RendererElement) => void
  onAfterAppear?: (el: RendererElement) => void
  onAppearCancelled?: (el: RendererElement) => void
}

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
  app?: App,
  backHookId?: string,
) => {
  if (app === undefined) return

  const _unmounted = () => {
    app.unmount()
    if (app._container instanceof Element) {
      app._container.parentElement?.removeChild(app._container)
    }

    if (!needApplyBackHook) return
    enableBodyPointerEvents()
    applyBackHook(backHookId)
  }

  if (needAnimated) {
    getClose(app._context)?.(() => _unmounted())
  } else {
    _unmounted()
  }
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
      unmounted(false, false, routerStack.splice(routerStack.length - 2, 1)[0])
    }

    const {
      onAfterEnter,
      onAfterLeave,
      onBeforeEnter,
      onBeforeLeave,
      ...OtherHooks
    } = hooks ?? {}

    // 创建 app
    const app = createApp({
      setup: () => {
        const isShow = ref(true)
        /// 关闭方法,在动画执行完成后 调用 销毁 app
        let closeDone: (() => void) | undefined = undefined

        /// 出发页面的 deactived
        const lastAppContext = getLastApp()?._context

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
                /// 执行 进入动画
                const from = getChildren(lastAppContext.app._container)
                await execEnterAnimator(target?.appContext, from, el)
                done()
                replaceDone()
                resolve(app)
              }}
              onLeave={async (el, done) => {
                disableBodyPointerEvents()
                const to = getChildren(getLastApp()._container)
                /// 执行 退出动画
                await execLeaveAnimator(target?.appContext, el, to)
                done()
                if (closeDone) closeDone()
                else enableBodyPointerEvents()
              }}
              onBeforeEnter={(el) => {
                onBeforeEnter?.(el)

                if (getIsQuietPage(target?.appContext)) return
                triggerWillDisappear(lastAppContext)
                triggerWillAppear(target?.appContext)
              }}
              onAfterEnter={(el) => {
                onAfterEnter?.(el)

                if (getIsQuietPage(target?.appContext)) return
                triggerDidDisappear(lastAppContext)
                triggerDidAppear(target?.appContext)

                trigglePageChange(target?.appContext, lastAppContext)
              }}
              onBeforeLeave={(el) => {
                onBeforeLeave?.(el)

                if (getIsQuietPage(target?.appContext)) return
                triggerWillDisappear(target?.appContext)
                triggerWillAppear(getLastApp()._context)
              }}
              onAfterLeave={(el) => {
                onAfterLeave?.(el)

                if (getIsQuietPage(target?.appContext)) return
                triggerDidDisappear(target?.appContext)
                triggerDidAppear(getLastApp()._context)

                trigglePageChange(target?.appContext, getLastApp()._context)
              }}
              {...OtherHooks}
            >
              {isShow.value ? compoent : null}
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
        '',
      )
    }

    // push 方法滞后,保持 index
    routerStack.push(app)
  })
}

export { mounted, unmounted }
