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
      {
        path: "/archive",
        name: "Archive",
        component: () => import("@/views/frontend/Archive.vue"),
        meta: { title: "归档" },
      },
      {
        path: "/archive/:id",
        name: "ArticleDetail",
        component: () => import("@/views/frontend/ArticleDetail.vue"),
        meta: { title: "文章详情" },
      },
      {
        path: "/archive/categories",
        name: "ArchiveCategories",
        component: () => import("@/views/frontend/Category.vue"),
        meta: { title: "分类" },
      },
      {
        path: "/archive/tags",
        name: "ArchiveTags",
        component: () => import("@/views/frontend/Tags.vue"),
        meta: { title: "标签云" },
      },
      {
        path: "/lyrics",
        name: "Lyrics",
        component: () => import("@/views/frontend/Lyrics.vue"),
        meta: { title: "歌词" },
      },
      {
        path: "/gallery",
        name: "Gallery",
        component: () => import("@/views/frontend/Gallery.vue"),
        meta: { title: "图集" },
      },
      {
        path: "/scenes",
        name: "Scenes",
        component: () => import("@/views/frontend/Scenes.vue"),
        meta: { title: "场景" },
      },
      {
        path: "/about",
        name: "About",
        component: () => import("@/views/frontend/About.vue"),
        meta: { title: "关于我" },
      },
      {
        path: "/footprint",
        name: "Footprint",
        component: () => import("@/views/frontend/Footprint.vue"),
        meta: { title: "足迹" },
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
    path: "/admin/test",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminTest",
        component: () => import("@/views/admin/Test.vue"),
        meta: { title: "测试页", requiresAuth: true },
      },
    ],
  },
  {
    path: "/admin/footprint",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminFootprint",
        component: () => import("@/views/admin/Footprint.vue"),
        meta: { title: "足迹管理", requiresAuth: true },
      },
    ],
  },
  {
    path: "/admin/gallery",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminGallery",
        component: () => import("@/views/admin/Gallery.vue"),
        meta: { title: "图集管理", requiresAuth: true },
      },
    ],
  },
  {
    path: "/admin/videos",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminVideos",
        component: () => import("@/views/admin/Video.vue"),
        meta: { title: "视频管理", requiresAuth: true },
      },
    ],
  },
  {
    path: "/admin/articles",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminArticles",
        component: () => import("@/views/admin/Article.vue"),
        meta: { title: "文章管理", requiresAuth: true },
      },
    ],
  },
  {
    path: "/admin/users",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminUsers",
        component: () => import("@/views/admin/Users.vue"),
        meta: { title: "用户管理", requiresAuth: true },
      },
    ],
  },
  {
    path: "/admin/settings",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminSettings",
        component: () => import("@/views/admin/Settings.vue"),
        meta: { title: "系统配置", requiresAuth: true },
      },
    ],
  },
  {
    path: "/admin/activity",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminActivity",
        component: () => import("@/views/admin/Activity.vue"),
        meta: { title: "系统记录", requiresAuth: true },
      },
    ],
  },
  {
    path: "/admin/scenes",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminScenes",
        component: () => import("@/views/admin/Scenes.vue"),
        meta: { title: "场景管理", requiresAuth: true },
      },
    ],
  },
  {
    path: "/admin/music",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminMusic",
        component: () => import("@/views/admin/Music.vue"),
        meta: { title: "音乐管理", requiresAuth: true },
      },
    ],
  },
  {
    path: "/admin/memory",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminMemory",
        component: () => import("@/views/admin/Memory.vue"),
        meta: { title: "记忆管理", requiresAuth: true },
      },
      {
        path: "memoir/:categoryId",
        name: "AdminMemoirCategory",
        component: () => import("@/views/admin/MemoirCategory.vue"),
        meta: { title: "回忆录详情", requiresAuth: true },
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
    ...authRoutes,
    ...adminPortalRoutes,
    ...adminMinimalRoutes,
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
