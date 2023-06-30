import { createApp } from "vue";
import "./style.css";
import App from "./App";
import { navigation } from "./core";
import { onPageChange } from "./core/hooks";

createApp(App).use(navigation()).mount("#app");

onPageChange((from, to) => {
  console.log("页面变化", from, to);
});
