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
            标签云
          </span>
        </h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">
          探索文章的标签世界
        </p>
        <p :class="isDark ? 'text-gray-500' : 'text-gray-400'" class="text-sm mt-2">
          共 {{ tags.length }} 个标签
        </p>
      </div>

      <div v-if="!selectedTag" class="flex flex-col items-center">
        <div class="relative w-48 h-48 mb-12 flex items-center justify-center">
          <div
            v-for="i in 4"
            :key="i"
            class="absolute rounded-full border"
            :class="[isDark ? 'border-white/5' : 'border-gray-200']"
            :style="{
              width: `${100 + i * 30}px`,
              height: `${100 + i * 30}px`,
              animation: `spin ${10 + i * 2}s linear infinite`,
              animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
            }"
          ></div>
          <div
            class="relative z-10 w-28 h-28 rounded-full flex items-center justify-center"
            :class="
              isDark
                ? 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20'
                : 'bg-gradient-to-br from-violet-100 to-fuchsia-100'
            "
          >
            <div class="text-center">
              <div
                class="text-4xl font-black"
                :class="isDark ? 'text-violet-400' : 'text-violet-600'"
              >
                {{ tags.length }}
              </div>
              <div class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                个标签
              </div>
            </div>
          </div>
          <div
            v-for="(tag, index) in tags.slice(0, 5)"
            :key="tag.id"
            class="absolute px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-110"
            :class="getTagStyle(tag)"
            :style="{
              transform: `rotate(${index * 72}deg) translateY(-90px) rotate(${-index * 72}deg)`,
            }"
            @click="selectTag(tag)"
          >
            {{ tag.name }}
          </div>
        </div>

        <div class="flex flex-wrap justify-center gap-3 mb-8">
          <button
            v-for="tag in tags"
            :key="tag.id"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
            :class="getTagStyle(tag)"
            @click="selectTag(tag)"
          >
            {{ tag.name }}
            <span class="ml-1 text-xs opacity-70">
              {{ tag.articleCount }}
            </span>
          </button>
        </div>
      </div>

      <div v-else>
        <div class="flex items-center mb-8">
          <button
            class="flex items-center text-sm font-medium transition-colors"
            :class="isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'"
            @click="selectedTag = null"
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
            返回标签云
          </button>
          <span class="mx-3 text-sm" :class="isDark ? 'text-gray-600' : 'text-gray-300'">/</span>
          <span class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ selectedTag.name }}
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
                  <span
                    v-if="article.category"
                    class="px-2 py-0.5 rounded-full text-xs bg-violet-500/20 text-violet-400"
                  >
                    {{ article.category.name }}
                  </span>
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
              该标签暂无文章
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

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

interface Tag {
  id: string;
  name: string;
  articleCount: number;
}

interface Category {
  id: string;
  name: string;
}

interface ArticleItem {
  id: string;
  title: string;
  excerpt: string | null;
  createdAt: string;
  category?: Category | null;
  tags?: Tag[];
}

const tags = ref<Tag[]>([]);
const selectedTag = ref<Tag | null>(null);
const articles = ref<ArticleItem[]>([]);

const tagColors = [
  { bg: isDark.value ? "bg-orange-500/20" : "bg-orange-100", text: "text-orange-500" },
  { bg: isDark.value ? "bg-green-500/20" : "bg-green-100", text: "text-green-500" },
  { bg: isDark.value ? "bg-blue-500/20" : "bg-blue-100", text: "text-blue-500" },
  { bg: isDark.value ? "bg-purple-500/20" : "bg-purple-100", text: "text-purple-500" },
  { bg: isDark.value ? "bg-amber-500/20" : "bg-amber-100", text: "text-amber-500" },
  { bg: isDark.value ? "bg-rose-500/20" : "bg-rose-100", text: "text-rose-500" },
];

const getTagStyle = (tag: Tag) => {
  const index = tags.value.indexOf(tag) % tagColors.length;
  const color = tagColors[index];
  return `${color.bg} ${color.text}`;
};

const selectTag = async (tag: Tag) => {
  selectedTag.value = tag;
  try {
    const data = await http.get<ArticleItem[]>(`/article/recent?limit=100`);
    articles.value = data.filter((article) => {
      if (!article.tags) return false;
      return article.tags.some((t) => t.id === tag.id);
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

const fetchTags = async () => {
  try {
    const data = await http.get<{ id: string; name: string }[]>("/article/tag");
    tags.value = data.map((tag) => ({
      ...tag,
      articleCount: 0,
    }));

    const articlesData = await http.get<ArticleItem[]>(`/article/recent?limit=100`);
    tags.value.forEach((tag) => {
      tag.articleCount = articlesData.filter((article) => {
        if (!article.tags) return false;
        return article.tags.some((t) => t.id === tag.id);
      }).length;
    });
  } catch (e) {
    console.error("获取标签失败:", e);
  }
};

onMounted(() => {
  fetchTags();
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
