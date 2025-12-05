import { createApp, defineComponent } from 'vue'
import { push, LoadingContainer, ToastContainer } from '@0x30/navigation-vue'
import Home from './views/Home'
import './styles/global.scss'

// 创建全局组件容器
const GlobalComponents = defineComponent({
  name: 'GlobalComponents',
  setup: () => () => (
    <>
      <LoadingContainer />
      <ToastContainer />
    </>
  ),
})

// 渲染全局组件
const globalContainer = document.createElement('div')
globalContainer.id = 'global-components'
document.body.appendChild(globalContainer)
createApp(GlobalComponents).mount(globalContainer)

// 推入首页（第一次 push 会自动初始化）
push(<Home />)
