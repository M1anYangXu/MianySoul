<template>
  <div class="min-h-screen py-24 px-6 relative overflow-hidden">
    <div
      class="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 blur-3xl"
      style="transform: translate(-20%, -20%)"
    ></div>
    <div
      class="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl"
      style="transform: translate(20%, 20%)"
    ></div>

    <div class="max-w-6xl mx-auto relative z-10">
      <div class="text-center mb-16">
        <h1
          class="text-4xl md:text-5xl font-bold mb-4"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            :class="
              isDark
                ? 'bg-gradient-to-r from-primary-400 via-accent-400 to-primary-500'
                : 'bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700'
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

      <div class="flex flex-wrap justify-center gap-3 mb-12">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
          :class="[
            selectedCategory === cat.name
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30'
              : isDark
                ? 'bg-white/10 text-gray-400 hover:bg-white/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          ]"
          @click="selectCategory(cat.name)"
        >
          {{ cat.icon }} {{ cat.name }}
          <span v-if="cat.count > 0" class="ml-1 opacity-70">({{ cat.count }})</span>
        </button>
      </div>

      <div class="lyrics-masonry-grid">
        <div
          v-for="(lyric, index) in lyrics"
          :key="lyric.id"
          class="lyrics-masonry-item group relative rounded-xl overflow-hidden cursor-pointer"
          :class="[
            {
              'translate-y-0 opacity-100': lyricsVisible,
              'opacity-0 pointer-events-none': !lyricsVisible,
            },
          ]"
          :style="{ transition: `all 0.6s ease-out ${0.08 * index}s` }"
        >
          <div
            class="relative"
            :class="
              lyric.coverImage
                ? ''
                : isDark
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200'
            "
          >
            <div v-if="lyric.coverImage" class="relative">
              <img
                :src="getFullImageUrl(lyric.coverImage)"
                :alt="lyric.songName"
                class="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                :class="lyricImageLoaded[lyric.id] ? 'opacity-100' : 'opacity-0'"
                @load="onLyricImageLoaded(lyric.id)"
                @error="onLyricImageLoaded(lyric.id)"
              />
              <div
                v-if="!lyricImageLoaded[lyric.id]"
                class="absolute inset-0 flex items-center justify-center"
              >
                <div
                  class="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                  :class="isDark ? 'border-gray-600' : 'border-gray-300'"
                ></div>
              </div>
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
              ></div>
              <div class="absolute top-3 left-3">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800 shadow-sm"
                >
                  {{ lyric.singer }}
                </span>
              </div>
              <div class="absolute bottom-3 left-3 right-3">
                <h3 class="text-lg font-bold text-white truncate">
                  {{ lyric.songName }}
                </h3>
              </div>
            </div>
            <div v-else class="relative h-40 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-12 h-12 opacity-30"
                :class="isDark ? 'text-gray-600' : 'text-gray-400'"
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
              <div class="absolute top-3 left-3">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="isDark ? 'bg-gray-700/80 text-gray-300' : 'bg-gray-200 text-gray-700'"
                >
                  {{ lyric.singer }}
                </span>
              </div>
              <div class="absolute bottom-3 left-3 right-3">
                <h3
                  class="text-lg font-bold truncate"
                  :class="isDark ? 'text-white' : 'text-gray-800'"
                >
                  {{ lyric.songName }}
                </h3>
              </div>
            </div>
          </div>

          <div class="p-4" :class="isDark ? 'bg-gray-800' : 'bg-white'">
            <div class="flex items-center gap-2 mb-3">
              <span
                v-if="
                  !selectedCategory &&
                  getLyricCategoryName(lyric) !== '未分类' &&
                  getLyricCategoryName(lyric) !== '默认分类'
                "
                class="px-2 py-0.5 rounded-full text-xs font-medium"
                :class="isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'"
              >
                {{ getLyricCategoryName(lyric) }}
              </span>
              <button
                v-if="lyric.audio"
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300 hover:scale-110"
                :class="[
                  playingId === lyric.id
                    ? 'bg-primary-500 text-white'
                    : isDark
                      ? 'bg-gray-700 text-gray-400 hover:bg-primary-500/80 hover:text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-primary-100 hover:text-primary-600',
                ]"
                title="播放音频"
                @click.stop="toggleAudio(lyric)"
              >
                {{ playingId === lyric.id ? "⏸" : "▶" }}
              </button>
            </div>

            <div class="relative text-left">
              <p
                class="text-sm leading-relaxed italic"
                :class="[isDark ? 'text-gray-400' : 'text-gray-600']"
                style="white-space: pre-wrap"
              >
                {{ lyric.lyric }}
              </p>
            </div>

            <div class="mt-3 flex items-center justify-between text-xs">
              <span :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                {{ formatDate(lyric.createdAt) }}
              </span>
              <span :class="isDark ? 'text-primary-400' : 'text-primary-500'">
                {{ lyric.lyric.length }} 字
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="lyrics.length === 0"
        class="text-center py-20"
        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
      >
        <div
          class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
          :class="isDark ? 'bg-gray-800' : 'bg-gray-100'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 opacity-50"
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
        <p>暂无歌词</p>
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
const pageTitle = computed(() => getPageTitle("lyrics"));
const pageSubtitle = computed(() => getPageSubtitle("lyrics"));

