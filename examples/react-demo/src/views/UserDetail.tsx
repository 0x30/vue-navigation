import { useState, type FC } from 'react'
import { NavPage, back, useLeaveBefore, SidePage, push, showToast, useQuietPage, type SidePageAnimationContext } from '@0x30/navigation-react'
import styles from './UserDetail.module.scss'

// 固定的图片地址，避免随机地址导致动画问题
const DEMO_IMAGE_URL = 'https://picsum.photos/id/237/400/300'
const DEMO_IMAGE_THUMB_URL = 'https://picsum.photos/id/237/200/150'

interface User {
  id: number
  name: string
  avatar: string
  lastMessage: string
  time: string
}

interface UserDetailProps {
  user: User
}

/**
 * 计算 Hero 动画的变换参数
 */
const calculateHeroTransform = (fromRect: DOMRect, toRect: DOMRect) => {
  const scaleX = fromRect.width / toRect.width
  const scaleY = fromRect.height / toRect.height
  const translateX = fromRect.left - toRect.left + (fromRect.width - toRect.width) / 2
  const translateY = fromRect.top - toRect.top + (fromRect.height - toRect.height) / 2
  return { scaleX, scaleY, translateX, translateY }
}

// 图片预览组件 - 使用 SidePage 的 onEnter/onLeave 实现 Hero 动画
const ImagePreview: FC<{ src: string }> = ({ src }) => {
  useQuietPage()

  // 进入动画 - Hero 效果
  const handleEnter = (ctx: SidePageAnimationContext) => {
    const fromHero = ctx.from?.querySelector('[data-hero-image]')
    const toHero = ctx.mainElement?.querySelector('img')

    // 背景渐入
    ctx.timeline.add(ctx.backElement!, { opacity: [0, 1] })

    if (fromHero && toHero) {
      const fromRect = fromHero.getBoundingClientRect()
      const toRect = toHero.getBoundingClientRect()
      const transform = calculateHeroTransform(fromRect, toRect)

      ctx.timeline.add(toHero, {
        translateX: [transform.translateX, 0],
        translateY: [transform.translateY, 0],
        scaleX: [transform.scaleX, 1],
        scaleY: [transform.scaleY, 1],
      }, 0)
    } else {
      // 降级动画
      ctx.timeline.add(ctx.mainElement!, { scale: [0.8, 1], opacity: [0, 1] }, 0)
    }
  }

  // 离开动画 - Hero 效果
  const handleLeave = (ctx: SidePageAnimationContext) => {
    const fromHero = ctx.to?.querySelector('[data-hero-image]')
    const toHero = ctx.mainElement?.querySelector('img')

    // 背景渐出
    ctx.timeline.add(ctx.backElement!, { opacity: 0 })

    if (fromHero && toHero) {
      const fromRect = fromHero.getBoundingClientRect()
      const toRect = toHero.getBoundingClientRect()
      const transform = calculateHeroTransform(fromRect, toRect)

      ctx.timeline.add(toHero, {
        translateX: transform.translateX,
        translateY: transform.translateY,
        scaleX: transform.scaleX,
        scaleY: transform.scaleY,
      }, 0)
    } else {
      ctx.timeline.add(ctx.mainElement!, { opacity: 0 }, 0)
    }
  }

  return (
    <SidePage 
      position="center" 
      onClickBack={back}
      onEnter={handleEnter}
      onLeave={handleLeave}
    >
      <div className={styles.imagePreview}>
        <img src={src} alt="" />
      </div>
    </SidePage>
  )
}

const UserDetail: FC<UserDetailProps> = ({ user }) => {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, type: 'received', content: user.lastMessage },
    { id: 2, type: 'sent', content: '好的，收到！' },
    { id: 3, type: 'received', content: '那我们约个时间吧' },
  ])

  // 返回前确认
  useLeaveBefore(async () => {
    if (inputValue.trim()) {
      return window.confirm('输入框中有内容，确定要离开吗？')
    }
    return true
  })

  const handleSend = () => {
    if (!inputValue.trim()) {
      showToast('请输入消息内容')
      return
    }
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'sent',
      content: inputValue,
    }])
    setInputValue('')
    showToast('消息已发送')
  }

  const handleImageClick = () => {
    push(<ImagePreview src={DEMO_IMAGE_URL} />)
  }

  return (
    <NavPage className={styles.container}>
      {/* 顶部导航栏 */}
      <div className={styles.header}>
        <span className={styles.backBtn} onClick={() => back()}>‹ 返回</span>
        <span className={styles.title}>{user.name}</span>
        <span className={styles.more}>···</span>
      </div>

      {/* 聊天内容 */}
      <div className={styles.chatContent}>
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`${styles.message} ${msg.type === 'sent' ? styles.sent : styles.received}`}
          >
            {msg.type === 'received' && (
              <div className={styles.msgAvatar}>{user.avatar}</div>
            )}
            <div className={styles.msgBubble}>{msg.content}</div>
            {msg.type === 'sent' && (
              <div className={styles.msgAvatar}>🙂</div>
            )}
          </div>
        ))}
        
        {/* 示例图片消息 */}
        <div className={`${styles.message} ${styles.received}`}>
          <div className={styles.msgAvatar}>{user.avatar}</div>
          <div className={styles.msgImage} onClick={handleImageClick}>
            <img data-hero-image src={DEMO_IMAGE_THUMB_URL} alt="" />
          </div>
        </div>
      </div>

      {/* 底部输入框 */}
      <div className={styles.inputBar}>
        <span className={styles.voice}>🎤</span>
        <input 
          type="text" 
          className={styles.input}
          placeholder="发送消息..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyUp={e => e.key === 'Enter' && handleSend()}
        />
        <span className={styles.emoji}>😊</span>
        <span className={styles.sendBtn} onClick={handleSend}>发送</span>
      </div>
    </NavPage>
  )
}

export default UserDetail
