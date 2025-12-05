# Navigator

导航根容器组件，应用的入口点。

## 签名

::: code-group

```tsx [Vue]
<Navigator>
  <HomePage />
</Navigator>
```

```tsx [React]
<Navigator>
  <HomePage />
</Navigator>
```

:::

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `children` | `ReactNode` | ✅ | 首页组件（React） |
| `default slot` | `VNode` | ✅ | 首页组件（Vue） |

## 示例

### Vue

```tsx
// main.tsx
import { createApp } from 'vue'
import { Navigator } from '@0x30/navigation-vue'
import Home from './views/Home'

createApp(() => (
  <Navigator>
    <Home />
  </Navigator>
)).mount('#app')
```

### React

```tsx
// main.tsx
import { createRoot } from 'react-dom/client'
import { Navigator } from '@0x30/navigation-react'
import Home from './views/Home'

createRoot(document.getElementById('root')!).render(
  <Navigator>
    <Home />
  </Navigator>
)
```

## 注意事项

- Navigator 应该是应用的最外层组件
- 首页会自动成为页面栈的第一个页面
- 首页不能通过 back 返回（因为没有上一页）
