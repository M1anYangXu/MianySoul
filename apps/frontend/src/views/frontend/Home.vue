<template>
  <div class="relative">
    <section
      id="hero"
      class="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div class="absolute inset-0">
        <canvas ref="particleCanvas" class="w-full h-full"></canvas>
      </div>

      <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div
          class="inline-block relative mb-8"
          :class="{
            'translate-y-0 opacity-100': heroVisible,
            'translate-y-10 opacity-0': !heroVisible,
          }"
          style="transition: all 0.8s ease-out"
        >
          <div class="relative">
            <div
              class="absolute -inset-2 rounded-full bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 blur-xl"
            ></div>
            <div
              class="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-400/20 to-fuchsia-400/20 blur-lg"
            ></div>
            <div
              class="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-6xl md:text-7xl relative z-10 overflow-hidden"
              :class="isDark ? 'bg-gray-800/80' : 'bg-white/80'"
              style="
                box-shadow:
                  0 8px 32px rgba(139, 92, 246, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1);
              "
            >
              <img
                v-if="publicProfile?.avatar"
                :src="publicProfile.avatar"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <img
                  src="https://picsum.photos/seed/avatar1/400/400"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <h1
          class="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight"
          :class="[
            { 'translate-y-0 opacity-100': heroVisible, 'translate-y-10 opacity-0': !heroVisible },
          ]"
          style="transition: all 0.8s ease-out 0.2s; font-family: &quot;Inter&quot;, sans-serif"
        >
          <span class="inline-flex items-center">
            <span
              v-for="(char, index) in usernameChars"
              :key="index"
              class="inline-block opacity-0 translate-y-4 transition-all duration-500 ease-out"
              :class="{ 'opacity-100 translate-y-0': heroVisible && index < visibleCharCount }"
              :style="{
                transitionDelay: `${0.15 * index}s`,
                textShadow: isDark ? '0 0 60px rgba(139, 92, 246, 0.3)' : 'none',
              }"
            >
              <span
                :class="
                  isDark
                    ? 'bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-400'
                    : 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-purple-600'
                "
                class="bg-clip-text text-transparent"
              >
                {{ char }}
              </span>
            </span>
          </span>
        </h1>

        <p
          class="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed font-medium"
          :class="[
            { 'translate-y-0 opacity-100': heroVisible, 'translate-y-10 opacity-0': !heroVisible },
          ]"
          style="transition: all 0.8s ease-out 0.4s; font-family: &quot;Inter&quot;, sans-serif"
        >
          <span
            :class="
              isDark
                ? 'bg-gradient-to-r from-violet-300 via-fuchsia-300 to-purple-300'
                : 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-500'
            "
            class="bg-clip-text text-transparent"
          >
            {{ siteConfig?.subtitle || "真实经历永远比叙述的复杂" }}
          </span>
        </p>

        <div
          class="grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto"
          :class="{
            'translate-y-0 opacity-100': heroVisible,
            'translate-y-10 opacity-0': !heroVisible,
          }"
          style="transition: all 0.8s ease-out 0.6s"
        >
          <div
            class="rounded-2xl p-4 text-center"
            :class="
              isDark ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/50'
            "
            style="backdrop-filter: blur(10px)"
          >
            <div
              class="text-3xl md:text-4xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent"
            >
              {{ siteStats.articles }}
            </div>
            <div class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">文章</div>
          </div>
          <div
            class="rounded-2xl p-4 text-center"
            :class="
              isDark ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/50'
            "
            style="backdrop-filter: blur(10px)"
          >
            <div
              class="text-3xl md:text-4xl font-black bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent"
            >
              {{ siteStats.images }}
            </div>
            <div class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">图片</div>
          </div>
          <div
            class="rounded-2xl p-4 text-center"
            :class="
              isDark ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/50'
            "
            style="backdrop-filter: blur(10px)"
          >
            <div
              class="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            >
              {{ siteStats.lyrics }}
            </div>
            <div class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">歌词</div>
          </div>
        </div>

        <div class="mt-20 flex justify-center">
          <div class="animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              :class="isDark ? 'text-white/50' : 'text-gray-400'"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <section id="articles" data-section="articles" class="py-24 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h2
              class="text-3xl md:text-4xl font-bold mb-2"
              :class="isDark ? 'text-white' : 'text-gray-900'"
            >
              近期笔记
            </h2>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">记录我的思考与感悟</p>
          </div>
          <a
            href="/archive"
            class="hidden sm:flex items-center text-violet-500 hover:text-violet-600 transition-colors"
          >
            <span>更多</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(article, index) in articles"
            :key="article.id"
            class="group relative rounded-2xl overflow-hidden cursor-pointer"
            :class="{
              'translate-y-0 opacity-100': articlesVisible,
              'translate-y-10 opacity-0': !articlesVisible,
            }"
            :style="{ transition: `all 0.6s ease-out ${0.1 * index}s` }"
            @click="router.push(`/archive/${article.id}`)"
          >
            <div
              class="absolute inset-0 backdrop-blur-md border"
              :class="
                isDark
                  ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/10'
                  : 'bg-white border border-gray-100'
              "
            ></div>
            <div class="relative p-6">
              <div class="flex items-center space-x-2 mb-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium bg-violet-500/20 text-violet-400"
                >
                  {{ article.category?.name || "默认分类" }}
                </span>
                <span class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  {{ formatFullDate(article.createdAt) }}
                </span>
              </div>
              <h3
                class="text-xl font-semibold mb-3 transition-colors"
                :class="
                  isDark
                    ? 'text-white group-hover:text-violet-300'
                    : 'text-gray-900 group-hover:text-violet-600'
                "
              >
                {{ article.title }}
              </h3>
              <p class="text-sm line-clamp-3" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ article.excerpt || "暂无摘要" }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="lyrics" data-section="lyrics" class="py-24 px-6 relative">
      <div class="max-w-6xl mx-auto relative z-10">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h2
              class="text-3xl md:text-4xl font-bold mb-2"
              :class="isDark ? 'text-white' : 'text-gray-900'"
            >
              歌词墙
            </h2>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">那些打动我的旋律</p>
          </div>
          <a
            href="/lyrics"
            class="hidden sm:flex items-center text-violet-500 hover:text-violet-600 transition-colors"
          >
            <span>更多</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>

        <div class="flex flex-wrap gap-4">
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
                <span class="text-xs text-violet-300">{{ lyric.singer }}</span>
                <span class="text-xs text-gray-500 px-1.5 py-0.5 rounded bg-white/10">
                  {{ lyric.category }}
                </span>
              </div>
              <div class="text-white font-semibold text-sm mb-1">{{ lyric.songName }}</div>
              <div class="text-gray-300 text-xs line-clamp-2 italic">{{ lyric.lyric }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="gallery" data-section="gallery" class="py-24 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h2
              class="text-3xl md:text-4xl font-bold mb-2"
              :class="isDark ? 'text-white' : 'text-gray-900'"
            >
              精选图集
            </h2>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">记录生活中的美好瞬间</p>
          </div>
          <a
            href="/gallery"
            class="hidden sm:flex items-center text-violet-500 hover:text-violet-600 transition-colors"
          >
            <span>更多</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>

        <div class="flex flex-wrap gap-3">
          <div
            v-for="(image, index) in galleryImages"
            :key="image.id"
            class="group relative rounded-lg overflow-hidden cursor-pointer w-[120px] h-[120px]"
            :class="{
              'translate-y-0 opacity-100': galleryVisible,
              'translate-y-10 opacity-0': !galleryVisible,
            }"
            :style="{ transition: `all 0.6s ease-out ${0.08 * index}s` }"
          >
            <img
              :src="image.url"
              :alt="image.filename"
              class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            />
            <div
              class="absolute inset-0 transition-colors duration-300"
              :class="
                isDark ? 'bg-white/0 group-hover:bg-white/10' : 'bg-black/0 group-hover:bg-black/5'
              "
            ></div>
          </div>
        </div>
      </div>
    </section>

    <section id="activity" data-section="activity" class="py-24 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h2
              class="text-3xl md:text-4xl font-bold mb-2"
              :class="isDark ? 'text-white' : 'text-gray-900'"
            >
              站点动态
            </h2>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">最近发生的事情</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="relative">
            <div
              class="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-purple-500 to-fuchsia-500"
            ></div>
            <div class="space-y-6 pl-10">
              <div v-for="item in activities" :key="item.id" class="relative">
                <div
                  class="absolute -left-[30px] w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 border-4"
                  :class="isDark ? 'border-slate-900' : 'border-white'"
                ></div>
                <div
                  class="rounded-xl p-4"
                  :class="
                    isDark
                      ? 'bg-white/5 border border-white/10'
                      : 'bg-white border border-gray-100 shadow-sm'
                  "
                >
                  <div class="flex items-start justify-between">
                    <div>
                      <div
                        class="font-semibold mb-1"
                        :class="isDark ? 'text-white' : 'text-gray-900'"
                      >
                        {{ item.targetName || "新增内容" }}
                      </div>
                      <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                        {{ item.description }}
                      </div>
                    </div>
                    <div
                      class="text-xs font-medium px-2 py-1 rounded-full"
                      :class="isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'"
                    >
                      {{ item.type }}
                    </div>
                  </div>
                  <div class="mt-3 text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                    {{ formatRelativeTime(item.createdAt) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 统计数据暂时隐藏 -->
          <!-- <div class="space-y-4">
            <h3 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">统计数据</h3>
            <div class="grid grid-cols-2 gap-4">
              <div
                class="rounded-xl p-5 text-center"
                :class="isDark ? 'bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30' : 'bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100'"
              >
                <div class="text-3xl font-bold text-violet-500">{{ siteStats.articles }}</div>
                <div class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">文章</div>
              </div>
              <div
                class="rounded-xl p-5 text-center"
                :class="isDark ? 'bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 border border-fuchsia-500/30' : 'bg-gradient-to-br from-fuchsia-50 to-pink-50 border border-fuchsia-100'"
              >
                <div class="text-3xl font-bold text-fuchsia-500">{{ siteStats.images }}</div>
                <div class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">图片</div>
              </div>
              <div
                class="rounded-xl p-5 text-center"
                :class="isDark ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30' : 'bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100'"
              >
                <div class="text-3xl font-bold text-cyan-500">{{ siteStats.lyrics }}</div>
                <div class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">歌词</div>
              </div>
              <div
                class="rounded-xl p-5 text-center"
                :class="isDark ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30' : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100'"
              >
                <div class="text-3xl font-bold text-amber-500">{{ siteStats.articles + siteStats.images + siteStats.lyrics }}</div>
                <div class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">总数</div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </section>

    <footer class="py-12 px-6 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div
            class="flex items-center space-x-4 text-base"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            <span>© {{ new Date().getFullYear() }} {{ siteConfig?.title || "MianySoul" }}</span>
            <span v-if="siteConfig?.icp" class="hidden sm:inline">|</span>
            <a
              v-if="siteConfig?.icp"
              href="https://beian.miit.gov.cn/"
              target="_blank"
              class="hidden sm:inline hover:text-violet-500 transition-colors"
            >
              {{ siteConfig.icp }}
            </a>
          </div>
          <div
            class="flex items-center space-x-4 text-base"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            <span>{{ uptime }}</span>
            <span>|</span>
            <a href="/rss" class="hover:text-violet-500 transition-colors">RSS</a>
          </div>
        </div>
      </div>
    </footer>

    <button
      class="fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-50"
      :class="[
        { 'opacity-100 translate-y-0': showBackTop, 'opacity-0 translate-y-4': !showBackTop },
        isDark
          ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-lg',
      ]"
      @click="scrollToTop"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");
