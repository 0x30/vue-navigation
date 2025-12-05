# 生命周期 Hooks

页面生命周期钩子，用于在页面显示/隐藏时执行代码。

## Hooks 列表

| Hook | 触发时机 |
|------|----------|
| `onWillAppear` | 页面即将显示（动画开始前） |
| `onDidAppear` | 页面已显示（动画完成后） |
| `onWillDisappear` | 页面即将消失（动画开始前） |
| `onDidDisappear` | 页面已消失（动画完成后） |

## 签名

```tsx
function onWillAppear(callback: () => void): void
function onDidAppear(callback: () => void): void
function onWillDisappear(callback: () => void): void
function onDidDisappear(callback: () => void): void
```

## 触发时序

### 页面 A 推入页面 B

```
1. A: onWillDisappear
2. B: onWillAppear
3. (动画执行...)
4. A: onDidDisappear
5. B: onDidAppear
```

### 页面 B 返回页面 A

```
1. B: onWillDisappear
2. A: onWillAppear
3. (动画执行...)
4. B: onDidDisappear
5. A: onDidAppear
```

## 示例

### 基础用法

::: code-group

```tsx [Vue]
import { defineComponent } from 'vue'
import { 
  onWillAppear, 
  onDidAppear, 
  onWillDisappear, 
  onDidDisappear,
  NavPage
} from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    onWillAppear(() => {
      console.log('页面即将显示')
    })

    onDidAppear(() => {
      console.log('页面已显示')
      // 适合：开始播放、发送埋点、聚焦输入框
    })

    onWillDisappear(() => {
      console.log('页面即将消失')
      // 适合：暂停播放、保存草稿
    })

    onDidDisappear(() => {
      console.log('页面已消失')
    })

    return () => <NavPage>页面内容</NavPage>
  }
})
```

```tsx [React]
import { 
  onWillAppear, 
  onDidAppear, 
  onWillDisappear, 
  onDidDisappear,
  NavPage
} from '@0x30/navigation-react'

function MyPage() {
  onWillAppear(() => {
    console.log('页面即将显示')
  })

  onDidAppear(() => {
    console.log('页面已显示')
    // 适合：开始播放、发送埋点、聚焦输入框
  })

  onWillDisappear(() => {
    console.log('页面即将消失')
    // 适合：暂停播放、保存草稿
  })

  onDidDisappear(() => {
    console.log('页面已消失')
  })

  return <NavPage>页面内容</NavPage>
}
```

:::

### 视频播放控制

::: code-group

```tsx [Vue]
import { ref, defineComponent } from 'vue'
import { onDidAppear, onWillDisappear, NavPage } from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    const videoRef = ref<HTMLVideoElement>()

    onDidAppear(() => {
      videoRef.value?.play()
    })

    onWillDisappear(() => {
      videoRef.value?.pause()
    })

    return () => (
      <NavPage>
        <video ref={videoRef} src="..." />
      </NavPage>
    )
  }
})
```

```tsx [React]
import { useRef } from 'react'
import { onDidAppear, onWillDisappear, NavPage } from '@0x30/navigation-react'

function VideoPage() {
  const videoRef = useRef<HTMLVideoElement>(null)

  onDidAppear(() => {
    videoRef.current?.play()
  })

  onWillDisappear(() => {
    videoRef.current?.pause()
  })

  return (
    <NavPage>
      <video ref={videoRef} src="..." />
    </NavPage>
  )
}
```

:::

### 页面曝光统计

::: code-group

```tsx [Vue]
import { defineComponent } from 'vue'
import { onDidAppear, NavPage } from '@0x30/navigation-vue'

export default defineComponent({
  props: ['productId'],
  setup(props) {
    onDidAppear(() => {
      analytics.track('page_view', {
        page: 'product_detail',
        product_id: props.productId
      })
    })

    return () => <NavPage>商品详情</NavPage>
  }
})
```

```tsx [React]
import { onDidAppear, NavPage } from '@0x30/navigation-react'

function ProductPage({ productId }: { productId: string }) {
  onDidAppear(() => {
    analytics.track('page_view', {
      page: 'product_detail',
      product_id: productId
    })
  })

  return <NavPage>商品详情</NavPage>
}
```

:::

### 输入框自动聚焦

::: code-group

```tsx [Vue]
import { ref, defineComponent } from 'vue'
import { onDidAppear, NavPage } from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    const inputRef = ref<HTMLInputElement>()

    onDidAppear(() => {
      inputRef.value?.focus()
    })

    return () => (
      <NavPage>
        <input ref={inputRef} placeholder="搜索..." />
      </NavPage>
    )
  }
})
```

```tsx [React]
import { useRef } from 'react'
import { onDidAppear, NavPage } from '@0x30/navigation-react'

function SearchPage() {
  const inputRef = useRef<HTMLInputElement>(null)

  onDidAppear(() => {
    inputRef.current?.focus()
  })

  return (
    <NavPage>
      <input ref={inputRef} placeholder="搜索..." />
    </NavPage>
  )
}
```

:::
```

## 与 useQuietPage 的关系

使用 `useQuietPage` 的页面不会触发下层页面的生命周期：

```tsx
// Modal 使用了 useQuietPage
function Modal() {
  useQuietPage()
  return <SidePage>...</SidePage>
}

// push(Modal) 时，下层页面的 onWillDisappear 不会触发
// back() 时，下层页面的 onWillAppear 不会触发
```

## 注意事项

- 必须在组件顶层调用，不能在条件语句中
- 可以注册多个相同类型的钩子，按注册顺序执行
- 钩子函数中可以是异步的，但不会等待
