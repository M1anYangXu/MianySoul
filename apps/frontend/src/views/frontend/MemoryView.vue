<template>
  <div class="min-h-screen py-24 px-6 relative z-10">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1
          class="text-4xl md:text-5xl font-bold mb-4"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            :class="
              isDark
                ? 'bg-gradient-to-r from-primary-300 to-primary-500'
                : 'bg-gradient-to-r from-primary-400 to-primary-700'
            "
            class="bg-clip-text text-transparent"
          >
            我的记忆
          </span>
        </h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">
          记录生活中的点滴与回忆
        </p>
      </div>

      <div class="flex flex-wrap justify-center gap-4 mb-12">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="px-6 py-3 rounded-full text-sm font-medium transition-all duration-300"
          :class="[
            activeTab === tab.key
              ? isDark
                ? 'bg-gradient-to-r from-primary-300 to-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-gradient-to-r from-primary-400 to-primary-600 text-white shadow-lg shadow-primary-500/30'
              : isDark
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          ]"
          @click="handleTabChange(tab.key)"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <div v-if="activeTab === 'diary' || activeTab === 'dream'" class="mb-8">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <DropdownPill
              :model-value="filterYear"
              :options="yearOptions"
              placeholder="选择年份"
              @update:model-value="
                (val) => {
                  filterYear = val;
                  handleYearChange(val);
                }
              "
            />
            <DropdownPill
              :model-value="filterMonth"
              :options="monthOptions"
              placeholder="选择月份"
              @update:model-value="
                (val) => {
                  filterMonth = val;
                  handleFilterChange();
                }
              "
            />
          </div>
          <button
            v-if="filterYear || filterMonth"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="
              isDark
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            "
            @click="resetFilter"
          >
            清除筛选
          </button>
        </div>
      </div>

      <div v-if="activeTab === 'diary'" class="space-y-6">
        <div v-if="diaryPage.list.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📔</div>
          <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">暂无日记记录</p>
        </div>
        <div
          v-for="diary in diaryPage.list"
          :key="diary.id"
          class="rounded-2xl p-6 transition-all duration-300"
          :class="
            isDark
              ? 'bg-white/5 border border-white/10'
              : 'bg-white border border-gray-100 shadow-sm'
          "
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div v-if="getWeatherInfo(diary.weather)" class="relative group">
                <span class="text-xl cursor-help">{{ getWeatherInfo(diary.weather)!.emoji }}</span>
                <span
                  class="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  :class="isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-white'"
                >
                  {{ getWeatherInfo(diary.weather)!.label }}
                </span>
              </div>
              <div v-if="getMoodInfo(diary.mood)" class="relative group">
                <span class="text-xl cursor-help">{{ getMoodInfo(diary.mood)!.emoji }}</span>
                <span
                  class="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  :class="isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-white'"
                >
                  {{ getMoodInfo(diary.mood)!.label }}
                </span>
              </div>
              <span
                v-if="diary.isOutside"
                class="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400"
              >
                外出
              </span>
            </div>
            <span :class="isDark ? 'text-gray-500' : 'text-gray-400'" class="text-sm">
              {{ formatDate(diary.diaryDate) }}
            </span>
          </div>
          <p
            :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            class="leading-relaxed whitespace-pre-wrap"
          >
            {{ diary.content }}
          </p>
          <div v-if="diary.images && diary.images.length > 0" class="flex flex-wrap gap-3 mt-4">
            <img
              v-for="(img, idx) in diary.images"
              :key="idx"
              :src="img.imageUrl"
              alt="日记图片"
              class="w-20 h-20 rounded-lg object-cover"
            />
          </div>
        </div>

        <div v-if="diaryPage.total > 0" class="flex items-center justify-center gap-2 mt-8">
          <button
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="[
              isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600',
              diaryPage.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20',
            ]"
            :disabled="diaryPage.page === 1"
            @click="diaryPage.page > 1 && fetchDiaries(diaryPage.page - 1)"
          >
            上一页
          </button>
          <span :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-sm">
            {{ diaryPage.page }} / {{ diaryPage.totalPages }}
          </span>
          <button
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="[
              isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600',
              diaryPage.page === diaryPage.totalPages
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-white/20',
            ]"
            :disabled="diaryPage.page === diaryPage.totalPages"
            @click="diaryPage.page < diaryPage.totalPages && fetchDiaries(diaryPage.page + 1)"
          >
            下一页
          </button>
        </div>
      </div>

      <div v-if="activeTab === 'memoir'" class="space-y-6">
        <div v-if="categories.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📖</div>
          <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">暂无回忆录分类</p>
        </div>
        <div
          v-for="category in categories"
          :key="category.id"
          class="rounded-2xl overflow-hidden transition-all duration-300"
          :class="
            isDark
              ? 'bg-white/5 border border-white/10'
              : 'bg-white border border-gray-100 shadow-sm'
          "
        >
          <div
            class="p-6 cursor-pointer flex items-center justify-between"
            @click="toggleCategory(category.id)"
          >
            <div class="flex items-center space-x-4">
              <span class="text-3xl">{{ category.icon }}</span>
              <div>
                <h3 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ category.name }}
                </h3>
                <p
                  v-if="category.description"
                  :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                  class="text-sm"
                >
                  {{ category.description }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span :class="isDark ? 'text-gray-500' : 'text-gray-400'" class="text-sm">
                {{ category._count.entries }} 条
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 transition-transform duration-300"
                :class="[
                  isDark ? 'text-gray-400' : 'text-gray-500',
                  expandedCategories.includes(category.id) ? 'rotate-180' : '',
                ]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <div
            v-if="expandedCategories.includes(category.id)"
            class="px-6 pb-6 border-t"
            :class="isDark ? 'border-white/10' : 'border-gray-100'"
          >
            <div v-if="categoryEntries[category.id]?.length === 0" class="py-4 text-center">
              <p :class="isDark ? 'text-gray-500' : 'text-gray-400'" class="text-sm">暂无条目</p>
            </div>
            <div class="space-y-3 pt-4">
              <div
                v-for="entry in categoryEntries[category.id]"
                :key="entry.id"
                class="rounded-xl p-4"
                :class="isDark ? 'bg-white/5' : 'bg-gray-50'"
              >
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ entry.title }}
                  </h4>
                  <span
                    v-if="entry.eventDate"
                    :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                    class="text-xs"
                  >
                    {{ formatDate(entry.eventDate) }}
                  </span>
                </div>
                <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm line-clamp-3">
                  {{ entry.content }}
                </p>
                <img
                  v-if="entry.imageUrl"
                  :src="getFullImageUrl(entry.imageUrl)"
                  :alt="entry.title"
                  class="w-full h-40 object-cover rounded-lg mt-3 transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'dream'" class="space-y-6">
        <div v-if="dreamPage.list.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🌙</div>
          <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">暂无梦境记录</p>
        </div>
        <div
          v-for="dream in dreamPage.list"
          :key="dream.id"
          class="rounded-2xl p-6 transition-all duration-300"
          :class="
            isDark
              ? 'bg-white/5 border border-white/10'
              : 'bg-white border border-gray-100 shadow-sm'
          "
        >
          <div class="flex items-center justify-between mb-4">
            <span class="text-xl">🌙</span>
            <span :class="isDark ? 'text-gray-500' : 'text-gray-400'" class="text-sm">
              {{ formatDate(dream.dreamDate) }}
            </span>
          </div>
          <p
            :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            class="leading-relaxed whitespace-pre-wrap"
          >
            {{ dream.content }}
          </p>
        </div>

        <div v-if="dreamPage.total > 0" class="flex items-center justify-center gap-2 mt-8">
          <button
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="[
              isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600',
              dreamPage.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20',
            ]"
            :disabled="dreamPage.page === 1"
            @click="dreamPage.page > 1 && fetchDreams(dreamPage.page - 1)"
          >
            上一页
          </button>
          <span :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-sm">
            {{ dreamPage.page }} / {{ dreamPage.totalPages }}
          </span>
          <button
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="[
              isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600',
              dreamPage.page === dreamPage.totalPages
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-white/20',
            ]"
            :disabled="dreamPage.page === dreamPage.totalPages"
            @click="dreamPage.page < dreamPage.totalPages && fetchDreams(dreamPage.page + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";
