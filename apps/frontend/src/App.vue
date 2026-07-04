<template>
  <n-config-provider :theme="isDark ? darkTheme : lightTheme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <message-provider />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { NConfigProvider, NMessageProvider, NDialogProvider } from "naive-ui";
import MessageProvider from "@/components/MessageProvider.vue";
import { useAppStore, useUserStore } from "@/stores";
import { getAccessToken } from "@/utils/auth-token";
import { useModuleConfig } from "@/composables/useModuleConfig";

const appStore = useAppStore();
const userStore = useUserStore();

const { getConfig, loadConfig } = useModuleConfig();

const isDark = computed(() => appStore.themeMode === "dark");

const lightTheme = { name: "light" };
const darkTheme = { name: "dark" };

const themeOverrides = {
  common: {
    primaryColor: "#0ea5e9",
    primaryColorHover: "#38bdf8",
    primaryColorPressed: "#0284c7",
  },
};

const updateThemeClass = () => {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
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
  updateThemeClass();
  initToken();
  await loadConfig();
  const config = getConfig();
  updateFavicon(config.logo);
});

watch(isDark, () => {
  updateThemeClass();
});
</script>
