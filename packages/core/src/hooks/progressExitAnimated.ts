/**
 * 手势右滑执行
 * 需要客户端 介入
 */

import { getCurrentInstance } from 'vue'
import {
  ExtensionHooks,
  getValueFromAppContext,
  setValueToAppContext,
} from './core'
import { disableBodyPointerEvents, enableBodyPointerEvents } from '../util'
import { routerStack } from '../state'
import { getLeaveBefore } from './leaveBefore'
import { back } from '..'

declare global {
  interface Window {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, ev: CustomEventMap[K]) => void,
    ): void
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void

    ScreenEdgePanGestureRecognizerStart: () => void
    ScreenEdgePanGestureRecognizerChange: (progress: number) => void
    ScreenEdgePanGestureRecognizerEnded: (isFinish: boolean) => void
  }
}

enum State {
  began = 0,
  changed = 1,
  ended = 2,
}

interface StartData {
  state: State.began
}

interface ChangeData {
  state: State.changed
  progress: number
}

interface EndData {
  state: State.ended
  isFinish: boolean
}

interface CustomEventMap {
  onNativateIosScreenEdgePanEvent: CustomEvent<StartData | ChangeData | EndData>
}

const dispatchEvent = (detail: StartData | ChangeData | EndData) => {
  window.dispatchEvent(
    new CustomEvent<StartData | ChangeData | EndData>(
      'onNativateIosScreenEdgePanEvent',
      { detail },
    ),
  )
}

function startScreenEdgePanGestureRecognizer() {
  window.ScreenEdgePanGestureRecognizerStart = () => {
    disableBodyPointerEvents()
    dispatchEvent({ state: State.began })
  }

  window.ScreenEdgePanGestureRecognizerChange = (progress) => {
    dispatchEvent({ state: State.changed, progress })
  }

  window.ScreenEdgePanGestureRecognizerEnded = (isFinish) => {
    dispatchEvent({ state: State.ended, isFinish })
    enableBodyPointerEvents()
  }

  const getChildren = (ele?: HTMLElement) => {
    if (ele?.childElementCount === 1) return ele.children[0]
    return ele
  }

  window.addEventListener('onNativateIosScreenEdgePanEvent', (ev) => {
    if (routerStack.length < 2) return

    const lastApp = routerStack[routerStack.length - 1]
    const hook = getLeaveBefore(lastApp._context)

    /// 如果有拦截返回的数据 有拦截 就不再处理返回手势逻辑 而是直接触发返回事件 然后 拦截
    if (hook !== undefined) {
      back()
      return
    }

    const from = getChildren(lastApp._container)
    const to = getChildren(routerStack[routerStack.length - 2]._container)

    switch (ev.detail.state) {
      case State.began:
        break
      case State.changed:
        execProgressExitAnimated({ from, to }, ev.detail.progress)
        break
      default:
        // ev.detail is EndData in the default case
        execProgressExitAnimated({ from, to }, 0, (ev.detail as EndData).isFinish)
        break
    }
  })
}

type ProgressExitAnimatedHandle = (
  elements: {
    from?: Element
    to?: Element
  },
  progress: number,
  isFinish?: boolean,
) => void

/**
 * 当接收到 滑动手势渐进式返回 执行动画时
 * @param hook 执行动画的错做
 */
const useProgressExitAnimated = (hook: ProgressExitAnimatedHandle) => {
  setValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.ProgressExitAnimated,
    hook,
  )
}

/**
 * 管理方法: 执行 渐进式动画
 * @param elements
 * @param progress
 * @param isFinish
 */
const execProgressExitAnimated = (
  elements: {
    from?: Element
    to?: Element
  },
  progress: number,
  isFinish?: boolean,
) => {
  const hook = getValueFromAppContext<ProgressExitAnimatedHandle>(
    routerStack[routerStack.length - 1]?._context,
    ExtensionHooks.ProgressExitAnimated,
  )

  hook?.apply(null, [elements, progress, isFinish])
}

export {
  type ProgressExitAnimatedHandle,
  useProgressExitAnimated,
  execProgressExitAnimated,
}
export { startScreenEdgePanGestureRecognizer }
