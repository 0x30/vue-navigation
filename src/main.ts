import { createApp } from "vue";
import "./style.css";
import App from "./App";
import { navigation } from "./core";

createApp(App).use(navigation()).mount("#app");
