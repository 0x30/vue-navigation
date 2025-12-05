import { defineComponent } from 'vue'
import { NavPage, back, push, SidePage, useQuietPage, Page, showLoading } from '@0x30/navigation-vue'
import { useToast } from '@0x30/navigation-vue'
import styles from './ComponentsDemo.module.scss'

// 底部弹出组件演示
const BottomSheet = defineComponent({
  setup() {
    useQuietPage()
    return () => (
      <SidePage position="bottom" onClickBack={back}>
        <div class={styles.bottomSheet}>
          <div class={styles.sheetHeader}>
            <span>底部弹出</span>
            <span class={styles.closeBtn} onClick={() => back()}>✕</span>
          </div>
          <div class={styles.sheetContent}>
            <p>这是一个从底部弹出的组件</p>
            <p>支持多种位置：bottom, top, left, right, center</p>
          </div>
        </div>
      </SidePage>
    )
  },
})

// 右侧滑出组件演示
const RightDrawer = defineComponent({
  setup() {
    useQuietPage()
    return () => (
      <SidePage position="right" onClickBack={back}>
        <div class={styles.rightDrawer}>
          <div class={styles.drawerHeader}>
            <span class={styles.backBtn} onClick={() => back()}>‹</span>
            <span>右侧抽屉</span>
          </div>
          <div class={styles.drawerContent}>
            <p>从右侧滑入的抽屉组件</p>
            <p>点击遮罩或返回按钮关闭</p>
          </div>
        </div>
      </SidePage>
    )
  },
})

// 中心弹窗组件演示
const CenterModal = defineComponent({
  setup() {
    useQuietPage()
    return () => (
      <SidePage position="center" onClickBack={back}>
        <div class={styles.centerModal}>
          <div class={styles.modalHeader}>提示</div>
          <div class={styles.modalContent}>
            这是一个居中弹窗，带有弹性动画效果
          </div>
          <div class={styles.modalActions}>
            <button class={styles.cancelBtn} onClick={() => back()}>取消</button>
            <button class={styles.confirmBtn} onClick={() => {
              useToast('已确认')
              back()
            }}>确认</button>
          </div>
        </div>
      </SidePage>
    )
  },
})

// 普通页面演示
const SimplePage = defineComponent({
  setup() {
    return () => (
      <Page class={styles.simplePage}>
        <div class={styles.simpleHeader}>
          <span class={styles.backBtn} onClick={() => back()}>‹ 返回</span>
          <span>普通页面</span>
        </div>
        <div class={styles.simpleContent}>
          <p>这是使用 Page 组件的普通页面</p>
          <p>没有默认的进入/退出动画</p>
          <p>可以自定义动画效果</p>
        </div>
      </Page>
    )
  },
})

export default defineComponent({
  name: 'ComponentsDemo',
  setup() {
    const handleShowLoading = async () => {
      showLoading(0, '加载中...')
      await new Promise(r => setTimeout(r, 1500))
      showLoading(3)
    }

    const handleShowSuccess = () => {
      showLoading(1, '操作成功')
    }

    const handleShowError = () => {
      showLoading(2, '操作失败')
    }

    const handleShowToast = () => {
      useToast('这是一条 Toast 消息')
    }

    return () => (
      <NavPage class={styles.container}>
        <div class={styles.header}>
          <span class={styles.backBtn} onClick={() => back()}>‹ 返回</span>
          <span class={styles.title}>组件演示</span>
        </div>

        <div class={styles.content}>
          <div class={styles.section}>
            <div class={styles.sectionTitle}>页面组件</div>
            <div class={styles.item} onClick={() => push(<BottomSheet />)}>
              <span>📤 SidePage (bottom)</span>
              <span class={styles.arrow}>›</span>
            </div>
            <div class={styles.item} onClick={() => push(<RightDrawer />)}>
              <span>📥 SidePage (right)</span>
              <span class={styles.arrow}>›</span>
            </div>
            <div class={styles.item} onClick={() => push(<CenterModal />)}>
              <span>💬 SidePage (center)</span>
              <span class={styles.arrow}>›</span>
            </div>
            <div class={styles.item} onClick={() => push(<SimplePage />)}>
              <span>📄 Page (无动画)</span>
              <span class={styles.arrow}>›</span>
            </div>
          </div>

          <div class={styles.section}>
            <div class={styles.sectionTitle}>Loading 组件</div>
            <div class={styles.item} onClick={handleShowLoading}>
              <span>⏳ 显示 Loading</span>
              <span class={styles.arrow}>›</span>
            </div>
            <div class={styles.item} onClick={handleShowSuccess}>
              <span>✅ 显示成功</span>
              <span class={styles.arrow}>›</span>
            </div>
            <div class={styles.item} onClick={handleShowError}>
              <span>❌ 显示失败</span>
              <span class={styles.arrow}>›</span>
            </div>
          </div>

          <div class={styles.section}>
            <div class={styles.sectionTitle}>Toast 组件</div>
            <div class={styles.item} onClick={handleShowToast}>
              <span>💬 显示 Toast</span>
              <span class={styles.arrow}>›</span>
            </div>
          </div>

          <div class={styles.section}>
            <div class={styles.sectionTitle}>功能说明</div>
            <div class={styles.desc}>
              <p>• <strong>NavPage</strong>: 带有默认推入/推出动画的页面</p>
              <p>• <strong>Page</strong>: 基础页面组件，无默认动画</p>
              <p>• <strong>SidePage</strong>: 侧边弹出页面，支持多种位置</p>
              <p>• <strong>useLeaveBefore</strong>: 离开页面前拦截</p>
              <p>• <strong>useQuietPage</strong>: 安静页面，不触发其他页面生命周期</p>
              <p>• <strong>手势返回</strong>: 从左侧边缘滑动可返回</p>
            </div>
          </div>
        </div>
      </NavPage>
    )
  },
})
