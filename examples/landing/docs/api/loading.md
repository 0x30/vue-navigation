# Loading

加载指示器组件，支持动态创建、状态更新、成功/失败提示。

## API

```tsx
// 显示 Loading
const instance = await showLoading(message?: string): Promise<LoadingInstance>

// 隐藏 Loading
await hideLoading(): Promise<void>

// 显示成功提示
await showSuccess(message?: string, duration?: number): Promise<void>

// 显示失败提示
await showError(message?: string, duration?: number): Promise<void>

// 配置
setLoadingConfig(config: LoadingConfig): void

// Hook
const loading = useLoading()
```

## LoadingInstance

```tsx
interface LoadingInstance {
  setMessage(message: string): void  // 更新消息
  success(message?: string): void    // 显示成功并关闭
  error(message?: string): void      // 显示失败并关闭
  hide(): void                       // 立即关闭
}
```

## 示例

### 基础用法

::: code-group

```tsx [Vue]
import { showLoading, hideLoading } from '@0x30/navigation-vue'

async function fetchData() {
  await showLoading('加载中...')
  try {
    await api.getData()
  } finally {
    await hideLoading()
  }
}
```

```tsx [React]
import { showLoading, hideLoading } from '@0x30/navigation-react'

async function fetchData() {
  await showLoading('加载中...')
  try {
    await api.getData()
  } finally {
    await hideLoading()
  }
}
```

:::

### 状态更新

::: code-group

```tsx [Vue]
import { showLoading } from '@0x30/navigation-vue'

async function submitForm() {
  const loading = await showLoading('提交中...')
  
  try {
    await api.validate()
    loading.setMessage('处理中...')
    
    await api.submit()
    loading.setMessage('即将完成...')
    
    await api.finalize()
    loading.success('提交成功！')
  } catch (e) {
    loading.error('提交失败')
  }
}
```

```tsx [React]
import { showLoading } from '@0x30/navigation-react'

async function submitForm() {
  const loading = await showLoading('提交中...')
  
  try {
    await api.validate()
    loading.setMessage('处理中...')
    
    await api.submit()
    loading.setMessage('即将完成...')
    
    await api.finalize()
    loading.success('提交成功！')
  } catch (e) {
    loading.error('提交失败')
  }
}
```

:::

### 使用 Hook

::: code-group

```tsx [Vue]
import { defineComponent } from 'vue'
import { useLoading } from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    const loading = useLoading()
    
    const handleClick = async () => {
      await loading.show('加载中...')
      await someAsyncTask()
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
    await someAsyncTask()
    await loading.hide()
  }
  
  return <button onClick={handleClick}>加载</button>
}
```

:::

## 配置

::: code-group

```tsx [Vue]
import { setLoadingConfig } from '@0x30/navigation-vue'

setLoadingConfig({
  loadingImg: '/icons/loading.gif',  // 自定义加载图标
  successImg: '/icons/success.png',  // 自定义成功图标
  errorImg: '/icons/error.png',      // 自定义失败图标
  closeTimeout: 1500,                // 成功/失败后自动关闭时间 (ms)
})
```

```tsx [React]
import { setLoadingConfig } from '@0x30/navigation-react'

setLoadingConfig({
  loadingImg: '/icons/loading.gif',  // 自定义加载图标
  successImg: '/icons/success.png',  // 自定义成功图标
  errorImg: '/icons/error.png',      // 自定义失败图标
  closeTimeout: 1500,                // 成功/失败后自动关闭时间 (ms)
})
```

:::
```

### LoadingConfig

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `loadingImg` | `string` | - | 自定义加载图标 URL |
| `successImg` | `string` | - | 自定义成功图标 URL |
| `errorImg` | `string` | - | 自定义失败图标 URL |
| `closeTimeout` | `number` | `1500` | 成功/失败后自动关闭延时 |

## 特性

### 阻止返回

Loading 显示期间会自动阻止用户返回：

```tsx
await showLoading('处理中...')
// 此时用户无法：
// - 调用 back() 返回
// - 使用手势返回
// - 点击浏览器后退
await hideLoading()
```

### 无需容器

不需要在根组件添加任何容器，Loading 会自动创建 DOM。

### 内置动画

Loading 自带淡入淡出和缩放动画。
