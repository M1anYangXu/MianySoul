<template>
  <div class="admin-layout" :class="isDark ? 'admin-layout-dark' : 'admin-layout-light'">
    <!-- Icon-Only Navigation Rail -->
    <aside class="admin-rail" :class="{ 'admin-rail-dark': isDark }">
      <!-- Logo -->
      <div class="admin-rail-logo-area">
        <router-link to="/admin" class="admin-rail-logo" title="首页">
          <div v-if="config.logo" class="admin-rail-logo-img">
            <img :src="config.logo" alt="Logo" />
          </div>
          <div v-else class="admin-rail-logo-fallback">
            <span>M</span>
          </div>
        </router-link>
      </div>

      <!-- Nav Items -->
      <nav class="admin-rail-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="admin-rail-btn"
          :class="{ 'admin-rail-btn-active': isActive(item.path) }"
          :title="item.label"
        >
          <IconPark :type="item.icon" :size="24" theme="filled" :fill="item.color" />
        </router-link>
      </nav>
    </aside>

    <!-- Main Area: TopBar + Content -->
    <div class="admin-main">
      <!-- Top Bar -->
      <header class="admin-topbar" :class="{ 'admin-topbar-dark': isDark }">
        <div class="admin-topbar-left">
          <!-- Breadcrumb -->
          <nav class="admin-breadcrumb">
            <router-link to="/admin" class="admin-breadcrumb-item">控制台</router-link>
            <template v-if="breadcrumbItems.length > 0">
              <template v-for="(item, idx) in breadcrumbItems" :key="idx">
                <span class="admin-breadcrumb-sep">/</span>
                <span v-if="idx === breadcrumbItems.length - 1" class="admin-breadcrumb-current">
                  {{ item }}
                </span>
                <router-link v-else :to="breadcrumbPaths[idx]" class="admin-breadcrumb-item">
                  {{ item }}
                </router-link>
              </template>
            </template>
          </nav>
        </div>
        <div class="admin-topbar-right">
          <!-- Cmd+K Search Trigger -->
          <button class="admin-cmdk-trigger" @click="openCommandPalette">
            <IconPark type="Search" :size="14" />
            <span>快速搜索</span>
            <kbd class="admin-cmdk-kbd">⌘K</kbd>
          </button>
          <button class="admin-topbar-frontend-btn" title="前往前台" @click="goToFrontend">
            <IconPark type="Share" :size="16" />
            <span>前台</span>
          </button>
          <button
            class="admin-topbar-btn"
            :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
            @click="toggleTheme"
          >
            <IconPark :type="isDark ? 'Sun' : 'Moon'" :size="18" />
          </button>
          <div
            class="admin-topbar-user"
            :title="userInfo?.username || '用户'"
            @click="showUserMenu = !showUserMenu"
          >
            <div class="admin-topbar-avatar">
              <img v-if="userInfo?.avatar" :src="userInfo.avatar" alt="avatar" />
              <span v-else>{{ userInfo?.username?.charAt(0).toUpperCase() || "U" }}</span>
            </div>
            <!-- User Dropdown -->
            <div
              v-if="showUserMenu"
              class="admin-user-dropdown"
              :class="{ 'admin-user-dropdown-dark': isDark }"
            >
              <div class="admin-user-dropdown-header">
                <span class="admin-user-dropdown-name">{{ userInfo?.username }}</span>
                <span class="admin-user-dropdown-email">{{ userInfo?.email }}</span>
              </div>
              <button class="admin-user-dropdown-btn" @click="handleChangePassword">
                <IconPark type="Lock" :size="14" />
                修改密码
              </button>
              <button
                class="admin-user-dropdown-btn admin-user-dropdown-btn-danger"
                @click="handleLogout"
              >
                <IconPark type="Logout" :size="14" />
                退出登录
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="admin-content" :class="{ 'admin-content-dark': isDark }">
        <router-view />
      </main>
    </div>

    <!-- Mobile: Top Bar -->
    <header class="admin-mobile-topbar" :class="{ 'admin-mobile-topbar-dark': isDark }">
      <div class="flex items-center justify-between px-3 h-14">
        <div class="flex items-center gap-2">
          <div v-if="config.logo" class="w-7 h-7 rounded-lg overflow-hidden">
            <img :src="config.logo" alt="Logo" class="w-full h-full object-cover" />
          </div>
          <div
            v-else
            class="w-7 h-7 rounded-lg admin-rail-logo-fallback flex items-center justify-center"
          >
            <span class="text-white text-xs font-bold">M</span>
          </div>
          <span class="font-semibold text-sm" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ currentPageTitle }}
          </span>
        </div>
        <button
          class="p-2 rounded-lg"
          :class="isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'"
          @click="toggleTheme"
        >
          <IconPark :type="isDark ? 'Sun' : 'Moon'" :size="18" />
        </button>
      </div>
    </header>

    <!-- Mobile: Bottom Nav -->
    <nav class="admin-mobile-bottom" :class="{ 'admin-mobile-bottom-dark': isDark }">
      <router-link
        v-for="item in mobileNavItems"
        :key="item.path"
        :to="item.path"
        class="admin-mobile-btn"
        :class="{ 'admin-mobile-btn-active': isActive(item.path) }"
        :title="item.label"
      >
        <IconPark :type="item.icon" :size="20" />
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Backdrop -->
    <div v-if="showUserMenu" class="fixed inset-0 z-40" @click="showUserMenu = false"></div>

    <ChangePasswordModal v-model:visible="showChangePassword" />

    <!-- Command Palette (Cmd+K) -->
    <div v-if="showCommandPalette" class="admin-cmdk-backdrop" @click.self="closeCommandPalette">
      <div class="admin-cmdk-panel" :class="{ 'admin-cmdk-dark': isDark }" @click.stop>
        <div class="admin-cmdk-input-wrap">
          <IconPark type="Search" :size="18" class="admin-cmdk-search-icon" />
          <input
            ref="cmdkInputRef"
            v-model="cmdkQuery"
            type="text"
            placeholder="搜索页面或功能..."
            class="admin-cmdk-input"
            @keydown.esc="closeCommandPalette"
            @keydown.down.prevent="cmdkMoveDown"
            @keydown.up.prevent="cmdkMoveUp"
            @keydown.enter.prevent="cmdkSelect"
          />
          <kbd class="admin-cmdk-esc">ESC</kbd>
        </div>
        <div class="admin-cmdk-list">
          <div
            v-for="(item, idx) in cmdkFilteredItems"
            :key="item.path"
            class="admin-cmdk-item"
            :class="{ 'admin-cmdk-item-active': idx === cmdkActiveIndex }"
            @click="cmdkNavigate(item.path)"
            @mouseenter="cmdkActiveIndex = idx"
          >
            <IconPark :type="item.icon" :size="18" :fill="item.color" />
            <div class="admin-cmdk-item-info">
              <span class="admin-cmdk-item-label">{{ item.label }}</span>
              <span class="admin-cmdk-item-path">{{ item.path }}</span>
            </div>
            <IconPark
              v-if="idx === cmdkActiveIndex"
              type="ArrowRight"
              :size="14"
              class="admin-cmdk-enter-icon"
            />
          </div>
          <div v-if="cmdkFilteredItems.length === 0" class="admin-cmdk-empty">未找到匹配项</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppStore, useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import ChangePasswordModal from "@/components/ChangePasswordModal.vue";
