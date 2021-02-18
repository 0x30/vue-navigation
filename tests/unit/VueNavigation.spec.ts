/**
 * @jest-environment jsdom
 */
import { mount, VueWrapper } from "@vue/test-utils";
import { defineComponent, nextTick } from "vue";
import { createMemoryHistory, createRouter, Router } from "vue-router";
import { Navigation } from "../../src/components/Vuenavigation";

const Component = (methods: jest.Mock[] = []) => {
  const [created, mounted, unmounted, activated, deactivated] = methods;

  return defineComponent({
    props: { title: String },
    template: `
    <h1>{{title}} {{count}}</h1>
    <button @click="clickCount">点击</button>
    `,
    data() {
      return {
        count: 0
      };
    },
    methods: {
      clickCount() {
        this.count++;
      }
    },
    created,
    mounted,
    unmounted,
    activated,
    deactivated
  });
};

const App = defineComponent({
  components: {
    "vue-navigation": Navigation
  },
  template: `
  <router-view v-slot="{ Component }">
    <vue-navigation>
      <component :is="Component" />
    </vue-navigation>
  </router-view>
  `
});

describe("导航组件测试", () => {
  let router: Router;
  let wrapper: VueWrapper<any>;

  beforeAll(() => {
    const HomeComponent = defineComponent({
      template: `
      <base-component title="Home" />
      `,
      components: { "base-component": Component([]) }
    });

    const OtherComponent = defineComponent({
      template: `
      <base-component title="Other" />
      `,
      components: { "base-component": Component([]) }
    });

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/",
          name: "home",
          component: HomeComponent
        },
        {
          path: "/other",
          name: "other",
          component: OtherComponent
        }
      ]
    });

    wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    });
  });

  it("正常展示首页内容", async () => {
    await router.isReady();
    expect(wrapper.html()).toContain("Home");
  });

  it("点击两下,进入新的页面，返回仍然是敲击两下的状态", async () => {
    await router.isReady();
    await wrapper.find("button").trigger("click");
    await wrapper.find("button").trigger("click");
    router.push("/other");
    router.back();
    await nextTick();
    expect(wrapper.html()).toContain("Home 2");
  });

  // it("主页点击2下,进入other页面，点击两下，替换进入主页，返回应该为主页2次", async () => {
  //   await router.isReady();
  //   await wrapper.find("button").trigger("click");
  //   await wrapper.find("button").trigger("click");

  //   await router.push("/other");
  //   await wrapper.find("button").trigger("click");
  //   expect(wrapper.html()).toContain("Other 1");
  //   await router.replace("/");
  //   router.back();
  //   await nextTick();
  //   expect(wrapper.html()).toContain("Home 2");
  // });
});

describe("生命周期测试", () => {
  it("正常触发 actived 以及 deactive", async () => {
    const homeMockCreated = jest.fn();
    const homeMockMounted = jest.fn();
    const homeMockUnmounted = jest.fn();
    const homeMockActivated = jest.fn();
    const homeMockDeactivated = jest.fn();

    const HomeMocks = [
      homeMockCreated,
      homeMockMounted,
      homeMockUnmounted,
      homeMockActivated,
      homeMockDeactivated
    ];

    const otherMockCreated = jest.fn();
    const otherMockMounted = jest.fn();
    const otherMockUnmounted = jest.fn();
    const otherMockActivated = jest.fn();
    const otherMockDeactivated = jest.fn();

    const OthersMocks = [
      otherMockCreated,
      otherMockMounted,
      otherMockUnmounted,
      otherMockActivated,
      otherMockDeactivated
    ];

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/",
          name: "home",
          component: Component(HomeMocks)
        },
        {
          path: "/other",
          name: "other",
          component: Component(OthersMocks)
        }
      ]
    });

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    });

    await router.isReady();

    expect(HomeMocks.map(res => res.mock.calls.length)).toEqual([
      1,
      1,
      0,
      1,
      0
    ]);

    await router.push("/other");

    expect(HomeMocks.map(res => res.mock.calls.length)).toEqual([
      1,
      1,
      0,
      1,
      1
    ]);

    expect(OthersMocks.map(res => res.mock.calls.length)).toEqual([
      1,
      1,
      0,
      1,
      0
    ]);

    router.back();
    await router.isReady();
    await nextTick();

    /// 暂缓一秒钟，调用方法
    await (() => {
      return new Promise<void>(resolve => {
        setTimeout(resolve, 1000);
      });
    })();

    expect(OthersMocks.map(res => res.mock.calls.length)).toEqual([
      1,
      1,
      1,
      1,
      0
    ]);

    expect(HomeMocks.map(res => res.mock.calls.length)).toEqual([
      1,
      1,
      0,
      2,
      1
    ]);
  });
});