import type { PaginationResult } from "@miany-soul/shared";
import DropdownPill from "@/components/DropdownPill.vue";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

const tabs = [
  { key: "diary", label: "日记", icon: "📔" },
  { key: "memoir", label: "回忆录", icon: "📖" },
  { key: "dream", label: "梦境", icon: "🌙" },
];

const activeTab = ref("diary");
const expandedCategories = ref<string[]>([]);

const filterYear = ref<string | null>(null);
const filterMonth = ref<string | null>(null);

interface DateItem {
  year: number;
  months: number[];
}

const diaryDates = ref<DateItem[]>([]);
const dreamDates = ref<DateItem[]>([]);

const yearOptions = computed(() => {
  const dates = activeTab.value === "diary" ? diaryDates.value : dreamDates.value;
  return dates.map((d) => ({ value: d.year.toString(), label: `${d.year}年` }));
});

const monthOptions = computed(() => {
  if (!filterYear.value) return [];
  const dates = activeTab.value === "diary" ? diaryDates.value : dreamDates.value;
  const selectedYear = dates.find((d) => d.year.toString() === filterYear.value);
  if (!selectedYear) return [];
  const monthLabels: Record<number, string> = {
    1: "1月",
    2: "2月",
    3: "3月",
    4: "4月",
    5: "5月",
    6: "6月",
    7: "7月",
    8: "8月",
    9: "9月",
    10: "10月",
    11: "11月",
    12: "12月",
  };
  return selectedYear.months.map((m) => ({ value: m.toString(), label: monthLabels[m] }));
});

