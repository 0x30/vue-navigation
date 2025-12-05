# API 参考

这里是 Navigation 库的完整 API 参考文档。

## 包结构

| 包名 | 说明 |
|------|------|
| `@0x30/navigation-core` | 框架无关的核心逻辑 |
| `@0x30/navigation-vue` | Vue 3 实现 |
| `@0x30/navigation-react` | React 18 实现 |

## 导航方法

| 方法 | 说明 |
|------|------|
| [push](/api/push) | 推入新页面 |
| [back](/api/back) | 返回上一页 |
| [replace](/api/replace) | 替换当前页面 |
| [blackBoxBack](/api/black-box-back) | 静默返回多层 |
| [backToHome](/api/back-to-home) | 返回首页 |
| `goBack(n)` | 返回 n 层 |
| `to(path)` | 导航到指定路径 |

## 页面组件

| 组件 | 说明 |
|------|------|
| [Navigator](/api/navigator) | 导航根容器 |
| [NavPage](/api/nav-page) | 带动画的页面 |
| [Page](/api/page) | 基础页面 |
| [SidePage](/api/side-page) | 侧边弹出页面 |
| [Safearea](/api/safearea) | 安全区域组件 |

## Hooks

| Hook | 说明 |
|------|------|
| [useLeaveBefore](/api/use-leave-before) | 离开前拦截 |
| [useQuietPage](/api/use-quiet-page) | 安静页面 |
| [useProgressExitAnimated](/api/use-progress-exit-animated) | 手势返回进度 |
| [生命周期 Hooks](/api/lifecycle-hooks) | 页面生命周期 |
| [useHero](/api/use-hero) | Hero 动画 |
| `useTransitionEnter` | 自定义进入动画 |
| `useTransitionLeave` | 自定义退出动画 |
| `usePageMate` | 页面元数据 |

## UI 组件

| API | 说明 |
|-----|------|
| [Loading](/api/loading) | 加载指示器 |
| [Toast](/api/toast) | 轻提示 |
| [Popup](/api/popup) | 动态弹窗工具 |

## 工具函数

| 函数 | 说明 |
|------|------|
| `disableBodyPointerEvents()` | 禁用页面 pointer events |
| `enableBodyPointerEvents()` | 启用页面 pointer events |
| `wait(ms)` | 等待指定毫秒 |

## 类型定义

```tsx
// 页面生命周期钩子
type LifeCycleHooks = {
  onWillAppear?: () => void
  onDidAppear?: () => void
  onWillDisappear?: () => void
  onDidDisappear?: () => void
}

// 离开前钩子
type LeaveBeforeHook = () => boolean | Promise<boolean>

// 转场动画钩子
type TransitionAnimatorHook = (el: Element, done: () => void) => void

// 手势进度处理器
type ProgressExitAnimatedHandler = (progress: number) => void

// 页面元数据
type PageMate = Record<string, any>

// Hero 动画上下文
interface HeroAnimationContext {
  el: HTMLElement
  from: HeroTransform
  to: HeroTransform
  done: () => void
}

interface HeroTransform {
  left: number
  top: number
  width: number
  height: number
}

// SidePage 动画处理器
type SidePageAnimationHandler = (
  context: SidePageAnimationContext,
  done: () => void
) => void

interface SidePageAnimationContext {
  contentEl: HTMLElement
  maskEl: HTMLElement
}
```
