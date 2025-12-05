# Navigator

导航根容器组件，应用的入口点。

## 签名

::: code-group

```tsx [Vue]
<Navigator homePage={<HomePage />} />
```

```tsx [React]
<Navigator homePage={<HomePage />} />
```

:::

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `homePage` | `ReactNode \| VNode` | ✅ | 首页组件 |

## 示例

### Vue

```tsx
// main.tsx
import { createApp } from 'vue'
import { Navigator } from '@0x30/navigation-vue'
import Home from './views/Home'

createApp(() => <Navigator homePage={<Home />} />).mount('#app')
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

## 注意事项

- Navigator 应该是应用的最外层组件
- 首页会自动成为页面栈的第一个页面
- 首页不能通过 back 返回（因为没有上一页）
