# Loading & Toast

Navigation 内置了 Loading 和 Toast 组件，无需预渲染容器，完全动态创建。

## Loading

### 基础使用

::: code-group

```tsx [Vue]
import { showLoading, hideLoading } from '@0x30/navigation-vue'

async function fetchData() {
  await showLoading('加载中...')
  
  try {
    const data = await api.getData()
    await hideLoading()
  } catch (e) {
    await hideLoading()
  }
}
```

```tsx [React]
import { showLoading, hideLoading } from '@0x30/navigation-react'

async function fetchData() {
  await showLoading('加载中...')
  
  try {
    const data = await api.getData()
    await hideLoading()
  } catch (e) {
    await hideLoading()
  }
}
```

:::

### LoadingInstance API

`showLoading` 返回一个实例，可以动态更新状态：

::: code-group

```tsx [Vue]
import { showLoading } from '@0x30/navigation-vue'

async function submitForm() {
  const loading = await showLoading('正在提交...')
  
  try {
    await api.submit()
    loading.setMessage('处理中...')
    
    await api.process()
    loading.success('提交成功！')  // 显示成功后自动关闭
  } catch (e) {
    loading.error('提交失败')      // 显示失败后自动关闭
  }
}
```

```tsx [React]
import { showLoading } from '@0x30/navigation-react'

async function submitForm() {
  const loading = await showLoading('正在提交...')
  
  try {
    await api.submit()
    loading.setMessage('处理中...')
    
    await api.process()
    loading.success('提交成功！')  // 显示成功后自动关闭
  } catch (e) {
    loading.error('提交失败')      // 显示失败后自动关闭
  }
}
```

:::

### API

```tsx
// 显示 Loading
const instance = await showLoading(message?: string)

// 实例方法
instance.setMessage(message: string)   // 更新消息
instance.success(message?: string)     // 显示成功并关闭
instance.error(message?: string)       // 显示失败并关闭
instance.hide()                        // 立即关闭

// 直接关闭
await hideLoading()

// 快捷方法
await showSuccess(message?: string, duration?: number)
await showError(message?: string, duration?: number)
```

### 配置

::: code-group

```tsx [Vue]
import { setLoadingConfig } from '@0x30/navigation-vue'

setLoadingConfig({
  successImg: '/icons/success.png',  // 自定义成功图标
  errorImg: '/icons/error.png',      // 自定义失败图标
  loadingImg: '/icons/loading.gif',  // 自定义加载图标
  closeTimeout: 1500,                // 成功/失败后自动关闭时间
})
```

```tsx [React]
import { setLoadingConfig } from '@0x30/navigation-react'

setLoadingConfig({
  successImg: '/icons/success.png',  // 自定义成功图标
  errorImg: '/icons/error.png',      // 自定义失败图标
  loadingImg: '/icons/loading.gif',  // 自定义加载图标
  closeTimeout: 1500,                // 成功/失败后自动关闭时间
})
```

:::

### useLoading Hook

::: code-group

```tsx [Vue]
import { defineComponent } from 'vue'
import { useLoading } from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    const loading = useLoading()
    
    const handleClick = async () => {
      await loading.show('加载中...')
      // ...
      await loading.hide()
    }
    
    return () => <button onClick={handleClick}>加载</button>
  }
})
```

```tsx [React]
import { useLoading } from '@0x30/navigation-react'

function MyComponent() {
  const loading = useLoading()
  
  const handleClick = async () => {
    await loading.show('加载中...')
    // ...
    await loading.hide()
  }
  
  return <button onClick={handleClick}>加载</button>
}
```

:::

## Toast

### 基础使用

::: code-group

```tsx [Vue]
import { showToast } from '@0x30/navigation-vue'

// 显示 Toast
showToast('操作成功')

// 自定义时长
showToast('消息内容', 3000)  // 3秒

// 完整配置
showToast('消息内容', {
  duration: 3000,
  className: 'my-toast'
})
```

```tsx [React]
import { showToast } from '@0x30/navigation-react'

// 显示 Toast
showToast('操作成功')

// 自定义时长
showToast('消息内容', 3000)  // 3秒

// 完整配置
showToast('消息内容', {
  duration: 3000,
  className: 'my-toast'
})
```

:::

### API

```tsx
showToast(message: string, options?: ToastOptions | number)

interface ToastOptions {
  duration?: number    // 显示时长，默认 2000ms
  className?: string   // 自定义样式类名
}
```

### useToast Hook

::: code-group

```tsx [Vue]
import { defineComponent } from 'vue'
import { useToast } from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    const toast = useToast()
    
    const handleClick = () => {
      toast.show('Hello!')
    }
    
    return () => <button onClick={handleClick}>Show Toast</button>
  }
})
```

```tsx [React]
import { useToast } from '@0x30/navigation-react'

function MyComponent() {
  const toast = useToast()
  
  const handleClick = () => {
    toast.show('Hello!')
  }
  
  return <button onClick={handleClick}>Show Toast</button>
}
```

:::
```

## 特性

### 无需容器

不同于传统方案，Loading 和 Toast 都是动态创建 DOM 的：

```tsx
// ❌ 传统方案需要在根组件添加容器
<App>
  <Router />
  <LoadingContainer />  // 需要预渲染
  <ToastContainer />    // 需要预渲染
</App>

// ✅ Navigation 方案
<Navigator homePage={<Home />} />  // 只需要这一行
// Loading 和 Toast 会自动创建 DOM
```

### 阻止返回

Loading 显示期间会自动阻止用户返回操作：

```tsx
await showLoading('处理中...')
// 此时用户无法通过手势或返回按钮返回上一页
await hideLoading()
// Loading 关闭后才能返回
```

### 动画效果

内置流畅的动画效果：

- Loading: 淡入/淡出 + 缩放
- Toast: 弹性动画 + 淡入淡出
