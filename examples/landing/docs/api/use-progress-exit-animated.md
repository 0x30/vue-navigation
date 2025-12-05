# useProgressExitAnimated

获取手势返回的实时进度，用于实现跟手动画效果。

## 签名

```tsx
function useProgressExitAnimated(handler: ProgressExitAnimatedHandler): void

type ProgressExitAnimatedHandler = (progress: number) => void
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `handler` | `ProgressExitAnimatedHandler` | 进度变化时的回调函数 |

## 进度值

| 值 | 说明 |
|----|------|
| `0` | 手势未开始或已取消 |
| `0 ~ 1` | 手势进行中 |
| `1` | 手势完成，即将返回 |

## 示例

### 基础用法

::: code-group

```tsx [Vue]
import { ref, defineComponent } from 'vue'
import { useProgressExitAnimated, NavPage } from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    const progress = ref(0)
    
    useProgressExitAnimated((p) => {
      progress.value = p
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
  })

  return (
    <NavPage style={{ opacity: 1 - progress * 0.3 }}>
      <div>拖动进度: {(progress * 100).toFixed(0)}%</div>
    </NavPage>
  )
}
```

:::

### 视差效果

::: code-group

```tsx [Vue]
import { ref, defineComponent } from 'vue'
import { useProgressExitAnimated, NavPage } from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    const progress = ref(0)
    
    useProgressExitAnimated((p) => {
      progress.value = p
    })

    return () => (
      <NavPage>
        <div 
          style={{ 
            transform: `translateX(${progress.value * 50}px)`,
            opacity: 1 - progress.value * 0.5
          }}
        >
          视差内容
        </div>
      </NavPage>
    )
  }
})
```

```tsx [React]
import { useState } from 'react'
import { useProgressExitAnimated, NavPage } from '@0x30/navigation-react'

function ParallaxPage() {
  const [progress, setProgress] = useState(0)
  
  useProgressExitAnimated((p) => {
    setProgress(p)
  })

  return (
    <NavPage>
      <div 
        style={{ 
          transform: `translateX(${progress * 50}px)`,
          opacity: 1 - progress * 0.5
        }}
      >
        视差内容
      </div>
    </NavPage>
  )
}
```

:::

### 配合下层页面

```tsx
// 详情页
function DetailPage() {
  useProgressExitAnimated((progress) => {
    // 通知下层页面
    eventBus.emit('gesture-progress', progress)
  })
  
  return <NavPage>详情</NavPage>
}

// 列表页（下层）
function ListPage() {
  const scale = ref(1)
  
  onMounted(() => {
    eventBus.on('gesture-progress', (progress) => {
      // 下层页面随手势放大
      scale.value = 0.95 + progress * 0.05
    })
  })
  
  return (
    <NavPage style={{ transform: `scale(${scale.value})` }}>
      列表
    </NavPage>
  )
}
```

## 手势状态

```
触摸开始 → progress: 0
  ↓
向右滑动 → progress: 0.1 → 0.2 → 0.3 → ...
  ↓
松手（超过阈值）→ progress: 快速变为 1 → 执行返回
  ↓
松手（未超过阈值）→ progress: 快速变为 0 → 取消返回
```

## 注意事项

- 进度变化是连续的，适合用于动画
- 手势取消时进度会平滑回到 0
- 可以配合 requestAnimationFrame 优化性能
