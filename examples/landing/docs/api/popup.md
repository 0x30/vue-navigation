# Popup

动态弹窗工具函数，用于创建自定义弹出视图。

## API

```tsx
const [show, close] = Popup(options?: PopupOptions)
```

## PopupOptions

```tsx
interface PopupOptions {
  onEnter?: (el: Element, done: () => void) => void
  onLeave?: (el: Element, done: () => void) => void
  root?: Element  // 挂载根元素，默认 document.body
}
```

## 返回值

| 方法 | 类型 | 说明 |
|------|------|------|
| `show` | `(content: ReactNode \| VNode) => Promise<void>` | 显示内容 |
| `close` | `() => Promise<void>` | 关闭弹窗 |

## 示例

### 基础用法

::: code-group

```tsx [Vue]
import { Popup } from '@0x30/navigation-vue'
import { animate } from 'animejs'

function showMyPopup() {
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

  show(
    <div class="my-popup">
      <h2>标题</h2>
      <p>内容</p>
      <button onClick={() => close()}>关闭</button>
    </div>
  )
}
```

```tsx [React]
import { Popup } from '@0x30/navigation-react'
import { animate } from 'animejs'

function showMyPopup() {
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

  show(
    <div className="my-popup">
      <h2>标题</h2>
      <p>内容</p>
      <button onClick={() => close()}>关闭</button>
    </div>
  )
}
```

:::

### 确认弹窗

::: code-group

```tsx [Vue]
import { Popup } from '@0x30/navigation-vue'
import { animate } from 'animejs'

function confirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const [show, close] = Popup({
      onEnter(el, done) {
        animate(el, { opacity: [0, 1], duration: 200, onComplete: done })
      },
      onLeave(el, done) {
        animate(el, { opacity: [1, 0], duration: 150, onComplete: done })
      }
    })

    show(
      <div class="confirm-overlay">
        <div class="confirm-dialog">
          <p>{message}</p>
          <div class="actions">
            <button onClick={async () => { await close(); resolve(false) }}>
              取消
            </button>
            <button onClick={async () => { await close(); resolve(true) }}>
              确认
            </button>
          </div>
        </div>
      </div>
    )
  })
}

// 使用
const result = await confirm('确定删除吗？')
```

```tsx [React]
import { Popup } from '@0x30/navigation-react'
import { animate } from 'animejs'

function confirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const [show, close] = Popup({
      onEnter(el, done) {
        animate(el, { opacity: [0, 1], duration: 200, onComplete: done })
      },
      onLeave(el, done) {
        animate(el, { opacity: [1, 0], duration: 150, onComplete: done })
      }
    })

    show(
      <div className="confirm-overlay">
        <div className="confirm-dialog">
          <p>{message}</p>
          <div className="actions">
            <button onClick={async () => { await close(); resolve(false) }}>
              取消
            </button>
            <button onClick={async () => { await close(); resolve(true) }}>
              确认
            </button>
          </div>
        </div>
      </div>
    )
  })
}

// 使用
const result = await confirm('确定删除吗？')
```

:::

### ActionSheet

```tsx
function showActionSheet(actions: string[]) {
  const [show, close] = Popup({
    onEnter(el, done) {
      const mask = el.querySelector('.mask')
      const sheet = el.querySelector('.sheet')
      animate(mask, { opacity: [0, 1], duration: 200 })
      animate(sheet, { 
        translateY: ['100%', '0%'], 
        duration: 300, 
        ease: 'outExpo',
        onComplete: done 
      })
    },
    onLeave(el, done) {
      const mask = el.querySelector('.mask')
      const sheet = el.querySelector('.sheet')
      animate(mask, { opacity: [1, 0], duration: 200 })
      animate(sheet, { 
        translateY: ['0%', '100%'], 
        duration: 200,
        onComplete: done 
      })
    }
  })

  show(
    <div class="action-sheet-wrapper">
      <div class="mask" onClick={() => close()} />
      <div class="sheet">
        {actions.map(action => (
          <button onClick={() => close()}>{action}</button>
        ))}
      </div>
    </div>
  )
}
```

## 注意事项

1. **必须调用 done**: 动画完成后必须调用 `done()` 函数
2. **自动清理**: close 完成后自动移除 DOM
3. **样式自理**: Popup 只负责 DOM 管理，样式需自行编写
4. **Promise**: show 和 close 都返回 Promise，动画完成后 resolve