interface DiaryImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

interface Diary {
  id: string;
  content: string;
  weather: string | null;
  mood: string | null;
  isOutside: boolean | null;
  diaryDate: string;
  images: DiaryImage[];
}

interface MemoirCategory {
  id: string;
  name: string;
  icon: string;
  description: string | null;
  isDefault: boolean;
  _count: { entries: number };
}

interface MemoirEntry {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  eventDate: string | null;
  type: string;
  createdAt: string;
}

interface Dream {
  id: string;
  content: string;
  dreamDate: string;
}

const diaryPage = ref<PaginationResult<Diary>>({
  list: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
});

const categories = ref<MemoirCategory[]>([]);
const categoryEntries = ref<Record<string, MemoirEntry[]>>({});

const dreamPage = ref<PaginationResult<Dream>>({
  list: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
});

interface WeatherItem {
  emoji: string;
  label: string;
}

interface MoodItem {
  emoji: string;
  label: string;
}

const weatherMap: Record<string, WeatherItem> = {
  sunny: { emoji: "☀️", label: "晴天" },
  cloudy: { emoji: "☁️", label: "多云" },
  rainy: { emoji: "🌧️", label: "下雨" },
  snowy: { emoji: "❄️", label: "下雪" },
  windy: { emoji: "💨", label: "大风" },
  foggy: { emoji: "🌫️", label: "雾天" },
  thunderstorm: { emoji: "⛈️", label: "雷雨" },
  drizzle: { emoji: "🌦️", label: "小雨" },
  hail: { emoji: "🌨️", label: "冰雹" },
  overcast: { emoji: "☁️", label: "阴天" },
};

