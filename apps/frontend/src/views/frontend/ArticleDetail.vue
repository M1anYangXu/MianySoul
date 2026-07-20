<template>
  <div class="min-h-screen relative" :class="isDark ? 'bg-gray-900' : 'bg-gray-50'">
    <div class="fixed top-0 left-0 w-full h-1 z-50">
      <div
        class="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-150"
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
              <button
                v-for="tag in (article.tags || []).slice(0, 3)"
                :key="tag.id"
                class="group flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105"
                :class="
                  isDark
                    ? 'bg-primary-500/30 text-primary-300 hover:bg-primary-500/40'
                    : 'bg-accent-500/30 text-accent-200 hover:bg-accent-500/40'
                "
                style="backdrop-filter: blur(10px)"
                @click="goToTag(tag.id)"
              >
                <span>#{{ tag.name }}</span>
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>评论</span>
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-8 mt-8" style="min-height: 1px">
          <main class="flex-1">
            <article
              class="rounded-2xl border overflow-hidden"
              :class="
                isDark ? 'bg-gray-800/60 border-gray-700/30' : 'bg-white/90 border-gray-200/50'
              "
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
          </main>

          <aside class="lg:w-64 flex-shrink-0">
            <div class="sticky top-20 space-y-4">
              <div
                class="rounded-xl border p-4"
                :class="
                  isDark ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/90 border-gray-200/50'
                "
                style="backdrop-filter: blur(20px)"
              >
                <div class="flex items-center justify-between mb-4">
                  <h3
                    class="text-sm font-semibold"
                    :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                  >
                    文章目录
                  </h3>
                  <span
                    class="text-xs"
                    :class="isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'"
                    style="padding: 0.1rem 0.5rem; border-radius: 9999px"
                  >
                    {{ Math.round(readProgress) }}%
                  </span>
                </div>
                <div
                  class="relative h-1 mb-4 rounded-full overflow-hidden"
                  :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"
                >
                  <div
                    class="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-150"
                    :style="{ width: `${readProgress}%` }"
                  ></div>
                </div>
                <nav class="space-y-1 max-h-[400px] overflow-y-auto">
                  <button
                    v-for="(heading, index) in headings"
                    :key="index"
                    class="block w-full text-left text-xs py-1.5 px-2 rounded-md transition-all duration-200"
                    :class="[
                      activeHeading === index
                        ? isDark
                          ? 'bg-primary-500/20 text-primary-400 font-medium'
                          : 'bg-primary-500/10 text-primary-600 font-medium'
                        : isDark
                          ? 'text-gray-400 hover:bg-white/5'
                          : 'text-gray-600 hover:bg-gray-100',
                      heading.level === 1
                        ? 'pl-2'
                        : heading.level === 2
                          ? 'pl-5'
                          : 'pl-8 text-[11px]',
                    ]"
                    @click="scrollToHeading(index)"
                  >
                    {{ heading.text }}
                  </button>
                  <div
                    v-if="headings.length === 0"
                    class="text-xs text-center py-4"
                    :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                  >
                    暂无目录
                  </div>
                </nav>
              </div>

              <div
                class="rounded-xl border p-4"
                :class="
                  isDark ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/90 border-gray-200/50'
                "
                style="backdrop-filter: blur(20px)"
              >
                <h3
                  class="text-sm font-semibold mb-4"
                  :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                >
                  作者
                </h3>
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 rounded-full overflow-hidden bg-white/20">
                    <img
                      v-if="article?.author?.avatar"
                      :src="article.author.avatar"
                      alt="Author"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center text-lg"
                      :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                    >
                      {{ (article?.author?.username || "A")[0] }}
                    </div>
                  </div>
                  <div>
                    <div
                      class="font-medium text-sm"
                      :class="isDark ? 'text-white' : 'text-gray-900'"
                    >
                      {{ article?.author?.username || "Admin" }}
                    </div>
                    <div class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                      {{ siteConfig?.subtitle || "热爱分享技术与生活" }}
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="rounded-xl border p-4"
                :class="
                  isDark ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/90 border-gray-200/50'
                "
                style="backdrop-filter: blur(20px)"
              >
                <h3
                  class="text-sm font-semibold mb-4"
                  :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                >
                  相关文章
                </h3>
                <div class="space-y-3">
                  <div
                    v-for="relArticle in relatedArticles.slice(0, 3)"
                    :key="relArticle.id"
                    class="p-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                    :class="
                      isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                    "
                    @click="goToArticle(relArticle.id)"
                  >
                    <div
                      class="text-xs font-medium mb-1"
                      :class="isDark ? 'text-gray-300' : 'text-gray-800'"
                    >
                      {{ relArticle.title }}
                    </div>
                    <div
                      class="text-[11px] flex items-center justify-between"
                      :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                    >
                      <span>{{ formatDate(relArticle.createdAt) }}</span>
                      <span>{{ relArticle.viewCount }} 阅读</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <div v-else class="max-w-5xl mx-auto text-center py-20">
      <div class="text-6xl mb-4">📝</div>
      <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">文章不存在</p>
      <button
        class="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 hover:scale-105"
        @click="goBack"
      >
        返回首页
      </button>
    </div>

    <div v-if="showBackTop" class="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
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
      <button
        class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        :class="isDark ? 'bg-gray-800/90 hover:bg-gray-700' : 'bg-white/90 hover:bg-gray-100'"
        style="backdrop-filter: blur(20px); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15)"
        @click="scrollToTop"
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
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";
import TurndownService from "turndown";
import MarkdownIt from "markdown-it";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

