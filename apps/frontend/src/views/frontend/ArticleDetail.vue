<template>
  <div class="min-h-screen py-24 px-6 relative">
    <div
      class="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 blur-3xl"
      style="transform: translate(-30%, -30%)"
    ></div>
    <div
      class="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-3xl"
      style="transform: translate(30%, 30%)"
    ></div>

    <div v-if="loading" class="max-w-5xl mx-auto text-center py-20">
      <div
        class="inline-block w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"
      ></div>
      <p class="mt-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'">加载中...</p>
    </div>

    <div v-else-if="article" class="max-w-5xl mx-auto relative z-10">
      <button
        class="flex items-center space-x-2 mb-8 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
        :class="isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'"
        @click="goBack"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
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
        <span class="text-sm font-medium">返回列表</span>
      </button>

      <div class="flex flex-col lg:flex-row gap-8">
        <main class="flex-1">
          <article
            class="rounded-2xl border overflow-hidden"
            :class="isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-gray-200/50'"
            style="backdrop-filter: blur(20px)"
          >
            <div v-if="article.coverImage" class="relative h-56 md:h-72 overflow-hidden">
              <img
                :src="article.coverImage"
                :alt="article.title"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"
              ></div>
            </div>

            <div class="p-8 md:p-10">
              <h1
                class="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight"
                :class="isDark ? 'text-white' : 'text-gray-900'"
              >
                {{ article.title }}
              </h1>

              <div
                class="prose max-w-none"
                :class="isDark ? 'prose-invert' : ''"
                v-html="article.content"
              ></div>
            </div>
          </article>

          <div class="mt-12 flex justify-center">
            <button
              class="flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
              :class="
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              "
              @click="goBack"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
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
              <span class="font-medium">返回列表</span>
            </button>
          </div>
        </main>

        <aside class="lg:w-72">
          <div
            class="rounded-2xl border p-6 sticky top-24"
            :class="isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-gray-200/50'"
            style="backdrop-filter: blur(20px)"
          >
            <h3
              class="text-sm font-semibold mb-4 uppercase tracking-wider"
              :class="isDark ? 'text-gray-400' : 'text-gray-500'"
            >
              文章信息
            </h3>

            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 flex-shrink-0"
                  :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                  {{ formatDate(article.createdAt) }}
                </span>
              </div>

              <div class="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 flex-shrink-0"
                  :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                  {{ article.viewCount }} 阅读
                </span>
              </div>

              <div
                v-if="article.category"
                class="pt-4 border-t"
                :class="isDark ? 'border-white/10' : 'border-gray-200'"
              >
                <div
                  class="text-xs uppercase tracking-wider mb-2"
                  :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                >
                  分类
                </div>
                <span
                  class="px-3 py-1.5 rounded-lg text-sm font-medium bg-violet-500/20 text-violet-400"
                >
                  {{ article.category.name }}
                </span>
              </div>

              <div
                v-if="article.tags && article.tags.length > 0"
                class="pt-4 border-t"
                :class="isDark ? 'border-white/10' : 'border-gray-200'"
              >
                <div
                  class="text-xs uppercase tracking-wider mb-2"
                  :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                >
                  标签
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in article.tags"
                    :key="tag.id"
                    class="px-3 py-1.5 rounded-lg text-sm font-medium bg-fuchsia-500/20 text-fuchsia-400"
                  >
                    {{ tag.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <div v-else class="max-w-5xl mx-auto text-center py-20">
      <div class="text-6xl mb-4">📝</div>
      <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">文章不存在</p>
      <button
        class="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 hover:scale-105"
        @click="goBack"
      >
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

interface Tag {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface ArticleDetail {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  viewCount: number;
  createdAt: string;
  category?: Category | null;
  tags?: Tag[];
}

const loading = ref(true);
const article = ref<ArticleDetail | null>(null);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const goBack = () => {
  if (router.options.history.state.back) {
    router.back();
  } else {
    router.push("/archive");
  }
};

const fetchArticle = async () => {
  const id = route.params.id as string;
  try {
    const data = await http.get<ArticleDetail>(`/article/${id}`);
    article.value = data;
  } catch (e) {
    console.error("获取文章失败:", e);
    article.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchArticle();
});
</script>

<style scoped>
.prose {
  font-size: 16px;
  line-height: 1.8;
}

.prose h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: inherit;
}

.prose h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: inherit;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul,
.prose ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose blockquote {
  border-left: 4px solid #8b5cf6;
  padding-left: 1rem;
  margin-left: 0;
  font-style: italic;
  color: inherit;
}

.prose code {
  background-color: rgba(139, 92, 246, 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose pre {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose-invert pre {
  background-color: rgba(255, 255, 255, 0.05);
}

.prose img {
  max-width: 100%;
  border-radius: 0.5rem;
}

.prose hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, #8b5cf6, transparent);
  margin: 2rem 0;
}

.prose a {
  color: #8b5cf6;
  text-decoration: underline;
}

.prose-invert a {
  color: #a78bfa;
}
</style>
