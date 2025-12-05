import { type FC, type ReactNode, cloneElement, isValidElement } from 'react'
import { createTimeline, type Timeline } from 'animejs'
import { useTransitionEnter, useTransitionLeave } from '../hooks'

import styles from './SidePage.module.scss'

type Position = 'left' | 'right' | 'bottom' | 'top' | 'center'

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

interface SidePageProps {
  children?: ReactNode
  position?: Position
  onClickBack?: () => void
  className?: string
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
  onEnter?: SidePageAnimationHandler
  /**
   * 自定义离开动画
   */
  onLeave?: SidePageAnimationHandler
}

const backClassName = `.${styles.back}`
const mainClassName = `.${styles.main}`

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

/**
 * 侧边页面组件
 */
export const SidePage: FC<SidePageProps> = ({
  children,
  position = 'bottom',
  onClickBack,
  className,
  onEnter,
  onLeave,
}) => {
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
    
    if (onEnter) {
      onEnter(context)
    } else {
      createDefaultEnterAnime(position)(context)
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
    
    if (onLeave) {
      onLeave(context)
    } else {
      createDefaultLeaveAnime(position)(context)
    }
  })

  const bodyClassName = styles[`${position}Body`] ?? styles.body

  // 为子元素添加 main class
  const childWithClass = isValidElement(children)
    ? cloneElement(children, {
        className: `${styles.main} ${(children.props as { className?: string })?.className ?? ''} ${className ?? ''}`,
      } as { className: string })
    : children

  return (
    <div className={bodyClassName}>
      <div className={styles.back} onClick={onClickBack} />
      {childWithClass}
    </div>
  )
}
