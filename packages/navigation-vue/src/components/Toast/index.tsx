import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
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
 * 单个 Toast 项组件
 */
const ToastItemComponent = defineComponent({
  name: 'ToastItem',
  props: {
    message: { type: String, required: true },
    className: String,
  },
  setup(props) {
    const itemRef = ref<HTMLDivElement | null>(null)

    onMounted(() => {
      if (itemRef.value) {
        animate(itemRef.value, {
          opacity: [0, 1],
          scale: [0.8, 1],
          duration: 500,
          ease: 'outElastic',
        })
      }
    })

    return () => (
      <div ref={itemRef} class={props.className ?? styles.toast}>
        {props.message}
      </div>
    )
  },
})

/**
 * Toast 容器组件 - 需要在应用根部渲染一次
 */
export const ToastContainer = defineComponent({
  name: 'ToastContainer',
  setup() {
    const toasts = ref<ToastItem[]>(globalToasts)

    const listener = (newToasts: ToastItem[]) => {
      toasts.value = [...newToasts]
    }

    onMounted(() => {
      listeners.add(listener)
    })

    onUnmounted(() => {
      listeners.delete(listener)
    })

    return () => (
      <div class={styles.container}>
        {toasts.value.map(toast => (
          <ToastItemComponent 
            key={toast.id} 
            message={toast.message} 
            className={toast.className} 
          />
        ))}
      </div>
    )
  },
})

/**
 * 显示 Toast 消息
 */
export const showToast = (message: string, duration = 2000, className?: string) => {
  addToast(message, duration, className)
}

/**
 * 兼容旧版 API
 * @deprecated 请使用 showToast 代替
 */
export const useToast = (title: string, options?: { duration?: number; className?: string }) => {
  showToast(title, options?.duration ?? 2000, options?.className)
}
