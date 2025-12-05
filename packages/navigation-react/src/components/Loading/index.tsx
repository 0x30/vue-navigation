import { type FC, useState, useEffect, useCallback } from 'react'
import { animate } from 'animejs'
import { enableBodyPointerEvents, disableBodyPointerEvents } from '@0x30/navigation-core'
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

export const setLoadingConfig = (newConfig: LoadingConfig) => {
  config = { ...config, ...newConfig }
}

// 全局状态管理
type LoadingState = {
  status: Status
  message?: string
}

let globalState: LoadingState = { status: 'hidden' }
let listeners: Set<(state: LoadingState) => void> = new Set()

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
 * Loading 组件 - 需要在应用根部渲染一次
 */
export const LoadingContainer: FC = () => {
  const [state, setLocalState] = useState<LoadingState>(globalState)

  useEffect(() => {
    const listener = (newState: LoadingState) => setLocalState(newState)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const handleAnimateIn = useCallback((el: HTMLDivElement | null) => {
    if (el && state.status !== 'hidden') {
      animate(el, {
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 300,
        ease: 'outQuad',
      })
    }
  }, [state.status])

  if (state.status === 'hidden') return null

  const renderIcon = () => {
    switch (state.status) {
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

  return (
    <div className={styles.body}>
      <div className={styles.main} ref={handleAnimateIn}>
        <div className={styles.icon}>{renderIcon()}</div>
        {state.message && <span>{state.message}</span>}
      </div>
    </div>
  )
}

let hideTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 显示 Loading
 */
export const showLoading = (message?: string) => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  setState({ status: 'loading', message })
}

/**
 * 隐藏 Loading
 */
export const hideLoading = () => {
  setState({ status: 'hidden' })
}

/**
 * 显示成功提示
 */
export const showSuccess = (message?: string, duration?: number) => {
  setState({ status: 'success', message })
  hideTimer = setTimeout(() => {
    hideLoading()
  }, duration ?? config.closeTimeout)
}

/**
 * 显示失败提示
 */
export const showError = (message?: string, duration?: number) => {
  setState({ status: 'error', message })
  hideTimer = setTimeout(() => {
    hideLoading()
  }, duration ?? config.closeTimeout)
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
