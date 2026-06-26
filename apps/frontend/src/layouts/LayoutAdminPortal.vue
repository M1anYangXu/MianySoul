<template>
  <div
    class="min-h-screen transition-colors duration-500 relative overflow-hidden"
    :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'"
  >
    <div class="fixed inset-0 pointer-events-none" :class="isDark ? 'opacity-50' : 'opacity-30'">
      <div
        class="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
        :class="isDark ? 'bg-purple-500/20' : 'bg-purple-200'"
      ></div>
      <div
        class="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
        :class="isDark ? 'bg-pink-500/20' : 'bg-pink-200'"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
        :class="isDark ? 'bg-blue-500/10' : 'bg-blue-100'"
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
          <router-link to="/admin" class="flex items-center space-x-3 group">
            <div
              class="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/20 transition-transform duration-300 group-hover:scale-105"
            >
              <span class="text-white font-bold text-sm">M</span>
            </div>
            <span class="font-semibold text-lg" :class="isDark ? 'text-white' : 'text-gray-900'">
              MianySoul
            </span>
          </router-link>
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
                class="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-pink-500 flex items-center justify-center shadow-md"
              >
                <span class="text-white text-sm font-medium">
                  {{ userInfo?.username?.charAt(0).toUpperCase() || "U" }}
                </span>
              </div>
              <span class="text-sm font-medium hidden sm:inline">
                {{ userInfo?.username }}
              </span>
              <svg
                class="w-4 h-4 transition-transform duration-300"
                :class="{ 'rotate-180': showUserMenu }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              leave-active-class="transition-all duration-150 ease-in"
              enter-from-class="opacity-0 -translate-y-2 scale-95"
              enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-from-class="opacity-100 translate-y-0 scale-100"
              leave-to-class="opacity-0 -translate-y-2 scale-95"
            >
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-52 rounded-2xl shadow-2xl border overflow-hidden"
                :class="
                  isDark
                    ? 'bg-gray-800/90 border-gray-700/50 backdrop-blur-xl'
                    : 'bg-white/90 border-gray-200/50 backdrop-blur-xl'
                "
              >
                <div
                  class="p-4 border-b"
                  :class="isDark ? 'border-gray-700/50' : 'border-gray-200/50'"
                >
                  <p class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ userInfo?.username }}
                  </p>
                  <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    {{ userInfo?.email }}
                  </p>
                </div>
                <div class="py-2">
                  <button
                    class="w-full px-4 py-2.5 text-left text-sm transition-all duration-200 hover:-translate-x-0.5"
                    :class="
                      isDark
                        ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    "
                    @click="handleChangePassword"
                  >
                    🔑 修改密码
                  </button>
                  <button
                    class="w-full px-4 py-2.5 text-left text-sm transition-all duration-200 hover:-translate-x-0.5"
                    :class="
                      isDark
                        ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                        : 'text-red-500 hover:bg-red-50'
                    "
                    @click="handleLogout"
                  >
                    🚪 退出登录
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>

    <main class="relative z-10 max-w-7xl mx-auto px-6 py-8">
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
