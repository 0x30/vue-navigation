import { enableBodyPointerEvents, disableBodyPointerEvents } from '@0x30/navigation-core'
import { defineComponent, ref } from 'vue'
import { animate } from 'animejs'
import { push, back } from '../../navigation'
import { useLeaveBefore, useQuietPage } from '../../hooks'
import { Popup } from '../../utils'

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

/**
 * 0: 展示 loading
 * 1: 展示 success
 * 2: 展示 error
 * 3: 立即隐藏
 */
type Status = 0 | 1 | 2 | 3

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
const statusRef = ref<Status>()
const messageRef = ref<string>()
const closePopupRef = ref<() => Promise<void>>()

let isShowLoading = false
let closeLoadingTimer: number | undefined = undefined

const setStatus = (status: Status) => {
  statusRef.value = status

  if (status === 0) {
    disableBodyPointerEvents()
  } else {
    enableBodyPointerEvents()
  }
}

/**
 * Loading 页面组件 - 用于阻止用户返回
 */
const LoadingPage = defineComponent({
  name: 'LoadingPage',
  setup: () => {
    // 阻止返回，只有 isShowLoading 为 false 时才允许
    useLeaveBefore(() => isShowLoading === false)
    // 静默页面，不触发其他页面的生命周期
    useQuietPage()
    
    return () => <div />
  },
})

/**
 * Loading UI 组件 - Popup 内容
 */
const LoadingUI = defineComponent({
  name: 'LoadingUI',
  setup: () => {
    const renderIcon = () => {
      switch (statusRef.value) {
        case 0:
          return config.loadingImg ? <img src={config.loadingImg} alt="" /> : <LoadingSvg />
        case 1:
          return config.successImg ? <img src={config.successImg} alt="" /> : <SuccessSvg />
        case 2:
          return config.errorImg ? <img src={config.errorImg} alt="" /> : <ErrorSvg />
        default:
          return null
      }
    }

    return () => (
      <div class={styles.body}>
        <div class={styles.main}>
          <div class={styles.icon}>{renderIcon()}</div>
          {messageRef.value && <span>{messageRef.value}</span>}
        </div>
      </div>
    )
  },
})

/**
 * 显示 Loading UI Popup
 */
const showLoadingPopup = async () => {
  // 如果已经有 popup 在显示，不重复创建
  if (closePopupRef.value !== undefined) return

  const [show, close] = Popup({
    onLeave(el, onComplete) {
      const mainEl = el.querySelector(`.${styles.main}`)
      if (mainEl) {
        animate(mainEl, {
          opacity: [1, 0],
          duration: 200,
          ease: 'outExpo',
          onComplete,
        })
      } else {
        onComplete()
      }
    },
  })

  closePopupRef.value = async () => {
    closePopupRef.value = undefined
    await close()
  }

  await show(<LoadingUI />)
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
 * 创建一个 Loading 实例
 */
const createLoadingInstance = (): LoadingInstance => {
  return {
    setMessage: (message: string) => {
      messageRef.value = message
    },
    success: (message?: string, duration?: number) => {
      internalShowLoading(1, message, duration)
    },
    error: (message?: string, duration?: number) => {
      internalShowLoading(2, message, duration)
    },
    hide: () => {
      internalShowLoading(3)
    },
  }
}

/**
 * 内部展示 loading 方法
 */
const internalShowLoading = async (status: Status, message?: string, duration?: number) => {
  window.clearTimeout(closeLoadingTimer)

  if (status === 0) {
    isShowLoading = true
    await push(<LoadingPage />)
  } else {
    if (isShowLoading) {
      isShowLoading = false
      await back()
    }
  }

  // 设置状态
  setStatus(status)
  messageRef.value = message
  await showLoadingPopup()

  if (status === 0) return

  if (status === 3) {
    closeLoadingTimer = window.setTimeout(() => {
      closePopupRef.value?.()
    }, 150)
  } else {
    closeLoadingTimer = window.setTimeout(() => {
      closePopupRef.value?.()
    }, duration ?? config.closeTimeout)
  }
}

/**
 * 显示 Loading
 * @param message 可选的提示消息
 * @returns LoadingInstance 可用于后续控制 loading 状态
 */
export const showLoading = async (message?: string): Promise<LoadingInstance> => {
  await internalShowLoading(0, message)
  return createLoadingInstance()
}

/**
 * 隐藏 Loading
 */
export const hideLoading = async () => {
  await internalShowLoading(3)
}

/**
 * 显示成功提示
 * @param message 可选的提示消息
 * @param duration 可选的显示时长（毫秒）
 */
export const showSuccess = async (message?: string, duration?: number) => {
  await internalShowLoading(1, message, duration)
}

/**
 * 显示失败提示
 * @param message 可选的提示消息
 * @param duration 可选的显示时长（毫秒）
 */
export const showError = async (message?: string, duration?: number) => {
  await internalShowLoading(2, message, duration)
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

/**
 * @deprecated 不再需要使用 LoadingContainer，Loading 现在会自动创建 DOM
 */
export const LoadingContainer = defineComponent({
  name: 'LoadingContainer',
  setup: () => {
    console.warn('LoadingContainer is deprecated and no longer needed. Loading now creates DOM dynamically.')
    return () => null
  },
})