import { useModuleConfig } from "@/composables/useModuleConfig";
import { useThemeTransition } from "@/composables/useThemeTransition";
import { IconPark } from "@icon-park/vue-next/es/all";

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const { getConfig, loadConfig, getModuleName } = useModuleConfig();
const config = computed(() => getConfig());
const { toggleTheme } = useThemeTransition();

const showUserMenu = ref(false);
const showChangePassword = ref(false);
const isDark = computed(() => appStore.themeMode === "dark");

const navItems = computed(() => [
  { path: "/admin", icon: "Home", label: "首页", color: "#165dff" },
  { path: "/admin/gallery", icon: "Pic", label: getModuleName("gallery"), color: "#00b42a" },
  { path: "/admin/videos", icon: "Video", label: getModuleName("video"), color: "#ff7d00" },
  { path: "/admin/articles", icon: "FileText", label: getModuleName("article"), color: "#f53f3f" },
  { path: "/admin/music", icon: "Music", label: getModuleName("music"), color: "#722ed1" },
  { path: "/admin/audio", icon: "Headset", label: getModuleName("audio"), color: "#0fc6c2" },
  { path: "/admin/memory", icon: "Like", label: getModuleName("memory"), color: "#f77234" },
  { path: "/admin/narrative", icon: "Book", label: getModuleName("narrative"), color: "#722ed1" },
  { path: "/admin/users", icon: "User", label: getModuleName("users"), color: "#165dff" },
  { path: "/admin/siteinfo", icon: "Info", label: getModuleName("siteinfo"), color: "#0fc6c2" },
  { path: "/admin/settings", icon: "Setting", label: getModuleName("settings"), color: "#86909c" },
]);

