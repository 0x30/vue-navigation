# 页面组件

Navigation 提供了多种页面组件，用于不同的场景。

## NavPage

带有默认推入/推出动画的标准页面组件。

::: code-group

```tsx [Vue]
import { NavPage } from '@0x30/navigation-vue'

<NavPage class="my-page">
  <header>页面标题</header>
  <main>页面内容</main>
</NavPage>
```

```tsx [React]
import { NavPage } from '@0x30/navigation-react'

<NavPage className="my-page">
  <header>页面标题</header>
  <main>页面内容</main>
</NavPage>
```

:::

### 特点

- 自动填充整个视口
- 带有从右向左的推入动画
- 带有从左向右的推出动画
- 支持手势返回

## Page

基础页面组件，没有默认动画。

::: code-group

```tsx [Vue]
import { Page } from '@0x30/navigation-vue'

<Page class="my-page">
  <div>自定义页面内容</div>
</Page>
```

```tsx [React]
import { Page } from '@0x30/navigation-react'

<Page className="my-page">
  <div>自定义页面内容</div>
</Page>
```

:::

### 特点

- 自动填充整个视口
- 无默认动画
- 可配合 `useTransitionEnter` / `useTransitionLeave` 自定义动画

## SidePage

侧边弹出页面，支持多种弹出位置。

::: code-group

```tsx [Vue]
import { SidePage, back } from '@0x30/navigation-vue'

<SidePage position="bottom" onClickBack={back}>
  <div class="sheet">
    <h2>底部弹出</h2>
    <p>内容区域</p>
  </div>
</SidePage>
```

```tsx [React]
import { SidePage, back } from '@0x30/navigation-react'

<SidePage position="bottom" onClickBack={back}>
  <div className="sheet">
    <h2>底部弹出</h2>
    <p>内容区域</p>
  </div>
</SidePage>
```

:::

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `position` | `'bottom' \| 'top' \| 'left' \| 'right' \| 'center'` | `'bottom'` | 弹出位置 |
| `onClickBack` | `() => void` | - | 点击遮罩层回调 |
| `maskOpacity` | `number` | `0.5` | 遮罩层透明度 |
| `onEnter` | `SidePageAnimationHandler` | - | 自定义进入动画 |
| `onLeave` | `SidePageAnimationHandler` | - | 自定义退出动画 |

### 位置示例

::: code-group

```tsx [Vue]
// 底部弹出（ActionSheet 风格）
<SidePage position="bottom">
  <div style={{ height: '300px', background: 'white', borderRadius: '12px 12px 0 0' }}>
    底部内容
  </div>
</SidePage>

// 右侧抽屉
<SidePage position="right">
  <div style={{ width: '280px', height: '100%', background: 'white' }}>
    抽屉内容
  </div>
</SidePage>

// 居中弹窗
<SidePage position="center">
  <div style={{ width: '280px', background: 'white', borderRadius: '12px', padding: '20px' }}>
    弹窗内容
  </div>
</SidePage>
```

```tsx [React]
// 底部弹出（ActionSheet 风格）
<SidePage position="bottom">
  <div style={{ height: '300px', background: 'white', borderRadius: '12px 12px 0 0' }}>
    底部内容
  </div>
</SidePage>

// 右侧抽屉
<SidePage position="right">
  <div style={{ width: '280px', height: '100%', background: 'white' }}>
    抽屉内容
  </div>
</SidePage>

// 居中弹窗
<SidePage position="center">
  <div style={{ width: '280px', background: 'white', borderRadius: '12px', padding: '20px' }}>
    弹窗内容
  </div>
</SidePage>
```

:::

### 自定义动画

::: code-group

```tsx [Vue]
import { animate } from 'animejs'

<SidePage
  position="center"
  onEnter={({ contentEl, maskEl }, done) => {
    animate(maskEl, { opacity: [0, 0.5], duration: 300 })
    animate(contentEl, {
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 400,
      ease: 'outElastic',
      onComplete: done
    })
  }}
  onLeave={({ contentEl, maskEl }, done) => {
    animate(maskEl, { opacity: [0.5, 0], duration: 200 })
    animate(contentEl, {
      opacity: [1, 0],
      scale: [1, 0.8],
      duration: 200,
      onComplete: done
    })
  }}
>
  <div>自定义动画弹窗</div>
</SidePage>
```

```tsx [React]
import { animate } from 'animejs'

<SidePage
  position="center"
  onEnter={({ contentEl, maskEl }, done) => {
    animate(maskEl, { opacity: [0, 0.5], duration: 300 })
    animate(contentEl, {
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 400,
      ease: 'outElastic',
      onComplete: done
    })
  }}
  onLeave={({ contentEl, maskEl }, done) => {
    animate(maskEl, { opacity: [0.5, 0], duration: 200 })
    animate(contentEl, {
      opacity: [1, 0],
      scale: [1, 0.8],
      duration: 200,
      onComplete: done
    })
  }}
>
  <div>自定义动画弹窗</div>
</SidePage>
```

:::

## Safearea 组件

安全区域占位组件，用于适配刘海屏等设备。

::: code-group

```tsx [Vue]
import { SafeTopSpace, SafeBottomSpace } from '@0x30/navigation-vue'

<NavPage>
  <SafeTopSpace />
  <main>页面内容</main>
  <SafeBottomSpace />
</NavPage>
```

```tsx [React]
import { SafeTopSpace, SafeBottomSpace } from '@0x30/navigation-react'

<NavPage>
  <SafeTopSpace />
  <main>页面内容</main>
  <SafeBottomSpace />
</NavPage>
```

:::

### 可用组件

- `SafeTopSpace` - 顶部安全区域
- `SafeBottomSpace` - 底部安全区域
- `SafeLeftSpace` - 左侧安全区域
- `SafeRightSpace` - 右侧安全区域
