<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDark ? 'bg-gray-900' : 'bg-gray-50'">
    <!-- 顶部50px极简导航条 -->
    <header
      class="sticky top-0 z-50 h-[50px] backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border-b border-gray-200/50 dark:border-gray-700/50"
    >
      <div class="h-full px-6 flex items-center justify-between">
        <!-- 左侧：返回按钮 + 面包屑 -->
        <div class="flex items-center space-x-4">
          <button
            @click="handleBack"
            class="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <span class="text-gray-600 dark:text-gray-300">←</span>
            <span class="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">返回</span>
          </button>

          <!-- 面包屑 -->
          <nav class="flex items-center space-x-2 text-sm">
            <router-link
              to="/admin"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              首页
            </router-link>
            <span class="text-gray-400">/</span>
            <span class="text-gray-600 dark:text-gray-300">{{ currentPageTitle }}</span>
          </nav>
        </div>

        <!-- 右侧：主题切换 + 用户菜单 -->
        <div class="flex items-center space-x-4">
          <!-- 主题切换 -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <span v-if="!isDark" class="text-gray-600">🌙</span>
            <span v-else class="text-gray-300">☀️</span>
          </button>

          <!-- 用户头像下拉 -->
          <div class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <span class="text-white text-sm font-medium">{{ userStore.userInfo?.username?.charAt(0).toUpperCase() || 'U' }}</span>
              </div>
              <span class="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">{{ userStore.userInfo?.username }}</span>
            </button>

            <!-- 下拉菜单 -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              leave-active-class="transition-all duration-150 ease-in"
              enter-from-class="opacity-0 -translate-y-1 scale-95"
              enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-from-class="opacity-100 translate-y-0 scale-100"
              leave-to-class="opacity-0 -translate-y-1 scale-95"
            >
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div class="p-3 border-b border-gray-100 dark:border-gray-700">
                  <p class="text-sm font-medium text-gray-800 dark:text-gray-100">{{ userStore.userInfo?.username }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ userStore.userInfo?.email }}</p>
                </div>
                <div class="py-1">
                  <button
                    @click="handleChangePassword"
                    class="w-full px-4 py-2 text-left text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    修改密码
                  </button>
                  <button
                    @click="handleLogout"
                    class="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="p-6">
      <router-view />
    </main>

    <div
      v-if="showUserMenu"
      @click="showUserMenu = false"
      class="fixed inset-0 z-40"
    ></div>

    <ChangePasswordModal v-model:visible="showChangePassword" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppStore, useUserStore } from "@/stores";
import ChangePasswordModal from "@/components/ChangePasswordModal.vue";

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const userStore = useUserStore();

const showUserMenu = ref(false);
const showChangePassword = ref(false);
const isDark = computed(() => appStore.themeMode === "dark");

const currentPageTitle = computed(() => {
  return route.meta.title || "页面";
});

const handleBack = () => {
  if (router.options.history.state.back) {
    router.back();
  } else {
    router.push("/admin");
  }
};

const toggleTheme = () => {
  appStore.setThemeMode(isDark.value ? "light" : "dark");
};

const handleChangePassword = () => {
  showUserMenu.value = false;
  showChangePassword.value = true;
};

const handleLogout = () => {
  showUserMenu.value = false;
  userStore.logout();
  router.push({ name: "AdminLogin" });
};
</script>