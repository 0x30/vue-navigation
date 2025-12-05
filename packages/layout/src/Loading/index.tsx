import {
  useQuietPage,
  useTransitionLeave,
  back,
  push,
  useLeaveBefore,
} from '@0x30/vue-navigation'
import { defineComponent, ref } from 'vue'

import { computed } from 'vue'

import styles from './index.module.scss'
import { Popup } from '../Popup'

import loadingImg from './imgs/loading.svg'
import errorImg from './imgs/error.svg'
import successImg from './imgs/success.svg'

let customLoadingImg: string | undefined = undefined
let customErrorImg: string | undefined = undefined
let customSuccessImg: string | undefined = undefined
let autoCloseTimeout = 1500

/**
 * 配置loading的配置
 * @param param0
 */
const setLoadingConfig = ({
  successImg,
  failedImg,
  loadingImg,
  closeTimeout,
}: {
  /**
   * 成功的图片
   */
  successImg?: string
  /**
   * 失败的图片
   */
  failedImg?: string
  /**
   * 加载的图片
   */
  loadingImg?: string
  /**
   * 自动关闭的时间 ms 默认1500ms
   */
  closeTimeout?: number
}) => {
  loadingImg && (customLoadingImg = loadingImg)
  failedImg && (customErrorImg = failedImg)
  successImg && (customSuccessImg = successImg)
  closeTimeout !== undefined && (autoCloseTimeout = closeTimeout)
}

/**
 * 0: 展示 loading toast
 * 1: 展示 success toast
 * 2: 展示 failed toast
 * 3: 立即隐藏
 */
type Status = 0 | 1 | 2 | 3

const statusRef = ref<Status>()
const messageRef = ref<string>()
const closeRef = ref<() => Promise<void>>()

const Component = defineComponent({
  name: 'LoadingView',
  setup: () => {
    const imageComputed = computed(() => {
      if (statusRef.value === 0) return customLoadingImg ?? loadingImg
      if (statusRef.value === 1) return customSuccessImg ?? successImg
      if (statusRef.value === 2) return customErrorImg ?? errorImg
      return undefined
    })

    return () => (
      <div class={styles.body}>
        <div class={styles.main}>
          {imageComputed.value ? <img src={imageComputed.value} /> : null}
          {messageRef.value ? <span>{messageRef.value}</span> : null}
        </div>
      </div>
    )
  },
})

// export { type Status, closeRef, setLoadingConfig, rawShowLoading }

const Loading = defineComponent(() => {
  useLeaveBefore(() => isShowLoading === false)
  useTransitionLeave((_, comp) => {
    window.setTimeout(comp, 300)
  })
  useQuietPage()
  return () => <div />
})

/**
 * 在非0type时,需要关闭现有的 loading 视图
 */
const closeLoadingToast = async () => {
  if (isShowLoading === false) return
  isShowLoading = false
  window.clearTimeout(closeLoadingTimer)
  closeLoadingTimer = window.setTimeout(() => {
    closeRef.value?.()
  }, 350)
  await back()
}

let closeLoadingTimer: number | undefined = undefined
let isShowLoading = false
/**
 * 展示 loading 页面
 * @param type
 * 0: 展示 loading toast
 * 1: 展示 success toast
 * 2: 展示 failed toast
 * 3: 立即隐藏
 * @param message
 */
const showLoading = async (status: Status, message?: string) => {
  if (status === 0) {
    window.clearTimeout(closeLoadingTimer)
    isShowLoading = true
    await push(<Loading />)
  }

  /// 状态 ref
  statusRef.value = status
  messageRef.value = message

  if (closeRef.value === undefined) {
    const [show, close] = Popup()
    closeRef.value = async () => {
      closeRef.value = undefined
      await close()
    }
    show(<Component />)
  }

  if (status === 0) return

  if (isShowLoading === false) return
  isShowLoading = false
  window.clearTimeout(closeLoadingTimer)

  if (status === 3) {
    closeLoadingTimer = window.setTimeout(() => {
      closeRef.value?.()
    }, 350)
  } else {
    closeLoadingTimer = window.setTimeout(() => {
      closeRef.value?.()
    }, autoCloseTimeout)
  }
}

export { closeLoadingToast, showLoading, setLoadingConfig }
