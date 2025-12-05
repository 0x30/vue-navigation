import { defineComponent, ref, type PropType } from 'vue'
import { NavPage, back, useLeaveBefore, SidePage, push, showToast, useQuietPage, getHeroAnimate, type SidePageAnimationContext } from '@0x30/navigation-vue'
import styles from './UserDetail.module.scss'

interface User {
  id: number
  name: string
  avatar: string
  lastMessage: string
  time: string
}

// 固定的图片地址，避免随机地址导致动画问题
const DEMO_IMAGE_URL = 'https://picsum.photos/id/237/400/300'
const DEMO_IMAGE_THUMB_URL = 'https://picsum.photos/id/237/200/150'

// 图片预览组件 - 使用 SidePage 的 onEnter/onLeave 实现 Hero 动画
const ImagePreview = defineComponent({
  props: {
    src: { type: String, required: true },
  },
  setup(props) {
    useQuietPage()

    // 进入动画 - Hero 效果
    const handleEnter = (ctx: SidePageAnimationContext) => {
      const hero = getHeroAnimate({
        root: ctx.mainElement,
        target: ctx.from,
        id: 'image',
      })

      // 背景渐入
      ctx.timeline.add(ctx.backElement!, { opacity: [0, 1] })

      // Hero 动画
      if (hero.matched) {
        ctx.timeline.add(hero.hero!, hero.getEnterParams()!, 0)
      } else {
        // 降级动画
        ctx.timeline.add(ctx.mainElement!, { scale: [0.8, 1], opacity: [0, 1] }, 0)
      }
    }

    // 离开动画 - Hero 效果
    const handleLeave = (ctx: SidePageAnimationContext) => {
      const hero = getHeroAnimate({
        root: ctx.mainElement,
        target: ctx.to,
        id: 'image',
      })

      // 背景渐出
      ctx.timeline.add(ctx.backElement!, { opacity: 0 })

      // Hero 动画
      if (hero.matched) {
        ctx.timeline.add(hero.hero!, hero.getLeaveParams()!, 0)
      } else {
        ctx.timeline.add(ctx.mainElement!, { opacity: 0 }, 0)
      }
    }

    return () => (
      <SidePage 
        position="center" 
        onClickBack={back}
        onEnter={handleEnter}
        onLeave={handleLeave}
      >
        <div class={styles.imagePreview}>
          <img data-hero-image src={props.src} alt="" />
        </div>
      </SidePage>
    )
  },
})

export default defineComponent({
  name: 'UserDetail',
  props: {
    user: { type: Object as PropType<User>, required: true },
  },
  setup(props) {
    const inputValue = ref('')
    const messages = ref([
      { id: 1, type: 'received', content: props.user.lastMessage },
      { id: 2, type: 'sent', content: '好的，收到！' },
      { id: 3, type: 'received', content: '那我们约个时间吧' },
    ])

    // 返回前确认
    useLeaveBefore(async () => {
      if (inputValue.value.trim()) {
        return window.confirm('输入框中有内容，确定要离开吗？')
      }
      return true
    })

    const handleSend = () => {
      if (!inputValue.value.trim()) {
        showToast('请输入消息内容')
        return
      }
      
      messages.value.push({
        id: Date.now(),
        type: 'sent',
        content: inputValue.value,
      })
      inputValue.value = ''
      showToast('消息已发送')
    }

    const handleImageClick = () => {
      push(<ImagePreview src={DEMO_IMAGE_URL} />)
    }

    return () => (
      <NavPage class={styles.container}>
        {/* 顶部导航栏 */}
        <div class={styles.header}>
          <span class={styles.backBtn} onClick={() => back()}>‹ 返回</span>
          <span class={styles.title}>{props.user.name}</span>
          <span class={styles.more}>···</span>
        </div>

        {/* 聊天内容 */}
        <div class={styles.chatContent}>
          {messages.value.map(msg => (
            <div 
              key={msg.id} 
              class={[styles.message, msg.type === 'sent' ? styles.sent : styles.received]}
            >
              {msg.type === 'received' && (
                <div class={styles.msgAvatar}>{props.user.avatar}</div>
              )}
              <div class={styles.msgBubble}>{msg.content}</div>
              {msg.type === 'sent' && (
                <div class={styles.msgAvatar}>🙂</div>
              )}
            </div>
          ))}
          
          {/* 示例图片消息 */}
          <div class={[styles.message, styles.received]}>
            <div class={styles.msgAvatar}>{props.user.avatar}</div>
            <div class={styles.msgImage} onClick={handleImageClick}>
              <img data-hero-image src={DEMO_IMAGE_THUMB_URL} alt="" />
            </div>
          </div>
        </div>

        {/* 底部输入框 */}
        <div class={styles.inputBar}>
          <span class={styles.voice}>🎤</span>
          <input 
            type="text" 
            class={styles.input}
            placeholder="发送消息..."
            v-model={inputValue.value}
            onKeyup={(e: KeyboardEvent) => e.key === 'Enter' && handleSend()}
          />
          <span class={styles.emoji}>😊</span>
          <span class={styles.sendBtn} onClick={handleSend}>发送</span>
        </div>
      </NavPage>
    )
  },
})
