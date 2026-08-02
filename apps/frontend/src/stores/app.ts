import { defineStore } from "pinia";

interface Scene {
  sceneId: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  audioUrl: string;
  isActive: boolean;
}

interface AppState {
  sidebarCollapsed: boolean;
  themeMode: "light" | "dark";
  loading: boolean;
  splashActive: boolean;
  activeScene: Scene | null;
  isPlaying: boolean;
  audioUrl: string;
}

export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    sidebarCollapsed: false,
    themeMode: "light",
    loading: false,
    splashActive: false,
    activeScene: null,
    isPlaying: false,
    audioUrl: "",
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

    setSplashActive(active: boolean) {
      this.splashActive = active;
    },

    setActiveScene(scene: Scene | null) {
      this.activeScene = scene;
      this.audioUrl = scene?.audioUrl || "";
    },

    setIsPlaying(playing: boolean) {
      this.isPlaying = playing;
    },

    playScene(scene: Scene) {
      this.activeScene = scene;
      this.audioUrl = scene.audioUrl;
      this.isPlaying = true;
    },

    pauseScene() {
      this.isPlaying = false;
    },

    stopScene() {
      this.activeScene = null;
      this.audioUrl = "";
      this.isPlaying = false;
    },
  },

  persist: {
    key: "app-store",
    paths: ["sidebarCollapsed", "themeMode"],
  },
});
