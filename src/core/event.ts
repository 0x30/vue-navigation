import { execProgressExitAnimated, getLeaveBefore } from './hooks'
import { routerStack } from './state'
import { disableBodyPointerEvents, enableBodyPointerEvents } from './util'

declare global {
  interface Window {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, ev: CustomEventMap[K]) => void
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
      { detail }
    )
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

    /// 如果有拦截返回的数据
    if (hook !== undefined) {
      const result = hook()
      if (result === false || typeof result === 'function') {
        return
      }
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
        execProgressExitAnimated({ from, to }, 0, ev.detail.isFinish)
        break
    }
  })
}

export { startScreenEdgePanGestureRecognizer }
