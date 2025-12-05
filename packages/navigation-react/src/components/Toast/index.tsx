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
      utils.set(el, { transform: 'translateX(-50%)' })
      animate(el, {
        opacity: [0, 1],
        scale: [0.8, 1],
        translateX: '-50%',
        duration: 500,
        ease: 'outElastic',
        onComplete: done,
      })
    },
    onLeave(el, done) {
      animate(el, {
        opacity: [1, 0],
        duration: 300,
        ease: 'inQuad',
        onComplete: done,
      })
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
