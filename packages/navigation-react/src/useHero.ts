import { createTimeline, type Timeline } from 'animejs'
import type { TransitionAnimatorHook } from './state'

export interface HeroAnimationContext {
  /** 源页面根元素 */
  from?: Element
  /** 目标页面根元素 */
  to?: Element
  /** 动画时间线 */
  timeline: Timeline
  /** 完成回调 */
  done: () => void
  /** 源 Hero 元素 (来自上一个页面) */
  fromHero?: Element | null
  /** 目标 Hero 元素 (当前页面) */
  toHero?: Element | null
  /** 源元素的边界矩形 */
  fromRect?: DOMRect
  /** 目标元素的边界矩形 */
  toRect?: DOMRect
  /** 计算好的变换参数 */
  transform?: {
    scaleX: number
    scaleY: number
    translateX: number
    translateY: number
  }
}

export type HeroEnterHandler = (context: HeroAnimationContext) => void
export type HeroLeaveHandler = (context: HeroAnimationContext) => void

export interface UseHeroOptions {
  /** Hero ID，用于匹配 data-hero-{id} 属性 */
  id: string
  /** 进入动画时长，默认 350ms */
  enterDuration?: number
  /** 离开动画时长，默认 300ms */
  leaveDuration?: number
  /** 进入动画缓动，默认 outQuart */
  enterEase?: string
  /** 离开动画缓动，默认 inOutQuart */
  leaveEase?: string
  /** 自定义进入动画处理 */
  onEnter?: HeroEnterHandler
  /** 自定义离开动画处理 */
  onLeave?: HeroLeaveHandler
  /** Hero 元素选择器，默认使用 [data-hero-{id}] */
  heroSelector?: string
}

export interface UseHeroResult {
  /** 进入动画 hook，传给 SidePage 的 overrideEnterAnime */
  enterAnime: TransitionAnimatorHook
  /** 离开动画 hook，传给 SidePage 的 overrideLeaveAnime */
  leaveAnime: TransitionAnimatorHook
}

/**
 * 计算 Hero 动画的变换参数
 */
const calculateTransform = (fromRect: DOMRect, toRect: DOMRect) => {
  const scaleX = fromRect.width / toRect.width
  const scaleY = fromRect.height / toRect.height
  const translateX = fromRect.left - toRect.left + (fromRect.width - toRect.width) / 2
  const translateY = fromRect.top - toRect.top + (fromRect.height - toRect.height) / 2

  return { scaleX, scaleY, translateX, translateY }
}

/**
 * 默认的进入动画处理
 */
const defaultEnterHandler: HeroEnterHandler = (context) => {
  const { timeline, to, toHero, transform } = context

  // Hero 元素动画
  if (toHero && transform) {
    timeline.add(toHero, {
      translateX: [transform.translateX, 0],
      translateY: [transform.translateY, 0],
      scaleX: [transform.scaleX, 1],
      scaleY: [transform.scaleY, 1],
    }, 0)
  } else if (to) {
    // 降级动画
    timeline.add(to, { scale: [0.8, 1], opacity: [0, 1] }, 0)
  }
}

/**
 * 默认的离开动画处理
 */
const defaultLeaveHandler: HeroLeaveHandler = (context) => {
  const { timeline, to, toHero, transform } = context

  // Hero 元素动画
  if (toHero && transform) {
    timeline.add(toHero, {
      translateX: transform.translateX,
      translateY: transform.translateY,
      scaleX: transform.scaleX,
      scaleY: transform.scaleY,
    }, 0)
  } else if (to) {
    // 降级动画
    timeline.add(to, { opacity: 0 }, 0)
  }
}

/**
 * useHero - 创建 Hero 共享元素过渡动画
 * 
 * @example
 * ```tsx
 * // 源页面 - 添加 data-hero-image 属性
 * <img data-hero-image src="..." />
 * 
 * // 目标页面 - 使用 useHero
 * const { enterAnime, leaveAnime } = useHero({ id: 'image' })
 * 
 * <SidePage
 *   position="center"
 *   overrideEnterAnime={enterAnime}
 *   overrideLeaveAnime={leaveAnime}
 * >
 *   <img data-hero-image src="..." />
 * </SidePage>
 * ```
 * 
 * @example 自定义动画
 * ```tsx
 * const { enterAnime, leaveAnime } = useHero({
 *   id: 'image',
 *   onEnter: (ctx) => {
 *     // ctx.timeline 是 animejs timeline
 *     // ctx.from, ctx.to 是源/目标页面根元素
 *     // ctx.fromHero, ctx.toHero 是源/目标 Hero 元素
 *     // ctx.transform 包含计算好的变换参数
 *     const back = ctx.to?.querySelector('.back')
 *     ctx.timeline.add(back!, { opacity: [0, 1] })
 *     ctx.timeline.add(ctx.toHero!, {
 *       translateX: [ctx.transform!.translateX, 0],
 *       translateY: [ctx.transform!.translateY, 0],
 *       scale: [0.5, 1],
 *     }, 0)
 *   },
 * })
 * ```
 */
export const useHero = (options: UseHeroOptions): UseHeroResult => {
  const {
    id,
    enterDuration = 350,
    leaveDuration = 300,
    enterEase = 'outQuart',
    leaveEase = 'inOutQuart',
    onEnter = defaultEnterHandler,
    onLeave = defaultLeaveHandler,
    heroSelector,
  } = options

  const getHeroSelector = () => heroSelector ?? `[data-hero-${id}]`

  const enterAnime: TransitionAnimatorHook = (elements, done) => {
    const fromHero = elements.from?.querySelector(getHeroSelector())
    const toHero = elements.to?.querySelector(getHeroSelector())

    const timeline = createTimeline({
      defaults: { duration: enterDuration, ease: enterEase },
      onComplete: done,
    })

    let transform: HeroAnimationContext['transform']
    let fromRect: DOMRect | undefined
    let toRect: DOMRect | undefined

    if (fromHero && toHero) {
      fromRect = fromHero.getBoundingClientRect()
      toRect = toHero.getBoundingClientRect()
      transform = calculateTransform(fromRect, toRect)
    }

    const context: HeroAnimationContext = {
      from: elements.from,
      to: elements.to,
      timeline,
      done,
      fromHero,
      toHero,
      fromRect,
      toRect,
      transform,
    }

    onEnter(context)
  }

  const leaveAnime: TransitionAnimatorHook = (elements, done) => {
    // 注意：离开时，from 是当前页面，to 是返回的页面
    const fromHero = elements.to?.querySelector(getHeroSelector())  // 返回到的页面的 hero
    const toHero = elements.from?.querySelector(getHeroSelector())  // 当前页面的 hero

    const timeline = createTimeline({
      defaults: { duration: leaveDuration, ease: leaveEase },
      onComplete: done,
    })

    let transform: HeroAnimationContext['transform']
    let fromRect: DOMRect | undefined
    let toRect: DOMRect | undefined

    if (fromHero && toHero) {
      fromRect = fromHero.getBoundingClientRect()
      toRect = toHero.getBoundingClientRect()
      transform = calculateTransform(fromRect, toRect)
    }

    const context: HeroAnimationContext = {
      from: elements.from,
      to: elements.to,
      timeline,
      done,
      fromHero,
      toHero,
      fromRect,
      toRect,
      transform,
    }

    onLeave(context)
  }

  return { enterAnime, leaveAnime }
}

export default useHero