const mobileNavItems = computed(() => [
  { path: "/admin", icon: "Home", label: "首页" },
  { path: "/admin/gallery", icon: "Pic", label: "图集" },
  { path: "/admin/articles", icon: "FileText", label: "漫想" },
  { path: "/admin/music", icon: "Music", label: "音乐" },
  { path: "/admin/settings", icon: "Setting", label: "设置" },
]);

const currentPageTitle = computed(() => {
  const path = route.path;
  if (path.startsWith("/admin/gallery")) return getModuleName("gallery");
  if (path.startsWith("/admin/videos")) return getModuleName("video");
  if (path.startsWith("/admin/articles")) return getModuleName("article");
  if (path.startsWith("/admin/music")) return getModuleName("music");
  if (path.startsWith("/admin/audio")) return getModuleName("audio");
  if (path.startsWith("/admin/memory")) return getModuleName("memory");
  if (path.startsWith("/admin/narrative")) return getModuleName("narrative");
  if (path.startsWith("/admin/users")) return getModuleName("users");
  if (path.startsWith("/admin/siteinfo")) return getModuleName("siteinfo");
  if (path.startsWith("/admin/settings")) return getModuleName("settings");
  return route.meta.title || "控制台";
});

// Breadcrumb
const breadcrumbItems = computed(() => {
  const items: string[] = [];
  const path = route.path;

  if (path === "/admin" || path === "/admin/") return [];

  // Determine section
  if (path.startsWith("/admin/gallery")) {
    items.push("内容");
    items.push(getModuleName("gallery"));
  } else if (path.startsWith("/admin/videos")) {
    items.push("内容");
    items.push(getModuleName("video"));
  } else if (path.startsWith("/admin/articles")) {
    items.push("内容");
    items.push(getModuleName("article"));
  } else if (path.startsWith("/admin/music")) {
    items.push("内容");
    items.push(getModuleName("music"));
  } else if (path.startsWith("/admin/audio")) {
    items.push("内容");
    items.push(getModuleName("audio"));
  } else if (path.startsWith("/admin/memory")) {
    items.push("内容");
    items.push(getModuleName("memory"));
  } else if (path.startsWith("/admin/narrative")) {
    items.push("内容");
    items.push(getModuleName("narrative"));
  } else if (path.startsWith("/admin/users")) {
    items.push("系统");
    items.push(getModuleName("users"));
  } else if (path.startsWith("/admin/siteinfo")) {
    items.push("系统");
    items.push(getModuleName("siteinfo"));
  } else if (path.startsWith("/admin/settings")) {
    items.push("系统");
    items.push(getModuleName("settings"));
  }
  return items;
});

const breadcrumbPaths = computed(() => {
  const paths: string[] = [];
  const path = route.path;
  if (path.startsWith("/admin/gallery")) {
    paths.push("/admin");
    paths.push("/admin/gallery");
  } else if (path.startsWith("/admin/videos")) {
    paths.push("/admin");
    paths.push("/admin/videos");
  } else if (path.startsWith("/admin/articles")) {
    paths.push("/admin");
    paths.push("/admin/articles");
  } else if (path.startsWith("/admin/music")) {
    paths.push("/admin");
    paths.push("/admin/music");
  } else if (path.startsWith("/admin/audio")) {
    paths.push("/admin");
    paths.push("/admin/audio");
  } else if (path.startsWith("/admin/memory")) {
    paths.push("/admin");
    paths.push("/admin/memory");
  } else if (path.startsWith("/admin/narrative")) {
    paths.push("/admin");
    paths.push("/admin/narrative");
  } else if (path.startsWith("/admin/users")) {
    paths.push("/admin");
    paths.push("/admin/users");
  } else if (path.startsWith("/admin/siteinfo")) {
    paths.push("/admin");
    paths.push("/admin/siteinfo");
  } else if (path.startsWith("/admin/settings")) {
    paths.push("/admin");
    paths.push("/admin/settings");
  }
  return paths;
});

const isActive = (path: string) => {
  if (path === "/admin") {
    return route.path === "/admin" || route.path === "/admin/";
  }
  return route.path.startsWith(path);
};

// ============ Command Palette ============
const showCommandPalette = ref(false);
const cmdkQuery = ref("");
const cmdkActiveIndex = ref(0);
const cmdkInputRef = ref<HTMLInputElement | null>(null);

