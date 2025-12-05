import type { Root } from 'react-dom/client'
import type { ReactElement } from 'react'
import {
  routerStack,
  type RouterStackItem,
  randomId,
} from '@0x30/navigation-core'

/**
 * React Router Stack Item
 */
export interface ReactRouterStackItem extends RouterStackItem {
  root: Root
  element: ReactElement
  // 存储组件相关的 hooks 和状态
  hooks: {
    leaveBefore?: () => boolean | Promise<boolean>
    onClose?: (done: () => void) => void
    triggerLeave?: (done: () => void) => void
    onLeaveComplete?: () => void
    transitionEnter?: TransitionAnimatorHook
    transitionLeave?: TransitionAnimatorHook
    progressExitAnimated?: ProgressExitAnimatedHandler
    isQuietPage?: boolean
    pageMate?: PageMate
  }
}

export type TransitionAnimatorHook = (
  elements: { from?: Element; to?: Element },
  done: () => void
) => void

export type ProgressExitAnimatedHandler = (
  elements: { from?: Element; to?: Element },
  progress: number,
  isFinish?: boolean
) => void

export interface PageMate {
  id?: string
  name?: string
  [key: string]: unknown
}

/**
 * 获取最后一个路由项
 */
export const getLastReactItem = (): ReactRouterStackItem | undefined => {
  return routerStack[routerStack.length - 1] as ReactRouterStackItem | undefined
}

/**
 * 获取指定索引的路由项
 */
export const getReactItem = (index: number): ReactRouterStackItem | undefined => {
  return routerStack[index] as ReactRouterStackItem | undefined
}

/**
 * 创建 React 路由项
 */
export const createReactRouterItem = (
  element: ReactElement,
  container: HTMLElement,
  root: Root
): ReactRouterStackItem => {
  return {
    id: randomId(),
    context: { root, element },
    container,
    root,
    element,
    hooks: {},
  }
}
