import { defineComponent } from 'vue'

import './index.scss'

const Page = defineComponent({
  name: 'PageView',
  setup: (_, { slots }) => {
    return () => {
      return <div class="vue-navigation-layout-body">{slots.default?.()}</div>
    }
  },
})

export default Page
