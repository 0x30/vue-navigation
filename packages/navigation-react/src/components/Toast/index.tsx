import { type FC } from 'react'
import { animate, utils } from 'animejs'
import { Popup } from '../../utils'
import styles from './index.module.scss'

/**
 * Toast 组件
 */
const Toast: FC<{ message: string; className?: string }> = ({ message, className }) => {
  return (
    <div className={className ?? styles.toast}>
      {message}
    </div>
  )
}

interface ToastOptions {
  duration?: number
  className?: string
}

/**
 * 显示 Toast 消息 - 动态创建 DOM，无需预渲染容器
 */
export const showToast = (message: string, options?: ToastOptions | number) => {
  const opts: ToastOptions = typeof options === 'number' ? { duration: options } : options ?? {}
  const duration = opts.duration ?? 2000

  const [show, close] = Popup({
    onEnter(el, done) {
      // 找到实际的 toast 元素
      const toastEl = el.firstElementChild as HTMLElement
      if (toastEl) {
        utils.set(toastEl, { transform: 'translateX(-50%)' })
        animate(toastEl, {
          opacity: [0, 1],
          scale: [0.8, 1],
          translateX: '-50%',
          duration: 500,
          ease: 'outElastic',
          onComplete: done,
        })
      } else {
        done()
      }
    },
    onLeave(el, done) {
      const toastEl = el.firstElementChild as HTMLElement
      if (toastEl) {
        animate(toastEl, {
          opacity: [1, 0],
          duration: 300,
          ease: 'inQuad',
          onComplete: done,
        })
      } else {
        done()
      }
    },
  })

  show(<Toast message={message} className={opts.className} />)
  setTimeout(close, duration)
}

/**
 * 使用 Toast 的 Hook
 */
export const useToast = () => {
  return {
    show: showToast,
  }
}

/**
 * @deprecated 不再需要使用 ToastContainer，Toast 现在会自动创建 DOM
 */
export const ToastContainer: FC = () => {
  console.warn('ToastContainer is deprecated and no longer needed. Toast now creates DOM dynamically.')
  return null
}
