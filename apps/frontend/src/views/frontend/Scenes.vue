<template>
  <div class="min-h-screen py-24 px-6 overflow-hidden">
    <div class="max-w-7xl mx-auto">
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
            {{ pageTitle }}
          </span>
        </h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">
          {{ pageSubtitle }}
        </p>
      </div>

      <div
        class="relative w-full aspect-[21/9] rounded-3xl overflow-hidden group"
        @mouseenter="pauseAutoPlay"
        @mouseleave="resumeAutoPlay"
      >
        <div
          v-for="(scene, index) in scenes"
          :key="scene.sceneId"
          class="absolute inset-0 transition-all duration-1000 ease-in-out"
          :class="{
            'opacity-100 scale-100 z-10': currentIndex === index,
            'opacity-0 scale-105 z-0': currentIndex !== index,
          }"
        >
          <img :src="scene.image" :alt="scene.name" class="w-full h-full object-cover" />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
          ></div>
          <div
            class="absolute bottom-12 left-12 right-12"
            :class="{
              'translate-y-0 opacity-100': currentIndex === index,
              'translate-y-8 opacity-0': currentIndex !== index,
            }"
            style="transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s"
          >
            <div class="flex items-center gap-4 mb-4">
              <span class="text-5xl">{{ scene.icon }}</span>
              <div>
                <h2 class="text-4xl font-bold text-white mb-2">{{ scene.name }}</h2>
                <p class="text-lg text-gray-300">{{ scene.description }}</p>
              </div>
            </div>
            <button
              class="flex items-center gap-3 px-8 py-3 rounded-full backdrop-blur-md border border-white/20 text-white font-medium hover:bg-white/10 transition-all duration-300"
              :class="{
                'bg-white/10': activeScene?.sceneId === scene.sceneId,
                'bg-white/5': activeScene?.sceneId !== scene.sceneId,
              }"
              @click="toggleScene(scene)"
            >
              <span v-if="activeScene?.sceneId === scene.sceneId">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              </span>
              <span v-else>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span>{{ activeScene?.sceneId === scene.sceneId ? "暂停播放" : "开始播放" }}</span>
            </button>
          </div>
        </div>

        <button
          class="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110"
          @click="prevSlide"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          class="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110"
          @click="nextSlide"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          <button
            v-for="(scene, index) in scenes"
            :key="scene.sceneId"
            class="group/dot flex items-center gap-2"
            @click="goToSlide(index)"
          >
            <span
              class="h-2 rounded-full transition-all duration-500"
              :class="{
                'w-8 bg-white': currentIndex === index,
                'w-2 bg-white/40 group-hover/dot:bg-white/70': currentIndex !== index,
              }"
            ></span>
          </button>
        </div>

        <div class="absolute top-6 right-6 z-20 flex items-center gap-3">
          <button
            class="w-12 h-12 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20"
            @click="toggleAutoPlay"
          >
            <svg
              v-if="isAutoPlaying"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          v-for="(scene, index) in scenes"
          :key="scene.sceneId"
          class="group relative cursor-pointer rounded-xl overflow-hidden aspect-[4/3]"
          :class="{
            'ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent': currentIndex === index,
          }"
          @click="goToSlide(index)"
        >
          <img
            :src="scene.image"
            :alt="scene.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
          ></div>
          <div class="absolute bottom-3 left-3 right-3">
            <div class="flex items-center gap-2">
              <span class="text-lg">{{ scene.icon }}</span>
              <span class="text-sm font-medium text-white truncate">{{ scene.name }}</span>
            </div>
          </div>
          <div
            v-if="currentIndex === index"
            class="absolute inset-0 border-2 border-cyan-400 rounded-xl"
          ></div>
        </div>
      </div>

      <div v-if="activeScene" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
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
import { useModuleConfig } from "@/composables/useModuleConfig";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

const { getPageTitle, getPageSubtitle } = useModuleConfig();
const pageTitle = computed(() => getPageTitle("scenes"));
const pageSubtitle = computed(() => getPageSubtitle("scenes"));

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
const currentIndex = ref(0);
const isAutoPlaying = ref(true);
let autoPlayTimer: ReturnType<typeof setInterval> | null = null;
let audioElement: HTMLAudioElement | null = null;

const AUTO_PLAY_INTERVAL = 5000;

const startAutoPlay = () => {
  if (autoPlayTimer) return;
  autoPlayTimer = setInterval(() => {
    nextSlide();
  }, AUTO_PLAY_INTERVAL);
};

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
};

const pauseAutoPlay = () => {
  stopAutoPlay();
};

const resumeAutoPlay = () => {
  if (isAutoPlaying.value) {
    startAutoPlay();
  }
};

const toggleAutoPlay = () => {
  isAutoPlaying.value = !isAutoPlaying.value;
  if (isAutoPlaying.value) {
    startAutoPlay();
  } else {
    stopAutoPlay();
  }
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
};

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % scenes.value.length;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + scenes.value.length) % scenes.value.length;
};

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
  fetchScenes().then(() => {
    startAutoPlay();
  });
});

onUnmounted(() => {
  stopAutoPlay();
  stopAudio();
});
</script>
