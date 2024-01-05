import {
  back,
  useTransitionEnter,
  useTransitionLeave,
  useProgressExitAnimated,
} from '@0x30/vue-navigation'
import anime from 'animejs'
import { defineComponent } from 'vue'
import Page from '../Page'

const PageBodyClassName = 'vue-navigation-layout-body'

const NavPage = defineComponent({
  name: 'NavPage',
  setup: (_, { slots }) => {
    const animeProps = { duration: 500, easing: 'easeOutExpo' }

    useTransitionEnter(({ to, from }, complete) => {
      const an = anime.timeline({ ...animeProps, complete })
      an.add({ targets: to, translateX: ['100%', '0'] })
      if (from?.classList.contains(PageBodyClassName)) {
        an.add(
          {
            targets: from,
            translateX: ['0%', '-50%'],
            complete: (anim) => anim.seek(0),
          },
          0,
        )
      }
    })

    let justBack = false
    useTransitionLeave(({ from, to }, complete) => {
      /// 如果该值 设置为 true 表明，当前是通过 滑动返回的方式关闭的
      /// 那么不需要执行任何动画 直接完成即可
      if (justBack) {
        complete()
        return
      }

      const an = anime.timeline({ ...animeProps, complete })
      if (to?.classList.contains(PageBodyClassName)) {
        an.add({ targets: to, translateX: ['-50%', '0%'] })
      }
      an.add({ targets: from, translateX: ['0', '100%'] }, 0)
    })

    useProgressExitAnimated(({ from, to }, progress, isFinish) => {
      if (isFinish === undefined) {
        if (to?.classList.contains(PageBodyClassName)) {
          anime.set(to, { translateX: -50 * (1 - progress) + '%' })
        }
        if (from) {
          anime.set(from, { translateX: 100 * progress + '%' })
        }
      } else {
        /// 如果 滑动返回成功结束
        if (isFinish) {
          const animated = anime.timeline({
            duration: 300,
            easing: 'easeOutExpo',
          })
          if (to?.classList.contains(PageBodyClassName)) {
            animated.add({ targets: to, translateX: '0' })
          }
          animated.add({ targets: from, translateX: '100%' }, 0)

          animated.complete = () => {
            justBack = true
            back()
          }
        } else {
          const animated = anime.timeline({
            duration: 300,
            easing: 'easeOutExpo',
          })
          if (to?.classList.contains(PageBodyClassName)) {
            animated.add({ targets: to, translateX: '-50%' })
          }
          animated.add({ targets: from, translateX: '0%' }, 0)
        }
      }
    })

    return () => <Page>{slots.default?.()}</Page>
  },
})

export default NavPage
