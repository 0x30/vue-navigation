import {
  type App,
  Transition,
  createApp,
  getCurrentInstance,
  onMounted,
  ref,
  type VNode,
  type RendererElement,
  type Component,
} from 'vue'
import {
  applyBackHook,
  currentSessionId,
  routerStack,
  setCurrentState,
  pushHistoryState,
  addToRouterStack,
} from '@0x30/navigation-core'
import { getLastApp } from './state'
import {
  execEnterAnimator,
  execLeaveAnimator,
  getClose,
  setClose,
  trigglePageChange,
  triggerPageAppearHooks as tpah,
  getIsQuietPage,
  ExtensionHooks as EXH,
} from './hooks'
import { disableBodyPointerEvents, enableBodyPointerEvents } from './util'
import { triggerTransitionHooks } from './hooks/transitionHooks'
import { configApp } from './hooks'

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

const mounted = (
  compoent: Component | VNode,
  replace: boolean,
  hooks?: LifeCycleHooks,
) => {
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
                /// Execute enter animation
                const from = getChildren(lastAppContext?.app._container)
                await execEnterAnimator(target?.appContext, from, el)

                replaceDone()
                resolve(app)

                /// After handling replace done event, handle animation completion
                done()
              }}
              onLeave={async (el, done) => {
                disableBodyPointerEvents()
                const to = getChildren(getLastApp()?._container)
                /// Execute exit animation
                await execLeaveAnimator(target?.appContext, el, to)

                if (closeDone) closeDone()
                else enableBodyPointerEvents()

                /// After handling close done event, handle animation completion
                done()
              }}
              onBeforeEnter={(el) => {
                onBeforeEnter?.(el)
                triggerTransitionHooks(target?.appContext, EXH.onBeforeEnter)

                if (getIsQuietPage(target?.appContext)) return
                tpah(lastAppContext, EXH.onWillDisappear)
                tpah(target?.appContext, EXH.onWillAppear, true)
              }}
              onAfterEnter={(el) => {
                onAfterEnter?.(el)
                triggerTransitionHooks(target?.appContext, EXH.onAfterEnter)

                if (getIsQuietPage(target?.appContext)) return
                tpah(lastAppContext, EXH.onDidDisappear)
                tpah(target?.appContext, EXH.onDidAppear, true)

                trigglePageChange(target?.appContext, lastAppContext)
              }}
              onBeforeLeave={(el) => {
                onBeforeLeave?.(el)
                triggerTransitionHooks(target?.appContext, EXH.onBeforeLeave)

                if (getIsQuietPage(target?.appContext)) return

                tpah(target?.appContext, EXH.onWillDisappear)
                tpah(getLastApp()?._context, EXH.onWillAppear, false)
              }}
              onAfterLeave={(el) => {
                onAfterLeave?.(el)
                triggerTransitionHooks(target?.appContext, EXH.onAfterLeave)

                if (getIsQuietPage(target?.appContext)) return

                tpah(target?.appContext, EXH.onDidDisappear)
                tpah(getLastApp()?._context, EXH.onDidAppear, false)

                trigglePageChange(target?.appContext, getLastApp()?._context)
              }}
              {...OtherHooks}
            >
              {isShow.value ? compoent : null}
            </Transition>
          )
        }
      },
    })
    configApp?.(app)
    app.mount(container)

    if (replace === false) {
      // Maintain history state
      pushHistoryState()
    }

    // Push method is delayed, maintain index
    addToRouterStack(app)
  })
}

export { mounted, unmounted }
