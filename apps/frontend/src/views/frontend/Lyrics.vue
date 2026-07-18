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
          :key="cat"
          class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
          :class="[
            selectedCategory === cat
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30'
              : isDark
                ? 'bg-white/10 text-gray-400 hover:bg-white/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          ]"
          @click="selectCategory(cat)"
        >
          {{ cat }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(lyric, index) in lyrics"
          :key="lyric.id"
          class="lyric-card-wrapper group"
          :class="[
            getCardSizeClass(lyric),
            {
              'translate-y-0 opacity-100': lyricsVisible,
              'translate-y-12 opacity-0': !lyricsVisible,
            },
          ]"
          :style="{
            transition: `all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.08 * index}s`,
            transform: lyricsVisible ? `rotate(${getRandomRotation(index)}deg)` : 'rotate(0deg)',
          }"
        >
          <div
            class="lyric-card relative rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer"
            :class="[
              isDark
                ? 'bg-gray-800/60 border border-gray-700/30 hover:border-primary-500/40'
                : 'bg-white/70 border border-gray-200/50 hover:border-primary-300/60',
            ]"
            style="backdrop-filter: blur(20px)"
          >
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              :class="getGradientClass(index)"
              style="opacity: 0.05"
            ></div>

            <div
              class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>

            <div class="p-5 md:p-6 relative z-10">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-semibold shrink-0"
                    :class="[getTagColorClass(index)]"
                  >
                    {{ lyric.singer }}
                  </span>
                  <h3
                    class="text-lg md:text-xl font-bold truncate transition-colors duration-300"
                    :class="
                      isDark
                        ? 'text-white group-hover:text-primary-300'
                        : 'text-gray-900 group-hover:text-primary-600'
                    "
                  >
                    {{ lyric.songName }}
                  </h3>
                </div>
                <button
                  v-if="lyric.audio"
                  class="w-7 h-7 rounded-full flex items-center justify-center text-base transition-all duration-300 hover:scale-110 shrink-0 ml-3"
                  :class="[
                    playingId === lyric.id
                      ? 'bg-primary-500 text-white animate-pulse'
                      : isDark
                        ? 'bg-gray-700/50 text-gray-400 hover:bg-primary-500/80 hover:text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-primary-100 hover:text-primary-600',
                  ]"
                  title="播放音频"
                  @click.stop="toggleAudio(lyric)"
                >
                  {{ playingId === lyric.id ? "⏸" : "▶" }}
                </button>
              </div>

              <div class="flex items-center gap-2 mb-3">
                <span
                  v-if="
                    !selectedCategory &&
                    getLyricCategoryName(lyric) !== '未分类' &&
                    getLyricCategoryName(lyric) !== '默认分类'
                  "
                  class="px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="isDark ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-500'"
                >
                  {{ getLyricCategoryName(lyric) }}
                </span>
              </div>

              <div
                v-if="lyric.coverImage"
                class="rounded-xl overflow-hidden mb-4 bg-gray-900 dark:bg-gray-800"
                :class="getImageContainerClass(lyric)"
              >
                <img
                  :src="getFullImageUrl(lyric.coverImage)"
                  :alt="lyric.songName"
                  class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div class="relative text-left">
                <p
                  class="text-sm md:text-base leading-loose italic transition-all duration-300"
                  :class="[
                    isDark
                      ? 'text-gray-400 group-hover:text-gray-300'
                      : 'text-gray-600 group-hover:text-gray-800',
                    expandedLyrics.has(lyric.id) ? '' : 'line-clamp-4',
                  ]"
                  style="white-space: pre-wrap"
                >
                  {{ lyric.lyric }}
                </p>
                <button
                  v-if="lyric.lyric.length > 100"
                  class="mt-2 text-xs font-medium transition-colors"
                  :class="
                    isDark
                      ? 'text-primary-400 hover:text-primary-300'
                      : 'text-primary-500 hover:text-primary-600'
                  "
                  @click.stop="toggleLyricExpand(lyric.id)"
                >
                  {{ expandedLyrics.has(lyric.id) ? "收起" : "展开" }}
                </button>
              </div>

              <div
                class="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="w-2 h-2 rounded-full animate-pulse"
                    :class="getAccentColorClass(index)"
                  ></span>
                  <span class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                    {{ formatDate(lyric.createdAt) }}
                  </span>
                </div>
                <span
                  class="text-xs font-medium"
                  :class="isDark ? 'text-primary-400' : 'text-primary-500'"
                >
                  {{ lyric.lyric.length }} 字
                </span>
              </div>
            </div>

            <div
              class="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-all duration-500"
              :class="getGradientClass(index)"
            ></div>
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
const expandedLyrics = ref<Set<string>>(new Set());

