import {
  type PropType,
  defineComponent,
  onMounted,
  onUnmounted,
  getCurrentInstance,
} from 'vue'
import { NavPage, showLoading } from '@0x30/vue-navigation-layout'
import { push } from '@0x30/vue-navigation'

import DetailPage from '../detail'

const wait = () =>
  new Promise<void>((res) => {
    window.setTimeout(res, 1000)
  })

const Component = defineComponent({
  name: 'HomePage',
  setup: (props, { slots }) => {
    return () => (
      <NavPage>
        home
        <button
          onClick={async () => {
            const app = await push(
              <DetailPage
                onVnodeUnmounted={() => {
                  console.log('组件外 销毁')
                }}
              />,
              {
                onAfterLeave(el) {
                  console.log('组件外 动画 组件销毁')
                },
              }
            )

            onUnmounted(() => {
              console.log('组件外!!!!!销毁')
            }, app._instance)

            console.log(app._instance)
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
