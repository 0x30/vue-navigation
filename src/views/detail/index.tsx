import { defineComponent } from 'vue'
import { NavPage } from '@0x30/vue-navigation-layout'
import { back, useLeaveBefore } from '@0x30/vue-navigation'

import { useConfirm } from '../alert'
import styles from './index.module.scss'
import { useHooks } from '../../util'

const Component = defineComponent({
  name: 'HomePage',
  setup: () => {
    useHooks('详情')
    /// 返回的时候 先弹出框询问用户
    useLeaveBefore(useConfirm)

    return () => (
      <NavPage class={styles.body}>
        detail
        <div>
          <button onClick={back}>back</button>
        </div>
      </NavPage>
    )
  },
})

export default Component
