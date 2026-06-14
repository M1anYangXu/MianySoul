import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/stores/user";

// 前台路由
const frontendRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/FrontendLayout.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/frontend/Home.vue"),
        meta: { title: "首页" },
      },
    ],
  },
];

// 后台路由
const adminRoutes: RouteRecordRaw[] = [
  {
    path: "/admin",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminDashboard",
        component: () => import("@/views/admin/Test.vue"),
        meta: { title: "测试页", requiresAuth: true },
      },
      {
        path: "test",
        name: "AdminTest",
        component: () => import("@/views/admin/Test.vue"),
        meta: { title: "测试页", requiresAuth: true },
      },
    ],
  },
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: () => import("@/views/admin/Login.vue"),
    meta: { title: "登录" },
  },
];

// 实验场路由
const playgroundRoutes: RouteRecordRaw[] = [
  {
    path: "/playground",
    component: () => import("@/layouts/PureLayout.vue"),
    children: [
      {
        path: "",
        name: "Playground",
        component: () => import("@/views/playground/Index.vue"),
        meta: { title: "实验场" },
      },
    ],
  },
];

// 404 路由
const errorRoutes: RouteRecordRaw[] = [
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/error/404.vue"),
    meta: { title: "页面不存在" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...frontendRoutes, ...adminRoutes, ...playgroundRoutes, ...errorRoutes],
});

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - MianySoul` : "MianySoul";

  // 后台路由鉴权
  if (to.meta.requiresAuth) {
    const userStore = useUserStore();
    if (!userStore.isLoggedIn) {
      return next({ name: "AdminLogin", query: { redirect: to.fullPath } });
    }
  }

  // 已登录时访问登录页，跳转到后台首页
  if (to.name === "AdminLogin") {
    const userStore = useUserStore();
    if (userStore.isLoggedIn) {
      return next({ name: "AdminDashboard" });
    }
  }

  next();
});

export default router;