const cmdkAllItems = computed(() => [
  { path: "/admin", icon: "Home", label: "首页 / 控制台", color: "#165dff" },
  { path: "/admin/gallery", icon: "Pic", label: getModuleName("gallery"), color: "#00b42a" },
  { path: "/admin/videos", icon: "Video", label: getModuleName("video"), color: "#ff7d00" },
  { path: "/admin/articles", icon: "FileText", label: getModuleName("article"), color: "#f53f3f" },
  { path: "/admin/music", icon: "Music", label: getModuleName("music"), color: "#722ed1" },
  { path: "/admin/audio", icon: "Headset", label: getModuleName("audio"), color: "#0fc6c2" },
  { path: "/admin/memory", icon: "Like", label: getModuleName("memory"), color: "#f77234" },
  { path: "/admin/narrative", icon: "Book", label: getModuleName("narrative"), color: "#722ed1" },
  { path: "/admin/users", icon: "User", label: getModuleName("users"), color: "#165dff" },
  { path: "/admin/siteinfo", icon: "Info", label: getModuleName("siteinfo"), color: "#0fc6c2" },
  { path: "/admin/settings", icon: "Setting", label: getModuleName("settings"), color: "#86909c" },
]);

const cmdkFilteredItems = computed(() => {
  if (!cmdkQuery.value) return cmdkAllItems.value;
  const q = cmdkQuery.value.toLowerCase();
  return cmdkAllItems.value.filter(
    (item) => item.label.toLowerCase().includes(q) || item.path.toLowerCase().includes(q)
  );
});

const cmdkNavigate = (path: string) => {
  router.push(path);
  closeCommandPalette();
};

const openCommandPalette = () => {
  showCommandPalette.value = true;
};

const closeCommandPalette = () => {
  showCommandPalette.value = false;
  cmdkQuery.value = "";
};

const cmdkMoveDown = () => {
  if (cmdkActiveIndex.value < cmdkFilteredItems.value.length - 1) {
    cmdkActiveIndex.value++;
  }
};

const cmdkMoveUp = () => {
  if (cmdkActiveIndex.value > 0) {
    cmdkActiveIndex.value--;
  }
};

const cmdkSelect = () => {
  const item = cmdkFilteredItems.value[cmdkActiveIndex.value];
  if (item) cmdkNavigate(item.path);
};

const handleCmdKey = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    if (showCommandPalette.value) {
      closeCommandPalette();
    } else {
      openCommandPalette();
    }
  }
};

watch(showCommandPalette, (val) => {
  if (val) {
    cmdkQuery.value = "";
    cmdkActiveIndex.value = 0;
    nextTick(() => {
      cmdkInputRef.value?.focus();
    });
  }
});

watch(cmdkQuery, () => {
  cmdkActiveIndex.value = 0;
});

onMounted(async () => {
  await loadConfig();
  document.addEventListener("keydown", handleCmdKey);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleCmdKey);
});

const handleChangePassword = () => {
  showUserMenu.value = false;
  showChangePassword.value = true;
};

const handleLogout = () => {
  showUserMenu.value = false;
  userStore.logout();
  router.push({ name: "AdminLogin" });
};

const goToFrontend = () => {
  window.open("/", "_blank");
};
</script>

<style scoped>
/* ============ Layout ============ */
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.admin-layout-light {
  background: #f7f8fa;
  color: #1d2129;
}

.admin-layout-dark {
  background: #17171a;
  color: #c9cdd4;
}

/* ============ Rail ============ */
.admin-rail {
  width: 72px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 8px;
  border-right: 1px solid #e5e6eb;
  transition:
    background-color 0.2s,
    border-color 0.2s;
}

.admin-rail-dark {
  background: #1d1d1f;
  border-right-color: #2a2a2d;
}

.admin-rail-light {
  background: #ffffff;
}

