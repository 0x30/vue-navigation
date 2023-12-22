import { type PropType, defineComponent } from 'vue'
import { NavPage } from '@0x30/vue-navigation-layout'
import { push } from '@0x30/vue-navigation'

import DetailPage from '../detail'

const Component = defineComponent({
  name: 'HomePage',
  setup: (props, { slots }) => {
    return () => (
      <NavPage>
        home
        <button
          onClick={() => {
            push(<DetailPage />)
          }}
        >
          push
        </button>
      </NavPage>
    )
  },
})

export default Component
