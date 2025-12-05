import { useState, type FC } from 'react'
import { NavPage, push, SafeBottomSpace, showLoading, hideLoading, showToast } from '@0x30/navigation-react'
import UserDetail from './UserDetail'
import ComponentsDemo from './ComponentsDemo'
import styles from './Home.module.scss'

// 模拟用户数据
const users = [
  { id: 1, name: '张三', avatar: '👨', lastMessage: '今天天气真好！', time: '12:30' },
  { id: 2, name: '李四', avatar: '👩', lastMessage: '明天一起吃饭吗？', time: '11:20' },
  { id: 3, name: '王五', avatar: '🧑', lastMessage: '项目进度怎么样了', time: '10:15' },
  { id: 4, name: '赵六', avatar: '👴', lastMessage: '周末有空吗', time: '昨天' },
  { id: 5, name: '钱七', avatar: '👵', lastMessage: '收到，谢谢！', time: '昨天' },
  { id: 6, name: '孙八', avatar: '🧔', lastMessage: '好的，没问题', time: '周一' },
]

type TabType = 'message' | 'contacts' | 'discover' | 'me'

const Home: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('message')

  const handleUserClick = (user: typeof users[0]) => {
    push(<UserDetail user={user} />)
  }

  const handleShowToast = () => {
    showToast('这是一条提示消息')
  }

  const handleShowLoading = async () => {
    showLoading('加载中...')
    await new Promise(r => setTimeout(r, 2000))
    hideLoading()
  }

  const handleComponentsDemo = () => {
    push(<ComponentsDemo />)
  }

  return (
    <NavPage className={styles.container}>
      {/* 顶部导航栏 */}
      <div className={styles.header}>
        <span className={styles.title}>
          {activeTab === 'message' && '微信'}
          {activeTab === 'contacts' && '通讯录'}
          {activeTab === 'discover' && '发现'}
          {activeTab === 'me' && '我'}
        </span>
        <div className={styles.headerRight}>
          <span className={styles.icon}>➕</span>
        </div>
      </div>

      {/* 内容区域 */}
      <div className={styles.content}>
        {activeTab === 'message' && (
          <div className={styles.messageList}>
            {users.map(user => (
              <div 
                key={user.id} 
                className={styles.messageItem}
                onClick={() => handleUserClick(user)}
              >
                <div className={styles.avatar}>{user.avatar}</div>
                <div className={styles.messageContent}>
                  <div className={styles.messageHeader}>
                    <span className={styles.name}>{user.name}</span>
                    <span className={styles.time}>{user.time}</span>
                  </div>
                  <div className={styles.lastMessage}>{user.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className={styles.contacts}>
            <div className={styles.searchBar}>
              <span>🔍 搜索</span>
            </div>
            <div className={styles.contactSection}>
              <div className={styles.sectionTitle}>新的朋友</div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>👋</span>
                <span>新的朋友</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>👥</span>
                <span>群聊</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>🏷️</span>
                <span>标签</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'discover' && (
          <div className={styles.discover}>
            <div className={styles.discoverItem} onClick={handleComponentsDemo}>
              <span className={styles.discoverIcon}>🎨</span>
              <span>组件演示</span>
              <span className={styles.arrow}>›</span>
            </div>
            <div className={styles.discoverItem} onClick={handleShowToast}>
              <span className={styles.discoverIcon}>💬</span>
              <span>显示 Toast</span>
              <span className={styles.arrow}>›</span>
            </div>
            <div className={styles.discoverItem} onClick={handleShowLoading}>
              <span className={styles.discoverIcon}>⏳</span>
              <span>显示 Loading</span>
              <span className={styles.arrow}>›</span>
            </div>
            <div className={styles.discoverItem}>
              <span className={styles.discoverIcon}>📱</span>
              <span>朋友圈</span>
              <span className={styles.arrow}>›</span>
            </div>
            <div className={styles.discoverItem}>
              <span className={styles.discoverIcon}>📺</span>
              <span>视频号</span>
              <span className={styles.arrow}>›</span>
            </div>
          </div>
        )}

        {activeTab === 'me' && (
          <div className={styles.me}>
            <div className={styles.profile}>
              <div className={styles.profileAvatar}>🙂</div>
              <div className={styles.profileInfo}>
                <div className={styles.profileName}>用户</div>
                <div className={styles.profileId}>微信号: react_demo</div>
              </div>
            </div>
            <div className={styles.meSection}>
              <div className={styles.meItem}>
                <span className={styles.meIcon}>💰</span>
                <span>服务</span>
              </div>
            </div>
            <div className={styles.meSection}>
              <div className={styles.meItem}>
                <span className={styles.meIcon}>⭐</span>
                <span>收藏</span>
              </div>
              <div className={styles.meItem}>
                <span className={styles.meIcon}>📷</span>
                <span>朋友圈</span>
              </div>
            </div>
            <div className={styles.meSection}>
              <div className={styles.meItem}>
                <span className={styles.meIcon}>⚙️</span>
                <span>设置</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部 TabBar */}
      <div className={styles.tabBar}>
        <SafeBottomSpace />
        <div className={styles.tabBarContent}>
          <div 
            className={`${styles.tabItem} ${activeTab === 'message' ? styles.active : ''}`}
            onClick={() => setActiveTab('message')}
          >
            <span className={styles.tabIcon}>💬</span>
            <span className={styles.tabLabel}>微信</span>
          </div>
          <div 
            className={`${styles.tabItem} ${activeTab === 'contacts' ? styles.active : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            <span className={styles.tabIcon}>👥</span>
            <span className={styles.tabLabel}>通讯录</span>
          </div>
          <div 
            className={`${styles.tabItem} ${activeTab === 'discover' ? styles.active : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            <span className={styles.tabIcon}>🔍</span>
            <span className={styles.tabLabel}>发现</span>
          </div>
          <div 
            className={`${styles.tabItem} ${activeTab === 'me' ? styles.active : ''}`}
            onClick={() => setActiveTab('me')}
          >
            <span className={styles.tabIcon}>👤</span>
            <span className={styles.tabLabel}>我</span>
          </div>
        </div>
      </div>
    </NavPage>
  )
}

export default Home
