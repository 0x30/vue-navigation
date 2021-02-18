import { createMemoryHistory, createRouter, RouteRecordRaw } from "vue-router";
import { currentDirection, useRouterListen } from "../../src";
import { currentDelta, NavigationDirection } from "../../src/utils/libRouter";
import { components } from "./utils";

const routes: RouteRecordRaw[] = [
  { path: "/", component: components.Home, name: "home" },
  { path: "/basic", component: components.Foo },
  { path: "/search", component: components.Bar }
];

describe("测试监听方向方法", () => {
  it("当调用 router 前进方法时，当前方向是否为 前进", () => {
    const history = createMemoryHistory();
    const router = createRouter({ history, routes });
    useRouterListen(router);
    router.push("/basic");
    expect(currentDirection).toEqual(NavigationDirection.forward);
  });

  it("当调用 router 返回方法时，当前方向是否为 返回", () => {
    const history = createMemoryHistory();
    const router = createRouter({ history, routes });
    useRouterListen(router);
    router.push("/basic");
    router.back();
    expect(currentDirection).toEqual(NavigationDirection.back);
    expect(currentDelta).toEqual(-1);
  });

  it("当调用 router 返回方法时，当前方向是否为 返回 -2", () => {
    const history = createMemoryHistory();
    const router = createRouter({ history, routes });
    useRouterListen(router);
    router.push("/search");
    router.push("/basic");
    router.go(-2);
    expect(currentDirection).toEqual(NavigationDirection.back);
    expect(currentDelta).toEqual(-2);
  });

  it("当调用 router 替换方法时，当前方向是否为 替换", () => {
    const history = createMemoryHistory();
    const router = createRouter({ history, routes });
    useRouterListen(router);
    router.replace("/basic");
    expect(currentDirection).toEqual(NavigationDirection.replace);
  });
});
