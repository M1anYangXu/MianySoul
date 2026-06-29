<template>
  <div class="min-h-screen py-24 px-6">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h1
          class="text-4xl md:text-5xl font-bold mb-4"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            :class="
              isDark
                ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400'
                : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600'
            "
            class="bg-clip-text text-transparent"
          >
            场景
          </span>
        </h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">
          选择一个场景，放松心情
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(scene, index) in scenes"
          :key="scene.sceneId"
          class="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500"
          :class="{
            'scale-105 shadow-2xl': activeScene?.sceneId === scene.sceneId,
          }"
          :style="{ transitionDelay: `${0.1 * index}s` }"
          @click="toggleScene(scene)"
        >
          <div class="aspect-[4/3] relative">
            <img
              :src="scene.image"
              :alt="scene.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent"
            ></div>

            <div
              class="absolute inset-0 flex items-center justify-center"
              :class="{
                'opacity-100': activeScene?.sceneId === scene.sceneId,
                'opacity-0': activeScene?.sceneId !== scene.sceneId,
              }"
              style="transition: opacity 0.3s ease"
            >
              <div
                class="w-20 h-20 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md animate-pulse"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="absolute bottom-0 left-0 right-0 p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-3xl">{{ scene.icon }}</span>
              <div
                v-if="activeScene?.sceneId === scene.sceneId"
                class="flex items-center space-x-1"
              >
                <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span
                  class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"
                  style="animation-delay: 0.2s"
                ></span>
                <span
                  class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"
                  style="animation-delay: 0.4s"
                ></span>
              </div>
            </div>
            <h3 class="text-xl font-bold mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ scene.name }}
            </h3>
            <p class="text-sm line-clamp-2" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
              {{ scene.description || "暂无描述" }}
            </p>
          </div>

          <div
            class="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/50 transition-colors duration-300 rounded-2xl"
          ></div>
        </div>
      </div>

      <div v-if="activeScene" class="mt-12 fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div
          class="flex items-center space-x-4 px-6 py-4 rounded-full backdrop-blur-xl"
          :class="
            isDark
              ? 'bg-slate-900/90 border border-white/10'
              : 'bg-white/90 border border-gray-200 shadow-lg'
          "
        >
          <span class="text-2xl">{{ activeScene.icon }}</span>
          <div class="flex-1">
            <div class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ activeScene.name }}
            </div>
            <div class="flex items-center space-x-1">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span
                class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"
                style="animation-delay: 0.2s"
              ></span>
              <span
                class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"
                style="animation-delay: 0.4s"
              ></span>
              <span class="text-xs ml-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                播放中
              </span>
            </div>
          </div>
          <button
            class="p-2 rounded-full transition-colors"
            :class="isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'"
            @click="stopAudio"
          >
            <svg
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

interface Scene {
  sceneId: string;
  name: string;
  icon: string;
  description?: string;
  image: string;
  audioUrl: string;
  sortOrder: number;
  isActive: boolean;
}

const scenes = ref<Scene[]>([]);
const activeScene = ref<Scene | null>(null);
let audioElement: HTMLAudioElement | null = null;

const toggleScene = (scene: Scene) => {
  if (activeScene.value?.sceneId === scene.sceneId) {
    stopAudio();
    return;
  }

  stopAudio();

  activeScene.value = scene;
  audioElement = new Audio(scene.audioUrl);
  audioElement.loop = true;
  audioElement.play().catch((e) => {
    console.error("播放失败:", e);
    activeScene.value = null;
  });
};

const stopAudio = () => {
  if (audioElement) {
    audioElement.pause();
    audioElement = null;
  }
  activeScene.value = null;
};

const fetchScenes = async () => {
  try {
    const data = await http.get<Scene[]>("/scene");
    scenes.value = data;
  } catch (e) {
    console.error("获取场景失败:", e);
  }
};

onMounted(() => {
  fetchScenes();
});

onUnmounted(() => {
  stopAudio();
});
</script>
