import { useState, type FC } from 'react'
import { NavPage, back, useLeaveBefore, SidePage, push, showToast, useQuietPage } from '@0x30/navigation-react'
import { createTimeline } from 'animejs'
import styles from './UserDetail.module.scss'

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

// Hero 动画的唯一标识 class
const HERO_IMAGE_CLASS = 'hero-image-source'

// 图片预览组件 - 带 Hero 动画
const ImagePreview: FC<{ src: string }> = ({ src }) => {
  useQuietPage()

  // 自定义进入动画 - Hero 效果
  const heroEnterAnime = (
    elements: { from?: Element; to?: Element },
    done: () => void,
    target: { backElement?: Element | null; mainElement?: Element | null }
  ) => {
    const sourceImg = elements.from?.querySelector(`.${HERO_IMAGE_CLASS}`)
    const targetImg = target.mainElement?.querySelector('img')

    if (sourceImg && targetImg) {
      const sourceRect = sourceImg.getBoundingClientRect()
      const targetRect = targetImg.getBoundingClientRect()

      // 计算初始位置和缩放
      const scaleX = sourceRect.width / targetRect.width
      const scaleY = sourceRect.height / targetRect.height
      const translateX = sourceRect.left - targetRect.left + (sourceRect.width - targetRect.width) / 2
      const translateY = sourceRect.top - targetRect.top + (sourceRect.height - targetRect.height) / 2

      const timeline = createTimeline({
        defaults: { duration: 350, ease: 'outQuart' },
        onComplete: done,
      })

      timeline.add(target.backElement!, { opacity: [0, 1] })
      timeline.add(targetImg, {
        translateX: [translateX, 0],
        translateY: [translateY, 0],
        scaleX: [scaleX, 1],
        scaleY: [scaleY, 1],
      }, 0)
    } else {
      // 降级到普通动画
      const timeline = createTimeline({
        defaults: { duration: 300 },
        onComplete: done,
      })
      timeline.add(target.backElement!, { opacity: [0, 1] })
      timeline.add(target.mainElement!, { scale: [0.8, 1], opacity: [0, 1] }, 0)
    }
  }

  // 自定义离开动画 - Hero 效果
  const heroLeaveAnime = (
    elements: { from?: Element; to?: Element },
    done: () => void,
    target: { backElement?: Element | null; mainElement?: Element | null }
  ) => {
    const sourceImg = elements.to?.querySelector(`.${HERO_IMAGE_CLASS}`)
    const targetImg = target.mainElement?.querySelector('img')

    if (sourceImg && targetImg) {
      const sourceRect = sourceImg.getBoundingClientRect()
      const targetRect = targetImg.getBoundingClientRect()

      const scaleX = sourceRect.width / targetRect.width
      const scaleY = sourceRect.height / targetRect.height
      const translateX = sourceRect.left - targetRect.left + (sourceRect.width - targetRect.width) / 2
      const translateY = sourceRect.top - targetRect.top + (sourceRect.height - targetRect.height) / 2

      const timeline = createTimeline({
        defaults: { duration: 300, ease: 'inOutQuart' },
        onComplete: done,
      })

      timeline.add(target.backElement!, { opacity: 0 })
      timeline.add(targetImg, {
        translateX: translateX,
        translateY: translateY,
        scaleX: scaleX,
        scaleY: scaleY,
      }, 0)
    } else {
      const timeline = createTimeline({
        defaults: { duration: 200 },
        onComplete: done,
      })
      timeline.add([target.backElement!, target.mainElement!], { opacity: 0 })
    }
  }

  return (
    <SidePage 
      position="center" 
      onClickBack={back}
      overrideEnterAnime={heroEnterAnime}
      overrideLeaveAnime={heroLeaveAnime}
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
    push(<ImagePreview src="https://picsum.photos/400/300" />)
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
            <img className={HERO_IMAGE_CLASS} src="https://picsum.photos/200/150" alt="" />
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
