import { ComponentOptions, h } from "vue";
import { RouteComponent, RouterView } from "vue-router";

export const components = {
  Home: { render: () => h("div", {}, "Home") },
  Foo: { render: () => h("div", {}, "Foo") },
  Bar: { render: () => h("div", {}, "Bar") },
  User: {
    props: {
      id: {
        default: "default",
      },
    },
    render() {
      return h("div", {}, "User: " + this.id);
    },
  } as ComponentOptions,
  WithProps: {
    props: {
      id: {
        default: "default",
      },
      other: {
        default: "other",
      },
    },
    render() {
      return h("div", {}, `id:${this.id};other:${this.other}`);
    },
  } as RouteComponent,
  Nested: {
    render: () => {
      return h("div", {}, [
        h("h2", {}, "Nested"),
        RouterView ? h(RouterView) : [],
      ]);
    },
  },
  BeforeLeave: {
    render: () => h("div", {}, "before leave"),
    beforeRouteLeave(to, from, next) {
      next();
    },
  } as RouteComponent,
};
