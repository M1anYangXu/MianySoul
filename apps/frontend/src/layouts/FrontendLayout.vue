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
            v-if="config.logo"
            class="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300"
          >
            <img :src="config.logo" alt="Logo" class="w-full h-full object-cover" />
          </div>
          <div
            v-else
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300"
          >
            M
          </div>
          <span
            class="text-xl font-bold tracking-wide transition-colors duration-300"
            :class="
              isScrolled
                ? isDark
                  ? 'text-white'
                  : 'text-gray-900'
                : isDark
                  ? 'text-white'
                  : 'text-gray-900'
            "
          >
            {{ config.title || "MianySoul" }}
          </span>
        </div>

        <div class="hidden md:flex items-center space-x-8">
          <template v-for="item in navItems" :key="item.href">
            <div v-if="item.children && item.children.length" class="relative group">
              <a
                :href="item.href"
                class="relative flex items-center text-base font-medium transition-colors duration-300"
                :class="
                  isScrolled
                    ? isDark
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                    : isDark
                      ? 'text-white hover:text-gray-200'
                      : 'text-gray-700 hover:text-gray-900'
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
                  v-for="child in item.children"
                  :key="child.href"
                  :href="child.href"
                  class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors duration-200"
                  :class="
                    isScrolled
                      ? isDark
                        ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      : isDark
                        ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  "
                >
                  <svg
                    v-if="child.href.includes('categories')"
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
                  <svg
                    v-else-if="child.href.includes('tags')"
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
                  <svg
                    v-else-if="child.href.includes('footprint')"
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {{ child.label }}
                </a>
              </div>
            </div>
            <a
              v-else
              :href="item.href"
              class="relative group text-base font-medium transition-colors duration-300"
              :class="
                isScrolled
                  ? isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                  : isDark
                    ? 'text-white hover:text-gray-200'
                    : 'text-gray-700 hover:text-gray-900'
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
            :class="
              isScrolled
                ? isDark
                  ? 'hover:bg-white/10 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
                : isDark
                  ? 'hover:bg-white/10 text-white'
                  : 'hover:bg-gray-100 text-gray-600'
            "
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
            class="hidden sm:flex items-center space-x-2 px-5 py-2.5 rounded-full backdrop-blur-md border text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
            :class="
              isScrolled
                ? isDark
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30'
                  : 'bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100 hover:border-violet-300'
                : isDark
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:shadow-violet-500/10'
                  : 'bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100 hover:border-violet-300'
            "
            @click="$router.push('/admin')"
          >
            <span>进入后台</span>
            <span>🚀</span>
          </button>

          <button
            class="md:hidden p-2 rounded-lg transition-colors"
            :class="
              isScrolled
                ? isDark
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-600 hover:bg-gray-100'
                : isDark
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-600 hover:bg-gray-100'
            "
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
        <div class="flex flex-col space-y-1 py-4">
          <template v-for="item in navItems" :key="item.href">
            <div v-if="item.children && item.children.length" class="relative">
              <button
                class="flex items-center justify-between w-full px-6 py-3 text-sm font-medium transition-colors duration-300"
                :class="
                  isScrolled
                    ? isDark
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                    : isDark
                      ? 'text-white hover:text-gray-200'
                      : 'text-gray-700 hover:text-gray-900'
                "
                @click="toggleMobileSubmenu(item.href)"
              >
                <span>{{ item.label }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transition-transform duration-300"
                  :class="expandedSubmenus.includes(item.href) ? 'rotate-90' : ''"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <div v-if="expandedSubmenus.includes(item.href)" class="ml-4 mt-1 space-y-1">
                <a
                  v-for="child in item.children"
                  :key="child.href"
                  :href="child.href"
                  class="flex items-center px-6 py-2.5 text-sm font-medium transition-colors duration-300"
                  :class="
                    isScrolled
                      ? isDark
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-500 hover:text-gray-900'
                      : isDark
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-500 hover:text-gray-900'
                  "
                  @click="mobileMenuOpen = false"
                >
                  {{ child.label }}
                </a>
              </div>
            </div>
            <a
              v-else
              :href="item.href"
              class="px-6 py-3 text-sm font-medium transition-colors duration-300"
              :class="
                isScrolled
                  ? isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                  : isDark
                    ? 'text-white hover:text-gray-200'
                    : 'text-gray-700 hover:text-gray-900'
              "
              @click="mobileMenuOpen = false"
            >
              {{ item.label }}
            </a>
          </template>
          <button
            class="mt-4 mx-6 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300"
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
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useAppStore } from "@/stores";
import { useUserStore } from "@/stores/user";
import { useModuleConfig } from "@/composables/useModuleConfig";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

const userStore = useUserStore();

const { pageConfigs, loadConfig, getConfig } = useModuleConfig();

const config = computed(() => getConfig());

const isScrolled = ref(false);
const mobileMenuOpen = ref(false);
const expandedSubmenus = ref<string[]>([]);

const toggleMobileSubmenu = (href: string) => {
  const index = expandedSubmenus.value.indexOf(href);
  if (index > -1) {
    expandedSubmenus.value.splice(index, 1);
  } else {
    expandedSubmenus.value.push(href);
  }
};

watch(mobileMenuOpen, (newVal) => {
  if (!newVal) {
    expandedSubmenus.value = [];
  }
});

const navItems = computed(() => {
  const items = [
    { label: "首页", href: "/" },
    {
      label: pageConfigs.value.archive.title,
      href: "/archive",
      children: [
        { label: "分类", href: "/archive/categories" },
        { label: "标签云", href: "/archive/tags" },
      ],
    },
    { label: pageConfigs.value.lyrics.title, href: "/lyrics" },
    { label: pageConfigs.value.gallery.title, href: "/gallery" },
    { label: pageConfigs.value.scenes.title, href: "/scenes" },
    {
      label: pageConfigs.value.about.title,
      href: "/about",
      children: [{ label: pageConfigs.value.footprint.title, href: "/footprint" }],
    },
  ];
  if (userStore.isAdmin) {
    items.push({ label: "记忆", href: "/memory" });
  }
  return items;
});

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
