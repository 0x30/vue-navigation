import { defineComponent, ref } from 'vue'
import { toDetail } from './routers'
import { usePageMate } from '@0x30/vue-navigation'
import Home from './views/home'

const Page = defineComponent({
  name: 'PageDetail',
  setup: () => {
    return () => <Home />
  },
})

export default Page
