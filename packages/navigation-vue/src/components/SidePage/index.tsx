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
} from '../../hooks'
import { createTimeline, type Timeline } from 'animejs'

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

/**
 * 自定义动画回调的上下文
 */
export interface SidePageAnimationContext {
  /** 背景元素 */
  backElement: Element | null
  /** 主视图元素 */
  mainElement: Element | null
  /** 源页面根元素 */
  from?: Element
  /** 目标页面根元素 */
  to?: Element
  /** 动画时间线 */
  timeline: Timeline
  /** 完成回调 - 动画结束时必须调用 */
  done: () => void
}

export type SidePageAnimationHandler = (context: SidePageAnimationContext) => void

type Position = 'left' | 'right' | 'bottom' | 'top' | 'center'

/**
 * 创建默认进入动画
 */
const createDefaultEnterAnime = (position: Position): SidePageAnimationHandler => {
  return ({ backElement, mainElement, timeline }) => {
    timeline.add(backElement!, { opacity: [0, 1] })
    
    switch (position) {
      case 'bottom':
        timeline.add(mainElement!, { translateY: ['100%', '0'] }, 0)
        break
      case 'top':
        timeline.add(mainElement!, { translateY: ['-100%', '0'] }, 0)
        break
      case 'left':
        timeline.add(mainElement!, { translateX: ['-100%', '0'] }, 0)
        break
      case 'right':
        timeline.add(mainElement!, { translateX: ['100%', '0'] }, 0)
        break
      case 'center':
        timeline.set(backElement!, { opacity: 0.5 })
        timeline.add(backElement!, { opacity: 1, ease: 'linear' })
        timeline.add(mainElement!, { scale: [0.1, 1], opacity: 1, ease: 'outElastic', duration: 800 }, 0)
        break
    }
  }
}

/**
 * 创建默认离开动画
 */
const createDefaultLeaveAnime = (position: Position): SidePageAnimationHandler => {
  return ({ backElement, mainElement, timeline }) => {
    timeline.add(backElement!, { opacity: 0 })
    
    switch (position) {
      case 'bottom':
        timeline.add(mainElement!, { translateY: '100%' }, 0)
        break
      case 'top':
        timeline.add(mainElement!, { translateY: '-100%' }, 0)
        break
      case 'left':
        timeline.add(mainElement!, { translateX: '-100%' }, 0)
        break
      case 'right':
        timeline.add(mainElement!, { translateX: '100%' }, 0)
        break
      case 'center':
        timeline.add([backElement, mainElement], { opacity: 0, duration: 150, ease: 'linear' })
        break
    }
  }
}

const Component = defineComponent({
  name: 'SidePage',
  props: {
    /** 点击背景视图 */
    onClickBack: Function as PropType<() => void>,
    /**
     * 自定义进入动画
     * @example
     * ```tsx
     * <SidePage
     *   onEnter={({ backElement, mainElement, timeline }) => {
     *     timeline.add(backElement!, { opacity: [0, 1] })
     *     timeline.add(mainElement!, { scale: [0.5, 1] }, 0)
     *   }}
     * />
     * ```
     */
    onEnter: Function as PropType<SidePageAnimationHandler>,
    /**
     * 自定义离开动画
     */
    onLeave: Function as PropType<SidePageAnimationHandler>,
    /**
     * 位置：bottom, top, left, right, center
     */
    position: {
      type: String as PropType<Position>,
      default: 'bottom',
    },
  },
  setup: (props, { slots }) => {
    // 创建进入动画 hook
    useTransitionEnter((elements, done) => {
      const backElement = elements.to?.querySelector(backClassName) ?? null
      const mainElement = elements.to?.querySelector(mainClassName) ?? null
      
      const timeline = createTimeline({
        defaults: { duration: 500, ease: 'outExpo' },
        onComplete: done,
      })
      
      const context: SidePageAnimationContext = {
        backElement,
        mainElement,
        from: elements.from,
        to: elements.to,
        timeline,
        done,
      }
      
      if (props.onEnter) {
        props.onEnter(context)
      } else {
        createDefaultEnterAnime(props.position)(context)
      }
    })

    // 创建离开动画 hook
    useTransitionLeave((elements, done) => {
      const backElement = elements.from?.querySelector(backClassName) ?? null
      const mainElement = elements.from?.querySelector(mainClassName) ?? null
      
      const timeline = createTimeline({
        defaults: { duration: 500, ease: 'outExpo' },
        onComplete: done,
      })
      
      const context: SidePageAnimationContext = {
        backElement,
        mainElement,
        from: elements.from,
        to: elements.to,
        timeline,
        done,
      }
      
      if (props.onLeave) {
        props.onLeave(context)
      } else {
        createDefaultLeaveAnime(props.position)(context)
      }
    })

    return () => (
      <div class={styles[`${props.position}Body`]}>
        <div class={styles.back} onClick={props.onClickBack} />
        {cloneSlot(slots.default, { class: styles.main })}
      </div>
    )
  },
})

export default Component
