<template>
  <div
    class="fixed inset-0 transition-colors duration-300"
    :class="isDark ? 'bg-gray-950' : 'bg-gray-100'"
  >
    <!-- 左上角悬浮返回按钮 -->
    <button
      class="fixed top-6 left-6 z-50 p-3 rounded-xl backdrop-blur-lg bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
      :class="{ 'opacity-30': isIdle && !isHoveringBack }"
      @click="handleBack"
      @mouseenter="isHoveringBack = true"
      @mouseleave="isHoveringBack = false"
    >
      <span class="text-gray-600 dark:text-gray-300 text-xl">←</span>
    </button>

    <!-- 右上角迷你主题切换 -->
    <button
      class="fixed top-6 right-6 z-50 p-3 rounded-xl backdrop-blur-lg bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
      :class="{ 'opacity-30': isIdle && !isHoveringTheme }"
      @click="toggleTheme"
      @mouseenter="isHoveringTheme = true"
      @mouseleave="isHoveringTheme = false"
    >
      <span v-if="!isDark" class="text-gray-600">🌙</span>
      <span v-else class="text-gray-300">☀️</span>
    </button>

    <!-- 底部提示 -->
    <div
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full backdrop-blur-lg bg-black/20 text-white/60 text-xs transition-all duration-300"
      :class="{ 'opacity-0 pointer-events-none': isIdle }"
    >
      按 Esc 返回
    </div>

    <!-- 主内容区 -->
    <main class="w-full h-full">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores";

const router = useRouter();
const appStore = useAppStore();

const isDark = computed(() => appStore.themeMode === "dark");
const isIdle = ref(false);
const isHoveringBack = ref(false);
const isHoveringTheme = ref(false);

let idleTimer: ReturnType<typeof setTimeout> | null = null;

const resetIdleTimer = () => {
  if (idleTimer) {
    clearTimeout(idleTimer);
  }
  isIdle.value = false;
  idleTimer = setTimeout(() => {
    isIdle.value = true;
  }, 3000);
};

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

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    handleBack();
  }
};

onMounted(() => {
  resetIdleTimer();
  document.addEventListener("mousemove", resetIdleTimer);
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  if (idleTimer) {
    clearTimeout(idleTimer);
  }
  document.removeEventListener("mousemove", resetIdleTimer);
  document.removeEventListener("keydown", handleKeydown);
});
</script>
