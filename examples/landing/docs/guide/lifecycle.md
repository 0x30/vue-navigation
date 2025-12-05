# 生命周期

Navigation 提供了丰富的页面生命周期钩子，帮助你在合适的时机执行代码。

## 生命周期图示

```
页面 A 推入页面 B：
┌─────────────────────────────────────────────────────┐
│  A: onWillDisappear → B: onWillAppear              │
│        ↓                    ↓                       │
│     (动画执行中...)                                  │
│        ↓                    ↓                       │
│  A: onDidDisappear  → B: onDidAppear               │
└─────────────────────────────────────────────────────┘

页面 B 返回页面 A：
┌─────────────────────────────────────────────────────┐
│  B: onWillDisappear → A: onWillAppear              │
│        ↓                    ↓                       │
│     (动画执行中...)                                  │
│        ↓                    ↓                       │
│  B: onDidDisappear  → A: onDidAppear               │
└─────────────────────────────────────────────────────┘
```

## 生命周期 Hooks

### onWillAppear

页面即将显示时触发。

::: code-group

```tsx [Vue]
import { onWillAppear } from '@0x30/navigation-vue'

onWillAppear(() => {
  console.log('页面即将显示')
})
```

```tsx [React]
import { onWillAppear } from '@0x30/navigation-react'

onWillAppear(() => {
  console.log('页面即将显示')
})
```

:::

### onDidAppear

页面显示完成后触发。

::: code-group

```tsx [Vue]
import { onDidAppear } from '@0x30/navigation-vue'

onDidAppear(() => {
  console.log('页面已显示')
  // 适合执行：
  // - 开始播放动画/视频
  // - 发送页面曝光统计
  // - 聚焦输入框
})
```

```tsx [React]
import { onDidAppear } from '@0x30/navigation-react'

onDidAppear(() => {
  console.log('页面已显示')
  // 适合执行：
  // - 开始播放动画/视频
  // - 发送页面曝光统计
  // - 聚焦输入框
})
```

:::

### onWillDisappear

页面即将消失时触发。

::: code-group

```tsx [Vue]
import { onWillDisappear } from '@0x30/navigation-vue'

onWillDisappear(() => {
  console.log('页面即将消失')
  // 适合执行：
  // - 暂停播放
  // - 保存草稿
})
```

```tsx [React]
import { onWillDisappear } from '@0x30/navigation-react'

onWillDisappear(() => {
  console.log('页面即将消失')
  // 适合执行：
  // - 暂停播放
  // - 保存草稿
})
```

:::

### onDidDisappear

页面消失后触发。

::: code-group

```tsx [Vue]
import { onDidDisappear } from '@0x30/navigation-vue'

onDidDisappear(() => {
  console.log('页面已消失')
})
```

```tsx [React]
import { onDidDisappear } from '@0x30/navigation-react'

onDidDisappear(() => {
  console.log('页面已消失')
})
```

:::

## useQuietPage

将当前页面标记为"安静页面"，不会触发下层页面的生命周期。

::: code-group

```tsx [Vue]
import { defineComponent } from 'vue'
import { useQuietPage, SidePage } from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    useQuietPage() // 标记为安静页面
    
    return () => (
      <SidePage position="center">
        <div>弹窗内容</div>
      </SidePage>
    )
  }
})
```

```tsx [React]
import { useQuietPage, SidePage } from '@0x30/navigation-react'

function MyModal() {
  useQuietPage() // 标记为安静页面
  
  return (
    <SidePage position="center">
      <div>弹窗内容</div>
    </SidePage>
  )
}
```

:::

### 适用场景

- Toast 提示
- Loading 加载
- 模态弹窗
- 任何临时覆盖层

### 对比示例

```tsx
// 不使用 useQuietPage
// 打开弹窗时：下层页面触发 onWillDisappear
// 关闭弹窗时：下层页面触发 onWillAppear

// 使用 useQuietPage  
// 打开弹窗时：下层页面不触发任何生命周期
// 关闭弹窗时：下层页面不触发任何生命周期
```

## useLeaveBefore

离开页面前的拦截钩子。

::: code-group

```tsx [Vue]
import { ref, defineComponent } from 'vue'
import { useLeaveBefore, push, back, NavPage } from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    const hasUnsavedChanges = ref(true)
    
    useLeaveBefore(() => {
      if (hasUnsavedChanges.value) {
        return new Promise((resolve) => {
          push(
            <ConfirmDialog
              message="有未保存的更改，确定离开吗？"
              onConfirm={() => { back(); resolve(true) }}
              onCancel={() => { back(); resolve(false) }}
            />
          )
        })
      }
      return true
    })

    return () => <NavPage>...</NavPage>
  }
})
```

```tsx [React]
import { useState } from 'react'
import { useLeaveBefore, push, back, NavPage } from '@0x30/navigation-react'

function EditPage() {
  const [hasUnsavedChanges] = useState(true)
  
  useLeaveBefore(() => {
    if (hasUnsavedChanges) {
      return new Promise((resolve) => {
        push(
          <ConfirmDialog
            message="有未保存的更改，确定离开吗？"
            onConfirm={() => { back(); resolve(true) }}
            onCancel={() => { back(); resolve(false) }}
          />
        )
      })
    }
    return true
  })

  return <NavPage>...</NavPage>
}
```

:::

### 返回值说明

| 返回值 | 说明 |
|--------|------|
| `true` | 允许离开 |
| `false` | 阻止离开 |
| `Promise<boolean>` | 异步决定是否离开 |

## 转场动画 Hooks

### useTransitionEnter

自定义页面进入动画。

::: code-group

```tsx [Vue]
import { defineComponent } from 'vue'
import { useTransitionEnter, Page } from '@0x30/navigation-vue'
import { animate } from 'animejs'

export default defineComponent({
  setup() {
    useTransitionEnter((el, done) => {
      animate(el, {
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 400,
        ease: 'outExpo',
        onComplete: done
      })
    })

    return () => <Page>自定义进入动画</Page>
  }
})
```

```tsx [React]
import { useTransitionEnter, Page } from '@0x30/navigation-react'
import { animate } from 'animejs'

function CustomPage() {
  useTransitionEnter((el, done) => {
    animate(el, {
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 400,
      ease: 'outExpo',
      onComplete: done
    })
  })

  return <Page>自定义进入动画</Page>
}
```

:::

### useTransitionLeave

自定义页面退出动画。

::: code-group

```tsx [Vue]
import { useTransitionLeave } from '@0x30/navigation-vue'
import { animate } from 'animejs'

useTransitionLeave((el, done) => {
  animate(el, {
    opacity: [1, 0],
    translateY: [0, 50],
    duration: 300,
    ease: 'inQuad',
    onComplete: done
  })
})
```

```tsx [React]
import { useTransitionLeave } from '@0x30/navigation-react'
import { animate } from 'animejs'

useTransitionLeave((el, done) => {
  animate(el, {
    opacity: [1, 0],
    translateY: [0, 50],
    duration: 300,
    ease: 'inQuad',
    onComplete: done
  })
})
```

:::
```
