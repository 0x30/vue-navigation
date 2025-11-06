## navigation

## 安装

```shell
npm install github:0x30/vue-navigation
```

使用workspace方式安装后，可以通过 `navigation` 和 `navigation-vue` 两个包名导入。

```js
import { navigation } from 'navigation'
import { NavPage } from 'navigation-vue'
```

## 使用

### 初始化

component 方式

```jsx
import { Navigator } from 'navigation'

createApp(
  <Navigator>
    <Home />
  </Navigator>
).mount('#app')
```

plugin 方式

```jsx
import { navigation } from 'navigation'

createApp(<Home />)
  .use(navigation)
  .mount('#app')
```

### 操作方法

```jsx
import { push, replace, to } from 'navigation'

/**
 * 推出 一个 div 到当前之上
 */
push(<div />)

/**
 * replace 当前
 */
replace(<div />)

/**
 * repace 与 push 的辅助方式
 */
to(true)(<div />)
```

返回

```js
import { back, blackBoxBack, backToHome } from 'navigation'

/**
 * 返回方法
 */
back()

/**
 * 黑箱返回
 * 当页面前往 一个页面后 可以移除掉一些之前的页面
 * 
 *  a -> b -> c -> d
 *  blackBoxBack(2)
 *  a -> d
 */
blackBoxBack()

/**
 * 回到rootView
 */
backToHome()
```

## hooks 方法

* `onWillAppear` 页面即将出现，执行动画之前
* `onDidAppear` 页面已经出现，执行动画完成
* `onWillDisappear` 页面即将消失，执行动画之前
* `onDidDisappear` 页面已经消失，执行动画完成
* `useTransitionEnter` 进入动画配置
* `useTransitionLeave` 离开动画配置
* `useLeaveBefore` 页面返回之前的拦截方法
* `useQuietPage` 设置当前页面为安静的页面
* `usePageMate` 配置当前页面的 基础信息
* `getCurrentPageMate` 获取当前页面的 配置信息
* `onPageChange` 当前发生变化
* `useProgressExitAnimated` 配置渐进式动画

## 特殊说明

* 此库不是 `router`,只是一种管理组件的方式
* 此库所有页面均活跃,这不是内存泄漏,这符合ios视图导航的设计
* 此库没有路由表,没有嵌套路由
* 此库假定所有的页面组件均为`fixed`,且大小与屏幕一致
* 此库只适用于极小众的项目,比如: 混合开发app内嵌的h5app