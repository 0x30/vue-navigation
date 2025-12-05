import { defineComponent } from 'vue'
import { Popup } from '../../utils/Popup'
import styles from './index.module.scss'
import { utils, animate } from 'animejs'

const Toast = defineComponent({
  name: 'Toast',
  props: {
    title: String,
    className: String,
  },
  setup: (props) => {
    return () => <div class={props.className ?? styles.body}>{props.title}</div>
  },
})

type ToastOptoions = {
  duration?: number
  className?: string
}

export const useToast = (title: string, options?: ToastOptoions) => {
  const [show, close] = Popup({
    onEnter(el, onComplete) {
      utils.set(el, { translateX: '-50%' })
      animate(el, {
        opacity: [0, 1],
        scale: [0.8, 1],
        translateX: '-50%',
        duration: 800,
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
  show(<Toast title={title} className={options?.className} />)
  window.setTimeout(close, options?.duration ?? 2000)
}
