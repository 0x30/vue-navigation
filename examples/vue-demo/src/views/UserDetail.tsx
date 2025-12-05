import { defineComponent, ref, type PropType } from 'vue'
import { NavPage, back, useLeaveBefore, SidePage, push, showToast, useQuietPage, useHero } from '@0x30/navigation-vue'
import styles from './UserDetail.module.scss'

interface User {
  id: number
  name: string
  avatar: string
  lastMessage: string
  time: string
}

// 图片预览组件 - 使用 useHero 实现共享元素动画
const ImagePreview = defineComponent({
  props: {
    src: { type: String, required: true },
  },
  setup(props) {
    useQuietPage()

    // 使用 useHero 创建 Hero 动画，自定义背景渐变
    const { enterAnime, leaveAnime } = useHero({
      id: 'image',
      onEnter: (ctx) => {
        // 背景渐入
        const back = ctx.to?.querySelector('.back')
        if (back) {
          ctx.timeline.add(back, { opacity: [0, 1] })
        }
        // Hero 元素动画
        if (ctx.toHero && ctx.transform) {
          ctx.timeline.add(ctx.toHero, {
            translateX: [ctx.transform.translateX, 0],
            translateY: [ctx.transform.translateY, 0],
            scaleX: [ctx.transform.scaleX, 1],
            scaleY: [ctx.transform.scaleY, 1],
          }, 0)
        }
      },
      onLeave: (ctx) => {
        // 背景渐出
        const back = ctx.from?.querySelector('.back')
        if (back) {
          ctx.timeline.add(back, { opacity: 0 })
        }
        // Hero 元素动画
        if (ctx.toHero && ctx.transform) {
          ctx.timeline.add(ctx.toHero, {
            translateX: ctx.transform.translateX,
            translateY: ctx.transform.translateY,
            scaleX: ctx.transform.scaleX,
            scaleY: ctx.transform.scaleY,
          }, 0)
        }
      },
    })

    return () => (
      <SidePage 
        position="center" 
        onClickBack={back}
        overrideEnterAnime={enterAnime}
        overrideLeaveAnime={leaveAnime}
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
      push(<ImagePreview src="https://picsum.photos/400/300" />)
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
              <img data-hero-image src="https://picsum.photos/200/150" alt="" />
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
