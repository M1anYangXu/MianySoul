import { defineStore } from "pinia";

interface AppState {
  sidebarCollapsed: boolean;
  themeMode: "light" | "dark";
  loading: boolean;
}

export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    sidebarCollapsed: false,
    themeMode: "light",
    loading: false,
  }),

  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },

    setSidebarCollapsed(collapsed: boolean) {
      this.sidebarCollapsed = collapsed;
    },

    setThemeMode(mode: "light" | "dark") {
      this.themeMode = mode;
    },

    setLoading(loading: boolean) {
      this.loading = loading;
    },
  },

  persist: {
    key: "app-store",
    paths: ["sidebarCollapsed", "themeMode"],
  },
});
