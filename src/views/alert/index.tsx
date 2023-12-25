import { type PropType, defineComponent } from 'vue'
import { SidePage } from '@0x30/vue-navigation-layout'

import styles from './index.module.scss'
import { back, push, useQuietPage } from '@0x30/vue-navigation'

const Component = defineComponent({
  name: 'AlertPage',
  props: {
    onConfirm: Function as PropType<(res: boolean) => void>,
  },
  setup: (props) => {
    /// 将此页面配置为 安静的页面
    useQuietPage()

    const onClick = (res: boolean) => {
      return async () => {
        await back()
        props.onConfirm?.(res)
      }
    }

    return () => (
      <SidePage position="center">
        <div class={styles.body}>
          <span>是否要返回</span>
          <div>
            <button onClick={onClick(true)}>确定</button>
            <button onClick={onClick(false)}>取消</button>
          </div>
        </div>
      </SidePage>
    )
  },
})

export const useConfirm = () => {
  return new Promise<boolean>((resolve) => {
    push(<Component onConfirm={resolve} />)
  })
}
