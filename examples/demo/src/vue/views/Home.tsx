import { defineComponent, ref } from 'vue'
import { NavPage, push, SafeBottomSpace, showLoading } from '@0x30/navigation-vue'
import { useToast } from '@0x30/navigation-vue'
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

export default defineComponent({
  name: 'Home',
  setup() {
    const activeTab = ref<'message' | 'contacts' | 'discover' | 'me'>('message')

    const handleUserClick = (user: typeof users[0]) => {
      push(<UserDetail user={user} />)
    }

    const handleShowToast = () => {
      useToast('这是一条提示消息')
    }

    const handleShowLoading = async () => {
      showLoading(0, '加载中...')
      await new Promise(r => setTimeout(r, 2000))
      showLoading(3)
    }

    const handleComponentsDemo = () => {
      push(<ComponentsDemo />)
    }

    return () => (
      <NavPage class={styles.container}>
        {/* 顶部导航栏 */}
        <div class={styles.header}>
          <span class={styles.title}>
            {activeTab.value === 'message' && '微信'}
            {activeTab.value === 'contacts' && '通讯录'}
            {activeTab.value === 'discover' && '发现'}
            {activeTab.value === 'me' && '我'}
          </span>
          <div class={styles.headerRight}>
            <span class={styles.icon}>➕</span>
          </div>
        </div>

        {/* 内容区域 */}
        <div class={styles.content}>
          {activeTab.value === 'message' && (
            <div class={styles.messageList}>
              {users.map(user => (
                <div 
                  key={user.id} 
                  class={styles.messageItem}
                  onClick={() => handleUserClick(user)}
                >
                  <div class={styles.avatar}>{user.avatar}</div>
                  <div class={styles.messageContent}>
                    <div class={styles.messageHeader}>
                      <span class={styles.name}>{user.name}</span>
                      <span class={styles.time}>{user.time}</span>
                    </div>
                    <div class={styles.lastMessage}>{user.lastMessage}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab.value === 'contacts' && (
            <div class={styles.contacts}>
              <div class={styles.searchBar}>
                <span>🔍 搜索</span>
              </div>
              <div class={styles.contactSection}>
                <div class={styles.sectionTitle}>新的朋友</div>
                <div class={styles.contactItem}>
                  <span class={styles.contactIcon}>👋</span>
                  <span>新的朋友</span>
                </div>
                <div class={styles.contactItem}>
                  <span class={styles.contactIcon}>👥</span>
                  <span>群聊</span>
                </div>
                <div class={styles.contactItem}>
                  <span class={styles.contactIcon}>🏷️</span>
                  <span>标签</span>
                </div>
              </div>
            </div>
          )}

          {activeTab.value === 'discover' && (
            <div class={styles.discover}>
              <div class={styles.discoverItem} onClick={handleComponentsDemo}>
                <span class={styles.discoverIcon}>🎨</span>
                <span>组件演示</span>
                <span class={styles.arrow}>›</span>
              </div>
              <div class={styles.discoverItem} onClick={handleShowToast}>
                <span class={styles.discoverIcon}>💬</span>
                <span>显示 Toast</span>
                <span class={styles.arrow}>›</span>
              </div>
              <div class={styles.discoverItem} onClick={handleShowLoading}>
                <span class={styles.discoverIcon}>⏳</span>
                <span>显示 Loading</span>
                <span class={styles.arrow}>›</span>
              </div>
              <div class={styles.discoverItem}>
                <span class={styles.discoverIcon}>📱</span>
                <span>朋友圈</span>
                <span class={styles.arrow}>›</span>
              </div>
              <div class={styles.discoverItem}>
                <span class={styles.discoverIcon}>📺</span>
                <span>视频号</span>
                <span class={styles.arrow}>›</span>
              </div>
            </div>
          )}

          {activeTab.value === 'me' && (
            <div class={styles.me}>
              <div class={styles.profile}>
                <div class={styles.profileAvatar}>🙂</div>
                <div class={styles.profileInfo}>
                  <div class={styles.profileName}>用户</div>
                  <div class={styles.profileId}>微信号: vue_demo</div>
                </div>
              </div>
              <div class={styles.meSection}>
                <div class={styles.meItem}>
                  <span class={styles.meIcon}>💰</span>
                  <span>服务</span>
                </div>
              </div>
              <div class={styles.meSection}>
                <div class={styles.meItem}>
                  <span class={styles.meIcon}>⭐</span>
                  <span>收藏</span>
                </div>
                <div class={styles.meItem}>
                  <span class={styles.meIcon}>📷</span>
                  <span>朋友圈</span>
                </div>
              </div>
              <div class={styles.meSection}>
                <div class={styles.meItem}>
                  <span class={styles.meIcon}>⚙️</span>
                  <span>设置</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部 TabBar */}
        <div class={styles.tabBar}>
          <SafeBottomSpace />
          <div class={styles.tabBarContent}>
            <div 
              class={[styles.tabItem, activeTab.value === 'message' && styles.active]}
              onClick={() => activeTab.value = 'message'}
            >
              <span class={styles.tabIcon}>💬</span>
              <span class={styles.tabLabel}>微信</span>
            </div>
            <div 
              class={[styles.tabItem, activeTab.value === 'contacts' && styles.active]}
              onClick={() => activeTab.value = 'contacts'}
            >
              <span class={styles.tabIcon}>👥</span>
              <span class={styles.tabLabel}>通讯录</span>
            </div>
            <div 
              class={[styles.tabItem, activeTab.value === 'discover' && styles.active]}
              onClick={() => activeTab.value = 'discover'}
            >
              <span class={styles.tabIcon}>🔍</span>
              <span class={styles.tabLabel}>发现</span>
            </div>
            <div 
              class={[styles.tabItem, activeTab.value === 'me' && styles.active]}
              onClick={() => activeTab.value = 'me'}
            >
              <span class={styles.tabIcon}>👤</span>
              <span class={styles.tabLabel}>我</span>
            </div>
          </div>
        </div>
      </NavPage>
    )
  },
})