const playingId = ref<string | null>(null);
const audioRef = ref<HTMLAudioElement | null>(null);

const categories = ref<string[]>([]);
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

const selectCategory = (cat: string) => {
  selectedCategory.value = cat;
  lyricsVisible.value = false;
  setTimeout(() => {
    lyricsVisible.value = true;
  }, 100);
};

const gradients = [
  "bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500",
  "bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500",
  "bg-gradient-to-br from-pink-500 via-rose-500 to-red-500",
  "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
  "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500",
  "bg-gradient-to-br from-primary-500 via-accent-500 to-pink-500",
];

const tagColors = [
  { dark: "bg-primary-500/20 text-primary-300", light: "bg-primary-100 text-primary-600" },
  { dark: "bg-cyan-500/20 text-cyan-300", light: "bg-cyan-100 text-cyan-600" },
  { dark: "bg-pink-500/20 text-pink-300", light: "bg-pink-100 text-pink-600" },
  { dark: "bg-emerald-500/20 text-emerald-300", light: "bg-emerald-100 text-emerald-600" },
  { dark: "bg-amber-500/20 text-amber-300", light: "bg-amber-100 text-amber-600" },
];

const accentColors = [
  "bg-primary-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-emerald-500",
  "bg-amber-500",
];

const getGradientClass = (index: number) => {
  return gradients[index % gradients.length];
};

const getTagColorClass = (index: number) => {
  const color = tagColors[index % tagColors.length];
  return isDark.value ? color.dark : color.light;
};

const getAccentColorClass = (index: number) => {
  return accentColors[index % accentColors.length];
};

const getCardSizeClass = (lyric: LyricItem) => {
  const length = lyric.lyric.length;
  if (length > 400) {
    return "col-span-1 md:col-span-2 lg:col-span-2";
  } else if (length > 250) {
    return "col-span-1 md:col-span-2";
  } else if (length > 150) {
    const patterns = ["col-span-1", "col-span-1"];
    return patterns[lyric.id.length % patterns.length];
  } else {
    const patterns = ["col-span-1"];
    return patterns[lyric.id.length % patterns.length];
  }
};

const getImageContainerClass = (lyric: LyricItem) => {
  const length = lyric.lyric.length;
  if (length > 400) {
    return "h-48 md:h-56";
  } else if (length > 250) {
    return "h-40 md:h-48";
  } else if (length > 150) {
    return "h-32 md:h-40";
  } else {
    return "h-28 md:h-32";
  }
};

const getRandomRotation = (index: number) => {
  const rotations = [-2.5, 1.8, -1.2, 2.2, -0.8, 1.5, -2.0, 0.5];
  return rotations[index % rotations.length];
};

const toggleLyricExpand = (id: string) => {
  if (expandedLyrics.value.has(id)) {
    expandedLyrics.value.delete(id);
  } else {
    expandedLyrics.value.add(id);
  }
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
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
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

    const cats = new Set<string>();
    allLyrics.value.forEach((lyric) => {
      const catName = getLyricCategoryName(lyric);
      if (catName && catName !== "未分类" && catName !== "默认分类") {
        cats.add(catName);
      }
    });
    categories.value = Array.from(cats).sort();

    if (categories.value.length > 0 && !selectedCategory.value) {
      setTimeout(() => {
        selectCategory(categories.value[0]);
      }, 100);
    }
  } catch (e) {
    console.error("获取歌词失败:", e);
  }
};

onMounted(() => {
  fetchLyrics();
  setTimeout(() => {
    lyricsVisible.value = true;
  }, 200);
});

onUnmounted(() => {
  audioRef.value?.pause();
  audioRef.value = null;
});
</script>

<style scoped>
.lyric-card-wrapper {
  perspective: 1000px;
}

.lyric-card-wrapper:hover .lyric-card {
  transform: scale(1.05) rotate(0deg) !important;
  box-shadow:
    0 25px 50px -12px rgba(139, 92, 246, 0.25),
    0 0 40px rgba(139, 92, 246, 0.1);
}

.lyric-card {
  transform-style: preserve-3d;
  transition:
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.5s ease;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.lyric-card-wrapper:nth-child(odd) .lyric-card {
  animation: float 6s ease-in-out infinite;
}

.lyric-card-wrapper:nth-child(even) .lyric-card {
  animation: float 7s ease-in-out infinite reverse;
}

.lyric-card-wrapper:nth-child(3n) .lyric-card {
  animation: float 5.5s ease-in-out infinite;
}
</style>
