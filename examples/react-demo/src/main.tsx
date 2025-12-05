import { createRoot } from 'react-dom/client'
import { Navigator } from '@0x30/navigation-react'
import Home from './views/Home'
import './styles/global.scss'

createRoot(document.getElementById('root')!).render(
  <Navigator>
    <Home />
  </Navigator>
)
