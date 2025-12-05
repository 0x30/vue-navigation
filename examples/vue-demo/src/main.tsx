import { createApp } from 'vue'
import { Navigator } from '@0x30/navigation-vue'
import Home from './views/Home'
import './styles/global.scss'

// 使用 Navigator 初始化首页
createApp(
  <Navigator>
    <Home />
  </Navigator>
).mount('#app')
