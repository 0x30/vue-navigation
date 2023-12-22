import { useTransitionEnter, useTransitionLeave } from '@0x30/vue-navigation'
import { defineComponent } from 'vue'

import styles from './index.module.scss'
import anime from 'animejs'
import { cloneSlot } from '../Core'

const ModalPage = defineComponent({
  name: 'ModalPage',
  setup: (_, { slots }) => {
    useTransitionEnter(({ to }, complete) => {
      const back = to?.querySelector(`.${styles.back}`)
      const body = to?.querySelector(`.${styles.main}`)

      const an = anime.timeline({ duration: 450, complete })
      an.add({ targets: back, opacity: [0.5, 1], easing: 'linear' })
      an.add({ targets: body, scale: [0.1, 1], opacity: 1 }, 0)
    })
    useTransitionLeave(({ from }, complete) => {
      const back = from?.querySelector(`.${styles.back}`)
      const body = from?.querySelector(`.${styles.main}`)

      const an = anime.timeline({ duration: 150, complete, easing: 'linear' })
      an.add({ targets: [back, body], opacity: 0 })
    })

    return () => {
      const element = cloneSlot(slots.default, {
        class: styles.main,
      })
      if (element === undefined) return null
      return (
        <div class={styles.body}>
          <div class={styles.back}></div>
          {element}
        </div>
      )
    }
  },
})

export default ModalPage
