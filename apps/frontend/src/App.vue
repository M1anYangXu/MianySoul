<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <router-view />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NDialogProvider } from "naive-ui";

// 预留主题配置
const themeOverrides = {
  common: {
    primaryColor: "#0ea5e9",
    primaryColorHover: "#38bdf8",
    primaryColorPressed: "#0284c7",
  },
};
</script>
