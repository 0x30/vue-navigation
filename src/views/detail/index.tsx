import { defineComponent, ref } from 'vue'
import { NavPage } from '@0x30/vue-navigation-layout'
import { back, useLeaveBefore } from '@0x30/vue-navigation'

import { useConfirm } from '../alert'
import styles from './index.module.scss'
import { useHooks } from '../../util'

const Component = defineComponent({
  name: 'DetailPage',
  setup: () => {
    useHooks('产品详情')

    // 返回的时候先弹出框询问用户
    useLeaveBefore(useConfirm)

    const likeCount = ref(1234)
    const isLiked = ref(false)

    const toggleLike = () => {
      isLiked.value = !isLiked.value
      likeCount.value += isLiked.value ? 1 : -1
    }

    const shareCount = ref(89)
    const commentCount = ref(256)

    const handleShare = () => {
      shareCount.value++
      // 这里可以添加实际的分享逻辑
    }

    return () => (
      <NavPage class={styles.container}>
        <div class={styles.header}>
          <button class="btn btn-ghost" onClick={back}>
            <span>⬅️</span>
            返回
          </button>
          <h1 class="title title-md">Vue Navigation 详情</h1>
          <div class={styles.headerActions}>
            <button class="btn btn-ghost" onClick={handleShare}>
              <span>📤</span>
            </button>
          </div>
        </div>

        <div class={styles.content}>
          <div class={styles.heroSection}>
            <div class={styles.productImage}>
              <div class={styles.imagePlaceholder}>
                <span class={styles.logoIcon}>🚀</span>
              </div>
            </div>

            <div class={styles.productInfo}>
              <h2 class="title title-lg">Vue Navigation</h2>
              <p class={styles.productDesc}>现代化的 Vue.js 路由导航解决方案</p>

              <div class={styles.stats}>
                <div class={styles.statItem}>
                  <span class={styles.statIcon}>⭐</span>
                  <span class={styles.statText}>4.8 评分</span>
                </div>
                <div class={styles.statItem}>
                  <span class={styles.statIcon}>📥</span>
                  <span class={styles.statText}>10k+ 下载</span>
                </div>
                <div class={styles.statItem}>
                  <span class={styles.statIcon}>🔥</span>
                  <span class={styles.statText}>热门推荐</span>
                </div>
              </div>
            </div>
          </div>

          <div class={styles.actionsSection}>
            <button
              class={`btn ${isLiked.value ? 'btn-danger' : 'btn-outline'}`}
              onClick={toggleLike}
            >
              <span>{isLiked.value ? '❤️' : '🤍'}</span>
              {likeCount.value} 点赞
            </button>
            <button class="btn btn-secondary" onClick={handleShare}>
              <span>📤</span>
              {shareCount.value} 分享
            </button>
            <button class="btn btn-success">
              <span>💬</span>
              {commentCount.value} 评论
            </button>
          </div>

          <div class={`card ${styles.featuresSection}`}>
            <h3 class="title title-md">✨ 核心特性</h3>
            <div class={styles.featureList}>
              <div class={styles.featureItem}>
                <div class={styles.featureIcon}>
                  <span>🎯</span>
                </div>
                <div class={styles.featureContent}>
                  <h4>简单易用</h4>
                  <p>直观的 API 设计，快速上手无压力</p>
                </div>
              </div>

              <div class={styles.featureItem}>
                <div class={styles.featureIcon}>
                  <span>⚡</span>
                </div>
                <div class={styles.featureContent}>
                  <h4>高性能</h4>
                  <p>优化的渲染机制，流畅的用户体验</p>
                </div>
              </div>

              <div class={styles.featureItem}>
                <div class={styles.featureIcon}>
                  <span>🎨</span>
                </div>
                <div class={styles.featureContent}>
                  <h4>丰富动画</h4>
                  <p>内置多种转场动画和过渡效果</p>
                </div>
              </div>

              <div class={styles.featureItem}>
                <div class={styles.featureIcon}>
                  <span>🔧</span>
                </div>
                <div class={styles.featureContent}>
                  <h4>高度定制</h4>
                  <p>灵活的配置选项，满足各种需求</p>
                </div>
              </div>
            </div>
          </div>

          <div class={`card ${styles.descSection}`}>
            <h3 class="title title-md">📖 产品介绍</h3>
            <div class={styles.description}>
              <p>
                Vue Navigation 是一个专为 Vue.js 应用设计的现代化路由导航库。
                它提供了丰富的页面转场效果、侧边栏组件、弹窗管理等功能，
                让您的应用拥有更加流畅和专业的用户体验。
              </p>
              <p>
                无论是移动端还是桌面端应用，Vue Navigation 都能为您提供
                最佳的解决方案。简洁的 API 设计让开发变得更加高效，
                而丰富的自定义选项则确保您能打造独特的用户界面。
              </p>
            </div>
          </div>

          <div class={`card ${styles.codeSection}`}>
            <h3 class="title title-md">💻 快速开始</h3>
            <div class={styles.codeBlock}>
              <pre class={styles.code}>
                {`// 安装
npm install @0x30/vue-navigation

// 使用
import { navigation } from '@0x30/vue-navigation'
import { NavPage } from '@0x30/vue-navigation-layout'

createApp(App)
  .use(navigation)
  .mount('#app')`}
              </pre>
            </div>
          </div>
        </div>
      </NavPage>
    )
  },
})

export default Component
