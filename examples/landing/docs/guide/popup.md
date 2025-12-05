# Popup 工具

Popup 是一个底层工具函数，用于动态创建弹出视图。Loading 和 Toast 组件都是基于 Popup 实现的。

## 基础使用

::: code-group

```tsx [Vue]
import { Popup } from '@0x30/navigation-vue'
import { animate } from 'animejs'

function showCustomPopup() {
  const [show, close] = Popup({
    onEnter(el, done) {
      animate(el, {
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 300,
        ease: 'outExpo',
        onComplete: done
      })
    },
    onLeave(el, done) {
      animate(el, {
        opacity: [1, 0],
        scale: [1, 0.8],
        duration: 200,
        onComplete: done
      })
    }
  })

  show(
    <div class="my-popup">
      <h2>自定义弹窗</h2>
      <p>这是使用 Popup 创建的弹窗</p>
      <button onClick={() => close()}>关闭</button>
    </div>
  )
}
```

```tsx [React]
import { Popup } from '@0x30/navigation-react'
import { animate } from 'animejs'

function showCustomPopup() {
  const [show, close] = Popup({
    onEnter(el, done) {
      animate(el, {
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 300,
        ease: 'outExpo',
        onComplete: done
      })
    },
    onLeave(el, done) {
      animate(el, {
        opacity: [1, 0],
        scale: [1, 0.8],
        duration: 200,
        onComplete: done
      })
    }
  })

  show(
    <div className="my-popup">
      <h2>自定义弹窗</h2>
      <p>这是使用 Popup 创建的弹窗</p>
      <button onClick={() => close()}>关闭</button>
    </div>
  )
}
```

:::

## API

```tsx
const [show, close] = Popup(options?)
```

### 返回值

| 方法 | 类型 | 说明 |
|------|------|------|
| `show` | `(content: ReactNode) => Promise<void>` | 显示弹窗内容，进入动画完成后 resolve |
| `close` | `() => Promise<void>` | 关闭弹窗，退出动画完成后 resolve |

### Options

```tsx
interface PopupOptions {
  onEnter?: (el: Element, done: () => void) => void  // 进入动画
  onLeave?: (el: Element, done: () => void) => void  // 退出动画
  root?: Element  // 挂载的根元素，默认 document.body
}
```

## 动画钩子

### onEnter

进入动画钩子，当内容显示时调用：

```tsx
onEnter(el, done) {
  // el: 内容元素
  // done: 动画完成后必须调用此函数
  
  animate(el, {
    opacity: [0, 1],
    onComplete: done  // 重要：动画完成后调用 done
  })
}
```

### onLeave

退出动画钩子，当关闭时调用：

```tsx
onLeave(el, done) {
  animate(el, {
    opacity: [1, 0],
    onComplete: done  // 重要：动画完成后调用 done
  })
}
```

## 完整示例

### 确认弹窗

::: code-group

```tsx [Vue]
import { Popup } from '@0x30/navigation-vue'
import { animate } from 'animejs'

function confirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const [show, close] = Popup({
      onEnter(el, done) {
        animate(el, {
          opacity: [0, 1],
          scale: [0.9, 1],
          duration: 200,
          onComplete: done
        })
      },
      onLeave(el, done) {
        animate(el, {
          opacity: [1, 0],
          duration: 150,
          onComplete: done
        })
      }
    })

    const handleConfirm = async () => {
      await close()
      resolve(true)
    }

    const handleCancel = async () => {
      await close()
      resolve(false)
    }

    show(
      <div class="confirm-overlay">
        <div class="confirm-dialog">
          <div class="confirm-message">{message}</div>
          <div class="confirm-actions">
            <button onClick={handleCancel}>取消</button>
            <button onClick={handleConfirm}>确认</button>
          </div>
        </div>
      </div>
    )
  })
}

// 使用
const result = await confirm('确定要删除吗？')
if (result) {
  // 用户点击了确认
}
```

