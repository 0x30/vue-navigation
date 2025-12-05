import { enableBodyPointerEvents, disableBodyPointerEvents } from '@0x30/navigation-core'
import { defineComponent, ref, onMounted, onUnmounted, type ComponentPublicInstance } from 'vue'
import { animate } from 'animejs'
import { push, back } from '../../navigation'
import { useLeaveBefore, useQuietPage } from '../../hooks'

import styles from './index.module.scss'

// 内置 SVG 图标组件
const LoadingSvg = defineComponent({
  name: 'LoadingSvg',
  setup: () => () => (
    <svg viewBox="0 0 100 100" class={styles.spinner}>
      <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round" />
    </svg>
  ),
})

const SuccessSvg = defineComponent({
  name: 'SuccessSvg',
  setup: () => () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
})

const ErrorSvg = defineComponent({
  name: 'ErrorSvg',
  setup: () => () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
})

type Status = 'loading' | 'success' | 'error' | 'hidden'

interface LoadingConfig {
  successImg?: string
  errorImg?: string
  loadingImg?: string
  closeTimeout?: number
}

let config: LoadingConfig = {
  closeTimeout: 1500,
}

/**
 * 配置 Loading 组件
 */
export const setLoadingConfig = (newConfig: LoadingConfig) => {
  config = { ...config, ...newConfig }
}

// 全局状态管理
interface LoadingState {
  status: Status
  message?: string
}

let globalState: LoadingState = { status: 'hidden' }
let listeners: Set<(state: LoadingState) => void> = new Set()
let isLoadingPagePushed = false
let canLeave = false

const setState = (state: LoadingState) => {
  globalState = state
  listeners.forEach(listener => listener(state))

  if (state.status === 'loading') {
    disableBodyPointerEvents()
  } else {
    enableBodyPointerEvents()
  }
}

/**
 * Loading 实例接口 - 用于控制 loading 的状态和内容
 */
export interface LoadingInstance {
  /** 更新 loading 消息 */
  setMessage: (message: string) => void
  /** 切换为成功状态并自动关闭 */
  success: (message?: string, duration?: number) => void
  /** 切换为失败状态并自动关闭 */
  error: (message?: string, duration?: number) => void
  /** 立即隐藏 */
  hide: () => void
}

/**
 * Loading 页面组件 - 用于阻止用户返回
 */
const LoadingPage = defineComponent({
  name: 'LoadingPage',
  setup: () => {
    // 阻止返回，只有 canLeave 为 true 时才允许
    useLeaveBefore(() => canLeave)
    // 静默页面，不触发其他页面的生命周期
    useQuietPage()
    
    return () => null
  },
})

/**
 * Loading UI 组件 - 显示 loading 的 UI
 */
const LoadingUI = defineComponent({
  name: 'LoadingUI',
  setup: () => {
    const state = ref<LoadingState>(globalState)

    const listener = (newState: LoadingState) => {
      state.value = newState
    }

    onMounted(() => {
      listeners.add(listener)
    })

    onUnmounted(() => {
      listeners.delete(listener)
    })

    const handleAnimateIn = (el: Element | ComponentPublicInstance | null) => {
      if (el && el instanceof Element && state.value.status !== 'hidden') {
        animate(el, {
          opacity: [0, 1],
          scale: [0.8, 1],
          duration: 300,
          ease: 'outQuad',
        })
      }
    }

    const renderIcon = () => {
      switch (state.value.status) {
        case 'loading':
          return config.loadingImg ? <img src={config.loadingImg} alt="" /> : <LoadingSvg />
        case 'success':
          return config.successImg ? <img src={config.successImg} alt="" /> : <SuccessSvg />
        case 'error':
          return config.errorImg ? <img src={config.errorImg} alt="" /> : <ErrorSvg />
        default:
          return null
      }
    }

    return () => {
      if (state.value.status === 'hidden') return null

      return (
        <div class={styles.body}>
          <div class={styles.main} ref={handleAnimateIn}>
            <div class={styles.icon}>{renderIcon()}</div>
            {state.value.message && <span>{state.value.message}</span>}
          </div>
        </div>
      )
    }
  },
})

/**
 * Loading 容器组件 - 需要在应用根部渲染一次
 */
export const LoadingContainer = LoadingUI

let hideTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 创建一个 Loading 实例
 */
const createLoadingInstance = (): LoadingInstance => {
  return {
    setMessage: (message: string) => {
      if (globalState.status !== 'hidden') {
        setState({ ...globalState, message })
      }
    },
    success: (message?: string, duration?: number) => {
      showSuccess(message, duration)
    },
    error: (message?: string, duration?: number) => {
      showError(message, duration)
    },
    hide: () => {
      hideLoading()
    },
  }
}

/**
 * 关闭 loading 页面
 */
const closeLoadingPage = async () => {
  if (isLoadingPagePushed) {
    canLeave = true
    await back()
    canLeave = false
    isLoadingPagePushed = false
  }
}

/**
 * 显示 Loading
 * @param message 可选的提示消息
 * @returns LoadingInstance 可用于后续控制 loading 状态
 */
export const showLoading = async (message?: string): Promise<LoadingInstance> => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  
  // 如果还没有 push loading 页面，先 push
  if (!isLoadingPagePushed) {
    isLoadingPagePushed = true
    canLeave = false
    await push(<LoadingPage />)
  }
  
  setState({ status: 'loading', message })
  return createLoadingInstance()
}

/**
 * 隐藏 Loading
 */
export const hideLoading = async () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  setState({ status: 'hidden' })
  await closeLoadingPage()
}

/**
 * 显示成功提示
 * @param message 可选的提示消息
 * @param duration 可选的显示时长（毫秒）
 */
export const showSuccess = async (message?: string, duration?: number) => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  
  // 先关闭 loading 页面（如果有的话），允许用户返回
  await closeLoadingPage()
  
  setState({ status: 'success', message })
  hideTimer = setTimeout(() => {
    setState({ status: 'hidden' })
  }, duration ?? config.closeTimeout)
}

/**
 * 显示失败提示
 * @param message 可选的提示消息
 * @param duration 可选的显示时长（毫秒）
 */
export const showError = async (message?: string, duration?: number) => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  
  // 先关闭 loading 页面（如果有的话），允许用户返回
  await closeLoadingPage()
  
  setState({ status: 'error', message })
  hideTimer = setTimeout(() => {
    setState({ status: 'hidden' })
  }, duration ?? config.closeTimeout)
}

/**
 * 使用 Loading 的组合式函数
 */
export const useLoading = () => {
  return {
    show: showLoading,
    hide: hideLoading,
    success: showSuccess,
    error: showError,
  }
}
