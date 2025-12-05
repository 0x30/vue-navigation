# SidePage

侧边弹出页面组件，支持多种弹出位置和自定义动画。

## 使用

::: code-group

```tsx [Vue]
import { SidePage, back } from '@0x30/navigation-vue'

<SidePage position="bottom" onClickBack={back}>
  <div class="sheet">底部弹出内容</div>
</SidePage>
```

```tsx [React]
import { SidePage, back } from '@0x30/navigation-react'

<SidePage position="bottom" onClickBack={back}>
  <div className="sheet">底部弹出内容</div>
</SidePage>
```

:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `position` | `'bottom' \| 'top' \| 'left' \| 'right' \| 'center'` | `'bottom'` | 弹出位置 |
| `onClickBack` | `() => void` | - | 点击遮罩层回调 |
| `maskOpacity` | `number` | `0.5` | 遮罩层透明度 |
| `onEnter` | `SidePageAnimationHandler` | - | 自定义进入动画 |
| `onLeave` | `SidePageAnimationHandler` | - | 自定义退出动画 |

## 位置效果

### bottom（默认）

从底部向上弹出，适合 ActionSheet、底部表单等：

```tsx
<SidePage position="bottom" onClickBack={back}>
  <div style={{ 
    height: '300px', 
    background: 'white', 
    borderRadius: '12px 12px 0 0' 
  }}>
    内容
  </div>
</SidePage>
```

### right

从右侧滑入，适合抽屉菜单：

```tsx
<SidePage position="right" onClickBack={back}>
  <div style={{ 
    width: '280px', 
    height: '100%', 
    background: 'white' 
  }}>
    抽屉内容
  </div>
</SidePage>
```

### center

居中弹出，适合对话框、弹窗：

```tsx
<SidePage position="center" onClickBack={back}>
  <div style={{ 
    width: '280px', 
    background: 'white', 
    borderRadius: '12px',
    padding: '20px'
  }}>
    弹窗内容
  </div>
</SidePage>
```

### top

从顶部向下弹出：

```tsx
<SidePage position="top" onClickBack={back}>
  <div style={{ height: '200px', background: 'white' }}>
    顶部内容
  </div>
</SidePage>
```

### left

从左侧滑入：

```tsx
<SidePage position="left" onClickBack={back}>
  <div style={{ width: '280px', height: '100%', background: 'white' }}>
    左侧菜单
  </div>
</SidePage>
```

## 自定义动画

```tsx
import { animate } from 'animejs'

<SidePage
  position="center"
  onClickBack={back}
  onEnter={({ contentEl, maskEl }, done) => {
    // 遮罩淡入
    animate(maskEl, { opacity: [0, 0.5], duration: 200 })
    // 内容弹性进入
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
      scale: [1, 0.9],
      duration: 200,
      onComplete: done
    })
  }}
>
  <div>自定义动画弹窗</div>
</SidePage>
```

## SidePageAnimationContext

```tsx
interface SidePageAnimationContext {
  contentEl: HTMLElement  // 内容区域元素
  maskEl: HTMLElement     // 遮罩层元素
}

type SidePageAnimationHandler = (
  context: SidePageAnimationContext,
  done: () => void
) => void
```

## 配合 useQuietPage

通常 SidePage 应该配合 `useQuietPage` 使用，避免触发下层页面生命周期：

```tsx
function MyModal() {
  useQuietPage()
  
  return (
    <SidePage position="center" onClickBack={back}>
      <div>弹窗内容</div>
    </SidePage>
  )
}
```
