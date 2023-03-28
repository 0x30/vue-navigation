import { createApp } from "vue";
import "./style.css";
import App from "./App";
import { didPageChange, navigation } from "./core";

didPageChange((type, params) => {
  console.log(type, params);
});

createApp(App)
  .use(navigation({ page: "home" }))
  .mount("#app");
