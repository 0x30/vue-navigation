import {
  type PropType,
  defineComponent,
  onMounted,
  onUnmounted,
  getCurrentInstance,
} from 'vue'
import { NavPage, showLoading } from '@0x30/vue-navigation-layout'
import {
  onDidAppear,
  onDidDisappear,
  onWillAppear,
  onWillDisappear,
  push,
} from '@0x30/vue-navigation'

import DetailPage from '../detail'

const wait = () =>
  new Promise<void>((res) => {
    window.setTimeout(res, 1000)
  })

const Component = defineComponent({
  name: 'HomePage',
  setup: (props, { slots }) => {
    onWillAppear(() => {
      console.log('home', '即将展示')
    })

    onWillDisappear(() => {
      console.log('home', '即将消失')
    })

    onDidAppear(() => {
      console.log('home', '展示')
    })

    onDidDisappear(() => {
      console.log('home', '消失')
    })

    return () => (
      <NavPage>
        home
        <button
          onClick={async () => {
            const app = await push(<DetailPage />, {
              onAfterLeave(el) {
                console.log('组件外 动画 组件销毁')
              },
            })
          }}
        >
          push
        </button>
        <button
          onClick={async () => {
            showLoading(0)
            await wait()
            showLoading(3)
            console.log('隐藏')

            await showLoading(0, 'xxxx')

            console.log('展示')
            await wait()

            showLoading(1, '你好')
          }}
        >
          loading
        </button>
      </NavPage>
    )
  },
})

export default Component