```tsx [React]
import { Popup } from '@0x30/navigation-react'
import { animate } from 'animejs'

function confirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const [show, close] = Popup({
      onEnter(el, done) {
        animate(el, {
          opacity: [0, 1],
          scale: [0.9, 1],
          duration: 200,
          onComplete: done
        })
      },
      onLeave(el, done) {
        animate(el, {
          opacity: [1, 0],
          duration: 150,
          onComplete: done
        })
      }
    })

    const handleConfirm = async () => {
      await close()
      resolve(true)
    }

    const handleCancel = async () => {
      await close()
      resolve(false)
    }

    show(
      <div className="confirm-overlay">
        <div className="confirm-dialog">
          <div className="confirm-message">{message}</div>
          <div className="confirm-actions">
            <button onClick={handleCancel}>取消</button>
            <button onClick={handleConfirm}>确认</button>
          </div>
        </div>
      </div>
    )
  })
}

// 使用
const result = await confirm('确定要删除吗？')
if (result) {
  // 用户点击了确认
}
```

:::

### ActionSheet

::: code-group

```tsx [Vue]
import { Popup } from '@0x30/navigation-vue'
import { animate } from 'animejs'

function showActionSheet(actions: { text: string, onClick: () => void }[]) {
  const [show, close] = Popup({
    onEnter(el, done) {
      const sheet = el.querySelector('.action-sheet')
      const mask = el.querySelector('.mask')
      animate(mask, { opacity: [0, 1], duration: 200 })
      animate(sheet, {
        translateY: ['100%', '0%'],
        duration: 300,
        ease: 'outExpo',
        onComplete: done
      })
    },
    onLeave(el, done) {
      const sheet = el.querySelector('.action-sheet')
      const mask = el.querySelector('.mask')
      animate(mask, { opacity: [1, 0], duration: 200 })
      animate(sheet, {
        translateY: ['0%', '100%'],
        duration: 200,
        onComplete: done
      })
    }
  })

  show(
    <div class="action-sheet-container">
      <div class="mask" onClick={() => close()} />
      <div class="action-sheet">
        {actions.map(action => (
          <button onClick={() => { action.onClick(); close() }}>
            {action.text}
          </button>
        ))}
        <button onClick={() => close()}>取消</button>
      </div>
    </div>
  )
}
```

```tsx [React]
import { Popup } from '@0x30/navigation-react'
import { animate } from 'animejs'

function showActionSheet(actions: { text: string, onClick: () => void }[]) {
  const [show, close] = Popup({
    onEnter(el, done) {
      const sheet = el.querySelector('.action-sheet')
      const mask = el.querySelector('.mask')
      animate(mask, { opacity: [0, 1], duration: 200 })
      animate(sheet, {
        translateY: ['100%', '0%'],
        duration: 300,
        ease: 'outExpo',
        onComplete: done
      })
    },
    onLeave(el, done) {
      const sheet = el.querySelector('.action-sheet')
      const mask = el.querySelector('.mask')
      animate(mask, { opacity: [1, 0], duration: 200 })
      animate(sheet, {
        translateY: ['0%', '100%'],
        duration: 200,
        onComplete: done
      })
    }
  })

  show(
    <div className="action-sheet-container">
      <div className="mask" onClick={() => close()} />
      <div className="action-sheet">
        {actions.map(action => (
          <button onClick={() => { action.onClick(); close() }}>
            {action.text}
          </button>
        ))}
        <button onClick={() => close()}>取消</button>
      </div>
    </div>
  )
}
```

:::
```

## 注意事项

1. **必须调用 done**: 动画完成后必须调用 `done()` 函数，否则 Promise 不会 resolve
2. **自动清理**: `close()` 完成后会自动移除 DOM 元素
3. **样式自理**: Popup 只负责 DOM 管理和动画，样式需要自己编写
