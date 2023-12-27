import { defineComponent } from 'vue'
import { NavPage, PullRefresh } from '@0x30/vue-navigation-layout'
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

    const refresh = () => {
      return new Promise<void>((resolve) => {
        window.setTimeout(resolve, 1000)
      })
    }

    return () => (
      <NavPage class={styles.body}>
        detail
        <div>
          <button onClick={back}>back</button>
        </div>
        <PullRefresh
          class={styles.contain}
          finishKeeyTime={500}
          onRefresh={async () => {
            await refresh()
            console.log('刷新完成')
          }}
          refreshingRender={() => {
            return (
              <div key={1} class={styles.header}>
                刷新中
              </div>
            )
          }}
          pullingRender={(progress) => {
            return (
              <div key={1} class={styles.header}>
                加油啊{progress}
              </div>
            )
          }}
          waitReleaseRender={() => {
            return (
              <div key={1} class={styles.header}>
                松开我就可以刷新了
              </div>
            )
          }}
          finishRender={() => {
            return (
              <div key={1} class={styles.header}>
                完成
              </div>
            )
          }}
        >
          <div style={{ height: '300px', background: 'green' }}>xxx</div>
          <div style={{ height: '300px', background: 'pink' }}>xxx</div>
          <div style={{ height: '300px', background: 'blue' }}>xxx</div>
          <div style={{ height: '300px', background: 'red' }}>xxx</div>
          <div style={{ height: '300px', background: 'green' }}>xxx</div>
          <div style={{ height: '300px', background: 'pink' }}>xxx</div>
          <div style={{ height: '300px', background: 'blue' }}>xxx</div>
          <div style={{ height: '300px', background: 'red' }}>xxx</div>
        </PullRefresh>
      </NavPage>
    )
  },
})

export default Component
