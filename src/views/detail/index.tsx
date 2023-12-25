import { defineComponent } from 'vue'
import { NavPage } from '@0x30/vue-navigation-layout'
import { push } from '@0x30/vue-navigation'

import AlertPage from '../alert'

const Component = defineComponent({
  name: 'HomePage',
  setup: (props, { slots }) => {
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
