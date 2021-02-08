import { createMemoryHistory, createRouter, RouteRecordRaw } from "vue-router";
import { currentDirection, useRouterListen } from "../../src";
import { NavigationDirection } from "../../src/utils/libRouter";
import { components } from "./utils";

const routes: RouteRecordRaw[] = [
  { path: "/", component: components.Home, name: "home" },
  { path: "/home", redirect: "/" },
  {
    path: "/home-before",
    component: components.Home,
    beforeEnter: (to, from, next) => {
      next("/");
    },
  },
  { path: "/search", component: components.Home },
  { path: "/foo", component: components.Foo, name: "Foo" },
  { path: "/to-foo", redirect: "/foo" },
  { path: "/to-foo-named", redirect: { name: "Foo" } },
  { path: "/to-foo2", redirect: "/to-foo" },
  { path: "/to-foo-query", redirect: "/foo?a=2#b" },
  { path: "/to-p/:p", redirect: { name: "Param" } },
  { path: "/p/:p", name: "Param", component: components.Bar },
  { path: "/repeat/:r+", name: "repeat", component: components.Bar },
  { path: "/to-p/:p", redirect: (to) => `/p/${to.params.p}` },
  { path: "/before-leave", component: components.BeforeLeave },
  {
    path: "/parent",
    meta: { fromParent: "foo" },
    component: components.Foo,
    children: [
      { path: "child", meta: { fromChild: "bar" }, component: components.Foo },
    ],
  },
  {
    path: "/inc-query-hash",
    redirect: (to) => ({
      name: "Foo",
      query: { n: to.query.n + "-2" },
      hash: to.hash + "-2",
    }),
  },
  {
    path: "/basic",
    alias: "/basic-alias",
    component: components.Foo,
  },
  {
    path: "/aliases",
    alias: ["/aliases1", "/aliases2"],
    component: components.Nested,
    children: [
      {
        path: "one",
        alias: ["o", "o2"],
        component: components.Foo,
        children: [
          { path: "two", alias: ["t", "t2"], component: components.Bar },
        ],
      },
    ],
  },
  { path: "/:pathMatch(.*)", component: components.Home, name: "catch-all" },
];

async function newRouter(
  options: Partial<Parameters<typeof createRouter>[0]> = {}
) {
  const history = options.history || createMemoryHistory();
  const router = createRouter({ history, routes, ...options });
  await router.push("/");

  return { history, router };
}

describe("Router", () => {
  it("starts at START_LOCATION", () => {
    const history = createMemoryHistory();
    const router = createRouter({ history, routes });
    useRouterListen(router);
    router.push("/basic");
    expect(currentDirection).toEqual(NavigationDirection.forward);
  });
});