interface LyricAudio {
  id: string;
  url: string;
  filename: string;
}

interface LyricCategory {
  id: string;
  name: string;
  icon: string;
}

interface LyricItem {
  id: string;
  singer: string;
  songName: string;
  lyric: string;
  coverImage?: string;
  audioId?: string;
  audio?: LyricAudio;
  category: string;
  categoryRel?: LyricCategory;
  sortOrder: number;
  createdAt: string;
}

const allLyrics = ref<LyricItem[]>([]);
const lyricsVisible = ref(false);
const lyricImageLoaded = ref<Record<string, boolean>>({});

const playingId = ref<string | null>(null);
const audioRef = ref<HTMLAudioElement | null>(null);

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  isDefault: boolean;
  count: number;
}

const categories = ref<CategoryItem[]>([]);
const selectedCategory = ref("");

const getLyricCategoryName = (lyric: LyricItem) => {
  return lyric.categoryRel?.name || lyric.category || "未分类";
};

const lyrics = computed(() => {
  if (!selectedCategory.value) {
    return allLyrics.value;
  }
  return allLyrics.value.filter((lyric) => getLyricCategoryName(lyric) === selectedCategory.value);
});

const fetchCategories = async () => {
  try {
    const data = await http.get<{ data: CategoryItem[] }>("/music/categories/list");
    categories.value = data.data || [];
  } catch (e) {
    console.error("获取分类失败:", e);
  }
};

const selectCategory = (cat: string) => {
  selectedCategory.value = cat;
  lyricsVisible.value = false;
  lyricImageLoaded.value = {};

  const grid = document.querySelector(".lyrics-masonry-grid") as HTMLElement;
  if (grid) {
    grid.style.height = "auto";
  }

  setTimeout(() => {
    lyricsVisible.value = true;
    const hasImages = lyrics.value.some((l) => l.coverImage);
    if (!hasImages) {
      updateLyricsMasonryLayout();
    }
  }, 100);
};

const onLyricImageLoaded = (id: string) => {
  lyricImageLoaded.value[id] = true;

  const allLoaded = lyrics.value.every((lyric) => lyricImageLoaded.value[lyric.id]);
  if (allLoaded) {
    setTimeout(updateLyricsMasonryLayout, 100);
  }
};

const calculateLyricHeight = (lyricLength: number, colWidth: number) => {
  const charsPerLine = Math.floor(colWidth / 8);
  const lines = Math.ceil(lyricLength / charsPerLine);
  const lineHeight = 24;
  return lines * lineHeight + 80;
};

