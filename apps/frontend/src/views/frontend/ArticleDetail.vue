<template>
  <div class="min-h-screen relative" :class="isDark ? 'bg-gray-900' : 'bg-gray-50'">
    <div class="fixed top-0 left-0 w-full h-1 z-50">
      <div
        class="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-150"
        :style="{ width: `${readProgress}%` }"
      ></div>
    </div>

    <div v-if="loading" class="max-w-5xl mx-auto text-center py-20">
      <div
        class="inline-block w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"
      ></div>
      <p class="mt-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'">加载中...</p>
    </div>

    <div v-else-if="article" class="relative">
      <div class="px-4 md:px-8 lg:px-12 py-8 pt-24 max-w-6xl md:max-w-7xl mx-auto">
        <div
          ref="coverRef"
          class="relative h-[240px] md:h-[300px] lg:h-[340px] rounded-2xl overflow-hidden shadow-xl"
        >
          <img
            v-if="article.coverImage"
            :src="article.coverImage"
            :alt="article.title"
            class="w-full h-full object-cover transition-transform duration-700"
            :style="{ transform: `scale(${1 + scrollOffset * 0.08})` }"
          />
          <div
            v-else
            class="w-full h-full bg-gradient-to-br"
            :class="isDark ? 'from-gray-800 to-gray-900' : 'from-gray-200 to-gray-300'"
          ></div>
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10"
          ></div>

          <div
            class="absolute inset-0 flex flex-col justify-end items-center px-6 text-center pb-8"
          >
            <div class="flex flex-wrap justify-center gap-2 mb-3">
              <button
                v-if="article.category"
                class="group flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105"
                :class="
                  isDark
                    ? 'bg-white/20 text-white/90 hover:bg-white/30'
                    : 'bg-black/30 text-white/90 hover:bg-black/40'
                "
                style="backdrop-filter: blur(10px)"
                @click="goToCategory(article.category.id)"
              >
                <span>{{ article.category.name }}</span>
              </button>
            </div>

            <h1
              class="text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-3"
              :class="isDark ? 'text-white' : 'text-white'"
            >
              {{ article.title }}
            </h1>

            <div
              class="flex flex-wrap items-center justify-center gap-4 text-sm"
              :class="isDark ? 'text-white/70' : 'text-white/70'"
            >
              <span class="flex items-center space-x-1">
                <div class="w-6 h-6 rounded-full overflow-hidden bg-white/20">
                  <img
                    v-if="article?.author?.avatar"
                    :src="article.author.avatar"
                    alt="Author"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-xs">
                    {{ (article?.author?.username || "Admin")[0] }}
                  </div>
                </div>
                <span>{{ article?.author?.username || "Admin" }}</span>
              </span>
              <span class="flex items-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
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
                <span>{{ formatDate(article.createdAt) }}</span>
              </span>
              <span class="flex items-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
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
                <span>{{ article.viewCount }} 阅读</span>
              </span>
            </div>
          </div>
        </div>

        <div class="mt-8" style="min-height: 1px">
          <article
            class="rounded-2xl border overflow-hidden"
            :class="isDark ? 'bg-gray-800/60 border-gray-700/30' : 'bg-white/90 border-gray-200/50'"
            style="backdrop-filter: blur(20px)"
          >
            <div class="p-6 md:p-8 lg:p-10">
              <div
                class="article-content markdown-body"
                :class="{
                  'text-base': fontSize === 'normal',
                  'text-lg': fontSize === 'large',
                  'text-xl': fontSize === 'xlarge',
                }"
                v-html="renderedContent"
              ></div>
            </div>
          </article>

          <div class="mt-8 flex flex-col gap-4">
            <div
              v-if="prevArticle"
              class="rounded-xl border p-4 flex items-center gap-4 cursor-pointer transition-all duration-300 hover:scale-[1.01]"
              :class="
                isDark
                  ? 'bg-gray-800/60 border-gray-700/50 hover:border-primary-500/50'
                  : 'bg-white/80 border-gray-200/50 hover:border-primary-500/30'
              "
              style="backdrop-filter: blur(20px)"
              @click="goToArticle(prevArticle.id)"
            >
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="isDark ? 'bg-gray-700' : 'bg-gray-100'"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  :class="isDark ? 'text-gray-400' : 'text-gray-500'"
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
              </div>
              <div class="flex-1">
                <div
                  class="text-xs font-medium uppercase tracking-wider mb-1"
                  :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                >
                  上一篇
                </div>
                <div
                  class="text-sm font-medium"
                  :class="isDark ? 'text-gray-200' : 'text-gray-800'"
                >
                  {{ prevArticle.title }}
                </div>
              </div>
            </div>
            <div
              v-if="nextArticle"
              class="rounded-xl border p-4 flex items-center gap-4 cursor-pointer transition-all duration-300 hover:scale-[1.01]"
              :class="
                isDark
                  ? 'bg-gray-800/60 border-gray-700/50 hover:border-accent-500/50'
                  : 'bg-white/80 border-gray-200/50 hover:border-accent-500/30'
              "
              style="backdrop-filter: blur(20px)"
              @click="goToArticle(nextArticle.id)"
            >
              <div class="flex-1 text-right">
                <div
                  class="text-xs font-medium uppercase tracking-wider mb-1"
                  :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                >
                  下一篇
                </div>
                <div
                  class="text-sm font-medium"
                  :class="isDark ? 'text-gray-200' : 'text-gray-800'"
                >
                  {{ nextArticle.title }}
                </div>
              </div>
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="isDark ? 'bg-gray-700' : 'bg-gray-100'"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  :class="isDark ? 'text-gray-400' : 'text-gray-500'"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-5xl mx-auto text-center py-20">
      <div class="text-6xl mb-4">📝</div>
      <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">文章不存在</p>
      <button
        :class="
          isDark
            ? 'mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-primary-300 to-primary-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 hover:scale-105'
            : 'mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 text-white font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 hover:scale-105'
        "
        @click="goBack"
      >
        返回首页
      </button>
    </div>

    <div v-if="showBackTop" class="fixed bottom-8 left-8 z-50 flex flex-col gap-3">
      <button
        class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        :class="isDark ? 'bg-gray-800/90 hover:bg-gray-700' : 'bg-white/90 hover:bg-gray-100'"
        style="backdrop-filter: blur(20px); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15)"
        @click="adjustFontSize('increase')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          :class="isDark ? 'text-white' : 'text-gray-700'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <button
        class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        :class="isDark ? 'bg-gray-800/90 hover:bg-gray-700' : 'bg-white/90 hover:bg-gray-100'"
        style="backdrop-filter: blur(20px); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15)"
        @click="adjustFontSize('decrease')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          :class="isDark ? 'text-white' : 'text-gray-700'"
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
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";
import MarkdownIt from "markdown-it";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

