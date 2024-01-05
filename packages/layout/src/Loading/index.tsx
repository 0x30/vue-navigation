import {
  useQuietPage,
  useTransitionLeave,
  back,
  push,
  useLeaveBefore,
} from '@0x30/vue-navigation'
import { defineComponent, ref } from 'vue'

import styles from './index.module.scss'
import { Popup } from '../Popup'

import loadingImg from './imgs/loading.svg'
import errorImg from './imgs/error.svg'
import successImg from './imgs/success.svg'
import anime from 'animejs'

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

const imageRef = ref<string>()

const setStatus = (status: Status) => {
  statusRef.value = status

  if (status === 0) imageRef.value = customLoadingImg ?? loadingImg
  if (status === 1) imageRef.value = customSuccessImg ?? successImg
  if (status === 2) imageRef.value = customErrorImg ?? errorImg
}

const Component = defineComponent({
  name: 'LoadingView',
  setup: () => {
    return () => (
      <div class={styles.body}>
        <div class={styles.main}>
          {imageRef.value ? <img src={imageRef.value} /> : null}
          {messageRef.value ? <span>{messageRef.value}</span> : null}
        </div>
      </div>
    )
  },
})

const Loading = defineComponent(() => {
  useLeaveBefore(() => isShowLoading === false)
  useTransitionLeave((_, comp) => {
    window.setTimeout(comp, 100)
  })
  useQuietPage()
  return () => <div />
})

const showLoadingComponent = async () => {
  /// 如果当前为展示 loading 组件 popup
  if (closeRef.value !== undefined) return

  const [show, close] = Popup({
    onLeave(el, complete) {
      anime({
        duration: 200,
        targets: el.querySelector(`.${styles.main}`),
        opacity: [1, 0],
        easing: 'easeOutExpo',
        complete,
      })
    },
  })
  closeRef.value = async () => {
    closeRef.value = undefined
    await close()
  }

  await show(<Component />)
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
  window.clearTimeout(closeLoadingTimer)

  if (status === 0) {
    isShowLoading = true
    await push(<Loading />)
  } else {
    if (isShowLoading) {
      isShowLoading = false
      await back()
    }
  }

  /// 状态 ref
  setStatus(status)
  messageRef.value = message
  await showLoadingComponent()

  if (status === 0) return

  if (status === 3) {
    closeLoadingTimer = window.setTimeout(() => {
      closeRef.value?.()
    }, 150)
  } else {
    closeLoadingTimer = window.setTimeout(() => {
      closeRef.value?.()
    }, autoCloseTimeout)
  }
}

export { showLoading, setLoadingConfig }