const router = useRouter();

const particleCanvas = ref<HTMLCanvasElement | null>(null);
let animationId: number | null = null;

const heroVisible = ref(false);
const articlesVisible = ref(false);
const lyricsVisible = ref(false);
const galleryVisible = ref(false);
const activityVisible = ref(false);

interface ArticleItem {
  id: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  viewCount: number;
  createdAt: string;
  category?: { name: string } | null;
}

interface LyricItem {
  id: string;
  singer: string;
  songName: string;
  lyric: string;
  coverImage?: string;
  category: string;
  sortOrder: number;
  createdAt: string;
}

interface ImageItem {
  id: string;
  url: string;
  filename: string;
  createdAt: string;
}

interface ActivityItem {
  id: string;
  type: string;
  targetId?: string;
  targetName?: string;
  description: string;
  createdAt: string;
}

interface PublicProfile {
  id: string;
  username: string;
  avatar?: string;
}

interface SiteConfig {
  logo: string;
  title: string;
  subtitle: string;
  description: string;
  copyright: string;
  icp: string;
}

const articles = ref<ArticleItem[]>([]);
const lyrics = ref<LyricItem[]>([]);
const galleryImages = ref<ImageItem[]>([]);
const siteStats = ref({ articles: 0, images: 0, lyrics: 0 });
const publicProfile = ref<PublicProfile | null>(null);
const siteConfig = ref<SiteConfig | null>(null);
const visibleCharCount = ref(0);
const showBackTop = ref(false);
const uptime = ref("");

