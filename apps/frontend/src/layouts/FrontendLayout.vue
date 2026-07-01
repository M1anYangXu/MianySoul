<template>
  <div
    class="min-h-screen relative overflow-x-hidden transition-all duration-500"
    :class="
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-950'
        : 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
    "
  >
    <nav
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      :class="isScrolled ? 'py-3' : 'py-5'"
      :style="{
        backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
        backgroundColor: isScrolled
          ? isDark
            ? 'rgba(15, 23, 42, 0.8)'
            : 'rgba(255, 255, 255, 0.9)'
          : 'transparent',
        borderBottom: isScrolled
          ? isDark
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(0,0,0,0.05)'
          : 'none',
      }"
    >
      <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div class="flex items-center space-x-3 cursor-pointer group" @click="$router.push('/')">
          <div
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300"
          >
            M
          </div>
          <span
            class="text-xl font-bold tracking-wide"
            :class="isDark ? 'text-white' : 'text-gray-900'"
          >
            MianySoul
          </span>
        </div>

        <div class="hidden md:flex items-center space-x-8">
          <template v-for="item in navItems" :key="item.href">
            <div v-if="item.label === '归档'" class="relative group">
              <a
                :href="item.href"
                class="relative flex items-center text-base font-medium transition-colors duration-300"
                :class="
                  isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                "
              >
                {{ item.label }}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 ml-1 transition-transform duration-300 group-hover:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span
                  class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 group-hover:w-full transition-all duration-300"
                ></span>
              </a>
              <div
                class="absolute top-full left-0 mt-2 w-40 py-2 rounded-xl backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                :class="
                  isDark
                    ? 'bg-slate-900/95 border border-white/10'
                    : 'bg-white/95 border border-gray-200 shadow-lg'
                "
              >
                <a
                  href="/archive/categories"
                  class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors duration-200"
                  :class="
                    isDark
                      ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  分类
                </a>
                <a
                  href="/archive/tags"
                  class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors duration-200"
                  :class="
                    isDark
                      ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 7h7l3 3v10a1 1 0 01-1 1H7a1 1 0 01-1-1V10a1 1 0 011-1zm5 8a2 2 0 100-4 2 2 0 000 4z"
                    />
                  </svg>
                  标签云
                </a>
              </div>
            </div>
            <a
              v-else
              :href="item.href"
              class="relative group text-base font-medium transition-colors duration-300"
              :class="
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              "
            >
              {{ item.label }}
              <span
                class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 group-hover:w-full transition-all duration-300"
              ></span>
            </a>
          </template>
        </div>

        <div class="flex items-center space-x-4">
          <button
            class="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
            :class="isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'"
            @click="toggleTheme"
          >
            <svg
              v-if="isDark"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>

          <button
            class="hidden sm:flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 hover:scale-105"
            @click="$router.push('/admin')"
          >
            <span>进入后台</span>
            <span>🚀</span>
          </button>

          <button
            class="md:hidden p-2 rounded-lg transition-colors"
            :class="isDark ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        v-if="mobileMenuOpen"
        class="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl border-b transition-all duration-300"
        :class="isDark ? 'bg-slate-900/95 border-white/10' : 'bg-white/95 border-gray-200'"
      >
        <div class="flex flex-col items-center space-y-4 py-4">
          <a
            v-for="item in navItems"
            :key="item.href"
            :href="item.href"
            class="text-sm font-medium py-2 transition-colors duration-300"
            :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'"
            @click="mobileMenuOpen = false"
          >
            {{ item.label }}
          </a>
          <button
            class="mt-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-medium"
            @click="$router.push('/admin')"
          >
            进入后台
          </button>
        </div>
      </div>
    </nav>

    <main class="relative z-10">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useAppStore } from "@/stores";
import { useModuleConfig } from "@/composables/useModuleConfig";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

const { pageConfigs, loadConfig } = useModuleConfig();

const isScrolled = ref(false);
const mobileMenuOpen = ref(false);

const navItems = computed(() => [
  { label: "首页", href: "/" },
  { label: pageConfigs.value.archive.title, href: "/archive" },
  { label: pageConfigs.value.lyrics.title, href: "/lyrics" },
  { label: pageConfigs.value.gallery.title, href: "/gallery" },
  { label: pageConfigs.value.scenes.title, href: "/scenes" },
  { label: pageConfigs.value.about.title, href: "/about" },
  { label: pageConfigs.value.footprint.title, href: "/footprint" },
]);

const toggleTheme = () => {
  appStore.setThemeMode(isDark.value ? "light" : "dark");
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
  await loadConfig();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
