<template>
  <div
    class="min-h-screen transition-colors duration-500 relative"
    :class="isDark ? 'bg-gray-900' : 'bg-gray-50'"
  >
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-0 -left-20 w-96 h-96 rounded-full blur-3xl opacity-30"
        :class="isDark ? 'bg-purple-500/30' : 'bg-purple-200'"
      ></div>
      <div
        class="absolute top-0 -right-20 w-96 h-96 rounded-full blur-3xl opacity-30"
        :class="isDark ? 'bg-pink-500/30' : 'bg-pink-200'"
      ></div>
      <div
        class="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        :class="isDark ? 'bg-blue-500/30' : 'bg-blue-200'"
      ></div>
    </div>

    <header
      class="sticky top-0 z-50 transition-all duration-300"
      :class="
        isDark
          ? 'bg-gray-800/60 backdrop-blur-xl border-b border-gray-700/30'
          : 'bg-white/70 backdrop-blur-xl border-b border-gray-200/30'
      "
    >
      <div class="h-14 px-6 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            class="flex items-center space-x-1 p-2.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
            :class="
              isDark ? 'hover:bg-gray-700/50 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            "
            @click="handleBack"
          >
            <span class="text-lg">←</span>
            <span class="text-sm font-medium hidden sm:inline">返回</span>
          </button>

          <nav class="flex items-center space-x-2 text-base">
            <router-link
              to="/admin"
              class="font-medium transition-colors duration-200"
              :class="
                isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'
              "
            >
              首页
            </router-link>
            <span class="text-gray-400">/</span>
            <span class="font-medium" :class="isDark ? 'text-gray-200' : 'text-gray-800'">
              {{ currentPageTitle }}
            </span>
          </nav>
        </div>

        <div class="flex items-center space-x-3">
          <button
            class="p-2.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
            :class="
              isDark ? 'hover:bg-gray-700/50 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            "
            @click="toggleTheme"
          >
            <span v-if="!isDark" class="text-xl">🌙</span>
            <span v-else class="text-xl">☀️</span>
          </button>

          <div class="relative">
            <button
              class="flex items-center space-x-3 p-2 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              :class="
                isDark ? 'hover:bg-gray-700/50 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              "
              @click="showUserMenu = !showUserMenu"
            >
              <div
                class="w-8 h-8 rounded-full gradient-danger flex items-center justify-center shadow-md"
              >
                <span class="text-white text-sm font-medium">
                  {{ userInfo?.username?.charAt(0).toUpperCase() || "U" }}
                </span>
              </div>
              <span class="text-sm font-medium hidden sm:block">
                {{ userInfo?.username }}
              </span>
            </button>

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
                class="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 overflow-hidden"
              >
                <div class="p-3 border-b border-gray-100/50 dark:border-gray-700/50">
                  <p class="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {{ userInfo?.username }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ userInfo?.email }}
                  </p>
                </div>
                <div class="py-1">
                  <button
                    class="w-full px-4 py-2 text-left text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    @click="handleChangePassword"
                  >
                    修改密码
                  </button>
                  <button
                    class="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-colors duration-150"
                    @click="handleLogout"
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

    <main class="p-6 relative z-10">
      <router-view />
    </main>

    <div v-if="showUserMenu" class="fixed inset-0 z-40" @click="showUserMenu = false"></div>

    <ChangePasswordModal v-model:visible="showChangePassword" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import { useAppStore, useUserStore } from "@/stores";
import ChangePasswordModal from "@/components/ChangePasswordModal.vue";

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const showUserMenu = ref(false);
const showChangePassword = ref(false);
const isDark = computed(() => appStore.themeMode === "dark");

const currentPageTitle = computed(() => {
  return route.meta.title || "页面";
});

const toggleTheme = () => {
  appStore.setThemeMode(isDark.value ? "light" : "dark");
};

const handleBack = () => {
  if (router.options.history.state.back) {
    router.back();
  } else {
    router.push("/admin");
  }
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
