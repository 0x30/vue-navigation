import { defineComponent } from 'vue'
import { Popup } from '@0x30/vue-navigation-layout'
import styles from './index.module.scss'
import anime from 'animejs'

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
    onEnter(el, done) {
      anime.set(el, { translateX: '-50%' })
      anime({
        targets: el,
        opacity: [0, 1],
        scale: [0.8, 1],
        translateX: '-50%',
        duration: 300,
        easing: 'easeOutExpo',
        complete: done,
      })
    },
    onLeave(el, done) {
      anime({
        targets: el,
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInQuad',
        complete: done,
      })
    },
  })
  show(<Toast title={title} className={options?.className} />)
  window.setTimeout(close, options?.duration ?? 2000)
}
