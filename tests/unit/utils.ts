import { JSDOM } from "jsdom";
import { defineComponent, h } from "vue";
import { RouteRecordName } from "vue-router";

export const components = {
  Home: { render: () => h("div", {}, "Home") },
  Foo: { render: () => h("div", {}, "Foo") },
  Bar: { render: () => h("div", {}, "Bar") }
};

