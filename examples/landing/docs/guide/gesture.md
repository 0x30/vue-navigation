# 手势返回

Navigation 内置了原生级的手势返回支持，从屏幕左边缘向右滑动即可触发返回。

## 基础使用

手势返回默认启用，无需额外配置。

::: code-group

```tsx [Vue]
import { NavPage } from '@0x30/navigation-vue'

// NavPage 自动支持手势返回
<NavPage>
  <div>从左边缘向右滑动返回上一页</div>
</NavPage>
```

```tsx [React]
import { NavPage } from '@0x30/navigation-react'

// NavPage 自动支持手势返回
<NavPage>
  <div>从左边缘向右滑动返回上一页</div>
</NavPage>
```

:::

## useProgressExitAnimated

获取手势返回的进度，实现跟手动画。

::: code-group

```tsx [Vue]
import { defineComponent, ref } from 'vue'
import { useProgressExitAnimated, NavPage } from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    const progress = ref(0)
    
    useProgressExitAnimated((p) => {
      progress.value = p
      // p: 0 ~ 1，表示返回手势的进度
      // 0: 未开始
      // 1: 完成返回
    })

    return () => (
      <NavPage style={{ opacity: 1 - progress.value * 0.3 }}>
        <div>拖动进度: {(progress.value * 100).toFixed(0)}%</div>
      </NavPage>
    )
  }
})
```

```tsx [React]
import { useState } from 'react'
import { useProgressExitAnimated, NavPage } from '@0x30/navigation-react'

function DetailPage() {
  const [progress, setProgress] = useState(0)
  
  useProgressExitAnimated((p) => {
    setProgress(p)
    // p: 0 ~ 1，表示返回手势的进度
    // 0: 未开始
    // 1: 完成返回
  })

  return (
    <NavPage style={{ opacity: 1 - progress * 0.3 }}>
      <div>拖动进度: {(progress * 100).toFixed(0)}%</div>
    </NavPage>
  )
}
```

:::

### 回调参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `progress` | `number` | 手势进度，0 ~ 1 |

### 使用场景

- 页面透明度渐变
- 自定义视差效果
- 下层页面动画联动

## 阻止手势返回

使用 `useLeaveBefore` 可以阻止手势返回。

::: code-group

```tsx [Vue]
import { defineComponent } from 'vue'
import { useLeaveBefore, NavPage } from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    useLeaveBefore(() => {
      // 返回 false 阻止手势返回
      return false
    })

    return () => <NavPage>这个页面不能通过手势返回</NavPage>
  }
})
```

```tsx [React]
import { useLeaveBefore, NavPage } from '@0x30/navigation-react'

function LockedPage() {
  useLeaveBefore(() => {
    // 返回 false 阻止手势返回
    return false
  })

  return <NavPage>这个页面不能通过手势返回</NavPage>
}
```

:::
```

## 手势触发区域

默认从屏幕左边缘 20px 范围内开始滑动即可触发手势返回。

```
┌──────────────────────────────────┐
│←20px→│                           │
│      │                           │
│ 触发 │      页面内容区域          │
│ 区域 │                           │
│      │                           │
└──────────────────────────────────┘
```

## 手势状态

手势返回过程中会经历以下状态：

1. **Start** - 手势开始，触摸屏幕左边缘
2. **Move** - 手势移动，进度从 0 向 1 变化
3. **End** - 手势结束
   - 如果进度 > 阈值：执行返回
   - 如果进度 < 阈值：取消返回，页面回弹

## 配合生命周期

手势返回和普通 `back()` 调用一样，会触发完整的生命周期：

```tsx
onWillDisappear(() => {
  // 无论是手势返回还是 back()，都会触发
  console.log('页面即将消失')
})
```
