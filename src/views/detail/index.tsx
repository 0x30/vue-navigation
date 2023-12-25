import { defineComponent } from 'vue'
import { NavPage } from '@0x30/vue-navigation-layout'
import { onDidAppear, onDidDisappear, onWillAppear, onWillDisappear, push } from '@0x30/vue-navigation'

import AlertPage from '../alert'

const Component = defineComponent({
  name: 'HomePage',
  setup: (props, { slots }) => {

    onWillAppear(() => {
      console.log('detail', '即将展示')
    })

    onWillDisappear(() => {
      console.log('detail', '即将消失')
    })

    onDidAppear(() => {
      console.log('detail', '展示')
    })

    onDidDisappear(() => {
      console.log('detail', '消失')
    })

    return () => (
      <NavPage>
        detail
        <button
          onClick={() => {
            push(<AlertPage />)
          }}
        >
          alert
        </button>
      </NavPage>
    )
  },
})

export default Component