.admin-rail-logo-area {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.admin-rail-logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.admin-rail-logo:hover {
  transform: scale(1.08);
}

.admin-rail-logo-img {
  width: 100%;
  height: 100%;
}

.admin-rail-logo-fallback {
  width: 100%;
  height: 100%;
  background: #165dff;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-rail-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
  width: 100%;
}

.admin-rail-btn {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #86909c;
  transition: all 0.2s;
  cursor: pointer;
  text-decoration: none;
}

.admin-rail-light .admin-rail-btn {
  color: #86909c;
}

.admin-rail-dark .admin-rail-btn {
  color: #4e5969;
}

.admin-rail-btn:hover {
  background: #f2f3f5;
}

.admin-rail-dark .admin-rail-btn:hover {
  background: #2a2a2d;
}

.admin-rail-btn-active {
  background: #e8f3ff !important;
}

.admin-rail-dark .admin-rail-btn-active {
  background: rgba(22, 93, 255, 0.15) !important;
}

.admin-rail-btn-active::before {
  content: "";
  position: absolute;
  left: -14px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  border-radius: 0 2px 2px 0;
  background: #165dff;
}

/* ============ Main Area ============ */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

/* ============ Top Bar ============ */
.admin-topbar {
  height: 56px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #e5e6eb;
  background: #fff;
  transition:
    background-color 0.2s,
    border-color 0.2s;
}

.admin-topbar-dark {
  background: #1d1d1f;
  border-bottom-color: #2a2a2d;
}

.admin-topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ============ Breadcrumb ============ */
.admin-breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.admin-breadcrumb-item {
  color: #86909c;
  text-decoration: none;
  transition: color 0.15s;
}

.admin-breadcrumb-item:hover {
  color: #165dff;
}

.admin-topbar-dark .admin-breadcrumb-item {
  color: #6b7280;
}

.admin-topbar-dark .admin-breadcrumb-item:hover {
  color: #4080ff;
}

.admin-breadcrumb-sep {
  color: #c9cdd4;
  margin: 0 2px;
}

.admin-topbar-dark .admin-breadcrumb-sep {
  color: #4b5563;
}

.admin-breadcrumb-current {
  color: #1d2129;
  font-weight: 600;
}

.admin-topbar-dark .admin-breadcrumb-current {
  color: #f2f3f5;
}

/* ============ Cmd+K Trigger ============ */
.admin-cmdk-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px 6px 8px;
  border-radius: 6px;
  font-size: 13px;
  color: #86909c;
  background: transparent;
  border: 1px solid #e5e6eb;
  transition: all 0.15s;
  cursor: pointer;
}

.admin-cmdk-trigger:hover {
  border-color: #c9cdd4;
  color: #4e5969;
  background: #f7f8fa;
}

.admin-topbar-dark .admin-cmdk-trigger {
  color: #6b7280;
  border-color: #2a2a2d;
}

.admin-topbar-dark .admin-cmdk-trigger:hover {
  border-color: #4b5563;
  color: #c9cdd4;
  background: #2a2a2d;
}

.admin-cmdk-kbd {
  font-size: 11px;
  padding: 1px 5px;
  border-radius: 3px;
  background: #f2f3f5;
  color: #86909c;
  font-family: inherit;
}

.admin-topbar-dark .admin-cmdk-kbd {
  background: #2a2a2d;
  color: #6b7280;
}

/* ============ Command Palette Modal ============ */
.admin-cmdk-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}

.admin-cmdk-panel {
  width: 560px;
  max-width: 90vw;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.admin-cmdk-dark {
  background: #1d1d1f;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.admin-cmdk-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #f2f3f5;
}

.admin-cmdk-dark .admin-cmdk-input-wrap {
  border-bottom-color: #2a2a2d;
}

.admin-cmdk-search-icon {
  color: #86909c;
  flex-shrink: 0;
}

.admin-cmdk-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: #1d2129;
}

.admin-cmdk-dark .admin-cmdk-input {
  color: #f2f3f5;
}

.admin-cmdk-input::placeholder {
  color: #c9cdd4;
}

.admin-cmdk-esc {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px;
  background: #f2f3f5;
  color: #86909c;
  font-family: inherit;
  flex-shrink: 0;
}

.admin-cmdk-dark .admin-cmdk-esc {
  background: #2a2a2d;
  color: #6b7280;
}

.admin-cmdk-list {
  max-height: 360px;
  overflow-y: auto;
  padding: 6px;
}

.admin-cmdk-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.1s;
}

.admin-cmdk-item-active {
  background: #f2f3f5;
}

.admin-cmdk-dark .admin-cmdk-item-active {
  background: #2a2a2d;
}

.admin-cmdk-item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.admin-cmdk-item-label {
  font-size: 14px;
  font-weight: 500;
  color: #1d2129;
}

.admin-cmdk-dark .admin-cmdk-item-label {
  color: #f2f3f5;
}

.admin-cmdk-item-path {
  font-size: 12px;
  color: #c9cdd4;
}

.admin-cmdk-dark .admin-cmdk-item-path {
  color: #6b7280;
}

.admin-cmdk-enter-icon {
  color: #86909c;
  flex-shrink: 0;
}

