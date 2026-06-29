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
            歌词墙
          </span>
        </h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">那些打动我的旋律</p>
      </div>

      <div class="flex flex-wrap justify-center gap-4">
        <div
          v-for="(lyric, index) in lyrics"
          :key="lyric.id"
          class="group relative rounded-xl overflow-hidden cursor-pointer w-[200px]"
          :class="{
            'translate-y-0 opacity-100': lyricsVisible,
            'translate-y-10 opacity-0': !lyricsVisible,
          }"
          :style="{ transition: `all 0.6s ease-out ${0.1 * index}s` }"
        >
          <div class="w-full h-[120px] relative">
            <img
              v-if="lyric.coverImage"
              :src="lyric.coverImage"
              :alt="lyric.songName"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 text-white/30"
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
          </div>
          <div
            class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"
          ></div>
          <div class="absolute bottom-0 left-0 right-0 p-3">
            <div class="flex items-center space-x-2 mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3 text-violet-400"
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
              <span class="text-xs text-violet-300">{{ lyric.singer }}</span>
            </div>
            <div class="text-white font-semibold text-sm mb-1">{{ lyric.songName }}</div>
            <div class="text-gray-300 text-xs line-clamp-2 italic">"{{ lyric.lyric }}"</div>
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

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

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

const fetchLyrics = async () => {
  try {
    const data = await http.get<LyricItem[]>("/music?limit=100");
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
