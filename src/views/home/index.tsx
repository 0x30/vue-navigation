import { defineComponent } from 'vue'
import {
  NavPage,
  Popup,
  SidePage,
  showLoading,
} from '@0x30/vue-navigation-layout'
import { back, push } from '@0x30/vue-navigation'

import DetailPage from '../detail'

import styles from './index.module.scss'
import { useHooks, wait } from '../../util'
import { useToast } from '@0x30/vue-navigation-layout'

const Component = defineComponent({
  name: 'HomePage',
  setup: () => {
    useHooks('首页')

    const showSidePage = (
      postion: 'left' | 'right' | 'bottom' | 'top' | 'center',
    ) => {
      return () =>
        push(
          <SidePage position={postion} onClickBack={back}>
            <div class={styles.content}>xxxx</div>
          </SidePage>,
        )
    }

    return () => (
      <NavPage class={styles.body}>
        <br />
        <span>Control</span>
        <div>
          <button onClick={() => push(<DetailPage />)}>push</button>
        </div>
        <br />
        <span>loading&popup</span>
        <div>
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
          <button
            onClick={async () => {
              const [show, close] = Popup()
              show(
                <div class={styles.content}>
                  <span>xxxxxx</span>
                  <button onClick={close}>close</button>
                </div>,
              )
            }}
          >
            popup
          </button>
          <button
            onClick={async () => {
              useToast(`Hello world.`)
            }}
          >
            toast
          </button>
        </div>
        <br />
        <span>SidePage</span>
        <div>
          <button onClick={showSidePage('top')}>上</button>
          <button onClick={showSidePage('bottom')}>下</button>
          <button onClick={showSidePage('left')}>左</button>
          <button onClick={showSidePage('right')}>右</button>
          <button onClick={showSidePage('center')}>中</button>
        </div>
      </NavPage>
    )
  },
})

export default Component
