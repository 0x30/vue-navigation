## @0x30/vue-navigation-layout

基于 `@0x30/vue-navigation` 进行开发的组件布局库，提供了一些预设的动画


### 组件

```ts
// 基础页面
export { default as Page } from './Page'

// NavPage 执行动画 类似于 iOS UINavgationController
export { default as NavPage } from './NavPage'

// 安全区域
export {
  SafeBottomSpace,
  SafeLeftSpace,
  SafeRightSpace,
  SafeTopSpace,
} from './Safearea'

// Side 出现方法
export { default as SidePage } from './SidePage'

// loading 组件
export * from './Loading'

// popup 方法
// 不同于 navigator 这个辅助方法 只会展示组件，但不会 修改历史
export * from './Popup'
```


### 滑动返回 iOS

```swift
//
//  PanGestureRecongnizerBackProcessor.swift
//  AiHoney
//
//  Created by 荆文征 on 2023/12/27.
//

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

#### 使用方法

```swift
PanGestureRecongnizerBackProcessor.shared.stick(webView)
```