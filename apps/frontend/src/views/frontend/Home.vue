<template>
  <div class="relative">
    <div
      class="fixed inset-0 z-0 transition-all duration-700 ease-out pointer-events-none"
      :style="{ opacity: scrollOpacity, filter: `blur(${(1 - scrollOpacity) * 20}px)` }"
    >
      <img
        v-if="siteConfig?.homeWallpaperLight || siteConfig?.homeWallpaperDark"
        :src="isDark ? siteConfig.homeWallpaperDark : siteConfig.homeWallpaperLight"
        alt="Home Wallpaper"
        class="w-full h-full object-cover"
      />
    </div>

    <section
      id="hero"
      class="min-h-screen flex flex-col items-center justify-center relative pt-32 z-20"
      style="overflow: visible"
    >
      <div class="relative z-50 text-center px-4">
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
              class="absolute -inset-4 rounded-full blur-xl animate-breath-border"
              :class="isDark ? 'bg-purple-500/15' : 'bg-teal-500/15'"
            ></div>
            <div
              class="absolute -inset-3 rounded-full blur-lg animate-breath-border"
              :class="isDark ? 'bg-purple-400/20' : 'bg-teal-400/20'"
              style="animation-delay: 0.3s"
            ></div>
            <div
              class="absolute -inset-2 rounded-full blur-md animate-breath-border"
              :class="isDark ? 'bg-purple-300/25' : 'bg-teal-300/25'"
              style="animation-delay: 0.6s"
            ></div>
            <div
              class="absolute -inset-1 rounded-full blur-sm"
              :class="isDark ? 'bg-purple-200/30' : 'bg-teal-200/30'"
            ></div>
            <div
              class="w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center text-6xl md:text-7xl relative z-10 overflow-hidden"
              :class="isDark ? 'bg-gray-800/80' : 'bg-white/80'"
              style="
                box-shadow:
                  0 8px 32px rgba(139, 92, 246, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1);
              "
            >
              <div
                class="w-full h-full rounded-full overflow-hidden border-2"
                :class="isDark ? 'border-gray-700' : 'border-gray-200'"
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
        </div>

        <h1
          class="text-5xl md:text-6xl lg:text-7xl font-bold italic mb-8 tracking-tight relative z-50"
          style="transition: all 0.8s ease-out 0.2s; font-family: &quot;Inter&quot;, sans-serif"
          :class="[
            { 'translate-y-0 opacity-100': heroVisible, 'translate-y-10 opacity-0': !heroVisible },
          ]"
        >
          <span class="inline-flex items-center">
            <span
              class="bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 bg-clip-text text-transparent"
              :style="{
                textShadow: isDark ? '0 0 60px rgba(139, 92, 246, 0.3)' : 'none',
              }"
            >
              {{ (usernameChars || []).slice(0, visibleCharCount).join("") }}&nbsp;
            </span>
            <span class="typing-cursor w-1 h-8 md:h-10 lg:h-12 bg-primary-500 animate-blink"></span>
          </span>
        </h1>

        <p
          class="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed font-normal"
          :class="[
            { 'translate-y-0 opacity-100': heroVisible, 'translate-y-10 opacity-0': !heroVisible },
          ]"
          style="transition: all 0.8s ease-out 0.4s; font-family: &quot;Inter&quot;, sans-serif"
        >
          <span
            :class="
              isDark
                ? 'bg-gradient-to-r from-primary-300 via-accent-300 to-primary-400'
                : 'bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600'
            "
            class="bg-clip-text text-transparent"
          >
            {{ siteConfig?.subtitle || "真实经历永远比叙述的复杂" }}
          </span>
        </p>

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

    <section id="articles" data-section="articles" class="py-24 px-6 relative z-10">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="inline-block">
              <h2
                class="text-xl md:text-2xl font-bold mb-2"
                :class="isDark ? 'text-white' : 'text-gray-900'"
              >
                近期笔记
              </h2>
              <div class="w-full h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></div>
            </div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="mt-1">
              记录我的思考与感悟
            </p>
          </div>
          <a
            href="/archive"
            class="hidden sm:flex items-center text-primary-500 hover:text-primary-600 transition-colors"
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
                  : 'bg-white/60 border border-white/30'
              "
            ></div>
            <div class="relative p-6">
              <div class="flex items-center space-x-2 mb-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400"
                >
                  {{ article.category?.name || "默认分类" }}
                </span>
                <span class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  {{ formatFullDate(article.createdAt) }}
                </span>
              </div>
              <h3
                class="text-xl font-medium mb-3 transition-colors"
                :class="
                  isDark
                    ? 'text-white group-hover:text-primary-300'
                    : 'text-gray-900 group-hover:text-primary-600'
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

    <section id="lyrics" data-section="lyrics" class="py-24 px-6 relative z-10">
      <div class="max-w-6xl mx-auto relative z-10">
        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="inline-block">
              <h2
                class="text-xl md:text-2xl font-bold mb-2"
                :class="isDark ? 'text-white' : 'text-gray-900'"
              >
                近期歌词
              </h2>
              <div class="w-full h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></div>
            </div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="mt-1">那些打动我的旋律</p>
          </div>
          <a
            href="/lyrics"
            class="hidden sm:flex items-center text-primary-500 hover:text-primary-600 transition-colors"
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

        <div class="flex flex-nowrap gap-4 overflow-x-auto">
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
                class="w-full h-full bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 flex items-center justify-center"
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
                <span class="text-xs text-primary-300">{{ lyric.singer }}</span>
                <span class="text-xs text-gray-500 px-1.5 py-0.5 rounded bg-white/10">
                  {{ lyric.category }}
                </span>
              </div>
              <div class="text-white font-medium text-sm mb-1">{{ lyric.songName }}</div>
              <div class="text-gray-300 text-xs line-clamp-2 italic">{{ lyric.lyric }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="gallery" data-section="gallery" class="py-24 px-6 relative z-10">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="inline-block">
              <h2
                class="text-xl md:text-2xl font-bold mb-2"
                :class="isDark ? 'text-white' : 'text-gray-900'"
              >
                近期图集
              </h2>
              <div class="w-full h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></div>
            </div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="mt-1">
              记录生活中的美好瞬间
            </p>
          </div>
          <a
            href="/gallery"
            class="hidden sm:flex items-center text-primary-500 hover:text-primary-600 transition-colors"
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

        <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
          <div
            v-for="(image, index) in galleryImages"
            :key="image.id"
            class="group relative rounded-lg overflow-hidden cursor-pointer aspect-square"
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

    <section id="activity" data-section="activity" class="py-24 px-6 relative z-10">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="inline-block">
              <h2
                class="text-xl md:text-2xl font-bold mb-2"
                :class="isDark ? 'text-white' : 'text-gray-900'"
              >
                站点动态
              </h2>
              <div class="w-full h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></div>
            </div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="mt-1">最近发生的事情</p>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-1 lg:flex-[2]">
            <div
              class="rounded-2xl border p-6 h-full overflow-hidden"
              :class="isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-gray-100/50'"
              style="backdrop-filter: blur(12px)"
            >
              <div class="relative h-full">
                <div
                  class="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-primary-600 to-accent-500"
                ></div>
                <div class="space-y-4 pl-10 overflow-y-auto" style="max-height: 500px">
                  <div v-for="item in activities" :key="item.id" class="relative">
                    <div
                      class="absolute -left-[30px] w-4 h-4 rounded-full border-4"
                      :class="[
                        getActivityTypeBg(item.type),
                        isDark ? 'border-slate-900' : 'border-white',
                      ]"
                      style="padding: 2px"
                    >
                      <div class="w-full h-full rounded-full bg-white/80"></div>
                    </div>
                    <div
                      class="rounded-xl p-4 transition-all hover:shadow-md"
                      :class="
                        isDark
                          ? 'bg-white/5 border border-white/10'
                          : 'bg-white/60 border border-gray-100/50'
                      "
                      style="backdrop-filter: blur(10px)"
                    >
                      <div class="flex items-start gap-3">
                        <div
                          class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          :class="getActivityTypeBg(item.type)"
                        >
                          <component
                            :is="getActivityTypeIcon(item.type)"
                            class="w-4 h-4"
                            :class="isDark ? 'text-white' : 'text-gray-700'"
                          />
                        </div>
                        <div class="flex-1 min-w-0">
                          <div
                            class="font-semibold mb-1"
                            :class="isDark ? 'text-white' : 'text-gray-900'"
                          >
                            {{ item.description }}
                          </div>
                          <div class="flex items-center gap-2 text-xs">
                            <span
                              class="font-medium px-2 py-0.5 rounded-full"
                              :class="
                                isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                              "
                            >
                              {{ item.type }}
                            </span>
                            <span :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                              {{ formatRelativeTime(item.createdAt) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-1">
            <div
              class="rounded-2xl border p-6 h-full"
              :class="isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-gray-100/50'"
              style="backdrop-filter: blur(12px)"
            >
              <h3
                class="text-lg font-semibold mb-4"
                :class="isDark ? 'text-white' : 'text-gray-900'"
              >
                近一个月统计
              </h3>
              <div class="space-y-3">
                <div
                  v-for="stat in statList"
                  :key="stat.type"
                  class="flex items-center justify-between p-3 rounded-lg"
                  :class="isDark ? 'bg-white/5' : 'bg-white/60'"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="w-6 h-6 rounded-lg flex items-center justify-center"
                      :class="getActivityTypeBg(stat.type)"
                    >
                      <component
                        :is="getActivityTypeIcon(stat.type)"
                        class="w-3 h-3"
                        :class="isDark ? 'text-white' : 'text-gray-700'"
                      />
                    </div>
                    <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                      {{ stat.type }}
                    </span>
                  </div>
                  <span class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ stat.count }}
                  </span>
                </div>
                <div
                  class="border-t pt-3"
                  :class="isDark ? 'border-white/10' : 'border-gray-200/50'"
                >
                  <div class="flex items-center justify-between">
                    <span
                      class="text-sm font-medium"
                      :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                    >
                      总计
                    </span>
                    <span
                      class="text-xl font-bold"
                      :class="isDark ? 'text-primary-400' : 'text-primary-600'"
                    >
                      {{ totalCount }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer
      class="py-12 px-6 border-t relative z-10"
      :class="isDark ? 'border-white/10' : 'border-gray-200'"
    >
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
              class="hidden sm:inline hover:text-primary-500 transition-colors"
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
            <a href="/rss" class="hover:text-primary-500 transition-colors">RSS</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";
import { FileText, Image, Music, Video, Globe, Layers, Headphones } from "lucide-vue-next";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");
const router = useRouter();

const heroVisible = ref(false);

const lyricsVisible = ref(false);
const galleryVisible = ref(false);
const activityVisible = ref(false);
const scrollOpacity = ref(1);

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
  groupName?: string;
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
  startTime: string;
  homeWallpaperLight: string;
  homeWallpaperDark: string;
}