const turndownService = new TurndownService();
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
  techStack: string | null;
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

interface SiteConfig {
  logo: string;
  title: string;
  subtitle: string;
  description: string;
  copyright: string;
  icp: string;
  startTime: string;
}

const loading = ref(true);
const article = ref<ArticleDetail | null>(null);
const prevArticle = ref<ArticleDetail | null>(null);
const nextArticle = ref<ArticleDetail | null>(null);
const relatedArticles = ref<ArticleDetail[]>([]);
const readProgress = ref(0);
const scrollOffset = ref(0);
const showBackTop = ref(false);
const fontSize = ref<"normal" | "large" | "xlarge">("normal");
const headings = ref<{ level: number; text: string; id: string }[]>([]);
const activeHeading = ref(-1);
const coverRef = ref<HTMLElement | null>(null);
const siteConfig = ref<SiteConfig | null>(null);

const renderedContent = computed(() => {
  if (!article.value?.content) return "";
  return md.render(article.value.content);
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

const goToTag = (id: string) => {
  router.push(`/tags/${id}`);
};

const scrollToHeading = (index: number) => {
  const heading = headings.value[index];
  if (heading) {
    const element = document.getElementById(heading.id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
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

const extractHeadings = (content: string) => {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const matches = content.matchAll(headingRegex);
  const result: { level: number; text: string; id: string }[] = [];

  for (const match of matches) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-");
    result.push({ level, text, id });
  }

  headings.value = result;
};

const convertHtmlToMarkdown = (content: string): string => {
  if (!content) return "";
  if (content.startsWith("{")) {
    try {
      const lakeJson = JSON.parse(content);
      if (lakeJson?.content) {
        extractHeadings(lakeJson.content);
        return lakeJson.content;
      }
    } catch {
      return content;
    }
  }
  if (content.trim().startsWith("<")) {
    try {
      const markdown = turndownService.turndown(content);
      extractHeadings(markdown);
      return markdown;
    } catch {
      return content;
    }
  }
  extractHeadings(content);
  return content;
};

const fetchConfig = async () => {
  try {
    const data = await http.get<SiteConfig>("/config");
    siteConfig.value = data;
  } catch (e) {
    console.error("获取网站配置失败:", e);
  }
};

const fetchArticle = async () => {
  const id = route.params.id as string;
  try {
    await fetchConfig();
    const data = await http.get<ArticleDetail>(`/article/${id}`);
    data.content = convertHtmlToMarkdown(data.content);
    article.value = data;

    await fetchRelatedArticles(id);
    await fetchPrevNextArticles(id);
  } catch (e) {
    console.error("获取文章失败:", e);
    article.value = null;
  } finally {
    loading.value = false;
    nextTick(() => {
      observeHeadings();
    });
  }
};

const fetchRelatedArticles = async (currentId: string) => {
  try {
    const data = await http.get<ArticleDetail[]>(`/article/recent?limit=4`);
    relatedArticles.value = data.filter((a) => a.id !== currentId);
  } catch (e) {
    console.error("获取相关文章失败:", e);
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

  updateActiveHeading();
};

const updateActiveHeading = () => {
  const scrollPosition = window.scrollY + 200;

  for (let i = headings.value.length - 1; i >= 0; i--) {
    const element = document.getElementById(headings.value[i].id);
    if (element && element.offsetTop <= scrollPosition) {
      activeHeading.value = i;
      return;
    }
  }
  activeHeading.value = -1;
};

const observeHeadings = () => {
  const contentElement = document.querySelector(".article-content");
  if (contentElement) {
    const headingElements = contentElement.querySelectorAll("h1, h2, h3");
    headingElements.forEach((el, index) => {
      const heading = headings.value[index];
      if (heading) {
        el.id = heading.id;
      }
    });
  }
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

  nextTick(() => {
    handleScroll();
  });
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
