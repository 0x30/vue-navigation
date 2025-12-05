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
  routerStack,
  disableBodyPointerEvents,
  enableBodyPointerEvents,
  type RouterStackItem,
  randomId,
} from '@0x30/navigation-core'
import {
  execEnterAnimator,
  execLeaveAnimator,
  getClose,
  setClose,
  trigglePageChange,
  triggerPageAppearHooks as tpah,
  getIsQuietPage,
  ExtensionHooks,
  configApp,
} from './hooks'
import { triggerTransitionHooks } from './hooks/transitionHooks'

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
 * Vue Router Stack Item
 */
export interface VueRouterStackItem extends RouterStackItem {
  context: App<Element>
}

/**
 * 获取最后一个 App
 */
const getLastApp = () => {
  const item = routerStack[routerStack.length - 1] as VueRouterStackItem | undefined
  return item?.context
}

/**
 * 获取 APP 下的子 node，用于执行动画
 */
const getChildren = (ele?: HTMLElement): Element | undefined => {
  if (ele?.childElementCount === 1) return ele.children[0]
  return ele
}

/**
 * 销毁 app
 */
export const unmounted = (
  needAnimated: boolean,
  needApplyBackHook: boolean,
  app?: App,
  backHookId?: string
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
 * 挂载组件
 */
export const mounted = (
  component: Component | VNode,
  replace: boolean,
  hooks?: LifeCycleHooks
) => {
  return new Promise<VueRouterStackItem>((resolve) => {
    // 创建 container
    const container = document.createElement('div')
    document.body.appendChild(container)

    // 在页面 replace 动画执行完成后 unmounted 倒数第二个 app
    const replaceDone = () => {
      if (replace === false) return
      const item = routerStack.splice(routerStack.length - 2, 1)[0] as VueRouterStackItem | undefined
      if (item) {
        unmounted(false, false, item.context)
      }
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
        let closeDone: (() => void) | undefined = undefined

        const lastAppContext = getLastApp()?._context

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
                const from = getChildren(lastAppContext?.app._container)
                await execEnterAnimator(target?.appContext, from, el)

                const routerItem: VueRouterStackItem = {
                  id: randomId(),
                  context: app,
                  container,
                }

                replaceDone()
                resolve(routerItem)
                done()
              }}
              onLeave={async (el, done) => {
                disableBodyPointerEvents()
                const lastContainer = getLastApp()?._container
                const to = getChildren(lastContainer instanceof HTMLElement ? lastContainer : undefined)
                await execLeaveAnimator(target?.appContext, el, to)

                if (closeDone) closeDone()
                else enableBodyPointerEvents()

                done()
              }}
              onBeforeEnter={(el) => {
                onBeforeEnter?.(el)
                triggerTransitionHooks(target?.appContext, ExtensionHooks.onBeforeEnter)

                if (getIsQuietPage(target?.appContext)) return
                tpah(lastAppContext, ExtensionHooks.onWillDisappear)
                tpah(target?.appContext, ExtensionHooks.onWillAppear, true)
              }}
              onAfterEnter={(el) => {
                onAfterEnter?.(el)
                triggerTransitionHooks(target?.appContext, ExtensionHooks.onAfterEnter)

                if (getIsQuietPage(target?.appContext)) return
                tpah(lastAppContext, ExtensionHooks.onDidDisappear)
                tpah(target?.appContext, ExtensionHooks.onDidAppear, true)

                trigglePageChange(target?.appContext, lastAppContext)
              }}
              onBeforeLeave={(el) => {
                onBeforeLeave?.(el)
                triggerTransitionHooks(target?.appContext, ExtensionHooks.onBeforeLeave)

                if (getIsQuietPage(target?.appContext)) return

                tpah(target?.appContext, ExtensionHooks.onWillDisappear)
                tpah(getLastApp()?._context, ExtensionHooks.onWillAppear, false)
              }}
              onAfterLeave={(el) => {
                onAfterLeave?.(el)
                triggerTransitionHooks(target?.appContext, ExtensionHooks.onAfterLeave)

                if (getIsQuietPage(target?.appContext)) return

                tpah(target?.appContext, ExtensionHooks.onDidDisappear)
                tpah(getLastApp()?._context, ExtensionHooks.onDidAppear, false)

                trigglePageChange(target?.appContext, getLastApp()?._context)
              }}
              {...OtherHooks}
            >
              {isShow.value ? component : null}
            </Transition>
          )
        }
      },
    })

    configApp?.(app)
    app.mount(container)
  })
}
