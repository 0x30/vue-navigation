import { type PropType, defineComponent, ref } from 'vue'

import styles from './index.module.scss'
import { animate } from '../util/anime'
import { useAddEventListener } from '../util/useAddEventListener'
import { wait } from '../util/wait'

const getY = (event: TouchEvent) => {
  const y = event.touches[event.touches.length - 1].screenY
  return y
}

type PullRefreshState = 'refreshing' | 'finish' | 'close'

const PullRefresh = defineComponent({
  name: 'PullRefresh',
  props: {
    /**
     * 超过这个距离，松开即可进行刷新
     */
    distance: {
      type: Number,
      default: 80,
    },
    /** 完成的时候 保持成功页面多久 */
    finishKeeyTime: {
      type: Number,
      default: 300,
    },
    /**
     * 刷新方法
     */
    onRefresh: Function as PropType<() => Promise<any>>,
    /**
     * 当header出于正在刷新的时候 绘制方法
     * 当存在 onHeaderRender 时，该方法失效
     */
    refreshingRender: Function as PropType<
      (progress: number, distance: number) => Element
    >,
    /**
     * 当header正在下拉但 还没有到达位置的时候
     */
    pullingRender: Function as PropType<
      (progress: number, distance: number) => Element
    >,
    /**
     * 当header松开就可以进行刷新的时候
     */
    waitReleaseRender: Function as PropType<
      (progress: number, distance: number) => Element
    >,
    /**
     * 当header完成刷新后的
     */
    finishRender: Function as PropType<
      (progress: number, distance: number) => Element
    >,
    /**
     * 绘制方法
     * 优先级最高
     */
    headerRender: Function as PropType<
      (progress: number, distance: number, state?: PullRefreshState) => Element
    >,
  },
  setup: (props, { slots }) => {
    // 容器组件
    const containRef = ref<HTMLDivElement>()
    // header 组件
    const headerRef = ref<HTMLDivElement>()

    /// 最后的 Y 值
    let lastY: number = 0
    /// header 变化值
    let move = 0
    /// header 变化值
    const moveRef = ref(0)

    /// 刷新状态
    let state: PullRefreshState | undefined = undefined

    const setMove = (value: number) => {
      move = value
      moveRef.value = value
    }

    const toHeight = (start: number, end: number) => {
      return animate(start, end, 600, 'easeOutQuint', (val) => {
        setMove(val)
        headerRef.value!.style.height = val + 'px'
      })
    }

    useAddEventListener(containRef, 'touchstart', (eve) => {
      if (eve.touches.length === 1) setMove(0)
      lastY = getY(eve)
    })

    useAddEventListener(containRef, 'touchmove', (eve) => {
      const y = getY(eve)
      const res = y - lastY
      lastY = y

      console.log(containRef.value?.scrollTop)

      if (containRef.value?.scrollTop !== 0) {
        return
      }

      /// 增速比例
      let scale = 3
      const height = containRef.value!.clientHeight

      /// 当大于刷新的高度的时候 就减速用户的下拉距离
      if (move > props.distance) {
        scale += (move / ((1 / 2) * height)) * 10
      }

      setMove(move + res / scale)

      console.log(move, '高度')

      if (move < 0) return
      headerRef.value!.style.height = move + 'px'
    })

    useAddEventListener(containRef, 'touchcancel', async () => {
      if (state !== undefined) return

      state = 'close'
      await toHeight(move, 0)
      state = undefined
    })

    useAddEventListener(containRef, 'touchend', async () => {
      if (state === 'finish' || state === 'close') return
      if (state === 'refreshing') {
        toHeight(move, props.distance)
        return
      }

      if (move > props.distance) {
        state = 'refreshing'
        await toHeight(move, props.distance)
        try {
          await props.onRefresh?.()
        } catch {}

        if (props.finishKeeyTime > 0 && props.finishRender !== undefined) {
          state = 'finish'
          moveRef.value = moveRef.value + 1
          await wait(props.finishKeeyTime)
        }
      }

      state = 'close'
      await toHeight(move, 0)
      state = undefined
    })

    return () => {
      const {
        headerRender,
        pullingRender,
        distance,
        finishRender,
        refreshingRender,
        waitReleaseRender,
      } = props

      const onRender = () => {
        const progress = move / props.distance

        if (state === 'close') return null

        /// 如果存在 headerRender 那么有限展示该render
        if (headerRender) {
          return headerRender(progress, distance, state)
        }
        /// 如果当前状态为 完成状态
        if (state === 'finish') {
          return finishRender?.(progress, distance)
        }
        if (state === 'refreshing') {
          return refreshingRender?.(progress, distance)
        }
        if (move > distance) {
          return waitReleaseRender?.(progress, distance)
        }

        return pullingRender?.(progress, distance)
      }

      return (
        <div class={styles.body} ref={containRef}>
          <div ref={headerRef} class={styles.head} data-d={moveRef.value}>
            {onRender()}
          </div>

          <div class={styles.contain}>{slots.default?.()}</div>
        </div>
      )
    }
  },
})

export default PullRefresh
