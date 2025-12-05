---
layout: home

hero:
  name: Navigation
  text: 原生级页面导航体验
  tagline: 为 Vue 和 React 打造的强大导航库，支持手势返回、页面转场动画、Hero 动画等特性
  image:
    src: /logo.svg
    alt: Navigation
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看 Demo
      link: /vue/
    - theme: alt
      text: GitHub
      link: https://github.com/0x30/vue-navigation

features:
  - icon: 🔄
    title: 栈式导航
    details: 类似原生 App 的页面栈管理，支持 push、pop、replace 等操作
  - icon: 👆
    title: 手势返回
    details: 从屏幕左边缘滑动即可返回上一页，完美模拟原生体验
  - icon: ⚡
    title: 高性能动画
    details: 基于 Anime.js 的流畅动画，支持自定义转场效果
  - icon: 🦸
    title: Hero 动画
    details: 跨页面元素共享动画，打造流畅的视觉过渡
  - icon: 🎯
    title: 生命周期钩子
    details: 丰富的页面生命周期钩子，精确控制页面行为
  - icon: 📱
    title: 移动端优先
    details: 专为移动端 Web App 设计，支持 Safe Area 适配
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #667eea 30%, #764ba2);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #667eea 50%, #764ba2 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
