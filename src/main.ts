import { createApp } from "vue";
import "./style.css";
import App from "./App";
import { navigation, onPageChange } from "./core";

onPageChange((type, params) => {
  console.log(type, params);
});

createApp(App)
  .use(navigation({ page: "home" }))
  .mount("#app");
