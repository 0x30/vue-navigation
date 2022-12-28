## vue-navgation [![beta](https://img.shields.io/npm/v/@0x30/vue-navigation)](https://www.npmjs.com/package/@0x30/vue-navigation)

模仿ios `UINavigationController` 缓存页面的方式，前进新的视图，back从堆栈中拉取缓存的视图

## 使用方式

```ts
import { Component } from "vue";
/**
 * 在页面在返回,提供一个方法,向用户询问
 * 请保证该方法只被注册一次,多次注册将覆盖
 */
export declare const useLeaveBefore: (hook: () => boolean | Promise<boolean>) => void;
/**
 * 在页面进入时设置 动画执行方法
 * 请保证该方法只被注册一次,多次注册将覆盖
 */
export declare const useTransitionEnter: (hook: (el: Element, done: () => void) => void) => void;
/**
 * 在页面离开时设置 动画执行方法
 * 请保证该方法只被注册一次,多次注册将覆盖
 */
export declare const useTransitionLeave: (hook: (el: Element, done: () => void) => void) => void;
/**
 * use activeated 活跃的时候 hook
 */
export declare const useActivated: (hook: () => void) => void;
/**
 * use activeated 非活跃的时候 hook
 */
export declare const useDeactivated: (hook: () => void) => void;
/**
 * 示例
````ts
import { createApp } from 'vue'

const app = createApp({
  // ...
})

app.use(navigation())
````

在 app,创建后 use 开始启用 该插件
 */
export declare const navigation: () => {
    install(): void;
};
/**
 * 前进方法
 *
 * ```tsx
 * import Component from "./component"
 *
 * push(<Component prop1={1} />)
 * ```
 *
 * 异步加载组件使用 vue 自带的 `defineAsyncComponent`
 *
 * ```tsx
 * const Component = defineAsyncComponent(() => import("./component"));
 * push(<Component prop1={1} />);
 * ```
 *
 * 方法返回 `Promise<void>`, 在页面完成跳转后 `promise.reslove`
 *
 * 组件可以通过设置 `useTransitionEnter` 设置页面动画,如果设置动画则会在动画执行完成后, `promise.reslove`
 *
 * @param component 组件
 */
export declare const push: (component: Component) => Promise<void>;
/**
 * 替换方法
 *
 * ```tsx
 * import Component from "./component"
 *
 * replace(<Component prop1={1} />)
 * ```
 *
 * 异步加载组件使用 vue 自带的 `defineAsyncComponent`
 *
 * ```tsx
 * const Component = defineAsyncComponent(() => import("./component"));
 * replace(<Component prop1={1} />);
 * ```
 *
 * 方法返回 `Promise<void>`, 在页面完成跳转后 `promise.reslove`
 *
 * 组件可以通过设置 `useTransitionEnter` 设置页面动画,如果设置动画则会在动画执行完成后, `promise.reslove`
 *
 * @param component 组件
 */
export declare const replace: (component: Component) => Promise<void>;
/**
 * 返回当前最顶部页面方法
 *
 * 方法返回 `Promise<void>`, 在页面完成跳转后 `promise.reslove`
 *
 * 组件可以通过设置 `useTransitionLeave` 设置页面离开动画,如果设置动画则会在动画执行完成后, `promise.reslove`
 *
 * @param delta 返回次数 uint
 */
export declare const back: (delta?: number) => Promise<void>;

```