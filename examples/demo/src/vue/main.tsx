import { push } from '@0x30/navigation-vue'
import Home from './views/Home'
import '../styles/vue.scss'

// 推入首页（第一次 push 会自动初始化）
push(<Home />)
