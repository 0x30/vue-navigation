# 手势返回

Navigation 支持 iOS 原生手势返回，通过 WebView 与 JavaScript 通信实现丝滑的跟手动画效果。

## 工作原理

手势返回需要 iOS 原生端配合。原生端通过 `UIScreenEdgePanGestureRecognizer` 监听屏幕左边缘滑动手势，并通过 `evaluateJavaScript` 通知 Web 端进度变化。

```
┌──────────────────────────────────────────────────────────────┐
│  iOS 原生                           Web (Navigation)         │
│                                                              │
│  手势开始  ─────────────────────>  ScreenEdgePanGestureRecognizerStart()    │
│  手势移动  ─────────────────────>  ScreenEdgePanGestureRecognizerChange(progress)  │
│  手势结束  ─────────────────────>  ScreenEdgePanGestureRecognizerEnded(finish)     │
└──────────────────────────────────────────────────────────────┘
```

## iOS 原生端配置

### 1. 禁用 WebView 默认手势

首先需要禁用 WKWebView 的默认前进/后退手势：

```swift
webView.allowsBackForwardNavigationGestures = false
```

### 2. 添加手势处理器

```swift
import UIKit
import WebKit

class PanGestureRecongnizerBackProcessor: NSObject {
    static let shared = PanGestureRecongnizerBackProcessor()

    private lazy var gesture: UIScreenEdgePanGestureRecognizer = {
        let gesture = UIScreenEdgePanGestureRecognizer(target: self, action: #selector(handlePan(_:)))
        gesture.edges = .left
        gesture.delegate = self
        return gesture
    }()

    @objc func handlePan(_ event: UIPanGestureRecognizer) {
        guard let webView = event.view as? WKWebView else { return }
        switch event.state {
        case .possible:
            return
        case .began:
            webView.evaluateJavaScript("ScreenEdgePanGestureRecognizerStart()")
        case .changed:
            let progress = event.location(in: webView).x / webView.frame.width
            webView.evaluateJavaScript("ScreenEdgePanGestureRecognizerChange(\(progress))")
        case .cancelled, .failed, .ended:
            let progress = event.location(in: webView).x / webView.frame.width
            let velocity = event.velocity(in: gesture.view).x > 800
            let finish = progress > 0.5 || velocity ? "true" : "false"
            webView.evaluateJavaScript("ScreenEdgePanGestureRecognizerEnded(\(finish))")
        @unknown default:
            webView.evaluateJavaScript("ScreenEdgePanGestureRecognizerEnded(false)")
        }
    }

    func stick(_ webView: WKWebView) {
        webView.addGestureRecognizer(gesture)
    }
}

extension PanGestureRecongnizerBackProcessor: UIGestureRecognizerDelegate {
    func gestureRecognizer(_: UIGestureRecognizer, shouldBeRequiredToFailBy _: UIGestureRecognizer) -> Bool {
        return true
    }
}
```

### 3. 绑定到 WebView

```swift
PanGestureRecongnizerBackProcessor.shared.stick(webView)
```

## Web 端

Navigation 已自动注册全局函数，无需额外配置：

- `ScreenEdgePanGestureRecognizerStart()` - 手势开始
- `ScreenEdgePanGestureRecognizerChange(progress)` - 手势进度变化
- `ScreenEdgePanGestureRecognizerEnded(finish)` - 手势结束

`NavPage` 组件内置了跟手动画，会根据 progress 值自动更新页面位置。

## useProgressExitAnimated

如果你需要在手势返回时执行自定义动画，可以使用 `useProgressExitAnimated` 获取实时进度：

::: code-group

```tsx [Vue]
import { ref, defineComponent } from 'vue'
import { useProgressExitAnimated, NavPage } from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    const progress = ref(0)
    
    useProgressExitAnimated((p) => {
      progress.value = p
      // p: 0 ~ 1，表示返回手势的进度
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

### 回调参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `progress` | `number` | 手势进度，0 ~ 1 |

### 使用场景

- 页面透明度渐变
- 自定义视差效果
- 下层页面动画联动

## 阻止手势返回

使用 `useLeaveBefore` 可以阻止手势返回：

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
    return false
  })

  return <NavPage>这个页面不能通过手势返回</NavPage>
}
```

:::

## 手势判定

iOS 原生端会根据以下条件判断是否完成返回：

- **进度 > 50%** - 完成返回
- **滑动速度 > 800** - 快速滑动完成返回
- 否则取消返回，页面回弹

## 配合生命周期

手势返回和普通 `back()` 调用一样，会触发完整的生命周期：

```tsx
onWillDisappear(() => {
  // 无论是手势返回还是 back()，都会触发
  console.log('页面即将消失')
})
```