const articlesVisible = ref(false);
const articles = ref<ArticleItem[]>([]);
const lyrics = ref<LyricItem[]>([]);
const galleryImages = ref<ImageItem[]>([]);
const publicProfile = ref<PublicProfile | null>(null);
const siteConfig = ref<SiteConfig | null>(null);
const visibleCharCount = ref(0);
const uptime = ref("");

let uptimeInterval: number | null = null;

const activities = ref<ActivityItem[]>([]);
const activityStats = ref<Record<string, number>>({});

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
  const totalChars = usernameChars.value.length;
  visibleCharCount.value = 0;

  const animate = () => {
    visibleCharCount.value = 0;
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index < totalChars) {
        visibleCharCount.value = index + 1;
        index++;
      } else {
        clearInterval(typeInterval);

        setTimeout(() => {
          const deleteInterval = setInterval(() => {
            if (visibleCharCount.value > 0) {
              visibleCharCount.value--;
            } else {
              clearInterval(deleteInterval);
              setTimeout(() => {
                animate();
              }, 500);
            }
          }, 150);
        }, 4000);
      }
    }, 120);

    return typeInterval;
  };

  animate();
};

const calculateUptime = () => {
  const startTime = siteConfig.value?.startTime || "2024-01-01";
  const launchDate = new Date(startTime);
  const now = new Date();
  const diff = now.getTime() - launchDate.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  uptime.value = `本站已运行 ${days}天 ${hours}小时 ${minutes}分钟`;
};

