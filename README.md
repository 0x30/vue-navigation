## vue-navgation [![beta](https://img.shields.io/npm/v/@0x30/vue-navigation)](https://www.npmjs.com/package/@0x30/vue-navigation)

模仿ios `UINavigationController` 缓存页面的方式，前进新的视图，back从堆栈中拉取缓存的视图

ps:
1. 此库不是 `router`,只是一种管理组件的方式
2. 此库所有页面均活跃,这不是内存泄漏,这符合ios视图导航的设计
3. 此库没有路由表,没有嵌套路由
4. 此库假定所有的页面组件均为`fixed`,且大小与屏幕一致
5. 此库只适用于极小众的项目,比如: 混合开发app内嵌的h5app

## 更多

参考例子: https://0x30.github.io/vue-navigation. 
