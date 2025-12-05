import { type FC } from 'react'
import { NavPage, back, push, SidePage, useQuietPage, Page, showLoading, hideLoading, showSuccess, showError, showToast } from '@0x30/navigation-react'
import styles from './ComponentsDemo.module.scss'

// 底部弹出组件演示
const BottomSheet: FC = () => {
  useQuietPage()
  return (
    <SidePage position="bottom" onClickBack={back}>
      <div className={styles.bottomSheet}>
        <div className={styles.sheetHeader}>
          <span>底部弹出</span>
          <span className={styles.closeBtn} onClick={() => back()}>✕</span>
        </div>
        <div className={styles.sheetContent}>
          <p>这是一个从底部弹出的组件</p>
          <p>支持多种位置：bottom, top, left, right, center</p>
        </div>
      </div>
    </SidePage>
  )
}

// 右侧滑出组件演示
const RightDrawer: FC = () => {
  useQuietPage()
  return (
    <SidePage position="right" onClickBack={back}>
      <div className={styles.rightDrawer}>
        <div className={styles.drawerHeader}>
          <span className={styles.backBtn} onClick={() => back()}>‹</span>
          <span>右侧抽屉</span>
        </div>
        <div className={styles.drawerContent}>
          <p>从右侧滑入的抽屉组件</p>
          <p>点击遮罩或返回按钮关闭</p>
        </div>
      </div>
    </SidePage>
  )
}

// 中心弹窗组件演示
const CenterModal: FC = () => {
  useQuietPage()
  return (
    <SidePage position="center" onClickBack={back}>
      <div className={styles.centerModal}>
        <div className={styles.modalHeader}>提示</div>
        <div className={styles.modalContent}>
          这是一个居中弹窗，带有弹性动画效果
        </div>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={() => back()}>取消</button>
          <button className={styles.confirmBtn} onClick={() => {
            showToast('已确认')
            back()
          }}>确认</button>
        </div>
      </div>
    </SidePage>
  )
}

// 普通页面演示
const SimplePage: FC = () => {
  return (
    <Page className={styles.simplePage}>
      <div className={styles.simpleHeader}>
        <span className={styles.backBtn} onClick={() => back()}>‹ 返回</span>
        <span>普通页面</span>
      </div>
      <div className={styles.simpleContent}>
        <p>这是使用 Page 组件的普通页面</p>
        <p>没有默认的进入/退出动画</p>
        <p>可以自定义动画效果</p>
      </div>
    </Page>
  )
}

const ComponentsDemo: FC = () => {
  const handleShowLoading = async () => {
    showLoading('加载中...')
    await new Promise(r => setTimeout(r, 1500))
    hideLoading()
  }

  const handleShowSuccess = () => {
    showSuccess('操作成功')
  }

  const handleShowError = () => {
    showError('操作失败')
  }

  const handleShowToast = () => {
    showToast('这是一条 Toast 消息')
  }

  return (
    <NavPage className={styles.container}>
      <div className={styles.header}>
        <span className={styles.backBtn} onClick={() => back()}>‹ 返回</span>
        <span className={styles.title}>组件演示</span>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>页面组件</div>
          <div className={styles.item} onClick={() => push(<BottomSheet />)}>
            <span>📤 SidePage (bottom)</span>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.item} onClick={() => push(<RightDrawer />)}>
            <span>📥 SidePage (right)</span>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.item} onClick={() => push(<CenterModal />)}>
            <span>💬 SidePage (center)</span>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.item} onClick={() => push(<SimplePage />)}>
            <span>📄 Page (无动画)</span>
            <span className={styles.arrow}>›</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Loading 组件</div>
          <div className={styles.item} onClick={handleShowLoading}>
            <span>⏳ 显示 Loading</span>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.item} onClick={handleShowSuccess}>
            <span>✅ 显示成功</span>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.item} onClick={handleShowError}>
            <span>❌ 显示失败</span>
            <span className={styles.arrow}>›</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Toast 组件</div>
          <div className={styles.item} onClick={handleShowToast}>
            <span>💬 显示 Toast</span>
            <span className={styles.arrow}>›</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>功能说明</div>
          <div className={styles.desc}>
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
}

export default ComponentsDemo
