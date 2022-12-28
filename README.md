## vue-navgation [![beta](https://img.shields.io/npm/v/@0x30/vue-navigation)](https://www.npmjs.com/package/@0x30/vue-navigation)

模仿ios `UINavigationController` 缓存页面的方式，前进新的视图，back从堆栈中拉取缓存的视图

## 使用方式

一共有以下方法

1. navigation
1. useLeaveBefore
1. useTransitionEnter
1. useTransitionLeave
1. useActivated
1. useDeactivated
1. push
1. replace
1. back

### 1. navigation

向vue注册navigation

````ts
import { createApp } from 'vue'

const app = createApp({
  // ...
})

app.use(navigation())
````

### 2. push & replace & back

导航方法

 ```tsx
 import Component from "./component"
 push(<Component prop1={1} />)
 ```

 异步加载组件使用 vue 自带的 `defineAsyncComponent`

 ```tsx
 const Component = defineAsyncComponent(() => import("./component"));
 push(<Component prop1={1} />);
 ```


### 2. useLeaveBefore & useTransitionEnter

在组件增加进入页面和离开页面的方法,以 done 为结束

````ts
 useTransitionEnter((el, done) => {
   anime({
   targets: el,
   translateY: ["100%", "0"],
   duration: 800,
   complete: done,
   });
 });

 useTransitionLeave((el, done) => {
   anime({
   targets: el,
   translateY: ["0", "100%"],
   duration: 800,
   complete: done,
   });
 });
````

### 3. useActivated & useDeactivated

类似于`KeepAlive`的 `onActivated & onDeactivated`

## 更多

参考例子: https://0x30.github.io/vue-navigation. 
