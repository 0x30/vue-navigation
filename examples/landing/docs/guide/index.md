# 介绍

Navigation 是一个为 Vue 和 React 打造的页面导航库，提供类似原生 App 的导航体验。

## 特性

### 🔄 栈式导航

采用页面栈的方式管理页面，支持：

- `push` - 推入新页面
- `back` - 返回上一页
- `replace` - 替换当前页面
- `blackBoxBack` - 静默返回多层
- `backToHome` - 返回首页

### 👆 手势返回

从屏幕左边缘向右滑动即可触发返回操作，支持：

- 实时跟手的动画效果
- 可自定义的动画处理
- 可禁用手势返回

### ⚡ 流畅动画

基于 [Anime.js](https://animejs.com/) 实现的高性能动画：

- 页面推入/推出动画
- 侧边弹出动画
- 居中弹窗动画
- 自定义动画支持

### 🦸 Hero 动画

跨页面元素共享动画，实现流畅的视觉过渡效果。

### 🎯 生命周期

丰富的页面生命周期钩子：

- `onWillAppear` - 页面即将显示
- `onDidAppear` - 页面已显示
- `onWillDisappear` - 页面即将消失
- `onDidDisappear` - 页面已消失

### 📱 移动端适配

- Safe Area 安全区域组件
- 禁用页面滚动时的 pointer events
- 适配各种移动端浏览器

## 框架支持

| 框架 | 包名 |
|------|------|
| Vue 3 | `@0x30/navigation-vue` |
| React 18 | `@0x30/navigation-react` |
| Core (框架无关) | `@0x30/navigation-core` |

## 快速体验

<div style="display: flex; gap: 12px; margin-top: 20px;">
  <a href="https://0x30.github.io/navigation/vue/" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(135deg, #42b883, #35495e); color: white; border-radius: 8px; text-decoration: none; font-weight: 500;">
    Vue Demo →
  </a>
  <a href="https://0x30.github.io/navigation/react/" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(135deg, #61dafb, #282c34); color: white; border-radius: 8px; text-decoration: none; font-weight: 500;">
    React Demo →
  </a>
</div>
