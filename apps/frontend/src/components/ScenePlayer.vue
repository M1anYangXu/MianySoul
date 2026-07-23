<template>
  <div class="relative">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="isExpanded"
        class="absolute bottom-16 right-0 w-64 rounded-2xl shadow-2xl overflow-hidden mb-4"
        :class="
          isDark ? 'bg-slate-900/95 border border-white/10' : 'bg-white/95 border border-gray-200'
        "
        style="backdrop-filter: blur(20px)"
      >
        <div class="p-4 border-b" :class="isDark ? 'border-white/10' : 'border-gray-200'">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-sm" :class="isDark ? 'text-white' : 'text-gray-900'">
              选择场景音乐
            </span>
            <button
              class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="isExpanded = false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="max-h-64 overflow-y-auto">
          <div
            v-for="scene in scenes"
            :key="scene.sceneId"
            class="p-3 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3"
            :class="{
              'bg-cyan-500/10': appStore.activeScene?.sceneId === scene.sceneId,
            }"
            @click="selectScene(scene)"
          >
            <DynamicIcon
              :name="scene.icon"
              class="w-6 h-6 flex-shrink-0"
              :style="{ color: scene.color }"
            />
            <div class="flex-1 min-w-0">
              <div
                class="font-medium text-sm truncate"
                :class="isDark ? 'text-white' : 'text-gray-900'"
              >
                {{ scene.name }}
              </div>
              <div
                v-if="scene.description"
                class="text-xs truncate"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ scene.description }}
              </div>
            </div>
            <div
              v-if="appStore.activeScene?.sceneId === scene.sceneId"
              class="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <div v-if="scenes.length === 0" class="p-6 text-center">
            <DynamicIcon
              name="Music"
              class="w-10 h-10 mx-auto mb-2"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'"
            />
            <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">暂无场景音乐</p>
          </div>
        </div>
      </div>
    </Transition>

    <button
      class="group relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      :class="[
        appStore.activeScene
          ? isDark
            ? 'bg-[var(--color-primary-500)] text-white border-transparent'
            : 'bg-[var(--color-primary-500)] text-white border-transparent'
          : isDark
            ? 'bg-white/10 border border-white/20 text-white hover:bg-[var(--color-primary-500)] hover:border-transparent'
            : 'bg-white border border-gray-200 text-gray-600 hover:bg-[var(--color-primary-500)] hover:text-white hover:border-transparent',
      ]"
      style="backdrop-filter: blur(10px)"
      title="场景音乐"
      @click="toggleExpand"
    >
      <div
        v-if="appStore.activeScene && appStore.isPlaying"
        class="absolute inset-0 rounded-full overflow-hidden"
      >
        <div
          class="absolute inset-0 opacity-30"
          :style="{
            background: `conic-gradient(from 0deg, transparent, ${appStore.activeScene.color}, transparent, ${appStore.activeScene.color}, transparent)`,
            animation: 'spin 3s linear infinite',
          }"
        ></div>
      </div>

      <DynamicIcon
        v-if="appStore.activeScene"
        :name="appStore.activeScene.icon"
        class="w-6 h-6 z-10"
        :style="{ color: appStore.isPlaying ? 'white' : undefined }"
      />
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 z-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
        />
      </svg>

      <div
        v-if="appStore.activeScene && appStore.isPlaying"
        class="absolute -bottom-1 -right-1 flex gap-0.5"
      >
        <span
          class="w-1 h-3 rounded-full bg-cyan-400 animate-pulse"
          style="animation-delay: 0s"
        ></span>
        <span
          class="w-1 h-4 rounded-full bg-cyan-400 animate-pulse"
          style="animation-delay: 0.1s"
        ></span>
        <span
          class="w-1 h-2 rounded-full bg-cyan-400 animate-pulse"
          style="animation-delay: 0.2s"
        ></span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";
import DynamicIcon from "@/components/DynamicIcon.vue";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

interface Scene {
  sceneId: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  audioUrl: string;
  isActive: boolean;
}

const scenes = ref<Scene[]>([]);
const isExpanded = ref(false);
let audioElement: HTMLAudioElement | null = null;

const fetchScenes = async () => {
  try {
    const data = await http.get<{ list: Scene[] }>("/scene");
    scenes.value = data.list || [];
  } catch (e) {
    console.error("获取场景失败:", e);
  }
};

const createAudioElement = () => {
  if (!appStore.activeScene) return;

  audioElement = new Audio(appStore.activeScene.audioUrl);
  audioElement.loop = true;

  audioElement.addEventListener("error", () => {
    console.error("音频加载失败");
    appStore.stopScene();
    audioElement = null;
  });

  audioElement.addEventListener("pause", () => {
    if (audioElement && audioElement.paused) {
      appStore.setIsPlaying(false);
    }
  });

  audioElement.addEventListener("play", () => {
    appStore.setIsPlaying(true);
  });
};

const selectScene = (scene: Scene) => {
  if (appStore.activeScene?.sceneId === scene.sceneId) {
    togglePlay();
    isExpanded.value = false;
    return;
  }

  stopAudio();

  appStore.playScene(scene);
  createAudioElement();

  if (audioElement) {
    audioElement
      .play()
      .then(() => {
        appStore.setIsPlaying(true);
      })
      .catch((e) => {
        console.error("播放失败:", e);
        appStore.stopScene();
      });
  }

  isExpanded.value = false;
};

const togglePlay = () => {
  if (!audioElement) return;

  if (appStore.isPlaying) {
    audioElement.pause();
    appStore.setIsPlaying(false);
  } else {
    audioElement.play().catch((e) => {
      console.error("播放失败:", e);
    });
    appStore.setIsPlaying(true);
  }
};

const stopAudio = () => {
  if (audioElement) {
    audioElement.pause();
    audioElement = null;
  }
};

const toggleExpand = () => {
  if (!appStore.activeScene) {
    isExpanded.value = !isExpanded.value;
    return;
  }

  if (isExpanded.value) {
    isExpanded.value = false;
  } else {
    isExpanded.value = true;
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".fixed.bottom-8.right-8")) {
    isExpanded.value = false;
  }
};

onMounted(() => {
  fetchScenes();
  document.addEventListener("click", handleClickOutside);

  if (appStore.activeScene && appStore.isPlaying) {
    createAudioElement();
    if (audioElement) {
      audioElement.play().catch((e) => {
        console.error("恢复播放失败:", e);
      });
    }
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
