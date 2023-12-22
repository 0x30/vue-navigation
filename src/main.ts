import { createApp } from 'vue'
import './style.css'
import App from './App'
import { navigation, onPageChange } from '@0x30/vue-navigation'

createApp(App).use(navigation).mount('#app')

onPageChange((from, to) => {
  console.log('页面变化', from, to)
})
