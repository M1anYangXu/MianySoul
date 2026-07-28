import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useModuleConfig } from "@/composables/useModuleConfig";

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
        path: "/about",
        name: "About",
        component: () => import("@/views/frontend/About.vue"),
        meta: { title: "关于我" },
      },
      {
        path: "/memory",
        name: "Memory",
        component: () => import("@/views/frontend/MemoryView.vue"),
        meta: { title: "记忆", requiresAuth: true },
      },
      {
        path: "/narrative",
        name: "Narrative",
        component: () => import("@/views/frontend/NarrativeView.vue"),
        meta: { title: "往事叙述" },
      },
      {
        path: "/narrative/:id",
        name: "NarrativeDetail",
        component: () => import("@/views/frontend/NarrativeDetail.vue"),
        meta: { title: "叙述详情" },
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
    path: "/admin/gallery",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminGallery",
        component: () => import("@/views/admin/Gallery.vue"),
        meta: { title: "图集", requiresAuth: true },
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
        meta: { title: "视频", requiresAuth: true },
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
        meta: { title: "漫想", requiresAuth: true },
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
        meta: { title: "用户", requiresAuth: true },
      },
    ],
  },
  {
    path: "/admin/siteinfo",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminSiteInfo",
        component: () => import("@/views/admin/SiteInfo.vue"),
        meta: { title: "网站信息", requiresAuth: true },
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
    path: "/admin/music",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminMusic",
        component: () => import("@/views/admin/Music.vue"),
        meta: { title: "音乐", requiresAuth: true },
      },
    ],
  },
  {
    path: "/admin/audio",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminAudio",
        component: () => import("@/views/admin/Audio.vue"),
        meta: { title: "音频", requiresAuth: true },
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
        meta: { title: "记忆", requiresAuth: true },
      },
    ],
  },
  {
    path: "/admin/narrative",
    component: () => import("@/layouts/LayoutAdminMinimal.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminNarrative",
        component: () => import("@/views/admin/Narrative.vue"),
        meta: { title: "叙述", requiresAuth: true },
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
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return { el: to.hash };
    } else {
      return { top: 0, left: 0 };
    }
  },
});

// 路由守卫
router.beforeEach((to, _from, next) => {
  const { getConfig, getModuleName } = useModuleConfig();
  const config = getConfig();
  const siteTitle = config.title || "MianySoul";

  let pageTitle = to.meta.title as string || "";
  
  if (to.path.startsWith("/admin/gallery")) {
    pageTitle = getModuleName("gallery");
  } else if (to.path.startsWith("/admin/videos")) {
    pageTitle = getModuleName("video");
  } else if (to.path.startsWith("/admin/articles")) {
    pageTitle = getModuleName("article");
  } else if (to.path.startsWith("/admin/users")) {
    pageTitle = getModuleName("users");
  } else if (to.path.startsWith("/admin/music")) {
    pageTitle = getModuleName("music");
  } else if (to.path.startsWith("/admin/audio")) {
    pageTitle = getModuleName("audio");
  } else if (to.path.startsWith("/admin/memory")) {
    pageTitle = getModuleName("memory");
  } else if (to.path.startsWith("/admin/narrative")) {
    pageTitle = getModuleName("narrative");
  }

  // 设置页面标题
  document.title = pageTitle ? `${pageTitle} - ${siteTitle}` : siteTitle;

  const userStore = useUserStore();

  // 路由鉴权
  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      return next({ name: "AdminLogin", query: { redirect: to.fullPath } });
    }
  }

  // 已登录时访问登录页，跳转到后台首页
  if (to.name === "AdminLogin") {
    if (userStore.isLoggedIn) {
      return next({ name: "AdminDashboard" });
    }
  }

  next();
});

export default router;
