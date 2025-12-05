import { useState, type FC } from 'react'
import { NavPage, back, useLeaveBefore, SidePage, push, showToast, useQuietPage, useHero } from '@0x30/navigation-react'
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

// 图片预览组件 - 使用 useHero 实现共享元素动画
const ImagePreview: FC<{ src: string }> = ({ src }) => {
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

  return (
    <SidePage 
      position="center" 
      onClickBack={back}
      overrideEnterAnime={enterAnime}
      overrideLeaveAnime={leaveAnime}
    >
      <div className={styles.imagePreview}>
        <img data-hero-image src={src} alt="" />
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
            <img data-hero-image src="https://picsum.photos/200/150" alt="" />
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