const updateLyricsMasonryLayout = () => {
  const grid = document.querySelector(".lyrics-masonry-grid") as HTMLElement;
  if (!grid) return;

  const items = Array.from(grid.children) as HTMLElement[];
  if (items.length === 0) return;

  const containerWidth = grid.offsetWidth;
  const gap = 24;

  let columnCount = 3;
  if (containerWidth < 640) columnCount = 1;
  else if (containerWidth < 768) columnCount = 2;
  else if (containerWidth < 1024) columnCount = 3;
  else columnCount = 4;

  const colWidth = Math.floor((containerWidth - gap * (columnCount - 1)) / columnCount);
  const columnHeights = Array(columnCount).fill(0);

  items.forEach((item, index) => {
    const lyric = lyrics.value[index];
    const img = item.querySelector("img") as HTMLImageElement;

    let imgHeight = colWidth * 0.7;
    if (img && img.naturalWidth && img.naturalHeight) {
      const imgRatio = img.naturalWidth / img.naturalHeight;
      imgHeight = Math.floor(colWidth / imgRatio);
    } else {
      const placeholder = item.querySelector(".h-40");
      if (placeholder) {
        imgHeight = 160;
      }
    }

    const lyricHeight = calculateLyricHeight(lyric?.lyric.length || 0, colWidth);
    const itemHeight = imgHeight + lyricHeight;

    const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
    const top = columnHeights[minHeightIndex];
    const left = minHeightIndex * (colWidth + gap);

    item.style.width = `${colWidth}px`;
    item.style.height = `${itemHeight}px`;
    item.style.position = "absolute";
    item.style.top = `${top}px`;
    item.style.left = `${left}px`;
    item.style.margin = "0";

    columnHeights[minHeightIndex] += itemHeight + gap;
  });

  const maxHeight = Math.max(...columnHeights);
  grid.style.height = `${maxHeight}px`;
};

const handleLyricsResize = () => {
  const grid = document.querySelector(".lyrics-masonry-grid") as HTMLElement;
  if (grid) {
    grid.style.height = "auto";
    grid.style.position = "relative";
  }
  updateLyricsMasonryLayout();
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  if (url.startsWith("/")) return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
  return `${import.meta.env.VITE_API_BASE_URL || ""}/uploads/${url}`;
};

const getFullAudioUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}/uploads/${url}`;
};

const toggleAudio = (lyric: LyricItem) => {
  if (!lyric.audio || !lyric.audio.url) {
    console.warn("音频数据不完整");
    return;
  }

  if (playingId.value === lyric.id) {
    if (audioRef.value) {
      audioRef.value.pause();
    }
    playingId.value = null;
  } else {
    if (audioRef.value) {
      audioRef.value.pause();
      audioRef.value = null;
    }

    const fullUrl = getFullAudioUrl(lyric.audio.url);
    console.log("播放音频:", fullUrl);

    const audio = new Audio(fullUrl);
    audioRef.value = audio;

    audio.onended = () => {
      playingId.value = null;
    };

    audio.onerror = (e) => {
      console.error("音频加载失败:", e);
      playingId.value = null;
    };

    audio.load();

    audio.play().catch((e) => {
      console.error("播放失败:", e);
      playingId.value = null;
    });

    playingId.value = lyric.id;
  }
};

const fetchLyrics = async () => {
  try {
    const data = await http.get<{ list: LyricItem[] }>("/music?pageSize=200");
    const rawLyrics = data.list || [];

    const uniqueMap = new Map<string, LyricItem>();
    rawLyrics.forEach((lyric) => {
      const key = `${lyric.songName}||${lyric.lyric}`;
      const existing = uniqueMap.get(key);
      if (!existing) {
        uniqueMap.set(key, lyric);
      } else {
        const existingCat = getLyricCategoryName(existing);
        const newCat = getLyricCategoryName(lyric);
        if (existingCat === "默认分类" && newCat !== "默认分类") {
          uniqueMap.set(key, lyric);
        }
      }
    });

    allLyrics.value = Array.from(uniqueMap.values());
  } catch (e) {
    console.error("获取歌词失败:", e);
  }
};

onMounted(async () => {
  await fetchLyrics();
  await fetchCategories();

  setTimeout(() => {
    if (lyrics.value.length > 0) {
      lyricsVisible.value = true;
      const hasImages = lyrics.value.some((l) => l.coverImage);
      if (!hasImages) {
        updateLyricsMasonryLayout();
      }
    }

    if (categories.value.length > 0 && !selectedCategory.value) {
      const defaultCategory = categories.value.find((cat) => cat.isDefault);
      selectCategory(defaultCategory ? defaultCategory.name : categories.value[0].name);
    }
  }, 200);

  window.addEventListener("resize", handleLyricsResize);
});

onUnmounted(() => {
  audioRef.value?.pause();
  audioRef.value = null;
  window.removeEventListener("resize", handleLyricsResize);
});
</script>

<style scoped>
.lyrics-masonry-grid {
  position: relative;
  width: 100%;
}

.lyrics-masonry-item {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.lyrics-masonry-item:hover {
  transform: translateY(-4px);
  box-shadow:
    0 20px 40px -12px rgba(139, 92, 246, 0.2),
    0 0 30px rgba(139, 92, 246, 0.08);
}
</style>
