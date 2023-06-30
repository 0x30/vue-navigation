import {
  type App,
  type Component,
  Transition,
  createApp,
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
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
  tiggleOnActivated,
  tiggleOnDeactivated,
  tiggleOnLeaveFinish,
  tigglePageChange,
  tiggleTransitionEnterFinish,
} from './hooks'
import { disableBodyPointerEvents, enableBodyPointerEvents } from './util'

const unmounted = (needAnimated: boolean, app?: App, backHookId?: string) => {
  if (app === undefined) return

  const _unmounted = () => {
    app.unmount()
    if (app._container instanceof Element) {
      app._container.parentElement?.removeChild(app._container)
    }
    tiggleOnLeaveFinish(app._context)
  }

  const isQuietPage = getIsQuietPage(app._context)
  if (!needAnimated) return _unmounted()

  getClose(app._context)?.(() => {
    _unmounted()
    if (!isQuietPage) tiggleOnActivated(getLastApp()._context)
    applyBackHook(backHookId)
    /// 触发页面变动
    tigglePageChange(app._context, getLastApp()._context)
  })
}

/**
 * 获取 APP 下的 子node, 用于 执行 动画
 */
const getChildren = (ele?: HTMLElement) => {
  if (ele?.childElementCount === 1) return ele.children[0]
  return ele
}

const mounted = (compoent: Component, replace: boolean) => {
  return new Promise<void>((resolve) => {
    // 创建 container
    const container = document.createElement('div')
    document.body.appendChild(container)

    /// 在页面 replace 动画执行完成后 unmounted 倒数第二个 app
    const replaceDone = () => {
      if (replace === false) return
      unmounted(false, routerStack.splice(routerStack.length - 2, 1)[0])
    }

    /// 出发页面的 deactived
    const lastAppContext = getLastApp()?._context
    const lastAppDeactived = () => tiggleOnDeactivated(lastAppContext)

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

        return () => (
          <Transition
            appear
            onEnter={async (el, done) => {
              /// 执行 进入动画
              const from = getChildren(
                routerStack[routerStack.length - 2]?._container
              )
              await execEnterAnimator(target?.appContext, from, el)

              done()
              replaceDone()
              resolve()

              if (!getIsQuietPage(target?.appContext)) {
                /// 上一个页面处理
                lastAppDeactived()
              }
              /// 动画执行完 事件
              tiggleTransitionEnterFinish(target?.appContext)
              /// 触发页面 变动
              tigglePageChange(lastAppContext, target?.appContext)
            }}
            onLeave={async (el, done) => {
              disableBodyPointerEvents()
              const to = getChildren(
                routerStack[routerStack.length - 1]?._container
              )

              /// 执行 退出动画
              await execLeaveAnimator(target?.appContext, el, to)

              done()
              await nextTick()
              closeDone?.()
              enableBodyPointerEvents()
            }}
          >
            {isShow.value ? compoent : null}
          </Transition>
        )
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