const fetchArticles = async () => {
  try {
    const data = await http.get<ArticleItem[]>("/article/recent?limit=3");
    articles.value = data;
  } catch (e) {
    console.error("获取文章失败:", e);
  }
};

const fetchLyrics = async () => {
  try {
    const data = await http.get<{ list: LyricItem[] }>("/music?pageSize=4");
    lyrics.value = (data.list || []).slice(0, 4);
  } catch (e) {
    console.error("获取歌词失败:", e);
  }
};

const fetchGallery = async () => {
  try {
    const data = await http.get<ImageItem[]>("/gallery/recent?limit=7");
    galleryImages.value = data;
  } catch (e) {
    console.error("获取图片失败:", e);
  }
};

const fetchConfig = async () => {
  try {
    const data = await http.get<SiteConfig>("/config");
    siteConfig.value = data;
    calculateUptime();
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
    const data = await http.get<ActivityItem[]>("/activity?limit=30");
    activities.value = data
      .filter((item) => {
        if (item.type === "记忆") return false;
        if (item.groupName === "系统信息") return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e) {
    console.error("获取站点动态失败:", e);
  }
};

const fetchStats = async () => {
  try {
    const data = await http.get<Record<string, number>>("/activity/stats");
    activityStats.value = data;
  } catch (e) {
    console.error("获取统计数据失败:", e);
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

const activityTypeOrder = ["文章", "图片", "歌词", "视频", "足迹", "场景", "音频"];

const statList = computed(() => {
  return activityTypeOrder.map((type) => ({
    type,
    count: activityStats.value[type] || 0,
  }));
});

const totalCount = computed(() => {
  return statList.value.reduce((sum, item) => sum + item.count, 0);
});

const getActivityTypeIcon = (type: string) => {
  const icons: Record<string, any> = {
    文章: FileText,
    图片: Image,
    歌词: Music,
    视频: Video,
    足迹: Globe,
    场景: Layers,
    音频: Headphones,
  };
  return icons[type] || FileText;
};

const getActivityTypeBg = (type: string) => {
  const bgs: Record<string, string> = {
    文章: "bg-gradient-to-br from-violet-500/30 to-purple-500/30",
    图片: "bg-gradient-to-br from-cyan-500/30 to-blue-500/30",
    歌词: "bg-gradient-to-br from-green-500/30 to-emerald-500/30",
    视频: "bg-gradient-to-br from-blue-500/30 to-indigo-500/30",
    足迹: "bg-gradient-to-br from-amber-500/30 to-orange-500/30",
    场景: "bg-gradient-to-br from-pink-500/30 to-rose-500/30",
    音频: "bg-gradient-to-br from-teal-500/30 to-cyan-500/30",
  };
  return bgs[type] || "bg-gradient-to-br from-gray-500/30 to-gray-600/30";
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
  heroVisible.value = true;
  setTimeout(() => {
    startCharAnimation();
  }, 1000);
  setTimeout(setupScrollReveal, 100);
  fetchArticles();
  fetchLyrics();
  fetchGallery();
  fetchConfig();
  fetchPublicProfile();
  fetchActivities();
  fetchStats();
  calculateUptime();

  uptimeInterval = window.setInterval(calculateUptime, 60000);

  let scrollTimeout: number | null = null;
  window.addEventListener("scroll", () => {
    if (scrollTimeout) return;
    scrollTimeout = window.setTimeout(() => {
      const fadeThreshold = window.innerHeight * 1.5;
      scrollOpacity.value = Math.max(0, 1 - window.scrollY / fadeThreshold);
      scrollTimeout = null;
    }, 16);
  });
});
onUnmounted(() => {
  if (uptimeInterval) clearInterval(uptimeInterval);
});
</script>

<style scoped>
@keyframes breath {
  0%,
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1);
    filter: brightness(1.05);
  }
}

.animate-breath {
  animation: breath 4s ease-in-out infinite;
}

@keyframes breath-glow {
  0%,
  100% {
    text-shadow:
      0 0 20px rgba(20, 184, 166, 0.3),
      0 0 40px rgba(14, 165, 233, 0.2);
  }
  50% {
    text-shadow:
      0 0 30px rgba(20, 184, 166, 0.5),
      0 0 60px rgba(14, 165, 233, 0.3);
  }
}

.animate-breath-glow {
  animation: breath-glow 4s ease-in-out infinite;
}

@keyframes breath-border {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

.animate-breath-border {
  animation: breath-border 3s ease-in-out infinite;
}
</style>