let animationInterval: number | null = null;
let uptimeInterval: number | null = null;

const activities = ref<ActivityItem[]>([]);

const formatFullDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const getUsername = () => {
  return publicProfile.value?.username || "MianYang";
};

const usernameChars = computed(() => {
  return getUsername().split("");
});

const startCharAnimation = () => {
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }

  const totalChars = usernameChars.value.length;
  visibleCharCount.value = 0;

  const animate = () => {
    visibleCharCount.value = 0;
    let index = 0;

    const charInterval = setInterval(() => {
      if (index < totalChars) {
        visibleCharCount.value = index + 1;
        index++;
      } else {
        clearInterval(charInterval);
      }
    }, 150);

    return charInterval;
  };

  animate();

  animationInterval = window.setInterval(() => {
    animate();
  }, 8000);

  return animationInterval;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const calculateUptime = () => {
  const launchDate = new Date("2024-01-01");
  const now = new Date();
  const diff = now.getTime() - launchDate.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  uptime.value = `本站已运行 ${days} 天 ${hours} 小时 ${minutes} 分钟`;
};

const fetchArticles = async () => {
  try {
    const data = await http.get<ArticleItem[]>("/article/recent?limit=6");
    articles.value = data;
  } catch (e) {
    console.error("获取文章失败:", e);
  }
};

