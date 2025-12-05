import { type FC, useState, useEffect } from 'react'
import { animate } from 'animejs'
import { enableBodyPointerEvents, disableBodyPointerEvents } from '@0x30/navigation-core'
import { push, back } from '../../navigation'
import { useLeaveBefore, useQuietPage } from '../../hooks'
import { Popup } from '../../utils'
import styles from './index.module.scss'

// 内置 SVG 图标
const LoadingSvg: FC = () => (
  <svg viewBox="0 0 100 100" className={styles.spinner}>
    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
  </svg>
)

const SuccessSvg: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ErrorSvg: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

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

export const setLoadingConfig = (newConfig: LoadingConfig) => {
  config = { ...config, ...newConfig }
}

// 全局状态管理
let currentStatus: Status | undefined = undefined
let currentMessage: string | undefined = undefined
let closePopup: (() => Promise<void>) | undefined = undefined
let updatePopupUI: (() => void) | undefined = undefined  // 用于触发 popup UI 更新
let isShowLoading = false
let isTransitioning = false
let closeLoadingTimer: number | undefined = undefined

const setStatus = (status: Status) => {
  currentStatus = status

  if (status === 0) {
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
const LoadingPage: FC = () => {
  // 阻止返回，只有 isShowLoading 为 false 时才允许
  useLeaveBefore(() => isShowLoading === false)
  // 静默页面，不触发其他页面的生命周期
  useQuietPage()
  
  return <div />
}

/**
 * Loading UI 组件 - Popup 内容
 */
const LoadingUI: FC = () => {
  const [, forceUpdate] = useState(0)

  // 注册更新回调
  useEffect(() => {
    updatePopupUI = () => forceUpdate(n => n + 1)
    return () => {
      updatePopupUI = undefined
    }
  }, [])

  const renderIcon = () => {
    switch (currentStatus) {
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

  return (
    <div className={styles.body}>
      <div className={styles.main}>
        <div className={styles.icon}>{renderIcon()}</div>
        {currentMessage && <span>{currentMessage}</span>}
      </div>
    </div>
  )
}

/**
 * 显示 Loading UI Popup
 */
const showLoadingPopup = async () => {
  // 如果已经有 popup 在显示，不重复创建
  if (closePopup !== undefined) return

  const [show, close] = Popup({
    onLeave(el, done) {
      const mainEl = el.querySelector(`.${styles.main}`)
      if (mainEl) {
        animate(mainEl, {
          opacity: [1, 0],
          duration: 200,
          ease: 'outExpo',
          onComplete: done,
        })
      } else {
        done()
      }
    },
  })

  closePopup = async () => {
    closePopup = undefined
    await close()
  }

  await show(<LoadingUI />)
}

/**
 * 创建一个 Loading 实例
 */
const createLoadingInstance = (): LoadingInstance => {
  return {
    setMessage: (message: string) => {
      currentMessage = message
      updatePopupUI?.()  // 触发 UI 更新
    },
    success: (message?: string, duration?: number) => {
      internalShowLoading(1, message, duration)
    },
    error: (message?: string, duration?: number) => {
      internalShowLoading(2, message, duration)
    },
    hide: () => {
      closeLoadingToast()
    },
  }
}

/**
 * 关闭 Loading Toast（内部方法）
 * 关闭 popup 并返回上一页
 */
const closeLoadingToast = async () => {
  if (isShowLoading === false) return
  isShowLoading = false
  window.clearTimeout(closeLoadingTimer)
  closeLoadingTimer = window.setTimeout(() => {
    closePopup?.()
  }, 150)
  await back()
}

/**
 * 内部展示 loading 方法
 */
const internalShowLoading = async (status: Status, message?: string, duration?: number) => {
  window.clearTimeout(closeLoadingTimer)

  // status === 0: 显示 loading，需要 push LoadingPage
  if (status === 0) {
    if (isShowLoading || isTransitioning) return
    isTransitioning = true
    isShowLoading = true
    await push(<LoadingPage />)
    isTransitioning = false
  }

  // 设置状态
  setStatus(status)
  currentMessage = message
  
  // 显示 popup
  await showLoadingPopup()
  
  // 触发 UI 更新（React 需要手动触发）
  updatePopupUI?.()

  if (status === 0) return

  // 如果 loading 已经关闭了，不需要处理
  if (isShowLoading === false) return

  // status !== 0 时，设置 isShowLoading = false，允许用户返回
  isShowLoading = false

  // status === 1/2: success/error，显示一段时间后关闭 popup 并返回
  closeLoadingTimer = window.setTimeout(async () => {
    await closePopup?.()
    await back()
  }, duration ?? config.closeTimeout)
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
  await closeLoadingToast()
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
 * 使用 Loading 的 Hook
 */
export const useLoading = () => {
  return {
    show: showLoading,
    hide: hideLoading,
    success: showSuccess,
    error: showError,
  }
}
