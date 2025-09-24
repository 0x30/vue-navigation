import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import {
  NavPage,
  Popup,
  SidePage,
  showLoading,
  useToast,
} from '@0x30/vue-navigation-layout'
import { back, push } from '@0x30/vue-navigation'

import DetailPage from '../detail'
import { LoginPage } from '../login'

import styles from './index.module.scss'
import { useHooks, wait } from '../../util'

const Component = defineComponent({
  name: 'HomePage',
  setup: () => {
    useHooks('Vue Navigation Demo')

    // 用户状态管理
    const userInfo = ref<any>(null)
    const currentTime = ref(new Date())

    // 初始化用户信息
    const initUserInfo = () => {
      const stored = localStorage.getItem('userInfo')
      if (stored) {
        userInfo.value = JSON.parse(stored)
      }
    }

    // 监听用户登录事件
    const handleUserLogin = (event: CustomEvent) => {
      userInfo.value = event.detail
    }

    // 用户登出
    const handleLogout = () => {
      localStorage.removeItem('userInfo')
      userInfo.value = null
      useToast('👋 已成功登出')
    }

    // 显示登录页面
    const showLogin = () => {
      push(<LoginPage />)
    }

    // 更新时间
    const updateTime = () => {
      currentTime.value = new Date()
    }

    onMounted(() => {
      initUserInfo()
      window.addEventListener('userLogin', handleUserLogin as EventListener)

      // 每秒更新时间
      const timer = setInterval(updateTime, 1000)

      onUnmounted(() => {
        window.removeEventListener(
          'userLogin',
          handleUserLogin as EventListener,
        )
        clearInterval(timer)
      })
    })

    const showSidePage =
      (
        position: 'left' | 'right' | 'center' | 'top' | 'bottom',
        title: string,
      ) =>
      () => {
        const sideClass =
          position === 'left'
            ? 'leftSide'
            : position === 'right'
              ? 'rightSide'
              : position === 'bottom'
                ? 'bottomSide'
                : position === 'top'
                  ? 'topSide'
                  : 'centerSide'
        push(
          <SidePage position={position} onClickBack={back}>
            <div class={`${styles.sidePageContent} ${styles[sideClass]}`}>
              <div class={styles.sidePageHeader}>
                <h3 class="title title-md">🎆 {title}侧边页面</h3>
                <p class={styles.sidePageDesc}>
                  这是一个从{title}方向滑入的侧边页面示例
                </p>
              </div>
              <div class={styles.sidePageBody}>
                <div class={styles.featureList}>
                  <div class={styles.featureItem}>
                    <span class={styles.featureIcon}>🎨</span>
                    <span>流畅的动画效果</span>
                  </div>
                  <div class={styles.featureItem}>
                    <span class={styles.featureIcon}>📱</span>
                    <span>响应式设计</span>
                  </div>
                  <div class={styles.featureItem}>
                    <span class={styles.featureIcon}>⚡</span>
                    <span>高性能渲染</span>
                  </div>
                </div>
              </div>
            </div>
          </SidePage>,
        )
      }

    const showDemoPopup = () => {
      const [show, close] = Popup()
      show(
        <div class={styles.popupContent}>
          <div class={styles.popupHeader}>
            <h3 class="title title-md">🎉 Popup 弹窗演示</h3>
            <p class={styles.popupDesc}>
              这是一个 <strong>Popup 组件</strong> 演示，区别于 SidePage：
            </p>
            <div class={styles.popupNotice}>
              <span class={styles.noticeIcon}>ℹ️</span>
              <span class={styles.noticeText}>
                此弹窗<strong>不触发页面切换</strong>，只是覆盖层显示
              </span>
            </div>
          </div>
          <div class={styles.popupBody}>
            <div class={styles.comparisonTable}>
              <div class={styles.tableRow}>
                <div class={styles.tableHeader}>Popup 🌆</div>
                <div class={styles.tableHeader}>SidePage 📱</div>
              </div>
              <div class={styles.tableRow}>
                <div class={styles.tableCell}>
                  <span class={styles.cellIcon}>❌</span>
                  不触发页面切换
                </div>
                <div class={styles.tableCell}>
                  <span class={styles.cellIcon}>✅</span>
                  触发页面切换
                </div>
              </div>
              <div class={styles.tableRow}>
                <div class={styles.tableCell}>
                  <span class={styles.cellIcon}>✅</span>
                  轻量级覆盖层
                </div>
                <div class={styles.tableCell}>
                  <span class={styles.cellIcon}>✅</span>
                  完整页面管理
                </div>
              </div>
              <div class={styles.tableRow}>
                <div class={styles.tableCell}>
                  <span class={styles.cellIcon}>✅</span>
                  快速显示内容
                </div>
                <div class={styles.tableCell}>
                  <span class={styles.cellIcon}>✅</span>
                  完整动画效果
                </div>
              </div>
            </div>
          </div>
          <div class={styles.popupFooter}>
            <button class="btn btn-outline" onClick={() => {
              close()
              useToast('💫 体验 SidePage 效果，点击上方“侧边页面”按钮')
            }}>
              <span>🔄</span>
              对比 SidePage
            </button>
            <button class="btn btn-primary" onClick={close}>
              <span>✨</span>
              关闭弹窗
            </button>
          </div>
        </div>,
      )
    }

    const showLoadingDemo = async () => {
      useToast('🔄 开始加载演示...')

      showLoading(0, '正在初始化...')
      await wait()

      showLoading(0, '加载用户数据...')
      await wait()

      showLoading(1, '✅ 加载成功!')

      setTimeout(() => {
        useToast('🎉 加载演示完成!')
      }, 1000)
    }

    const showToastDemo = () => {
      const messages = [
        '🎯 Vue Navigation 让路由管理变得简单!',
        '⚡ 支持多种动画效果和过渡方式',
        '🔥 轻量级，高性能，易于集成',
        '💡 完善的 TypeScript 支持',
      ]

      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)]
      useToast(randomMessage)
    }

    // 添加更多演示功能
    const showAdvancedDemo = () => {
      const [show, close] = Popup()
      show(
        <div class={styles.advancedPopup}>
          <div class={styles.popupHeader}>
            <h3 class="title title-md">🚀 高级功能演示</h3>
            <p class={styles.popupDesc}>探索 Vue Navigation 的强大功能（Popup 形式）</p>
            <div class={styles.popupNotice}>
              <span class={styles.noticeIcon}>ℹ️</span>
              <span class={styles.noticeText}>此为 Popup 组件，不会切换页面</span>
            </div>
          </div>
          <div class={styles.advancedContent}>
            <div class={styles.featureGrid}>
              <div
                class={styles.featureCard}
                onClick={() => {
                  close()
                  useToast('🎬 动画效果演示')
                }}
              >
                <span class={styles.featureCardIcon}>🎬</span>
                <h4>转场动画</h4>
                <p>丰富的页面转场效果</p>
              </div>

              <div
                class={styles.featureCard}
                onClick={() => {
                  close()
                  useToast('🔄 生命周期钩子演示')
                }}
              >
                <span class={styles.featureCardIcon}>🔄</span>
                <h4>生命周期</h4>
                <p>页面生命周期管理</p>
              </div>

              <div
                class={styles.featureCard}
                onClick={() => {
                  close()
                  useToast('💾 状态管理演示')
                }}
              >
                <span class={styles.featureCardIcon}>💾</span>
                <h4>状态管理</h4>
                <p>页面状态持久化</p>
              </div>

              <div
                class={styles.featureCard}
                onClick={() => {
                  close()
                  useToast('🎨 主题定制演示')
                }}
              >
                <span class={styles.featureCardIcon}>🎨</span>
                <h4>主题定制</h4>
                <p>灵活的样式配置</p>
              </div>
            </div>
          </div>
          <div class={styles.popupFooter}>
            <button class="btn btn-outline" onClick={close}>
              关闭
            </button>
          </div>
        </div>,
      )
    }

    const showDataDemo = () => {
      push(
        <SidePage position="right" onClickBack={back}>
          <div class={styles.dataDemoContent}>
            <h3 class="title title-md">📊 数据演示</h3>
            <div class={styles.dataStats}>
              <div class={styles.statCard}>
                <div class={styles.statValue}>1.2k</div>
                <div class={styles.statLabel}>下载量</div>
              </div>
              <div class={styles.statCard}>
                <div class={styles.statValue}>98%</div>
                <div class={styles.statLabel}>好评率</div>
              </div>
              <div class={styles.statCard}>
                <div class={styles.statValue}>24</div>
                <div class={styles.statLabel}>组件数</div>
              </div>
            </div>
            <div class={styles.chartPlaceholder}>
              <div class={styles.chartBar} style="height: 60%"></div>
              <div class={styles.chartBar} style="height: 80%"></div>
              <div class={styles.chartBar} style="height: 45%"></div>
              <div class={styles.chartBar} style="height: 90%"></div>
              <div class={styles.chartBar} style="height: 70%"></div>
            </div>
          </div>
        </SidePage>,
      )
    }

    return () => (
      <NavPage class={styles.container}>
        {/* 头部 */}
        <div class={styles.appHeader}>
          <div class={styles.headerTop}>
            <h1 class={styles.appTitle}>� Vue Navigation</h1>
            <div class={styles.userSection}>
              {userInfo.value ? (
                <div class={styles.userInfo} onClick={handleLogout}>
                  <img
                    class={styles.avatar}
                    src={userInfo.value.avatar}
                    alt="头像"
                  />
                  <span class={styles.username}>{userInfo.value.username}</span>
                </div>
              ) : (
                <button class="btn btn-ghost" onClick={showLogin}>
                  <span>�</span>
                  登录
                </button>
              )}
            </div>
          </div>

          <p class={styles.appDesc}>现代化的 Vue.js 路由导航解决方案</p>

          {userInfo.value && (
            <div class={styles.welcomeMessage}>
              <span class={styles.welcomeIcon}>👋</span>
              <span>欢迎回来，{userInfo.value.username}！</span>
            </div>
          )}
        </div>

        <div class={styles.appContent}>
          {/* 快捷功能区 */}
          <div class={styles.quickActions}>
            <button
              class={`${styles.quickAction} ${styles.primaryAction}`}
              onClick={() => push(<DetailPage />)}
            >
              <div class={styles.actionIcon}>�</div>
              <span class={styles.actionText}>产品详情</span>
              <span class={styles.actionDesc}>体验页面转场</span>
            </button>

            <button class={styles.quickAction} onClick={showLoadingDemo}>
              <div class={styles.actionIcon}>⏳</div>
              <span class={styles.actionText}>加载演示</span>
            </button>

            <button class={styles.quickAction} onClick={showDemoPopup}>
              <div class={styles.actionIcon}>�</div>
              <span class={styles.actionText}>Popup 弹窗</span>
            </button>

            <button class={styles.quickAction} onClick={showToastDemo}>
              <div class={styles.actionIcon}>💬</div>
              <span class={styles.actionText}>消息提示</span>
            </button>
          </div>

          {/* 组件对比说明区 */}
          <div class={`card ${styles.section}`}>
            <div class={styles.sectionHeader}>
              <h2 class="title title-md">📚 组件对比</h2>
              <div class={styles.componentTags}>
                <span class={styles.tag}>Popup 🌆 = 覆盖层</span>
                <span class={styles.tag}>SidePage 📱 = 页面切换</span>
              </div>
            </div>
            <p class={styles.sectionDesc}>
              Popup 只是覆盖层显示，不会触发页面切换。SidePage 会触发完整的页面切换和生命周期管理。
            </p>
          </div>

          {/* SidePage 功能演示区 */}
          <div class={`card ${styles.section}`}>
            <h2 class="title title-md">� SidePage 演示</h2>
            <p class={styles.sectionDesc}>体验不同方向的侧边页面效果（会触发页面切换）</p>
            <div class={styles.directionGrid}>
              <button
                class="btn btn-ghost"
                onClick={showSidePage('top', '顶部')}
              >
                <span>⬆️</span>
                顶部
              </button>
              <button
                class="btn btn-ghost"
                onClick={showSidePage('bottom', '底部')}
              >
                <span>⬇️</span>
                底部
              </button>
              <button
                class="btn btn-ghost"
                onClick={showSidePage('left', '左侧')}
              >
                <span>⬅️</span>
                左侧
              </button>
              <button
                class="btn btn-ghost"
                onClick={showSidePage('right', '右侧')}
              >
                <span>➡️</span>
                右侧
              </button>
              <button
                class="btn btn-outline"
                onClick={showSidePage('center', '中央')}
              >
                <span>🎯</span>
                中央
              </button>
            </div>
          </div>

          {/* 更多演示 */}
          <div class={`card ${styles.section}`}>
            <h2 class="title title-md">🎨 更多功能</h2>
            <p class={styles.sectionDesc}>探索更多强大功能</p>
            <div class={styles.moreActionsGrid}>
              <button class="btn btn-secondary" onClick={showToastDemo}>
                🎉 消息提示
              </button>

              <button class="btn btn-outline" onClick={showAdvancedDemo}>
                🚀 高级功能
              </button>

              <button class="btn btn-gradient" onClick={showDataDemo}>
                📊 数据演示
              </button>
            </div>
          </div>

          {/* 特性介绍 */}
          <div class={`card ${styles.featuresCard}`}>
            <h3 class="title title-md">✨ 核心特性</h3>
            <div class={styles.featuresList}>
              <div class={styles.featureItem}>
                <span class={styles.featureIcon}>🎯</span>
                <div>
                  <h4>简单易用</h4>
                  <p>直观的 API 设计</p>
                </div>
              </div>
              <div class={styles.featureItem}>
                <span class={styles.featureIcon}>⚡</span>
                <div>
                  <h4>高性能</h4>
                  <p>流畅的用户体验</p>
                </div>
              </div>
              <div class={styles.featureItem}>
                <span class={styles.featureIcon}>🎨</span>
                <div>
                  <h4>丰富动画</h4>
                  <p>多种转场效果</p>
                </div>
              </div>
              <div class={styles.featureItem}>
                <span class={styles.featureIcon}>🔧</span>
                <div>
                  <h4>高度定制</h4>
                  <p>灵活的配置选项</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部导航 */}
        <div class={styles.appBottomNav}>
          <div class={styles.navItem}>
            <span class={styles.navIcon}>🏠</span>
            <span class={styles.navText}>首页</span>
          </div>
          <div class={styles.navItem}>
            <span class={styles.navIcon}>🔍</span>
            <span class={styles.navText}>发现</span>
          </div>
          <div class={styles.navItem}>
            <span class={styles.navIcon}>❤️</span>
            <span class={styles.navText}>喜欢</span>
          </div>
          <div class={styles.navItem}>
            <span class={styles.navIcon}>👤</span>
            <span class={styles.navText}>我的</span>
          </div>
        </div>
      </NavPage>
    )
  },
})

export default Component
