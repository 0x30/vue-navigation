import { cpSync, mkdirSync, rmSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// 输出目录
const dist = resolve(root, 'dist')

// 清理并创建 dist 目录
rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })

// 复制 VitePress 文档到 dist 根目录
cpSync(
  resolve(root, 'examples/landing/docs/.vitepress/dist'),
  dist,
  { recursive: true }
)

// 复制 Vue Demo 到 dist/vue
cpSync(
  resolve(root, 'examples/vue-demo/dist'),
  resolve(dist, 'vue'),
  { recursive: true }
)

// 复制 React Demo 到 dist/react  
cpSync(
  resolve(root, 'examples/react-demo/dist'),
  resolve(dist, 'react'),
  { recursive: true }
)

console.log('✅ Build merged to dist/')
console.log('   - /           → VitePress docs')
console.log('   - /vue        → Vue Demo')
console.log('   - /react      → React Demo')
