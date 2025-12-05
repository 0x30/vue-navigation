import { type FC, type ReactNode, cloneElement, isValidElement } from 'react'
import { createTimeline } from 'animejs'
import { useTransitionEnter, useTransitionLeave, type TransitionAnimatorHook } from '../hooks'

import styles from './SidePage.module.scss'

type Position = 'left' | 'right' | 'bottom' | 'top' | 'center'

type AnimeType = TransitionAnimatorHook

interface SidePageProps {
  children?: ReactNode
  position?: Position
  onClickBack?: () => void
  className?: string
  /** 重写进入动画 */
  overrideEnterAnime?: TransitionAnimatorHook
  /** 重写离开动画 */
  overrideLeaveAnime?: TransitionAnimatorHook
}

const backClassName = `.${styles.back}`
const mainClassName = `.${styles.main}`

const createEnterAnime = (position: Position): AnimeType => {
  return ({ to }, onComplete) => {
    const back = to?.querySelector(backClassName)
    const main = to?.querySelector(mainClassName)
    const an = createTimeline({
      defaults: { duration: 500, ease: 'outExpo' },
      onComplete,
    })

    an.add(back!, { opacity: [0, 1] })

    switch (position) {
      case 'bottom':
        an.add(main!, { translateY: ['100%', '0'] }, 0)
        break
      case 'top':
        an.add(main!, { translateY: ['-100%', '0'] }, 0)
        break
      case 'left':
        an.add(main!, { translateX: ['-100%', '0'] }, 0)
        break
      case 'right':
        an.add(main!, { translateX: ['100%', '0'] }, 0)
        break
      case 'center':
        an.add(main!, { scale: [0.1, 1], opacity: 1, ease: 'outElastic' }, 0)
        break
    }
  }
}

const createLeaveAnime = (position: Position): AnimeType => {
  return ({ from }, onComplete) => {
    const back = from?.querySelector(backClassName)
    const main = from?.querySelector(mainClassName)
    const an = createTimeline({
      defaults: { duration: 500, ease: 'outExpo' },
      onComplete,
    })

    an.add(back!, { opacity: 0 })

    switch (position) {
      case 'bottom':
        an.add(main!, { translateY: '100%' }, 0)
        break
      case 'top':
        an.add(main!, { translateY: '-100%' }, 0)
        break
      case 'left':
        an.add(main!, { translateX: '-100%' }, 0)
        break
      case 'right':
        an.add(main!, { translateX: '100%' }, 0)
        break
      case 'center':
        an.add([back, main], { opacity: 0, duration: 150, ease: 'linear' })
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
  overrideEnterAnime,
  overrideLeaveAnime,
}) => {
  const enterAnime = overrideEnterAnime ?? createEnterAnime(position)
  const leaveAnime = overrideLeaveAnime ?? createLeaveAnime(position)

  useTransitionEnter(enterAnime)
  useTransitionLeave(leaveAnime)

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
