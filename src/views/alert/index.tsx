import { type PropType, defineComponent } from 'vue'
import { SidePage, back, push, useQuietPage } from '@0x30/navigation-vue'

import styles from './index.module.scss'

const Component = defineComponent({
  name: 'AlertPage',
  props: {
    onConfirm: Function as PropType<(res: boolean) => void>,
    title: {
      type: String,
      default: '确认返回',
    },
    message: {
      type: String,
      default: '您确定要离开当前页面吗？未保存的更改将会丢失。',
    },
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
      <SidePage position="center" class={styles.alertSidePage}>
        <div class={styles.alertOverlay}>
          <div class={styles.alertContainer}>
            <div class={styles.alertHeader}>
              <div class={styles.alertIcon}>⚠️</div>
              <h3 class={styles.alertTitle}>{props.title}</h3>
            </div>

            <div class={styles.alertBody}>
              <p class={styles.alertMessage}>{props.message}</p>
            </div>

            <div class={styles.alertActions}>
              <button class="btn btn-ghost" onClick={onClick(false)}>
                <span>✖️</span>
                取消
              </button>
              <button class="btn btn-danger" onClick={onClick(true)}>
                <span>✅</span>
                确认返回
              </button>
            </div>
          </div>
        </div>
      </SidePage>
    )
  },
})

export const useConfirm = (title?: string, message?: string) => {
  return new Promise<boolean>((resolve) => {
    push(<Component onConfirm={resolve} title={title} message={message} />)
  })
}
