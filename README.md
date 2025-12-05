# Navigation

一个强大的 Vue & React 导航库，提供原生级别的页面切换体验。

## ✨ 特性

- 🚀 **原生体验** - 流畅的页面转场动画，支持 iOS 风格手势返回
- 📦 **多框架支持** - 同时支持 Vue 3 和 React
- 🎯 **简单易用** - 基于组件的 API 设计，上手即用
- 🔄 **页面缓存** - 自动管理页面状态，返回时保持滚动位置
- 🎨 **高度可定制** - 支持自定义转场动画和页面样式

## 📚 文档

👉 **[查看完整文档](https://0x30.github.io/navigation/)**

## 📦 包

| 包名 | 版本 |
| --- | --- |
| [@0x30/navigation-core](packages/navigation-core) | [![npm](https://img.shields.io/npm/v/@0x30/navigation-core)](https://www.npmjs.com/package/@0x30/navigation-core) |
| [@0x30/navigation-vue](packages/navigation-vue) | [![npm](https://img.shields.io/npm/v/@0x30/navigation-vue)](https://www.npmjs.com/package/@0x30/navigation-vue) |
| [@0x30/navigation-react](packages/navigation-react) | [![npm](https://img.shields.io/npm/v/@0x30/navigation-react)](https://www.npmjs.com/package/@0x30/navigation-react) |

## 🚀 快速开始

### Vue

```bash
pnpm add @0x30/navigation-vue
```

```vue
<script setup lang="ts">
import { Navigator, Page } from '@0x30/navigation-vue'
import Home from './views/Home.vue'
</script>

<template>
  <Navigator>
    <Page>
      <Home />
    </Page>
  </Navigator>
</template>
```

### React

```bash
pnpm add @0x30/navigation-react
```

```tsx
import { Navigator, Page } from '@0x30/navigation-react'
import Home from './views/Home'

function App() {
  return (
    <Navigator>
      <Page>
        <Home />
      </Page>
    </Navigator>
  )
}
```

## 📖 了解更多

- [快速开始](https://0x30.github.io/navigation/guide/getting-started)
- [导航](https://0x30.github.io/navigation/guide/navigation)
- [页面组件](https://0x30.github.io/navigation/guide/page-components)
- [手势返回](https://0x30.github.io/navigation/guide/gesture)

## License

MIT
