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
                ? 'bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-400'
                : 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-purple-600'
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

      <div class="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
        <div
          v-for="(lyric, index) in lyrics"
          :key="lyric.id"
          class="break-inside-avoid group"
          :class="{
            'translate-y-0 opacity-100': lyricsVisible,
            'translate-y-10 opacity-0': !lyricsVisible,
          }"
          :style="{ transition: `all 0.6s ease-out ${0.05 * index}s` }"
        >
          <div
            class="relative rounded-xl overflow-hidden p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            :class="
              isDark
                ? 'bg-gray-800/80 border border-gray-700/50 hover:border-violet-500/30'
                : 'bg-white border border-gray-200/50 hover:border-violet-200'
            "
          >
            <div
              v-if="lyric.coverImage"
              class="rounded-lg overflow-hidden mb-3"
              :class="getImageHeightClass(lyric.lyric.length)"
            >
              <img
                :src="lyric.coverImage"
                :alt="lyric.songName"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="rounded-lg mb-3 flex items-center justify-center"
              :class="[getImageHeightClass(lyric.lyric.length), getGradientClass(index)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>

            <div class="flex items-center gap-2 mb-2">
              <span
                class="px-2 py-0.5 rounded-full text-xs font-medium"
                :class="
                  isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-600'
                "
              >
                {{ lyric.singer }}
              </span>
            </div>

            <h3 class="font-semibold mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ lyric.songName }}
            </h3>

            <p
              class="text-sm italic leading-relaxed"
              :class="isDark ? 'text-gray-400' : 'text-gray-600'"
            >
              "{{ lyric.lyric }}"
            </p>

            <div
              class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                :class="isDark ? 'text-violet-400' : 'text-violet-500'"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";
import { useModuleConfig } from "@/composables/useModuleConfig";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

const { getPageTitle, getPageSubtitle } = useModuleConfig();
const pageTitle = computed(() => getPageTitle("lyrics"));
const pageSubtitle = computed(() => getPageSubtitle("lyrics"));

interface LyricItem {
  id: string;
  singer: string;
  songName: string;
  lyric: string;
  coverImage?: string;
  sortOrder: number;
  createdAt: string;
}

const lyrics = ref<LyricItem[]>([]);
const lyricsVisible = ref(false);

const gradients = [
  "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500",
  "bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500",
  "bg-gradient-to-br from-pink-500 via-rose-500 to-red-500",
  "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
  "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500",
];

const getGradientClass = (index: number) => {
  return gradients[index % gradients.length];
};

const getImageHeightClass = (length: number) => {
  if (length < 30) return "h-24";
  if (length < 60) return "h-32";
  if (length < 90) return "h-40";
  return "h-48";
};

const fetchLyrics = async () => {
  try {
    const data = await http.get<LyricItem[]>("/music?limit=200");
    lyrics.value = data;
  } catch (e) {
    console.error("获取歌词失败:", e);
  }
};

onMounted(() => {
  fetchLyrics();
  setTimeout(() => {
    lyricsVisible.value = true;
  }, 100);
});
</script>
