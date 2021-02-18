import { createApp, defineComponent, ref } from "vue";
import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  RouterLink,
  RouterView,
  useRouter
} from "vue-router";
import { Navigation } from "../src/components/Vuenavigation";
import { currentDirection, useRouterListen } from "../src/utils/libRouter";

const Page = defineComponent({
  created() {
    console.log("页面[", this.title, "] ---- created");
  },
  mounted() {
    console.log("页面[", this.title, "] ---- mounted");
  },
  unmounted() {
    console.log("页面[", this.title, "] ---- unmounted");
  },
  activated() {
    console.log("页面[", this.title, "] ---- activated");
  },
  deactivated() {
    console.log("页面[", this.title, "] ---- deactivated");
  },
  props: { title: String },
  setup: props => {
    const countRef = ref(0);

    const dateString = new Date().toLocaleString();
    return () => {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start"
          }}
        >
          <h1>Page {props.title}</h1>
          {dateString}
          count: {countRef.value}
          <button onClick={() => countRef.value++}>counnt +1</button>
          <RouterLink to="/a">push to a</RouterLink>
          <RouterLink to="/b">push to b</RouterLink>
          <RouterLink to="/c">push to c</RouterLink>
          <hr />
          <RouterLink to="/a" replace={true}>
            replace to a
          </RouterLink>
          <RouterLink to="/b" replace={true}>
            replace to b
          </RouterLink>
          <RouterLink to="/c" replace={true}>
            replace to c
          </RouterLink>
          <button onClick={() => useRouter().push("b")}>to b</button>
        </div>
      );
    };
  }
});

export const Pagea = defineComponent(() => {
  return () => <Page title="A"></Page>;
});

export const Pageb = defineComponent(() => {
  return () => <Page title="B"></Page>;
});

export const Pagec = defineComponent(() => {
  return () => <Page title="C"></Page>;
});

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    redirect: "/a"
  },
  {
    path: "/a",
    name: "a",
    component: Pagea
  },
  {
    path: "/b",
    name: "b",
    component: Pageb
  },
  {
    path: "/c",
    name: "c",
    component: Pagec
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

const App = defineComponent(() => {
  const dirRef = ref("unknow");
  useRouterListen(router, (_to, _from, dir, _del) => {
    dirRef.value = dir;
  });

  return () => {
    return (
      <RouterView>
        {({ Component }: any) => {
          return (
            <div>
              <div>当前方向：{currentDirection}</div>
              <Navigation>
                <Component />
              </Navigation>
            </div>
          );
        }}
      </RouterView>
    );
  };
});

createApp(App)
  .use(router)
  .mount("#app");
