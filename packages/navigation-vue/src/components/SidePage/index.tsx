import {
  type PropType,
  defineComponent,
  cloneVNode,
  type Slot,
  type VNodeProps,
} from 'vue'

import styles from './index.module.scss'
import {
  useTransitionEnter,
  useTransitionLeave,
  type TransitionAnimatorHook,
} from '../../hooks'
import { createTimeline } from 'animejs'

const backClassName = `.${styles.back}`
const mainClassName = `.${styles.main}`

const cloneSlot = (
  slot?: Slot,
  extraProps?: (Record<string, unknown> & VNodeProps) | null,
  mergeRef?: boolean,
) => {
  const elements = slot?.()
  if (elements === undefined || elements.length > 1) return undefined
  const element = elements[0]
  return cloneVNode(element, extraProps, mergeRef)
}

type AnimeType = TransitionAnimatorHook

/**
 * 底部出现的动画
 */
const SideBottomEnterAnime: AnimeType = ({ to }, onComplete) => {
  const back = to?.querySelector(backClassName)
  const main = to?.querySelector(mainClassName)
  const an = createTimeline({
    defaults: { duration: 500, ease: 'outExpo' },
    onComplete,
  })
  an.add(back!, { opacity: [0, 1] })
  an.add(main!, { translateY: ['100%', '0'] }, 0)
}

/**
 * 底部消失的动画
 */
const SideBottomLeaveAnime: AnimeType = ({ from }, onComplete) => {
  const back = from?.querySelector(backClassName)
  const main = from?.querySelector(mainClassName)
  const an = createTimeline({
    defaults: { duration: 500, ease: 'outExpo' },
    onComplete,
  })
  an.add(back!, { opacity: 0 })
  an.add(main!, { translateY: '100%' }, 0)
}

/**
 * 左侧出现的动画
 */
const SideLeftEnterAnime: AnimeType = ({ to }, onComplete) => {
  const back = to?.querySelector(backClassName)
  const main = to?.querySelector(mainClassName)
  const an = createTimeline({
    defaults: { duration: 500, ease: 'outExpo' },
    onComplete,
  })
  an.add(back!, { opacity: [0, 1] })
  an.add(main!, { translateX: ['-100%', '0'] }, 0)
}

/**
 * 左侧消失的动画
 */
const SideLeftLeaveAnime: AnimeType = ({ from }, onComplete) => {
  const back = from?.querySelector(backClassName)
  const main = from?.querySelector(mainClassName)
  const an = createTimeline({
    defaults: { duration: 500, ease: 'outExpo' },
    onComplete,
  })
  an.add(back!, { opacity: 0 })
  an.add(main!, { translateX: '-100%' }, 0)
}

/**
 * 右侧出现的动画
 */
const SideRightEnterAnime: AnimeType = ({ to }, onComplete) => {
  const back = to?.querySelector(backClassName)
  const main = to?.querySelector(mainClassName)
  const an = createTimeline({
    defaults: { duration: 500, ease: 'outExpo' },
    onComplete,
  })
  an.add(back!, { opacity: [0, 1] })
  an.add(main!, { translateX: ['100%', '0'] }, 0)
}

/**
 * 右侧消失的动画
 */
const SideRightLeaveAnime: AnimeType = ({ from }, onComplete) => {
  const back = from?.querySelector(backClassName)
  const main = from?.querySelector(mainClassName)
  const an = createTimeline({
    defaults: { duration: 500, ease: 'outExpo' },
    onComplete,
  })
  an.add(back!, { opacity: 0 })
  an.add(main!, { translateX: '100%' }, 0)
}

/**
 * 上侧出现的动画
 */
const SideTopEnterAnime: AnimeType = ({ to }, onComplete) => {
  const back = to?.querySelector(backClassName)
  const main = to?.querySelector(mainClassName)
  const an = createTimeline({
    defaults: { duration: 500, ease: 'outExpo' },
    onComplete,
  })
  an.add(back!, { opacity: [0, 1] })
  an.add(main!, { translateY: ['-100%', '0'] }, 0)
}

/**
 * 上侧消失的动画
 */
const SideTopLeaveAnime: AnimeType = ({ from }, onComplete) => {
  const back = from?.querySelector(backClassName)
  const main = from?.querySelector(mainClassName)
  const an = createTimeline({
    defaults: { duration: 500, ease: 'outExpo' },
    onComplete,
  })
  an.add(back!, { opacity: 0 })
  an.add(main!, { translateY: '-100%' }, 0)
}

/**
 * 中侧出现的动画
 */
const SideCenterEnterAnime: AnimeType = ({ to }, onComplete) => {
  const back = to?.querySelector(backClassName)
  const main = to?.querySelector(mainClassName)
  const an = createTimeline({
    defaults: { duration: 800 },
    onComplete,
  })
  an.add(back!, { opacity: [0.5, 1], ease: 'linear' })
  an.add(main!, { scale: [0.1, 1], opacity: 1, ease: 'outElastic' }, 0)
}

/**
 * 中侧消失的动画
 */
const SideCenterLeaveAnime: AnimeType = ({ from }, onComplete) => {
  const back = from?.querySelector(backClassName)
  const main = from?.querySelector(mainClassName)
  const an = createTimeline({
    defaults: { duration: 150, ease: 'linear' },
    onComplete,
  })
  an.add([back, main], { opacity: 0 })
}

const Component = defineComponent({
  name: 'SidePage',
  props: {
    /** 点击背景视图 */
    onClickBack: Function as PropType<() => void>,
    /**
     * 重写 出现动画方法
     */
    overrideEnterAnime: Function as PropType<TransitionAnimatorHook>,
    /**
     * 重写 推出动画方法
     */
    overrideLeaveAnime: Function as PropType<TransitionAnimatorHook>,
    /**
     * 目前只有 底部
     */
    position: {
      type: String as PropType<'left' | 'right' | 'bottom' | 'top' | 'center'>,
      default: 'bottom',
    },
  },
  setup: (props, { slots }) => {
    const getEnterAnime = () => {
      if (props.overrideEnterAnime) return props.overrideEnterAnime
      if (props.position === 'bottom') return SideBottomEnterAnime
      if (props.position === 'center') return SideCenterEnterAnime
      if (props.position === 'left') return SideLeftEnterAnime
      if (props.position === 'right') return SideRightEnterAnime
      return SideTopEnterAnime
    }

    const getLeaveAnime = () => {
      if (props.overrideLeaveAnime) return props.overrideLeaveAnime
      if (props.position === 'bottom') return SideBottomLeaveAnime
      if (props.position === 'center') return SideCenterLeaveAnime
      if (props.position === 'left') return SideLeftLeaveAnime
      if (props.position === 'right') return SideRightLeaveAnime
      return SideTopLeaveAnime
    }

    useTransitionEnter(getEnterAnime())
    useTransitionLeave(getLeaveAnime())

    return () => (
      <div class={styles[`${props.position}Body`]}>
        <div class={styles.back} onClick={props.onClickBack} />
        {cloneSlot(slots.default, { class: styles.main })}
      </div>
    )
  },
})

export default Component
