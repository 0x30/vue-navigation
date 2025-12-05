# Page

基础页面组件，没有默认动画。

## 使用

::: code-group

```tsx [Vue]
import { Page } from '@0x30/navigation-vue'

<Page class="my-page">
  <div>页面内容</div>
</Page>
```

```tsx [React]
import { Page } from '@0x30/navigation-react'

<Page className="my-page">
  <div>页面内容</div>
</Page>
```

:::

## Props

| 属性 | 类型 | 说明 |
|------|------|------|
| `class` / `className` | `string` | 自定义样式类 |
| `style` | `CSSProperties` | 内联样式 |
| `children` | `ReactNode \| VNode` | 页面内容 |

## 与 NavPage 的区别

| 特性 | Page | NavPage |
|------|------|---------|
| 默认动画 | 无 | 滑入/滑出 |
| 手势返回 | 需要自行处理 | 自动支持 |
| 适用场景 | 自定义动画 | 标准页面 |

## 自定义动画

Page 没有默认动画，需要使用 hooks 添加：

```tsx
import { Page, useTransitionEnter, useTransitionLeave } from '@0x30/navigation-vue'
import { animate } from 'animejs'

function FadePage() {
  useTransitionEnter((el, done) => {
    animate(el, {
      opacity: [0, 1],
      duration: 400,
      ease: 'easeOutQuad',
      onComplete: done
    })
  })

  useTransitionLeave((el, done) => {
    animate(el, {
      opacity: [1, 0],
      duration: 300,
      ease: 'easeInQuad',
      onComplete: done
    })
  })

  return <Page>淡入淡出页面</Page>
}
```

## 样式

Page 默认样式：

```css
.page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
```
