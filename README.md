## vue-navgation

模仿ios `UINavigationController` 缓存页面的方式，前进新的视图，back从堆栈中拉取缓存的视图

## 使用方式

只使用组件

```tsx
import {
  VueNavigation as Navigation
} from "@0x30/vue-navigation";

<RouterView>
  {({ Component }: any) => (
    <Navigation>
      <Component />
    </Navigation>
  )}
</RouterView>;
```

监听页面的变化，以及方向

```tsx
export declare const useRouterListen: (router: Router, callback?: NavigationCallback | undefined) => () => void;
```

## 注意事项

在和vue`Transition`一起使用时，由于特殊的 vue-jsx 特殊的解析方式，在引入时需要 
```tsx
import {
  VueNavigation as KeepAlive
} from "@0x30/vue-navigation";

<KeepAlive></KeepAlive>
```

