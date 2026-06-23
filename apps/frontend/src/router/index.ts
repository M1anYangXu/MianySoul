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

// 后台路由 - 门户卡片首页
const adminPortalRoutes: RouteRecordRaw[] = [
  {
    path: "/admin",
    component: () => import("@/layouts/LayoutAdminPortal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminDashboard",
        component: () => import("@/views/admin/Dashboard.vue"),
        meta: { title: "门户首页", requiresAuth: true },
      },
    ],
  },
];

// 后台路由 - 极简顶栏布局
const adminMinimalRoutes: RouteRecordRaw[] = [
  {
    path: "/admin",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "test",
        name: "AdminTest",
        component: () => import("@/views/admin/Test.vue"),
        meta: { title: "测试页", requiresAuth: true },
      },
      {
        path: "gallery",
        name: "AdminGallery",
        component: () => import("@/views/admin/Gallery.vue"),
        meta: { title: "图集管理", requiresAuth: true },
      },
      {
        path: "videos",
        name: "AdminVideos",
        component: () => import("@/views/admin/Video.vue"),
        meta: { title: "视频管理", requiresAuth: true },
      },
      {
        path: "articles",
        name: "AdminArticles",
        component: () => import("@/views/admin/Test.vue"),
        meta: { title: "文章管理", requiresAuth: true },
      },
      {
        path: "users",
        name: "AdminUsers",
        component: () => import("@/views/admin/Users.vue"),
        meta: { title: "用户管理", requiresAuth: true },
      },
      {
        path: "settings",
        name: "AdminSettings",
        component: () => import("@/views/admin/Settings.vue"),
        meta: { title: "系统配置", requiresAuth: true },
      },
      {
        path: "scenes",
        name: "AdminScenes",
        component: () => import("@/views/admin/Scenes.vue"),
        meta: { title: "场景管理", requiresAuth: true },
      },
      {
        path: "music",
        name: "AdminMusic",
        component: () => import("@/views/admin/Test.vue"),
        meta: { title: "音乐管理", requiresAuth: true },
      },
      {
        path: "memory",
        name: "AdminMemory",
        component: () => import("@/views/admin/Memory.vue"),
        meta: { title: "记忆管理", requiresAuth: true },
      },
      {
        path: "memory/memoir/:categoryId",
        name: "AdminMemoirCategory",
        component: () => import("@/views/admin/MemoirCategory.vue"),
        meta: { title: "回忆录详情", requiresAuth: true },
      },
    ],
  },
];

// 实验场路由
const playgroundRoutes: RouteRecordRaw[] = [
  {
    path: "/playground",
    component: () => import("@/layouts/LayoutAdminPure.vue"),
    children: [
      {
        path: "",
        name: "Playground",
        component: () => import("@/views/playground/Index.vue"),
        meta: { title: "实验场" },
      },
      {
        path: "seaside",
        name: "PlaygroundSeaside",
        component: () => import("@/views/playground/SeasideView.vue"),
        meta: { title: "世界海滨之旅" },
      },
    ],
  },
];

// 登录路由
const authRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: () => import("@/views/admin/Login.vue"),
    meta: { title: "登录" },
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
  routes: [
    ...frontendRoutes,
    ...adminPortalRoutes,
    ...adminMinimalRoutes,
    ...playgroundRoutes,
    ...authRoutes,
    ...errorRoutes,
  ],
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
