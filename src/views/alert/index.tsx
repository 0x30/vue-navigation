import { type PropType, defineComponent } from 'vue'
import { NavPage, SidePage } from '@0x30/vue-navigation-layout'

import styles from './index.module.scss'

const Component = defineComponent({
  name: 'AlertPage',
  setup: (props, { slots }) => {
    return () => (
      <SidePage>
        <div class={styles.body}>detail</div>
      </SidePage>
    )
  },
})

export default Component
