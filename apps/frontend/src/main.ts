import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import naiveUi from "naive-ui";
import { addCollection } from "@iconify/vue";
import mdiIcons from "@/data/mdiIcons";
import App from "./App.vue";
import router from "./router";
import "./styles/main.css";

addCollection(mdiIcons);

const app = createApp(App);

// Pinia 状态管理
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

// 路由
app.use(router);

// Naive UI
app.use(naiveUi);

app.mount("#app");
