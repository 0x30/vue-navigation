import { createRoot } from 'react-dom/client'
import { 
  initNavigation, 
  push, 
  LoadingContainer, 
  ToastContainer 
} from '@0x30/navigation-react'
import Home from './views/Home'
import '../styles/react.scss'

// 初始化导航
initNavigation()

// 渲染全局组件容器（Loading、Toast）
const globalContainer = document.createElement('div')
globalContainer.id = 'global-components'
document.body.appendChild(globalContainer)

const GlobalComponents = () => (
  <>
    <LoadingContainer />
    <ToastContainer />
  </>
)

createRoot(globalContainer).render(<GlobalComponents />)

// 推入首页
push(<Home />)