const moodMap: Record<string, MoodItem> = {
  happy: { emoji: "😄", label: "开心" },
  calm: { emoji: "😌", label: "平静" },
  excited: { emoji: "🤩", label: "兴奋" },
  anxious: { emoji: "😰", label: "焦虑" },
  sad: { emoji: "😢", label: "难过" },
  angry: { emoji: "😠", label: "生气" },
  tired: { emoji: "😴", label: "疲惫" },
  confused: { emoji: "😕", label: "困惑" },
  hopeful: { emoji: "🌟", label: "期待" },
  grateful: { emoji: "🙏", label: "感恩" },
  lonely: { emoji: "🥺", label: "孤独" },
  content: { emoji: "😋", label: "满足" },
};

const getWeatherInfo = (weather: string | null) => weatherMap[weather || ""] || null;
const getMoodInfo = (mood: string | null) => moodMap[mood || ""] || null;

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const getFullImageUrl = (url: string | null) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
};

const handleTabChange = (tabKey: string) => {
  activeTab.value = tabKey;
  filterYear.value = null;
  filterMonth.value = null;
  if (tabKey === "diary") {
    fetchDiaries(1);
    fetchDiaryDates();
  } else if (tabKey === "dream") {
    fetchDreams(1);
    fetchDreamDates();
  }
};

const handleYearChange = (year: string | null) => {
  filterMonth.value = null;
  if (year) {
    handleFilterChange();
  }
};

const handleFilterChange = () => {
  if (activeTab.value === "diary") {
    fetchDiaries(1);
  } else if (activeTab.value === "dream") {
    fetchDreams(1);
  }
};

const resetFilter = () => {
  filterYear.value = null;
  filterMonth.value = null;
  handleFilterChange();
};

const toggleCategory = async (categoryId: string) => {
  const index = expandedCategories.value.indexOf(categoryId);
  if (index > -1) {
    expandedCategories.value.splice(index, 1);
  } else {
    expandedCategories.value.push(categoryId);
    if (!categoryEntries.value[categoryId]) {
      await fetchCategoryEntries(categoryId);
    }
  }
};

const fetchDiaryDates = async () => {
  try {
    const data = await http.get<DateItem[]>("/diary/dates");
    diaryDates.value = data;
  } catch (e) {
    console.error("获取日记日期失败:", e);
  }
};

const fetchDiaries = async (page: number = 1) => {
  try {
    const params: any = { page, pageSize: 10 };
    if (filterYear.value) {
      params.year = filterYear.value;
    }
    if (filterMonth.value) {
      params.month = filterMonth.value;
    }
    const data = await http.get<PaginationResult<Diary>>("/diary", { params });
    diaryPage.value = data;
  } catch (e) {
    console.error("获取日记失败:", e);
  }
};

const fetchCategories = async () => {
  try {
    const data = await http.get<MemoirCategory[]>("/memoir/categories");
    categories.value = data;
  } catch (e) {
    console.error("获取回忆录分类失败:", e);
  }
};

const fetchCategoryEntries = async (categoryId: string) => {
  try {
    const data = await http.get<MemoirEntry[]>(`/memoir/categories/${categoryId}/entries`);
    categoryEntries.value[categoryId] = data;
  } catch (e) {
    console.error("获取回忆录条目失败:", e);
  }
};

const fetchDreamDates = async () => {
  try {
    const data = await http.get<DateItem[]>("/dream/dates");
    dreamDates.value = data;
  } catch (e) {
    console.error("获取梦境日期失败:", e);
  }
};

const fetchDreams = async (page: number = 1) => {
  try {
    const params: any = { page, pageSize: 10 };
    if (filterYear.value) {
      params.year = filterYear.value;
    }
    if (filterMonth.value) {
      params.month = filterMonth.value;
    }
    const data = await http.get<PaginationResult<Dream>>("/dream", { params });
    dreamPage.value = data;
  } catch (e) {
    console.error("获取梦境失败:", e);
  }
};

onMounted(() => {
  fetchDiaryDates();
  fetchDiaries();
  fetchCategories();
  fetchDreamDates();
  fetchDreams();
});
</script>
