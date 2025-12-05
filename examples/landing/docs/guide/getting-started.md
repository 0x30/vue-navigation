# 快速开始

## 安装

::: code-group

```bash [Vue]
pnpm add @0x30/navigation-vue animejs
```

```bash [React]
pnpm add @0x30/navigation-react animejs
```

:::

## 基础使用

### Vue

```tsx
// main.tsx
import { createApp } from 'vue'
import { Navigator } from '@0x30/navigation-vue'
import Home from './views/Home'

createApp(() => <Navigator homePage={<Home />} />).mount('#app')
```

```tsx
// views/Home.tsx
import { defineComponent } from 'vue'
import { NavPage, push } from '@0x30/navigation-vue'
import Detail from './Detail'

export default defineComponent({
  setup() {
    const goDetail = () => {
      push(<Detail id={1} />)
    }

    return () => (
      <NavPage>
        <h1>首页</h1>
        <button onClick={goDetail}>查看详情</button>
      </NavPage>
    )
  }
})
```

### React

```tsx
// main.tsx
import { createRoot } from 'react-dom/client'
import { Navigator } from '@0x30/navigation-react'
import Home from './views/Home'

createRoot(document.getElementById('root')!).render(
  <Navigator homePage={<Home />} />
)
```

```tsx
// views/Home.tsx
import { NavPage, push } from '@0x30/navigation-react'
import Detail from './Detail'

export default function Home() {
  const goDetail = () => {
    push(<Detail id={1} />)
  }

  return (
    <NavPage>
      <h1>首页</h1>
      <button onClick={goDetail}>查看详情</button>
    </NavPage>
  )
}
```

## 页面导航

```tsx
import { push, back, replace } from '@0x30/navigation-vue' // 或 navigation-react

// 推入新页面
push(<DetailPage id={1} />)

// 返回上一页
back()

// 替换当前页面
replace(<NewPage />)
```

## 页面组件

### NavPage

带有默认推入/推出动画的页面组件：

```tsx
<NavPage>
  <div>页面内容</div>
</NavPage>
```

### SidePage

侧边弹出页面，支持多种位置：

```tsx
// 从底部弹出
<SidePage position="bottom">
  <div>弹出内容</div>
</SidePage>

// 从右侧滑出
<SidePage position="right">
  <div>抽屉内容</div>
</SidePage>

// 居中弹窗
<SidePage position="center">
  <div>弹窗内容</div>
</SidePage>
```

## 下一步

- [导航详解](/guide/navigation) - 了解更多导航方法
- [页面组件](/guide/page-components) - 深入了解页面组件
- [生命周期](/guide/lifecycle) - 掌握页面生命周期
- [API 参考](/api/) - 查看完整 API 文档
