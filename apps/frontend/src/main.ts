import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
import "./styles/main.css";

const app = createApp(App);

// 全局错误处理：捕获组件渲染、生命周期等错误，避免整个页面白屏
app.config.errorHandler = (err, instance, info) => {
  console.error(
    "[Vue Error]",
    err,
    "\nComponent:",
    instance?.$options?.__name || "unknown",
    "\nInfo:",
    info
  );
};

// Pinia 状态管理
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

// 路由
app.use(router);

app.mount("#app");
