import { type FC, type ReactNode } from 'react'
import { utils, createTimeline, type TimelineParams } from 'animejs'
import {
  useTransitionEnter,
  useTransitionLeave,
  useProgressExitAnimated,
} from '../hooks'
import { back } from '../navigation'

import './Page.scss'

const PageBodyClassName = 'react-navigation-layout-body'

/**
 * 基础页面组件
 */
export const Page: FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={`${PageBodyClassName} ${className ?? ''}`}>{children}</div>
  )
}

/**
 * 导航页面组件 - 带有默认的推入/推出动画
 */
export const NavPage: FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const animeProps: TimelineParams = {
    defaults: { duration: 500, ease: 'outExpo' },
  }

  useTransitionEnter(({ to, from }, onComplete) => {
    const an = createTimeline({ ...animeProps, onComplete })
    an.add(to!, { translateX: ['100%', '0'] })
    if (from?.classList.contains(PageBodyClassName)) {
      an.add(
        from,
        {
          translateX: ['0%', '-50%'],
          onComplete: (anim) => {
            utils.set(anim.targets, { translateX: '0%' })
          },
        },
        0
      )
    }
  })

  let justBack = false
  useTransitionLeave(({ from, to }, onComplete) => {
    if (justBack) {
      onComplete()
      return
    }

    const an = createTimeline({ ...animeProps, onComplete })
    if (to?.classList.contains(PageBodyClassName)) {
      an.add(to, { translateX: ['-50%', '0%'] })
    }
    an.add(from!, { translateX: ['0', '100%'] }, 0)
  })

  useProgressExitAnimated(({ from, to }, progress, isFinish) => {
    if (isFinish === undefined) {
      if (to?.classList.contains(PageBodyClassName)) {
        utils.set(to, { translateX: -50 * (1 - progress) + '%' })
      }
      if (from) {
        utils.set(from, { translateX: 100 * progress + '%' })
      }
    } else {
      if (isFinish) {
        const animated = createTimeline({
          defaults: { duration: 300, ease: 'outExpo' },
        })
        if (to?.classList.contains(PageBodyClassName)) {
          animated.add(to, { translateX: '0' })
        }
        animated.add(from!, { translateX: '100%' }, 0)
        animated.onComplete = () => {
          justBack = true
          back()
        }
      } else {
        const animated = createTimeline({
          defaults: { duration: 300, ease: 'outExpo' },
        })
        if (to?.classList.contains(PageBodyClassName)) {
          animated.add(to, { translateX: '-50%' })
        }
        animated.add(from!, { translateX: '0%' }, 0)
      }
    }
  })

  return <Page className={className}>{children}</Page>
}
