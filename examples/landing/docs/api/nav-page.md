# NavPage

带有默认推入/推出动画的页面组件。

## 使用

::: code-group

```tsx [Vue]
import { NavPage } from '@0x30/navigation-vue'

<NavPage class="my-page">
  <header>标题</header>
  <main>内容</main>
</NavPage>
```

```tsx [React]
import { NavPage } from '@0x30/navigation-react'

<NavPage className="my-page">
  <header>标题</header>
  <main>内容</main>
</NavPage>
```

:::

## Props

| 属性 | 类型 | 说明 |
|------|------|------|
| `class` / `className` | `string` | 自定义样式类 |
| `style` | `CSSProperties` | 内联样式 |
| `children` | `ReactNode \| VNode` | 页面内容 |

## 默认动画

NavPage 自带以下默认动画：

- **进入动画**: 从右侧滑入
- **退出动画**: 向右侧滑出
- **支持手势**: 从左边缘滑动返回

## 样式

NavPage 默认样式：

```css
.nav-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: white;
}
```

## 自定义动画

使用 `useTransitionEnter` 和 `useTransitionLeave` 覆盖默认动画：

```tsx
import { NavPage, useTransitionEnter, useTransitionLeave } from '@0x30/navigation-vue'
import { animate } from 'animejs'

function CustomPage() {
  useTransitionEnter((el, done) => {
    animate(el, {
      opacity: [0, 1],
      duration: 300,
      onComplete: done
    })
  })

  useTransitionLeave((el, done) => {
    animate(el, {
      opacity: [1, 0],
      duration: 200,
      onComplete: done
    })
  })

  return <NavPage>自定义动画页面</NavPage>
}
```
