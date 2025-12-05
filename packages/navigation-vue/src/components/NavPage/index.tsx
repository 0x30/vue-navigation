import { back } from '../../navigation'
import {
  useTransitionEnter,
  useTransitionLeave,
  useProgressExitAnimated,
} from '../../hooks'
import { utils, createTimeline, type TimelineParams } from 'animejs'
import { defineComponent } from 'vue'
import Page from '../Page'

const PageBodyClassName = 'vue-navigation-layout-body'

const NavPage = defineComponent({
  name: 'NavPage',
  setup: (_, { slots }) => {
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
          0,
        )
      }
    })

    let justBack = false
    useTransitionLeave(({ from, to }, onComplete) => {
      /// 如果该值 设置为 true 表明，当前是通过 滑动返回的方式关闭的
      /// 那么不需要执行任何动画 直接完成即可
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
        /// 如果 滑动返回成功结束
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
            defaults: {
              duration: 300,
              ease: 'outExpo',
            },
          })
          if (to?.classList.contains(PageBodyClassName)) {
            animated.add(to, { translateX: '-50%' })
          }
          animated.add(from!, { translateX: '0%' }, 0)
        }
      }
    })

    return () => <Page>{slots.default?.()}</Page>
  },
})

export default NavPage
