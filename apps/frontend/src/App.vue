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

const { getConfig, loadConfig, configCache } = useModuleConfig();

const isDark = computed(() => appStore.themeMode === "dark");

const lightTheme = { name: "light" };
const darkTheme = { name: "dark" };

const themeOverrides = computed(() => {
  const config = getConfig();
  const primaryColor = isDark.value
    ? config.darkThemeColor || "#d946ef"
    : config.lightThemeColor || "#14b8a6";
  return {
    common: {
      primaryColor,
      primaryColorHover: primaryColor,
      primaryColorPressed: primaryColor,
    },
  };
});

const lightColors: Record<string, string> = {
  "50": "#f0fdfa",
  "100": "#ccfbf1",
  "200": "#99f6e4",
  "300": "#5eead4",
  "400": "#2dd4bf",
  "500": "#14b8a6",
  "600": "#0d9488",
  "700": "#0f766e",
  "800": "#115e59",
  "900": "#134e4a",
};

const darkColors: Record<string, string> = {
  "50": "#fdf4ff",
  "100": "#fae8ff",
  "200": "#f5d0fe",
  "300": "#f0abfc",
  "400": "#e879f9",
  "500": "#d946ef",
  "600": "#c026d3",
  "700": "#a21caf",
  "800": "#86198f",
  "900": "#701a75",
};

const hexToHsl = (hex: string) => {
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s, l };
};

const hslToHex = (h: number, s: number, l: number) => {
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    h /= 360;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return `#${Math.round(r * 255)
    .toString(16)
    .padStart(2, "0")}${Math.round(g * 255)
    .toString(16)
    .padStart(2, "0")}${Math.round(b * 255)
    .toString(16)
    .padStart(2, "0")}`;
};

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

const generateAccentColor = (baseColor: string): string => {
  const { h, s, l } = hexToHsl(baseColor.replace("#", ""));
  return hslToHex((h + 45) % 360, s, l);
};

const updateThemeColors = () => {
  const config = getConfig();
  const baseColors = isDark.value
    ? { primary: darkColors, accent: darkColors }
    : { primary: lightColors, accent: lightColors };

  const customPrimary = isDark.value ? config.darkThemeColor : config.lightThemeColor;

  if (customPrimary) {
    const primaryPalette = generateColorPalette(customPrimary);
    const accentColor = generateAccentColor(customPrimary);
    const accentPalette = generateColorPalette(accentColor);

    Object.keys(primaryPalette).forEach((key) => {
      document.documentElement.style.setProperty(`--color-primary-${key}`, primaryPalette[key]);
    });

    Object.keys(accentPalette).forEach((key) => {
      document.documentElement.style.setProperty(`--color-accent-${key}`, accentPalette[key]);
    });
  } else {
    Object.keys(baseColors.primary).forEach((key) => {
      document.documentElement.style.setProperty(`--color-primary-${key}`, baseColors.primary[key]);
    });

    Object.keys(baseColors.accent).forEach((key) => {
      document.documentElement.style.setProperty(`--color-accent-${key}`, baseColors.accent[key]);
    });
  }
};

const updateThemeClass = () => {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
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

watch(isDark, () => {
  updateThemeClass();
});

watch(
  configCache,
  () => {
    updateThemeColors();
  },
  { deep: true }
);
</script>
