import { createApp } from 'vue'
import './style.css'

import Home from './views/home'

import { navigation, onPageChange } from '@0x30/vue-navigation'

createApp(Home).use(navigation).mount('#app')

onPageChange((from, to) => {
  console.log('页面变化', from, to)
},{isEvery: true})