.admin-cmdk-empty {
  padding: 32px;
  text-align: center;
  font-size: 14px;
  color: #86909c;
}

.admin-topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-topbar-frontend-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #165dff;
  background: #e8f3ff;
  border: 1px solid transparent;
  transition: all 0.15s;
  cursor: pointer;
}

.admin-topbar-frontend-btn:hover {
  background: #bedaff;
}

.admin-topbar-dark .admin-topbar-frontend-btn {
  color: #4080ff;
  background: rgba(22, 93, 255, 0.15);
}

.admin-topbar-dark .admin-topbar-frontend-btn:hover {
  background: rgba(22, 93, 255, 0.25);
}

.admin-topbar-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #4e5969;
  transition:
    background 0.15s,
    color 0.15s;
  cursor: pointer;
}

.admin-topbar-btn:hover {
  background: #f2f3f5;
  color: #1d2129;
}

.admin-topbar-dark .admin-topbar-btn {
  color: #c9cdd4;
}

.admin-topbar-dark .admin-topbar-btn:hover {
  background: #2a2a2d;
  color: #f2f3f5;
}

.admin-topbar-user {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: box-shadow 0.15s;
}

/* User Dropdown */
.admin-user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 200px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e5e6eb;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 100;
}

.admin-user-dropdown-dark {
  background: #1d1d1f;
  border-color: #2a2a2d;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.admin-user-dropdown-header {
  padding: 12px;
  border-bottom: 1px solid #f2f3f5;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.admin-user-dropdown-dark .admin-user-dropdown-header {
  border-bottom-color: #2a2a2d;
}

.admin-user-dropdown-name {
  font-size: 14px;
  font-weight: 600;
  color: #1d2129;
}

.admin-user-dropdown-dark .admin-user-dropdown-name {
  color: #f2f3f5;
}

.admin-user-dropdown-email {
  font-size: 12px;
  color: #86909c;
}

.admin-user-dropdown-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  color: #4e5969;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}

.admin-user-dropdown-btn:hover {
  background: #f2f3f5;
  color: #1d2129;
}

.admin-user-dropdown-dark .admin-user-dropdown-btn {
  color: #c9cdd4;
}

.admin-user-dropdown-dark .admin-user-dropdown-btn:hover {
  background: #2a2a2d;
  color: #f2f3f5;
}

.admin-user-dropdown-btn-danger {
  color: #f53f3f;
}

.admin-user-dropdown-btn-danger:hover {
  background: #ffece8;
  color: #f53f3f;
}

.admin-user-dropdown-dark .admin-user-dropdown-btn-danger:hover {
  background: rgba(245, 63, 63, 0.15);
}

.admin-topbar-user:hover {
  box-shadow: 0 0 0 2px #e5e6eb;
}

.admin-topbar-dark .admin-topbar-user:hover {
  box-shadow: 0 0 0 2px #2a2a2d;
}

.admin-topbar-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  background: #f53f3f;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

/* ============ Content ============ */
.admin-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  background: #f7f8fa;
}

.admin-content-dark {
  background: #17171a;
}

.admin-content::-webkit-scrollbar {
  width: 6px;
}

.admin-content::-webkit-scrollbar-track {
  background: transparent;
}

.admin-content::-webkit-scrollbar-thumb {
  background: #c9cdd4;
  border-radius: 3px;
}

.admin-content-dark::-webkit-scrollbar-thumb {
  background: #4e5969;
}

/* ============ Mobile ============ */
.admin-mobile-topbar,
.admin-mobile-bottom {
  display: none;
}

@media (max-width: 768px) {
  .admin-rail {
    display: none;
  }

  .admin-main {
    display: none;
  }

  .admin-layout {
    flex-direction: column;
  }

  .admin-mobile-topbar {
    display: block;
    position: sticky;
    top: 0;
    z-index: 30;
    background: #fff;
    border-bottom: 1px solid #e5e6eb;
  }

  .admin-mobile-topbar-dark {
    background: #1d1d1f;
    border-bottom-color: #2a2a2d;
  }

  .admin-mobile-bottom {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    border-top: 1px solid #e5e6eb;
    padding: 4px 0;
    z-index: 30;
  }

  .admin-mobile-bottom-dark {
    background: #1d1d1f;
    border-top-color: #2a2a2d;
  }

  .admin-mobile-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 4px 0;
    color: #86909c;
    text-decoration: none;
    font-size: 10px;
    transition: color 0.15s;
  }

  .admin-mobile-btn-active {
    color: #165dff;
  }
}
</style>
