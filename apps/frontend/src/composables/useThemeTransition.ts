import { nextTick } from "vue";
import { useAppStore } from "@/stores";

const appStore = useAppStore();

export function useThemeTransition() {
  const toggleTheme = () => {
    const currentMode = appStore.themeMode;
    const newMode = currentMode === "dark" ? "light" : "dark";

    const startX = window.innerWidth;
    const startY = 0;

    const radius = Math.hypot(window.innerWidth, window.innerHeight);

    document.documentElement.style.setProperty("--tx", `${startX}px`);
    document.documentElement.style.setProperty("--ty", `${startY}px`);
    document.documentElement.style.setProperty("--tr", `${radius}px`);

    if ("startViewTransition" in document) {
      document.startViewTransition(async () => {
        appStore.setThemeMode(newMode);
        await nextTick();
      });
    } else {
      appStore.setThemeMode(newMode);
    }
  };

  return {
    toggleTheme,
  };
}
