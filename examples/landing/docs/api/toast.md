# Toast

轻提示组件，用于显示临时消息。

## API

```tsx
// 显示 Toast
showToast(message: string, options?: ToastOptions | number): void

// Hook
const toast = useToast()
toast.show(message, options?)
```

## ToastOptions

```tsx
interface ToastOptions {
  duration?: number    // 显示时长，默认 2000ms
  className?: string   // 自定义样式类名
}
```

## 示例

### 基础用法

::: code-group

```tsx [Vue]
import { showToast } from '@0x30/navigation-vue'

// 显示消息
showToast('操作成功')

// 自定义时长
showToast('消息内容', 3000)

// 完整配置
showToast('消息内容', {
  duration: 3000,
  className: 'my-toast'
})
```

```tsx [React]
import { showToast } from '@0x30/navigation-react'

// 显示消息
showToast('操作成功')

// 自定义时长
showToast('消息内容', 3000)

// 完整配置
showToast('消息内容', {
  duration: 3000,
  className: 'my-toast'
})
```

:::

### 使用 Hook

::: code-group

```tsx [Vue]
import { defineComponent } from 'vue'
import { useToast } from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    const toast = useToast()
    
    const handleClick = () => {
      toast.show('Hello World!')
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
    toast.show('Hello World!')
  }
  
  return <button onClick={handleClick}>Show Toast</button>
}
```

:::

### 自定义样式

```tsx
showToast('自定义样式', {
  className: 'custom-toast'
})
```

```css
.custom-toast {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 12px 24px;
  border-radius: 20px;
}
```

## 默认样式

Toast 的默认样式：

```css
.toast {
  position: fixed;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 15px;
  padding: 8px 16px;
  border-radius: 4px;
  
  max-width: 60%;
  text-align: center;
  z-index: 9999;
}
```

## 默认动画

Toast 自带弹性进入动画和淡出动画：

- **进入**: 缩放 0.8 → 1 + 淡入，使用 outElastic 缓动
- **退出**: 淡出，使用 inQuad 缓动

## 特性

### 无需容器

不需要在根组件添加任何容器，Toast 会自动创建 DOM。

### 自动消失

Toast 会在指定时间后自动消失，默认 2000ms。

### 多个 Toast

可以同时显示多个 Toast，它们会自动堆叠。