interface Tag {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface ArticleAuthor {
  id: string;
  username: string;
  avatar: string | null;
  tags: string | null;
  contactInfo: string | null;
}

interface ArticleDetail {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  viewCount: number;
  createdAt: string;
  status?: string;
  category?: Category | null;
  tags?: Tag[];
  author?: ArticleAuthor;
}

const loading = ref(true);
const article = ref<ArticleDetail | null>(null);
const prevArticle = ref<ArticleDetail | null>(null);
const nextArticle = ref<ArticleDetail | null>(null);
const readProgress = ref(0);
const scrollOffset = ref(0);
const showBackTop = ref(false);
const fontSize = ref<"normal" | "large" | "xlarge">("normal");
const coverRef = ref<HTMLElement | null>(null);

// content 已在 fetchArticle 中通过 renderContent 转换为 HTML，这里直接返回
const renderedContent = computed(() => {
  return article.value?.content || "";
});

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const goBack = () => {
  if (router.options.history.state.back) {
    router.back();
  } else {
    router.push("/archive");
  }
};

const goToArticle = (id: string) => {
  router.push(`/article/${id}`);
};

const goToCategory = (id: string) => {
  router.push(`/category/${id}`);
};

const adjustFontSize = (action: "increase" | "decrease") => {
  if (action === "increase") {
    if (fontSize.value === "normal") fontSize.value = "large";
    else if (fontSize.value === "large") fontSize.value = "xlarge";
  } else {
    if (fontSize.value === "xlarge") fontSize.value = "large";
    else if (fontSize.value === "large") fontSize.value = "normal";
  }
};

const renderContent = (content: string): string => {
  if (!content) return "";

  if (content.startsWith("{")) {
    try {
      const lakeJson = JSON.parse(content);
      if (lakeJson?.content) {
        return renderContent(lakeJson.content);
      }
    } catch {
      return content;
    }
    return content;
  }

  if (content.trim().startsWith("<")) {
    return content;
  }

  return md.render(content);
};

const fetchArticle = async () => {
  const id = route.params.id as string;
  try {
    const data = await http.get<ArticleDetail>(`/article/${id}`);
    data.content = renderContent(data.content);
    article.value = data;

    await fetchPrevNextArticles(id);
  } catch (e) {
    console.error("获取文章失败:", e);
    article.value = null;
  } finally {
    loading.value = false;
  }
};

const fetchPrevNextArticles = async (currentId: string) => {
  try {
    const data = await http.get<{ list: ArticleDetail[] }>(`/article?limit=100`);
    const articles = data.list.filter((a) => a.status === "published" || !a.status);
    const currentIndex = articles.findIndex((a) => a.id === currentId);

    if (currentIndex > 0) {
      prevArticle.value = articles[currentIndex - 1];
    }
    if (currentIndex < articles.length - 1) {
      nextArticle.value = articles[currentIndex + 1];
    }
  } catch (e) {
    console.error("获取上下篇文章失败:", e);
  }
};

const handleScroll = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (docHeight > 0) {
    readProgress.value = Math.min(100, (scrollTop / docHeight) * 100);
  }

  scrollOffset.value = Math.min(scrollTop / 500, 1);

  showBackTop.value = scrollTop > 400;
};

watch(
  () => route.params.id,
  () => {
    loading.value = true;
    fetchArticle();
  }
);

onMounted(() => {
  fetchArticle();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleScroll);
});
</script>

<style scoped>
.article-content {
  overflow-x: hidden;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3) {
  scroll-margin-top: 80px;
}
</style>
