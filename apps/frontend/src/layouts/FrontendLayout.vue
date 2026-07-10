<template>
  <nav
    class="fixed left-0 right-0 z-50"
    style="top: 0 !important; margin: 0 !important"
    :class="isScrolled ? 'pt-0 pb-3' : 'pt-0 pb-4'"
  >
    <div
      class="w-full transition-all duration-500"
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
        </div>

        <div class="hidden md:flex items-center space-x-8">
          <template v-for="item in navItems" :key="item.href">
            <div v-if="item.children && item.children.length" class="relative group">
              <a
                :href="item.href"
                class="relative flex items-center text-lg font-bold transition-all duration-300 px-3 py-1.5 rounded-xl"
                style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3)"
                :class="
                  isDark
                    ? 'text-primary-400 hover:bg-white/10 hover:text-white/80'
                    : 'text-primary-600 hover:bg-white/15 hover:text-white/80'
                "
              >
                <Icon :icon="item.icon" class="w-5 h-5 mr-3" />
                {{ item.label }}
                <span
                  class="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 bg-white/60"
                ></span>
              </a>
              <div
                class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-auto min-w-[100px] max-w-[140px] py-1.5 px-1 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
                :class="
                  isDark
                    ? 'bg-slate-900/95 border border-primary-500/30'
                    : 'bg-white/95 border border-primary-200 shadow-xl'
                "
              >
                <a
                  v-for="child in item.children"
                  :key="child.href"
                  :href="child.href"
                  class="flex items-center px-3 py-2 text-sm font-bold transition-colors duration-200"
                  :class="
                    isDark
                      ? 'text-primary-400 hover:bg-primary-500/20 hover:text-primary-300'
                      : 'text-primary-600 hover:bg-primary-50 hover:text-primary-500'
                  "
                >
                  <Icon :icon="child.icon" class="w-4 h-4 mr-2" />
                  {{ child.label }}
                </a>
              </div>
            </div>
            <a
              v-else
              :href="item.href"
              class="relative group flex items-center text-lg font-bold transition-all duration-300 px-3 py-1.5 rounded-xl"
              style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3)"
              :class="
                isDark
                  ? 'text-primary-400 hover:bg-white/10 hover:text-white/80'
                  : 'text-primary-600 hover:bg-white/15 hover:text-white/80'
              "
            >
              <Icon :icon="item.icon" class="w-5 h-5 mr-3" />
              {{ item.label }}
              <span
                class="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 bg-white/60"
              ></span>
            </a>
          </template>
        </div>

        <div class="flex items-center space-x-4">
          <button
            class="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/10 hover:text-white/80"
            style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3)"
            :class="isDark ? 'text-primary-400' : 'text-primary-600'"
            @click="toggleTheme"
          >
            <svg
              v-if="isDark"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
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
              class="h-6 w-6"
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
            class="md:hidden p-2 rounded-lg transition-colors hover:bg-white/10 hover:text-white/80"
            style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3)"
            :class="isDark ? 'text-primary-400' : 'text-primary-600'"
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
                  isDark
                    ? 'text-primary-400 hover:text-primary-300'
                    : 'text-primary-600 hover:text-primary-500'
                "
                @click="toggleMobileSubmenu(item.href)"
              >
                <span class="flex items-center">
                  <Icon
                    :icon="item.icon"
                    class="w-4 h-4 mr-2"
                    :class="isDark ? 'text-primary-400' : 'text-primary-600'"
                  />
                  {{ item.label }}
                </span>
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
                    isDark
                      ? 'text-primary-400 hover:text-primary-300'
                      : 'text-primary-600 hover:text-primary-500'
                  "
                  @click="mobileMenuOpen = false"
                >
                  <Icon
                    :icon="child.icon"
                    class="w-4 h-4 mr-2"
                    :class="isDark ? 'text-primary-400' : 'text-primary-600'"
                  />
                  {{ child.label }}
                </a>
              </div>
            </div>
            <a
              v-else
              :href="item.href"
              class="flex items-center px-6 py-3 text-sm font-bold transition-colors duration-300"
              :class="
                isDark
                  ? 'text-primary-400 hover:text-primary-300'
                  : 'text-primary-600 hover:text-primary-500'
              "
              @click="mobileMenuOpen = false"
            >
              <Icon :icon="item.icon" class="w-4 h-4 mr-2" />
              {{ item.label }}
            </a>
          </template>
        </div>
      </div>
    </div>
  </nav>

  <div class="min-h-screen relative" style="overflow: visible">
    <main class="relative z-10" style="overflow: visible">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useAppStore } from "@/stores";
import { useUserStore } from "@/stores/user";
import { useModuleConfig } from "@/composables/useModuleConfig";
import { Icon } from "@iconify/vue";

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
    { label: "首页", href: "/", icon: "mdi:home" },
    {
      label: pageConfigs.value.archive.title,
      href: "/archive",
      icon: "mdi:archive",
      children: [
        { label: "分类", href: "/archive/categories", icon: "mdi:folder-multiple" },
        { label: "标签云", href: "/archive/tags", icon: "mdi:tag-multiple" },
      ],
    },
    { label: pageConfigs.value.lyrics.title, href: "/lyrics", icon: "mdi:music" },
    { label: pageConfigs.value.gallery.title, href: "/gallery", icon: "mdi:image" },
    { label: pageConfigs.value.scenes.title, href: "/scenes", icon: "mdi:mountain" },
    {
      label: pageConfigs.value.about.title,
      href: "/about",
      icon: "mdi:user",
      children: [
        { label: pageConfigs.value.footprint.title, href: "/footprint", icon: "mdi:footprints" },
      ],
    },
  ];
  if (userStore.isAdmin) {
    items.push({ label: "记忆", href: "/memory", icon: "mdi:brain" });
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