const fetchLyrics = async () => {
  try {
    const data = await http.get<LyricItem[]>("/music?limit=4");
    lyrics.value = data.slice(0, 4);
  } catch (e) {
    console.error("获取歌词失败:", e);
  }
};

const fetchGallery = async () => {
  try {
    const data = await http.get<ImageItem[]>("/gallery/recent?limit=8");
    galleryImages.value = data;
  } catch (e) {
    console.error("获取图片失败:", e);
  }
};

const fetchStats = async () => {
  try {
    const data = await http.get<{ articleCount: number; imageCount: number; lyricCount: number }>(
      "/stats/public"
    );
    siteStats.value = {
      articles: data.articleCount || 0,
      images: data.imageCount || 0,
      lyrics: data.lyricCount || 0,
    };
  } catch (e) {
    console.error("获取统计失败:", e);
  }
};

const fetchConfig = async () => {
  try {
    const data = await http.get<SiteConfig>("/config");
    siteConfig.value = data;
  } catch (e) {
    console.error("获取网站配置失败:", e);
  }
};

const fetchPublicProfile = async () => {
  try {
    const data = await http.get<PublicProfile>("/auth/profile");
    publicProfile.value = data;
    if (heroVisible.value) {
      startCharAnimation();
    }
  } catch (e) {
    console.error("获取公开用户信息失败:", e);
  }
};

const fetchActivities = async () => {
  try {
    const data = await http.get<ActivityItem[]>("/activity?limit=10");
    activities.value = data;
  } catch (e) {
    console.error("获取站点动态失败:", e);
  }
};

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return formatFullDate(dateStr);
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

const initParticles = () => {
  const canvas = particleCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const particles: Particle[] = [];
  const darkColors = ["#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#06b6d4", "#3b82f6"];
  const lightColors = ["#6b46c1", "#805ad5", "#9f7aea", "#b794f4", "#2b6cb0", "#3182ce"];
  const colors = isDark.value ? darkColors : lightColors;

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: isDark.value ? Math.random() * 0.4 + 0.15 : Math.random() * 0.3 + 0.1,
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach((p2) => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p1.color;
          ctx.globalAlpha = (1 - dist / 120) * (isDark.value ? 0.15 : 0.1);
          ctx.stroke();
        }
      });
    });
    ctx.globalAlpha = 1;
    animationId = requestAnimationFrame(animate);
  };
  animate();
};

const setupScrollReveal = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-section");
          if (id === "articles") articlesVisible.value = true;
          if (id === "lyrics") lyricsVisible.value = true;
          if (id === "gallery") galleryVisible.value = true;
          if (id === "activity") activityVisible.value = true;
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll("[data-section]").forEach((el) => observer.observe(el));
};

onMounted(() => {
  initParticles();
  heroVisible.value = true;
  setTimeout(() => {
    startCharAnimation();
  }, 1000);
  setTimeout(setupScrollReveal, 100);
  fetchArticles();
  fetchLyrics();
  fetchGallery();
  fetchStats();
  fetchConfig();
  fetchPublicProfile();
  fetchActivities();
  calculateUptime();

  uptimeInterval = window.setInterval(calculateUptime, 60000);

  window.addEventListener("scroll", () => {
    showBackTop.value = window.scrollY > 500;
  });
});
onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId);
  if (animationInterval) clearInterval(animationInterval);
  if (uptimeInterval) clearInterval(uptimeInterval);
  window.removeEventListener("scroll", () => {
    showBackTop.value = window.scrollY > 500;
  });
});
watch(isDark, () => {
  if (animationId) cancelAnimationFrame(animationId);
  initParticles();
});
</script>
