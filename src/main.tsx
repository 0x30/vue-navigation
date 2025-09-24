import { createApp } from 'vue'

import Home from './views/home'

import { navigation, onPageChange } from '@0x30/vue-navigation'

// 引入全局样式
import './styles/global.scss'

// or use this mode
// createApp(
//   <Navigator>
//     <Home />
//   </Navigator>
// ).mount('#app')

createApp(<Home />)
  .use(navigation as any)
  .mount('#app')

onPageChange(
  (from, to) => {
    console.log('页面变化', from, to)
  },
  { isEvery: true },
)
