<template>
  <div
    class="min-h-screen transition-colors duration-300"
    :class="isDark ? 'bg-gray-900' : 'bg-gray-50'"
  >
    <header
      class="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border-b border-gray-200/50 dark:border-gray-700/50"
    >
      <div class="h-12 px-6 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div
            class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center"
          >
            <span class="text-white font-bold text-sm">M</span>
          </div>
          <span class="font-semibold text-gray-800 dark:text-gray-100">MianySoul</span>
        </div>

        <div class="flex items-center space-x-4">
          <button
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            @click="toggleTheme"
          >
            <span v-if="!isDark" class="text-gray-600">🌙</span>
            <span v-else class="text-gray-300">☀️</span>
          </button>

          <div class="relative">
            <button
              class="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              @click="showUserMenu = !showUserMenu"
            >
              <div
                class="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center"
              >
                <span class="text-white text-sm font-medium">
                  {{ userInfo?.username?.charAt(0).toUpperCase() || "U" }}
                </span>
              </div>
              <span class="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
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
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div class="p-3 border-b border-gray-100 dark:border-gray-700">
                  <p class="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {{ userInfo?.username }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ userInfo?.email }}</p>
                </div>
                <div class="py-1">
                  <button
                    class="w-full px-4 py-2 text-left text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    @click="handleChangePassword"
                  >
                    修改密码
                  </button>
                  <button
                    class="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
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

    <main class="max-w-6xl mx-auto px-6 py-8">
      <div class="mb-10">
        <h1 class="text-3xl font-bold mb-2" :class="isDark ? 'text-white' : 'text-black'">
          欢迎回来，{{ userInfo?.username }}
        </h1>
        <p :class="isDark ? 'text-gray-300' : 'text-gray-700'">今天也要元气满满地创作哦 ✨</p>
      </div>

      <router-view />
    </main>

    <div v-if="showUserMenu" class="fixed inset-0 z-40" @click="showUserMenu = false"></div>

    <ChangePasswordModal v-model:visible="showChangePassword" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore, useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import ChangePasswordModal from "@/components/ChangePasswordModal.vue";

const router = useRouter();
const appStore = useAppStore();
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const showUserMenu = ref(false);
const showChangePassword = ref(false);
const isDark = computed(() => appStore.themeMode === "dark");

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
