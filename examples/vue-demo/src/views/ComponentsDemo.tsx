import { defineComponent, ref, type PropType } from 'vue'
import { 
  NavPage, back, push, SidePage, useQuietPage, Page, 
  showLoading, hideLoading, showSuccess, showError, showToast,
  useLeaveBefore, blackBoxBack,
  onWillAppear, onDidAppear, onWillDisappear, onDidDisappear
} from '@0x30/navigation-vue'
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
              showToast('已确认')
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

// useQuietPage 演示 - 安静页面不会触发下层页面的生命周期
const QuietPageDemo = defineComponent({
  setup() {
    useQuietPage()
    return () => (
      <SidePage position="center" onClickBack={back}>
        <div class={styles.centerModal}>
          <div class={styles.modalHeader}>useQuietPage 演示</div>
          <div class={styles.modalContent}>
            <p>这个弹窗使用了 <strong>useQuietPage()</strong></p>
            <p>打开时不会触发下层页面的 onWillDisappear</p>
            <p>关闭时不会触发下层页面的 onWillAppear</p>
            <p>适用于：弹窗、Toast、Loading 等临时覆盖层</p>
          </div>
          <div class={styles.modalActions}>
            <button class={styles.confirmBtn} onClick={() => back()}>关闭</button>
          </div>
        </div>
      </SidePage>
    )
  },
})

// 自定义确认弹窗
const ConfirmModal = defineComponent({
  props: {
    message: { type: String, required: true },
    onConfirm: { type: Function as PropType<() => void>, required: true },
    onCancel: { type: Function as PropType<() => void>, required: true },
  },
  setup(props) {
    useQuietPage()
    return () => (
      <SidePage position="center" onClickBack={props.onCancel}>
        <div class={styles.centerModal}>
          <div class={styles.modalHeader}>确认离开</div>
          <div class={styles.modalContent}>{props.message}</div>
          <div class={styles.modalActions}>
            <button class={styles.cancelBtn} onClick={props.onCancel}>取消</button>
            <button class={styles.confirmBtn} onClick={props.onConfirm}>确认离开</button>
          </div>
        </div>
      </SidePage>
    )
  },
})

// useLeaveBefore 演示 - 离开前拦截
const LeaveBeforeDemo = defineComponent({
  setup() {
    const hasUnsavedChanges = ref(true)
    
    useLeaveBefore(() => {
      if (hasUnsavedChanges.value) {
        return new Promise<boolean>((resolve) => {
          push(
            <ConfirmModal 
              message="有未保存的更改，确定离开吗？" 
              onConfirm={() => {
                back()
                resolve(true)
              }}
              onCancel={() => {
                back()
                resolve(false)
              }}
            />
          )
        })
      }
      return true
    })

    return () => (
      <NavPage class={styles.simplePage}>
        <div class={styles.simpleHeader}>
          <span class={styles.backBtn} onClick={() => back()}>‹ 返回</span>
          <span>useLeaveBefore 演示</span>
        </div>
        <div class={styles.simpleContent}>
          <p>这个页面使用了 <strong>useLeaveBefore()</strong></p>
          <p>尝试返回时会弹出自定义确认弹窗</p>
          <p>适用于：表单编辑、支付流程等需要确认的场景</p>
          <div style={{ marginTop: '20px' }}>
            <label>
              <input 
                type="checkbox" 
                checked={hasUnsavedChanges.value}
                onChange={(e: Event) => hasUnsavedChanges.value = (e.target as HTMLInputElement).checked}
              />
              {' '}模拟有未保存的更改
            </label>
          </div>
        </div>
      </NavPage>
    )
  },
})

// 生命周期演示
const LifecycleDemo = defineComponent({
  setup() {
    const logs = ref<string[]>([])
    
    const addLog = (msg: string) => {
      logs.value.push(`${new Date().toLocaleTimeString()} - ${msg}`)
    }

    onWillAppear(() => addLog('onWillAppear'))
    onDidAppear(() => addLog('onDidAppear'))
    onWillDisappear(() => addLog('onWillDisappear'))
    onDidDisappear(() => addLog('onDidDisappear'))

    return () => (
      <NavPage class={styles.simplePage}>
        <div class={styles.simpleHeader}>
          <span class={styles.backBtn} onClick={() => back()}>‹ 返回</span>
          <span>生命周期演示</span>
        </div>
        <div class={styles.simpleContent}>
          <p>页面生命周期钩子：</p>
          <ul style={{ textAlign: 'left', marginTop: '10px' }}>
            <li><strong>onWillAppear</strong>: 页面即将显示</li>
            <li><strong>onDidAppear</strong>: 页面已经显示</li>
            <li><strong>onWillDisappear</strong>: 页面即将消失</li>
            <li><strong>onDidDisappear</strong>: 页面已经消失</li>
          </ul>
          <div class={styles.logBox}>
            {logs.value.length === 0 
              ? <p style={{ color: '#999' }}>暂无日志，打开其他页面再返回试试</p>
              : logs.value.map((log, i) => <p key={i}>{log}</p>)
            }
          </div>
          <button 
            class={styles.confirmBtn} 
            style={{ marginTop: '10px' }}
            onClick={() => push(<QuietPageDemo />)}
          >
            打开安静页面（不触发生命周期）
          </button>
        </div>
      </NavPage>
    )
  },
})

