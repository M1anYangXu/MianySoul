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

// 后台路由 - Navigation Rail 统一布局
const adminRailRoutes: RouteRecordRaw[] = [
  {
    path: "/admin",
    component: () => import("@/layouts/LayoutAdminRail.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "AdminDashboard",
        component: () => import("@/views/admin/Dashboard.vue"),
        meta: { title: "门户首页", requiresAuth: true },
      },
      {
        path: "gallery",
        name: "AdminGallery",
        component: () => import("@/views/admin/Gallery.vue"),
        meta: { title: "图集", requiresAuth: true },
      },
      {
        path: "videos",
        name: "AdminVideos",
        component: () => import("@/views/admin/Video.vue"),
        meta: { title: "视频", requiresAuth: true },
      },
      {
        path: "articles",
        name: "AdminArticles",
        component: () => import("@/views/admin/Article.vue"),
        meta: { title: "漫想", requiresAuth: true },
      },
      {
        path: "users",
        name: "AdminUsers",
        component: () => import("@/views/admin/Users.vue"),
        meta: { title: "用户", requiresAuth: true },
      },
      {
        path: "siteinfo",
        name: "AdminSiteInfo",
        component: () => import("@/views/admin/SiteInfo.vue"),
        meta: { title: "网站信息", requiresAuth: true },
      },
      {
        path: "settings",
        name: "AdminSettings",
        component: () => import("@/views/admin/Settings.vue"),
        meta: { title: "系统配置", requiresAuth: true },
      },
      {
        path: "music",
        name: "AdminMusic",
        component: () => import("@/views/admin/Music.vue"),
        meta: { title: "音乐", requiresAuth: true },
      },
      {
        path: "audio",
        name: "AdminAudio",
        component: () => import("@/views/admin/Audio.vue"),
        meta: { title: "音频", requiresAuth: true },
      },
      {
        path: "memory",
        name: "AdminMemory",
        component: () => import("@/views/admin/Memory.vue"),
        meta: { title: "记忆", requiresAuth: true },
      },
      {
        path: "narrative",
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
  routes: [...frontendRoutes, ...authRoutes, ...adminRailRoutes, ...errorRoutes],
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

  let pageTitle = (to.meta.title as string) || "";

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
