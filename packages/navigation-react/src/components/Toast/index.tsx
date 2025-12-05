import { type FC, useState, useEffect, useCallback, useRef } from 'react'
import { animate } from 'animejs'
import styles from './index.module.scss'

interface ToastItem {
  id: number
  message: string
  className?: string
}

let toastId = 0
let globalToasts: ToastItem[] = []
let listeners: Set<(toasts: ToastItem[]) => void> = new Set()

const setToasts = (toasts: ToastItem[]) => {
  globalToasts = toasts
  listeners.forEach(listener => listener(toasts))
}

const addToast = (message: string, duration: number, className?: string) => {
  const id = ++toastId
  setToasts([...globalToasts, { id, message, className }])
  
  setTimeout(() => {
    setToasts(globalToasts.filter(t => t.id !== id))
  }, duration)
}

/**
 * Toast 容器组件 - 需要在应用根部渲染一次
 */
export const ToastContainer: FC = () => {
  const [toasts, setLocalToasts] = useState<ToastItem[]>(globalToasts)

  useEffect(() => {
    const listener = (newToasts: ToastItem[]) => setLocalToasts([...newToasts])
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return (
    <div className={styles.container}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  )
}

const ToastItem: FC<ToastItem> = ({ message, className }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      animate(ref.current, {
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 500,
        ease: 'outElastic',
      })
    }
  }, [])

  return (
    <div ref={ref} className={className ?? styles.toast}>
      {message}
    </div>
  )
}

/**
 * 显示 Toast 消息
 */
export const showToast = (message: string, duration = 2000, className?: string) => {
  addToast(message, duration, className)
}

/**
 * 使用 Toast 的 Hook
 */
export const useToast = () => {
  const show = useCallback((message: string, duration = 2000, className?: string) => {
    showToast(message, duration, className)
  }, [])

  return { show }
}
