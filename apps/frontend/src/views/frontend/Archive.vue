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

      <div class="flex flex-wrap justify-center gap-3 mb-12">
        <button
          class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
          :class="[
            !selectedYear
              ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white'
              : isDark
                ? 'bg-white/10 text-gray-400 hover:bg-white/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          ]"
          @click="selectedYear = null"
        >
          全部
        </button>
        <button
          v-for="year in years"
          :key="year"
          class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
          :class="[
            selectedYear === year
              ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white'
              : isDark
                ? 'bg-white/10 text-gray-400 hover:bg-white/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          ]"
          @click="selectedYear = year"
        >
          {{ year }}
        </button>
      </div>

      <div class="space-y-8">
        <div v-for="group in groupedArticles" :key="group.year">
          <div class="flex items-center mb-6">
            <div class="w-12 h-px bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
            <h2 class="ml-4 text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ group.year }}
            </h2>
            <span class="ml-3 text-sm" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
              {{ group.months.length }} 篇文章
            </span>
          </div>

          <div class="ml-16 space-y-6">
            <div v-for="month in group.months" :key="month.month">
              <h3
                class="text-lg font-semibold mb-4 pl-4 border-l-2"
                :class="[
                  isDark ? 'text-gray-300 border-violet-500/50' : 'text-gray-700 border-violet-500',
                ]"
              >
                {{ month.monthName }}
              </h3>
              <div class="space-y-3">
                <div
                  v-for="article in month.articles"
                  :key="article.id"
                  class="group relative rounded-xl p-5 cursor-pointer transition-all duration-300 flex gap-5"
                  :class="[
                    isDark
                      ? 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30'
                      : 'bg-white border border-gray-100 hover:border-violet-200 hover:shadow-lg',
                  ]"
                >
                  <div
                    v-if="article.coverImage"
                    class="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden"
                  >
                    <img
                      :src="article.coverImage"
                      :alt="article.title"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div class="flex-1 min-w-0 relative">
                    <h4
                      class="text-lg font-medium mb-2 transition-colors"
                      :class="[
                        isDark
                          ? 'text-white group-hover:text-violet-300'
                          : 'text-gray-900 group-hover:text-violet-600',
                      ]"
                    >
                      {{ article.title }}
                    </h4>
                    <p
                      class="text-sm line-clamp-2 mb-3"
                      :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                    >
                      {{ article.excerpt || "暂无摘要" }}
                    </p>
                    <div class="flex items-center space-x-4">
                      <span class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                        {{ formatDate(article.createdAt) }}
                      </span>
                    </div>

                    <div
                      class="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-end space-y-2"
                    >
                      <div
                        v-if="article.category"
                        class="px-3 py-1 rounded-full text-xs font-medium bg-violet-500/20 text-violet-400"
                      >
                        {{ article.category.name }}
                      </div>
                      <div
                        v-if="article.tags && article.tags.length > 0"
                        class="flex flex-wrap gap-1"
                      >
                        <span
                          v-for="tag in article.tags.slice(0, 3)"
                          :key="tag.id"
                          class="px-2 py-0.5 rounded-full text-xs bg-fuchsia-500/20 text-fuchsia-400"
                        >
                          {{ tag.name }}
                        </span>
                        <span
                          v-if="article.tags.length > 3"
                          class="px-2 py-0.5 rounded-full text-xs bg-gray-500/20 text-gray-400"
                        >
                          +{{ article.tags.length - 3 }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="groupedArticles.length === 0" class="text-center py-20">
          <div class="text-6xl mb-4">📝</div>
          <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">暂无文章</p>
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
const pageTitle = computed(() => getPageTitle("archive"));
const pageSubtitle = computed(() => getPageSubtitle("archive"));

interface Tag {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface ArticleItem {
  id: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  category?: Category | null;
  tags?: Tag[];
}

const articles = ref<ArticleItem[]>([]);
const selectedYear = ref<number | null>(null);

const months = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];

const years = computed(() => {
  const yearSet = new Set<number>();
  articles.value.forEach((article) => {
    yearSet.add(new Date(article.createdAt).getFullYear());
  });
  return Array.from(yearSet).sort((a, b) => b - a);
});

const groupedArticles = computed(() => {
  const filtered = selectedYear.value
    ? articles.value.filter(
        (article) => new Date(article.createdAt).getFullYear() === selectedYear.value
      )
    : articles.value;

  const groups: Record<number, Record<number, ArticleItem[]>> = {};

  filtered.forEach((article) => {
    const date = new Date(article.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (!groups[year]) {
      groups[year] = {};
    }
    if (!groups[year][month]) {
      groups[year][month] = [];
    }
    groups[year][month].push(article);
  });

  return Object.entries(groups)
    .map(([year, monthsData]) => ({
      year: Number(year),
      months: Object.entries(monthsData)
        .map(([month, monthArticles]) => ({
          month: Number(month),
          monthName: months[Number(month)],
          articles: monthArticles,
        }))
        .sort((a, b) => b.month - a.month),
    }))
    .sort((a, b) => b.year - a.year);
});

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const fetchArticles = async () => {
  try {
    const data = await http.get<ArticleItem[]>("/article/recent?limit=100");
    articles.value = data;
  } catch (e) {
    console.error("获取文章失败:", e);
  }
};

onMounted(() => {
  fetchArticles();
});
</script>
