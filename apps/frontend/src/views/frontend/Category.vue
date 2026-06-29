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
        <p :class="isDark ? 'text-gray-500' : 'text-gray-400'" class="text-sm mt-2">
          共 {{ categories.length }} 个分类
        </p>
      </div>

      <div
        v-if="!selectedCategory"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
      >
        <div
          v-for="category in categories"
          :key="category.id"
          class="group cursor-pointer rounded-xl p-6 transition-all duration-300"
          :class="[
            isDark
              ? 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30'
              : 'bg-white border border-gray-100 hover:border-violet-200 hover:shadow-lg',
          ]"
          @click="selectCategory(category)"
        >
          <div class="flex items-center justify-between mb-3">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              :class="isDark ? 'bg-white/10' : 'bg-gray-100'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                :class="isDark ? 'text-violet-400' : 'text-violet-600'"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
            <span class="text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ category.articleCount }} 篇文章
            </span>
          </div>
          <h3
            class="text-xl font-bold mb-2 transition-colors"
            :class="[
              isDark
                ? 'text-white group-hover:text-violet-300'
                : 'text-gray-900 group-hover:text-violet-600',
            ]"
          >
            {{ category.name }}
          </h3>
        </div>
      </div>

      <div v-else>
        <div class="flex items-center mb-8">
          <button
            class="flex items-center text-sm font-medium transition-colors"
            :class="isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'"
            @click="selectedCategory = null"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回分类列表
          </button>
          <span class="mx-3 text-sm" :class="isDark ? 'text-gray-600' : 'text-gray-300'">/</span>
          <span class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ selectedCategory.name }}
          </span>
          <span class="ml-3 text-sm" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
            ({{ articles.length }} 篇文章)
          </span>
        </div>

        <div class="space-y-4">
          <div
            v-for="(article, index) in articles"
            :key="article.id"
            class="group relative rounded-xl p-5 cursor-pointer transition-all duration-300"
            :class="[
              isDark
                ? 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30'
                : 'bg-white border border-gray-100 hover:border-violet-200 hover:shadow-lg',
            ]"
            :style="{ transitionDelay: `${0.05 * index}s` }"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
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
                  <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-1">
                    <span
                      v-for="tag in article.tags.slice(0, 3)"
                      :key="tag.id"
                      class="px-2 py-0.5 rounded-full text-xs bg-fuchsia-500/20 text-fuchsia-400"
                    >
                      {{ tag.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            ></div>
          </div>

          <div v-if="articles.length === 0" class="text-center py-16">
            <div class="text-6xl mb-4">📝</div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">
              该分类暂无文章
            </p>
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
const pageTitle = computed(() => getPageTitle("categories"));
const pageSubtitle = computed(() => getPageSubtitle("categories"));

interface Category {
  id: string;
  name: string;
  articleCount: number;
}

interface Tag {
  id: string;
  name: string;
}

interface ArticleItem {
  id: string;
  title: string;
  excerpt: string | null;
  createdAt: string;
  tags?: Tag[];
}

const categories = ref<Category[]>([]);
const selectedCategory = ref<Category | null>(null);
const articles = ref<ArticleItem[]>([]);

const selectCategory = async (category: Category) => {
  selectedCategory.value = category;
  try {
    const data = await http.get<ArticleItem[]>(`/article/recent?limit=100`);
    articles.value = data.filter((article) => {
      if (!article.category) return false;
      return article.category.id === category.id;
    });
  } catch (e) {
    console.error("获取文章失败:", e);
    articles.value = [];
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const fetchCategories = async () => {
  try {
    const data = await http.get<{ id: string; name: string }[]>("/article/category");
    categories.value = data.map((cat) => ({
      ...cat,
      articleCount: 0,
    }));

    const articlesData = await http.get<ArticleItem[]>(`/article/recent?limit=100`);
    categories.value.forEach((cat) => {
      cat.articleCount = articlesData.filter(
        (article) => article.category && article.category.id === cat.id
      ).length;
    });
  } catch (e) {
    console.error("获取分类失败:", e);
  }
};

onMounted(() => {
  fetchCategories();
});
</script>
