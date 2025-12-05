/**
 * 手势右滑返回相关
 * 需要客户端介入
 */

import { routerStack, getLastRouterItem } from './state'
import { disableBodyPointerEvents, enableBodyPointerEvents } from './pointer-events'
import { back } from './navigation'

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

export enum GestureState {
  began = 0,
  changed = 1,
  ended = 2,
}

interface StartData {
  state: GestureState.began
}

interface ChangeData {
  state: GestureState.changed
  progress: number
}

interface EndData {
  state: GestureState.ended
  isFinish: boolean
}

export type GestureEventData = StartData | ChangeData | EndData

interface CustomEventMap {
  onNativateIosScreenEdgePanEvent: CustomEvent<GestureEventData>
}

const dispatchEvent = (detail: GestureEventData) => {
  window.dispatchEvent(
    new CustomEvent<GestureEventData>('onNativateIosScreenEdgePanEvent', { detail })
  )
}

/**
 * Progress Exit Animated Handler 类型
 */
export type ProgressExitAnimatedHandler = (
  elements: { from?: Element; to?: Element },
  progress: number,
  isFinish?: boolean
) => void

/**
 * 获取进度退出动画 handler - 由框架层设置
 */
let getProgressExitAnimatedHandler: ((item: any) => ProgressExitAnimatedHandler | undefined) | undefined

/**
 * 获取 leaveBefore hook - 由框架层设置
 */
let getLeaveBeforeHookForGesture: ((item: any) => (() => boolean | Promise<boolean>) | undefined) | undefined

/**
 * 注册手势相关的 hooks
 */
export const registerGestureHooks = (
  getProgressHandler: typeof getProgressExitAnimatedHandler,
  getLeaveBeforeHook: typeof getLeaveBeforeHookForGesture
) => {
  getProgressExitAnimatedHandler = getProgressHandler
  getLeaveBeforeHookForGesture = getLeaveBeforeHook
}

const getChildren = (ele?: HTMLElement) => {
  if (ele?.childElementCount === 1) return ele.children[0]
  return ele
}

/**
 * 执行渐进式动画
 */
const execProgressExitAnimated = (
  elements: { from?: Element; to?: Element },
  progress: number,
  isFinish?: boolean
) => {
  const lastItem = getLastRouterItem()
  if (!lastItem) return

  const hook = getProgressExitAnimatedHandler?.(lastItem)
  hook?.(elements, progress, isFinish)
}

/**
 * 启动屏幕边缘手势识别器
 */
export const startScreenEdgePanGestureRecognizer = () => {
  window.ScreenEdgePanGestureRecognizerStart = () => {
    disableBodyPointerEvents()
    dispatchEvent({ state: GestureState.began })
  }

  window.ScreenEdgePanGestureRecognizerChange = (progress) => {
    dispatchEvent({ state: GestureState.changed, progress })
  }

  window.ScreenEdgePanGestureRecognizerEnded = (isFinish) => {
    dispatchEvent({ state: GestureState.ended, isFinish })
    enableBodyPointerEvents()
  }

  window.addEventListener('onNativateIosScreenEdgePanEvent', (ev) => {
    if (routerStack.length < 2) return

    const lastItem = getLastRouterItem()
    if (!lastItem) return

    const hook = getLeaveBeforeHookForGesture?.(lastItem)

    // 如果有拦截返回的数据，有拦截就不再处理返回手势逻辑，而是直接触发返回事件然后拦截
    if (hook !== undefined) {
      back()
      return
    }

    const from = getChildren(lastItem.container)
    const to = getChildren(routerStack[routerStack.length - 2]?.container)

    switch (ev.detail.state) {
      case GestureState.began:
        break
      case GestureState.changed:
        execProgressExitAnimated({ from, to }, ev.detail.progress)
        break
      default:
        execProgressExitAnimated({ from, to }, 0, ev.detail.isFinish)
        break
    }
  })
}