// blackBoxBack 演示 - 第二层页面
const BlackBoxBackPage2 = defineComponent({
  setup() {
    return () => (
      <NavPage class={styles.simplePage}>
        <div class={styles.simpleHeader}>
          <span class={styles.backBtn} onClick={() => back()}>‹ 返回</span>
          <span>blackBoxBack 第二层</span>
        </div>
        <div class={styles.simpleContent}>
          <p>当前页面栈：首页 → 组件演示 → 第一层 → <strong>第二层（当前）</strong></p>
          <p style={{ marginTop: '16px' }}>点击下方按钮测试 blackBoxBack：</p>
          <button 
            class={styles.confirmBtn}
            style={{ marginTop: '12px' }}
            onClick={() => blackBoxBack(1)}
          >
            blackBoxBack(1) - 静默返回1层
          </button>
          <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
            效果：跳过第一层，直接回到组件演示页
          </p>
          <button 
            class={styles.confirmBtn}
            style={{ marginTop: '16px' }}
            onClick={() => blackBoxBack(2)}
          >
            blackBoxBack(2) - 静默返回2层
          </button>
          <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
            效果：跳过第一层和组件演示页，直接回到首页
          </p>
        </div>
      </NavPage>
    )
  },
})

// blackBoxBack 演示 - 第一层页面
const BlackBoxBackDemo = defineComponent({
  setup() {
    return () => (
      <NavPage class={styles.simplePage}>
        <div class={styles.simpleHeader}>
          <span class={styles.backBtn} onClick={() => back()}>‹ 返回</span>
          <span>blackBoxBack 第一层</span>
        </div>
        <div class={styles.simpleContent}>
          <p>当前页面栈：首页 → 组件演示 → <strong>第一层（当前）</strong></p>
          <p style={{ marginTop: '16px' }}>
            <strong>blackBoxBack(n)</strong> 可以静默返回 n 层页面，
            中间的页面会被直接移除，不会触发动画和生命周期。
          </p>
          <button 
            class={styles.confirmBtn}
            style={{ marginTop: '20px' }}
            onClick={() => push(<BlackBoxBackPage2 />)}
          >
            进入第二层 →
          </button>
        </div>
      </NavPage>
    )
  },
})

export default defineComponent({
  name: 'ComponentsDemo',
  setup() {
    const handleShowLoading = async () => {
      await showLoading('加载中...')
      await new Promise(r => setTimeout(r, 1500))
      await hideLoading()
    }

    // 演示 LoadingInstance API
    const handleShowLoadingWithInstance = async () => {
      const instance = await showLoading('正在提交...')
      
      // 模拟进度更新
      await new Promise(r => setTimeout(r, 1000))
      instance.setMessage('处理数据中...')
      
      await new Promise(r => setTimeout(r, 1000))
      instance.setMessage('即将完成...')
      
      await new Promise(r => setTimeout(r, 500))
      instance.success('提交成功！')
    }

    // 演示错误状态
    const handleShowLoadingWithError = async () => {
      const instance = await showLoading('正在验证...')
      
      await new Promise(r => setTimeout(r, 1500))
      instance.error('验证失败')
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
            <div class={styles.sectionTitle}>Hooks API</div>
            <div class={styles.item} onClick={() => push(<QuietPageDemo />)}>
              <span>🔇 useQuietPage</span>
              <span class={styles.arrow}>›</span>
            </div>
            <div class={styles.item} onClick={() => push(<LeaveBeforeDemo />)}>
              <span>🚫 useLeaveBefore</span>
              <span class={styles.arrow}>›</span>
            </div>
            <div class={styles.item} onClick={() => push(<LifecycleDemo />)}>
              <span>🔄 生命周期钩子</span>
              <span class={styles.arrow}>›</span>
            </div>
            <div class={styles.item} onClick={() => push(<BlackBoxBackDemo />)}>
              <span>⚡ blackBoxBack</span>
              <span class={styles.arrow}>›</span>
            </div>
          </div>

          <div class={styles.section}>
            <div class={styles.sectionTitle}>Loading 组件</div>
            <div class={styles.item} onClick={handleShowLoading}>
              <span>⏳ 基础 Loading</span>
              <span class={styles.arrow}>›</span>
            </div>
            <div class={styles.item} onClick={handleShowLoadingWithInstance}>
              <span>📊 Loading + 状态更新</span>
              <span class={styles.arrow}>›</span>
            </div>
            <div class={styles.item} onClick={handleShowLoadingWithError}>
              <span>⚠️ Loading + 错误</span>
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
            <div class={styles.sectionTitle}>API 说明</div>
            <div class={styles.desc}>
              <p>• <strong>showLoading(msg)</strong>: 返回 LoadingInstance</p>
              <p>• <strong>instance.setMessage(msg)</strong>: 更新消息</p>
              <p>• <strong>instance.success(msg)</strong>: 显示成功后关闭</p>
              <p>• <strong>instance.error(msg)</strong>: 显示错误后关闭</p>
              <p>• <strong>instance.hide()</strong>: 直接关闭</p>
              <p>• <strong>showToast(msg, duration?)</strong>: 显示轻提示</p>
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
