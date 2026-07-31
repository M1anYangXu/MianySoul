<template>
  <router-view />
  <MessageHost />
  <DialogHost />
</template>

<script setup lang="ts">
import { computed, onMounted, watch, ref } from "vue";
import MessageHost from "@/components/MessageHost.vue";
import DialogHost from "@/components/DialogHost.vue";
import { useAppStore, useUserStore } from "@/stores";
import { getAccessToken } from "@/utils/auth-token";
import { useModuleConfig } from "@/composables/useModuleConfig";

const appStore = useAppStore();
const userStore = useUserStore();

const { getConfig, loadConfig, configCache } = useModuleConfig();

const isDark = computed(() => appStore.themeMode === "dark");
const displayIsDark = ref(isDark.value);

watch(
  isDark,
  (newIsDark) => {
    displayIsDark.value = newIsDark;
    updateThemeClass();
  },
  { flush: "post" }
);

// 由用户配置的主色生成 50–900 调色板
const generateColorPalette = (baseColor: string): Record<string, string> => {
  const hex = baseColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const palette: Record<string, string> = {};
  for (let i = 50; i <= 900; i += 50) {
    let newR: number, newG: number, newB: number;
    if (i === 500) {
      newR = r;
      newG = g;
      newB = b;
    } else if (i < 500) {
      const ratio = (500 - i) / 500;
      newR = Math.round(r + (255 - r) * ratio);
      newG = Math.round(g + (255 - g) * ratio);
      newB = Math.round(b + (255 - b) * ratio);
    } else {
      const ratio = (i - 500) / 500;
      newR = Math.round(r * (1 - ratio));
      newG = Math.round(g * (1 - ratio));
      newB = Math.round(b * (1 - ratio));
    }
    newR = Math.max(0, Math.min(255, newR));
    newG = Math.max(0, Math.min(255, newG));
    newB = Math.max(0, Math.min(255, newB));
    palette[i.toString()] =
      `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  }
  return palette;
};

const updateThemeColors = () => {
  const config = getConfig();
  const customPrimary = displayIsDark.value ? config.darkThemeColor : config.lightThemeColor;
  if (customPrimary) {
    const primaryPalette = generateColorPalette(customPrimary);
    Object.keys(primaryPalette).forEach((key) => {
      document.documentElement.style.setProperty(`--color-primary-${key}`, primaryPalette[key]);
    });
  }
};

const updateThemeClass = () => {
  if (displayIsDark.value) {
    document.documentElement.classList.add("dark");
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.setAttribute("data-theme", "light");
  }
  updateThemeColors();
};

const initToken = () => {
  const token = getAccessToken();
  if (token && !userStore.token) {
    userStore.token = token;
  }
};

const updateFavicon = (logo: string) => {
  const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
  if (link) {
    link.href = logo || "/favicon.svg";
  }
};

onMounted(async () => {
  await loadConfig();
  updateThemeClass();
  initToken();
  const config = getConfig();
  updateFavicon(config.logo);
});

watch(
  configCache,
  () => {
    updateThemeColors();
  },
  { deep: true }
);
</script>
