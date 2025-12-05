# useLeaveBefore

离开页面前的拦截钩子，可以阻止用户离开当前页面。

## 签名

```tsx
function useLeaveBefore(hook: LeaveBeforeHook): void

type LeaveBeforeHook = () => boolean | Promise<boolean>
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `hook` | `LeaveBeforeHook` | 离开前执行的钩子函数 |

## 返回值说明

| 返回值 | 说明 |
|--------|------|
| `true` | 允许离开 |
| `false` | 阻止离开 |
| `Promise<boolean>` | 异步决定是否离开 |

## 示例

### 基础用法

::: code-group

```tsx [Vue]
import { ref, defineComponent } from 'vue'
import { useLeaveBefore, NavPage } from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    const hasChanges = ref(true)
    
    useLeaveBefore(() => {
      if (hasChanges.value) {
        return confirm('有未保存的更改，确定离开吗？')
      }
      return true
    })

    return () => <NavPage>编辑页面</NavPage>
  }
})
```

```tsx [React]
import { useState } from 'react'
import { useLeaveBefore, NavPage } from '@0x30/navigation-react'

function EditPage() {
  const [hasChanges] = useState(true)
  
  useLeaveBefore(() => {
    if (hasChanges) {
      return confirm('有未保存的更改，确定离开吗？')
    }
    return true
  })

  return <NavPage>编辑页面</NavPage>
}
```

:::

### 自定义确认弹窗

::: code-group

```tsx [Vue]
import { ref, defineComponent } from 'vue'
import { useLeaveBefore, push, back, NavPage } from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    const hasChanges = ref(true)
    
    useLeaveBefore(() => {
      if (!hasChanges.value) return true
      
      return new Promise((resolve) => {
        push(
          <ConfirmDialog
            message="有未保存的更改，确定离开吗？"
            onConfirm={() => {
              back()
              resolve(true)
            }}
            onCancel={() => {
              back()
              resolve(false)
            }}
          />
        )
      })
    })

    return () => <NavPage>编辑页面</NavPage>
  }
})
```

```tsx [React]
import { useState } from 'react'
import { useLeaveBefore, push, back, NavPage } from '@0x30/navigation-react'

function EditPage() {
  const [hasChanges] = useState(true)
  
  useLeaveBefore(() => {
    if (!hasChanges) return true
    
    return new Promise((resolve) => {
      push(
        <ConfirmDialog
          message="有未保存的更改，确定离开吗？"
          onConfirm={() => {
            back()
            resolve(true)
          }}
          onCancel={() => {
            back()
            resolve(false)
          }}
        />
      )
    })
  })

  return <NavPage>编辑页面</NavPage>
}
```

:::

### 阻止手势返回

```tsx
useLeaveBefore(() => {
  // 返回 false 会同时阻止：
  // 1. 调用 back() 返回
  // 2. 手势返回
  // 3. 浏览器后退按钮
  return false
})
```

## 适用场景

- 表单编辑页面
- 支付流程
- 考试/答题页面
- 任何需要用户确认才能离开的场景

## 注意事项

- 钩子函数在每次尝试离开时都会被调用
- 如果返回 Promise，导航会等待 Promise resolve
- 可以在钩子中 push 一个确认弹窗
