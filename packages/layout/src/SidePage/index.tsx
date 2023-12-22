import {
  type PropType,
  defineComponent,
  cloneVNode,
  type Slot,
  type VNodeProps,
} from 'vue'

import styles from './index.module.scss'
import { useTransitionEnter, useTransitionLeave } from '@0x30/vue-navigation'
import anime from 'animejs'

const backClassName = `.${styles.back}`
const mainClassName = `.${styles.main}`

const cloneSlot = (
  slot?: Slot,
  extraProps?: (Record<string, unknown> & VNodeProps) | null,
  mergeRef?: boolean
) => {
  const elements = slot?.()
  if (elements === undefined || elements.length > 1) return undefined
  const element = elements[0]
  return cloneVNode(element, extraProps, mergeRef)
}

type AnimeType = Parameters<typeof useTransitionEnter>[0]

/**
 * 底部出现的动画
 */
const SideBottomEnterAnime: AnimeType = ({ to }, complete) => {
  const back = to?.querySelector(backClassName)
  const main = to?.querySelector(mainClassName)
  const an = anime.timeline({ duration: 500, easing: 'easeOutExpo', complete })
  an.add({ targets: back, opacity: [0, 1] })
  an.add({ targets: main, translateY: ['100%', '0'] }, 0)
}

/**
 * 底部消失的动画
 */
const SideBottomLeaveAnime: AnimeType = ({ from }, complete) => {
  const back = from?.querySelector(backClassName)
  const main = from?.querySelector(mainClassName)
  const an = anime.timeline({ duration: 500, complete, easing: 'easeOutExpo' })
  an.add({ targets: back, opacity: 0 })
  an.add({ targets: main, translateY: '100%' }, 0)
}

/**
 * 左侧出现的动画
 */
const SideLeftEnterAnime: AnimeType = ({ to }, complete) => {
  const back = to?.querySelector(backClassName)
  const main = to?.querySelector(mainClassName)
  const an = anime.timeline({ duration: 500, easing: 'easeOutExpo', complete })
  an.add({ targets: back, opacity: [0, 1] })
  an.add({ targets: main, translateX: ['-100%', '0'] }, 0)
}

/**
 * 左侧消失的动画
 */
const SideLeftLeaveAnime: AnimeType = ({ from }, complete) => {
  const back = from?.querySelector(backClassName)
  const main = from?.querySelector(mainClassName)
  const an = anime.timeline({ duration: 500, complete, easing: 'easeOutExpo' })
  an.add({ targets: back, opacity: 0 })
  an.add({ targets: main, translateX: '-100%' }, 0)
}

/**
 * 右侧出现的动画
 */
const SideRightEnterAnime: AnimeType = ({ to }, complete) => {
  const back = to?.querySelector(backClassName)
  const main = to?.querySelector(mainClassName)
  const an = anime.timeline({ duration: 500, easing: 'easeOutExpo', complete })
  an.add({ targets: back, opacity: [0, 1] })
  an.add({ targets: main, translateX: ['100%', '0'] }, 0)
}

/**
 * 右侧消失的动画
 */
const SideRightLeaveAnime: AnimeType = ({ from }, complete) => {
  const back = from?.querySelector(backClassName)
  const main = from?.querySelector(mainClassName)
  const an = anime.timeline({ duration: 500, complete, easing: 'easeOutExpo' })
  an.add({ targets: back, opacity: 0 })
  an.add({ targets: main, translateX: '100%' }, 0)
}

/**
 * 上侧出现的动画
 */
const SideTopEnterAnime: AnimeType = ({ to }, complete) => {
  const back = to?.querySelector(backClassName)
  const main = to?.querySelector(mainClassName)
  const an = anime.timeline({ duration: 500, easing: 'easeOutExpo', complete })
  an.add({ targets: back, opacity: [0, 1] })
  an.add({ targets: main, translateY: ['-100%', '0'] }, 0)
}

/**
 * 上侧消失的动画
 */
const SideTopLeaveAnime: AnimeType = ({ from }, complete) => {
  const back = from?.querySelector(backClassName)
  const main = from?.querySelector(mainClassName)
  const an = anime.timeline({ duration: 500, complete, easing: 'easeOutExpo' })
  an.add({ targets: back, opacity: 0 })
  an.add({ targets: main, translateY: '-100%' }, 0)
}

/**
 * 中侧出现的动画
 */
const SideCenterEnterAnime: AnimeType = ({ to }, complete) => {
  const back = to?.querySelector(backClassName)
  const main = to?.querySelector(mainClassName)
  const an = anime.timeline({ duration: 450, complete })
  an.add({ targets: back, opacity: [0.5, 1], easing: 'linear' })
  an.add({ targets: main, scale: [0.1, 1], opacity: 1 }, 0)
}

/**
 * 中侧消失的动画
 */
const SideCenterLeaveAnime: AnimeType = ({ from }, complete) => {
  const back = from?.querySelector(backClassName)
  const main = from?.querySelector(mainClassName)
  const an = anime.timeline({ duration: 150, complete, easing: 'linear' })
  an.add({ targets: [back, main], opacity: 0 })
}

const Component = defineComponent({
  name: 'SidePage',
  props: {
    /** 点击背景视图 */
    onClickBack: Function as PropType<() => void>,
    /**
     * 重写 body class ，例如 bottom css 为
     * 
     * ```css
    .body{
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 100vh;

      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
      ```
     */
    overrideClassName: String,
    /**
     * 覆盖的 back class name
     */
    overrideBackName: String,
    /**
     * 重写 出现动画方法
     */
    overrideEnterAnime: Function as PropType<AnimeType>,
    /**
     * 重写 推出动画方法
     */
    overrideLeaveAnime: Function as PropType<AnimeType>,
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
      if (props.overrideEnterAnime) return props.overrideEnterAnime
      if (props.position === 'bottom') return SideBottomLeaveAnime
      if (props.position === 'center') return SideCenterLeaveAnime
      if (props.position === 'left') return SideLeftLeaveAnime
      if (props.position === 'right') return SideRightLeaveAnime
      return SideTopLeaveAnime
    }

    useTransitionEnter(getEnterAnime())
    useTransitionLeave(getLeaveAnime())

    return () => (
      <div class={props.overrideClassName ?? styles[`${props.position}Body`]}>
        <div
          class={props.overrideBackName ?? styles.back}
          onClick={props.onClickBack}
        />
        {cloneSlot(slots.default, { class: styles.main })}
      </div>
    )
  },
})

export { backClassName, mainClassName }
export default Component
