# Safearea

安全区域组件，用于适配刘海屏等设备。

## 组件列表

| 组件 | 说明 |
|------|------|
| `SafeTopSpace` | 顶部安全区域 |
| `SafeBottomSpace` | 底部安全区域 |
| `SafeLeftSpace` | 左侧安全区域 |
| `SafeRightSpace` | 右侧安全区域 |

## 使用

::: code-group

```tsx [Vue]
import { NavPage, SafeTopSpace, SafeBottomSpace } from '@0x30/navigation-vue'

<NavPage>
  <SafeTopSpace />
  <header>页面标题</header>
  <main>页面内容</main>
  <footer>页面底部</footer>
  <SafeBottomSpace />
</NavPage>
```

```tsx [React]
import { NavPage, SafeTopSpace, SafeBottomSpace } from '@0x30/navigation-react'

<NavPage>
  <SafeTopSpace />
  <header>页面标题</header>
  <main>页面内容</main>
  <footer>页面底部</footer>
  <SafeBottomSpace />
</NavPage>
```

:::

## 工作原理

这些组件使用 CSS 环境变量 `env(safe-area-inset-*)` 来获取安全区域的大小：

```css
/* SafeTopSpace */
.safe-top {
  height: env(safe-area-inset-top);
}

/* SafeBottomSpace */
.safe-bottom {
  height: env(safe-area-inset-bottom);
}

/* SafeLeftSpace */
.safe-left {
  width: env(safe-area-inset-left);
}

/* SafeRightSpace */
.safe-right {
  width: env(safe-area-inset-right);
}
```

## 适用场景

### 底部导航栏

```tsx
<NavPage>
  <main style={{ flex: 1 }}>内容</main>
  <nav class="tab-bar">
    <div>首页</div>
    <div>我的</div>
  </nav>
  <SafeBottomSpace />
</NavPage>
```

### 全屏页面

```tsx
<NavPage>
  <SafeTopSpace />
  <div class="full-screen-content">
    全屏内容
  </div>
  <SafeBottomSpace />
</NavPage>
```

## 注意事项

- 需要在 HTML 中设置 `viewport-fit=cover`：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

- 在不支持安全区域的设备上，这些组件的高度/宽度为 0
