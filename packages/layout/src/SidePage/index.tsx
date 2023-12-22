import { type PropType, defineComponent } from 'vue'
import { cloneSlot } from '../Core'

import styles from './index.module.scss'
import { useTransitionEnter, useTransitionLeave } from '@0x30/vue-navigation'
import anime from 'animejs'

const Component = defineComponent({
  name: 'SidePage',
  props: {
    /** 点击背景视图 */
    onClickBack: Function as PropType<() => void>,
    /**
     * 目前只有 底部
     */
    position: String as PropType<'left' | 'right' | 'bottom' | 'top'>,
  },
  setup: (props, { slots }) => {
    useTransitionEnter(({ to }, complete) => {
      const back = to?.querySelector(`.${styles.back}`)
      const main = to?.querySelector(`.${styles.main}`)

      const an = anime.timeline({
        duration: 500,
        easing: 'easeOutExpo',
        complete,
      })
      an.add({ targets: back, opacity: [0, 1] })
      an.add({ targets: main, translateY: ['100%', '0'] }, 0)
    })

    useTransitionLeave(({ from }, complete) => {
      const back = from?.querySelector(`.${styles.back}`)
      const main = from?.querySelector(`.${styles.main}`)

      const an = anime.timeline({
        duration: 500,
        complete,
        easing: 'easeOutExpo',
      })
      an.add({ targets: back, opacity: 0 })
      an.add({ targets: main, translateY: '100%' }, 0)
    })

    return () => {
      return (
        <div class={styles.body}>
          <div class={styles.back} onClick={props.onClickBack} />
          {cloneSlot(slots.default, { class: styles.main })}
        </div>
      )
    }
  },
})

export default Component
