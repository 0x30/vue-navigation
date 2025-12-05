import { useEffect } from 'react'
import { usePageContext, usePageContextSafe } from './context'
import type {
  TransitionAnimatorHook,
  ProgressExitAnimatedHandler,
  PageMate,
} from './state'

/**
 * 设置页面为安静页面
 * 安静页面不会触发其他页面的 appear/disappear 事件
 */
export const useQuietPage = () => {
  const { updateHooks } = usePageContext()

  useEffect(() => {
    updateHooks({ isQuietPage: true })
  }, [updateHooks])
}

/**
 * 返回前拦截
 */
export const useLeaveBefore = (hook: () => boolean | Promise<boolean>) => {
  const { updateHooks } = usePageContext()

  useEffect(() => {
    updateHooks({ leaveBefore: hook })
    return () => {
      updateHooks({ leaveBefore: undefined })
    }
  }, [hook, updateHooks])
}

/**
 * 设置进入动画
 */
export const useTransitionEnter = (hook: TransitionAnimatorHook) => {
  const { updateHooks } = usePageContext()

  useEffect(() => {
    updateHooks({ transitionEnter: hook })
  }, [hook, updateHooks])
}

/**
 * 设置离开动画
 */
export const useTransitionLeave = (hook: TransitionAnimatorHook) => {
  const { updateHooks } = usePageContext()

  useEffect(() => {
    updateHooks({ transitionLeave: hook })
  }, [hook, updateHooks])
}

/**
 * 设置进度退出动画（手势返回）
 */
export const useProgressExitAnimated = (hook: ProgressExitAnimatedHandler) => {
  const { updateHooks } = usePageContext()

  useEffect(() => {
    updateHooks({ progressExitAnimated: hook })
  }, [hook, updateHooks])
}

/**
 * 设置页面元数据
 */
export const usePageMate = (mate: PageMate) => {
  const { updateHooks, item } = usePageContext()

  useEffect(() => {
    const oldMate = item.hooks.pageMate ?? {}
    updateHooks({ pageMate: { ...oldMate, ...mate } })
  }, [mate, updateHooks, item])
}

/**
 * 获取当前页面元数据
 */
export const useCurrentPageMate = (): PageMate | undefined => {
  const context = usePageContextSafe()
  return context?.item.hooks.pageMate
}

// Lifecycle hooks - 使用回调存储
type LifecycleCallback = (isFirst: boolean) => void
type LifecycleCallbackSimple = () => void

const willAppearCallbacks = new Map<string, LifecycleCallback[]>()
const didAppearCallbacks = new Map<string, LifecycleCallback[]>()
const willDisappearCallbacks = new Map<string, LifecycleCallbackSimple[]>()
const didDisappearCallbacks = new Map<string, LifecycleCallbackSimple[]>()

export const onWillAppear = (hook: LifecycleCallback) => {
  const context = usePageContextSafe()
  
  useEffect(() => {
    if (!context) return
    const id = context.item.id
    const callbacks = willAppearCallbacks.get(id) ?? []
    callbacks.push(hook)
    willAppearCallbacks.set(id, callbacks)
    
    return () => {
      const cbs = willAppearCallbacks.get(id) ?? []
      willAppearCallbacks.set(id, cbs.filter(cb => cb !== hook))
    }
  }, [hook, context])
}

export const onDidAppear = (hook: LifecycleCallback) => {
  const context = usePageContextSafe()
  
  useEffect(() => {
    if (!context) return
    const id = context.item.id
    const callbacks = didAppearCallbacks.get(id) ?? []
    callbacks.push(hook)
    didAppearCallbacks.set(id, callbacks)
    
    return () => {
      const cbs = didAppearCallbacks.get(id) ?? []
      didAppearCallbacks.set(id, cbs.filter(cb => cb !== hook))
    }
  }, [hook, context])
}

export const onWillDisappear = (hook: LifecycleCallbackSimple) => {
  const context = usePageContextSafe()
  
  useEffect(() => {
    if (!context) return
    const id = context.item.id
    const callbacks = willDisappearCallbacks.get(id) ?? []
    callbacks.push(hook)
    willDisappearCallbacks.set(id, callbacks)
    
    return () => {
      const cbs = willDisappearCallbacks.get(id) ?? []
      willDisappearCallbacks.set(id, cbs.filter(cb => cb !== hook))
    }
  }, [hook, context])
}

export const onDidDisappear = (hook: LifecycleCallbackSimple) => {
  const context = usePageContextSafe()
  
  useEffect(() => {
    if (!context) return
    const id = context.item.id
    const callbacks = didDisappearCallbacks.get(id) ?? []
    callbacks.push(hook)
    didDisappearCallbacks.set(id, callbacks)
    
    return () => {
      const cbs = didDisappearCallbacks.get(id) ?? []
      didDisappearCallbacks.set(id, cbs.filter(cb => cb !== hook))
    }
  }, [hook, context])
}

// 触发生命周期回调
export const triggerWillAppear = (id: string, isFirst: boolean) => {
  willAppearCallbacks.get(id)?.forEach(cb => cb(isFirst))
}

export const triggerDidAppear = (id: string, isFirst: boolean) => {
  didAppearCallbacks.get(id)?.forEach(cb => cb(isFirst))
}

export const triggerWillDisappear = (id: string) => {
  willDisappearCallbacks.get(id)?.forEach(cb => cb())
}

export const triggerDidDisappear = (id: string) => {
  didDisappearCallbacks.get(id)?.forEach(cb => cb())
}

// 清理生命周期回调
export const cleanupLifecycleCallbacks = (id: string) => {
  willAppearCallbacks.delete(id)
  didAppearCallbacks.delete(id)
  willDisappearCallbacks.delete(id)
  didDisappearCallbacks.delete(id)
}
