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