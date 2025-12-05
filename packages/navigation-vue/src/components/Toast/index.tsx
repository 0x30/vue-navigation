import { defineComponent } from 'vue'
import { animate, utils } from 'animejs'
import { Popup } from '../../utils'
import styles from './index.module.scss'

/**
 * Toast 组件
 */
const Toast = defineComponent({
  name: 'Toast',
  props: {
    message: { type: String, required: true },
    className: String,
  },
  setup(props) {
    return () => (
      <div class={props.className ?? styles.toast}>
        {props.message}
      </div>
    )
  },
})

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
    onEnter(el, onComplete) {
      utils.set(el, { translateX: '-50%' })
      animate(el, {
        opacity: [0, 1],
        scale: [0.8, 1],
        translateX: '-50%',
        duration: 500,
        ease: 'outElastic',
        onComplete,
      })
    },
    onLeave(el, onComplete) {
      animate(el, {
        opacity: [1, 0],
        duration: 300,
        ease: 'inQuad',
        onComplete,
      })
    },
  })

  show(<Toast message={message} className={opts.className} />)
  setTimeout(close, duration)
}

/**
 * 兼容旧版 API
 * @deprecated 请使用 showToast 代替
 */
export const useToast = (title: string, options?: { duration?: number; className?: string }) => {
  showToast(title, { duration: options?.duration ?? 2000, className: options?.className })
}
