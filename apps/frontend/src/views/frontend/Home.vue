<template>
  <div class="relative min-h-screen">
    <!-- ==================== Splash 闪屏 ==================== -->
    <Transition name="splash">
      <div
        v-if="showSplash"
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer overflow-hidden"
        :class="isDark ? 'bg-gray-900' : 'bg-gray-50'"
        @click="dismissSplash"
      >
        <!-- 渐变背景 -->
        <div
          class="absolute inset-0 pointer-events-none"
          :class="isDark ? 'home-bg-dark' : 'home-bg-light'"
        ></div>

        <!-- 水面波纹效果 -->
        <div class="ripple-container">
          <span class="ripple ripple-1"></span>
          <span class="ripple ripple-2"></span>
          <span class="ripple ripple-3"></span>
          <span class="ripple ripple-4"></span>
        </div>

        <!-- 头像 -->
        <div class="relative z-10">
          <div
            class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2"
            :class="isDark ? 'border-white/20' : 'border-white/60'"
            style="box-shadow: 0 8px 32px rgba(22, 93, 255, 0.25)"
          >
            <img
              v-if="publicProfile?.avatar"
              :src="publicProfile.avatar"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-5xl font-bold"
              :class="isDark ? 'text-primary-400 bg-gray-800' : 'text-primary-600 bg-gray-100'"
            >
              {{ (publicProfile?.username || "M")[0] }}
            </div>
          </div>
        </div>

        <p
          class="absolute bottom-12 text-sm animate-pulse z-10"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'"
        >
          点击进入
        </p>
      </div>
    </Transition>

    <!-- ==================== 背景 ==================== -->
    <div
      class="fixed inset-0 z-0 transition-all duration-700 ease-out pointer-events-none"
      :style="{ opacity: scrollOpacity }"
    >
      <img
        v-if="siteConfig?.homeWallpaperLight || siteConfig?.homeWallpaperDark"
        :src="isDark ? siteConfig.homeWallpaperDark : siteConfig.homeWallpaperLight"
        alt="Home Wallpaper"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full" :class="isDark ? 'home-bg-dark' : 'home-bg-light'"></div>
    </div>

    <!-- ==================== 主体内容 ==================== -->
    <div class="relative z-10">
      <!-- 紧凑头部 -->
      <section class="pt-28 pb-12 px-6">
        <div class="max-w-6xl mx-auto">
          <div class="flex flex-col md:flex-row items-center md:items-end gap-6">
            <!-- 头像 -->
            <div
              class="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 flex-shrink-0"
              :class="isDark ? 'border-gray-700' : 'border-gray-200'"
              style="box-shadow: 0 4px 20px rgba(139, 92, 246, 0.15)"
            >
              <img
                v-if="publicProfile?.avatar"
                :src="publicProfile.avatar"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-3xl font-bold"
                :class="isDark ? 'text-purple-400 bg-gray-800' : 'text-teal-500 bg-gray-100'"
              >
                {{ (publicProfile?.username || "M")[0] }}
              </div>
            </div>

            <!-- 名称+副标题 -->
            <div class="flex-1 text-center md:text-left">
              <h1
                class="text-3xl md:text-4xl font-bold italic mb-2 tracking-tight"
                style="font-family: &quot;Inter&quot;, sans-serif"
              >
                <span
                  :class="
                    isDark
                      ? 'bg-gradient-to-r from-primary-300 to-primary-500'
                      : 'bg-gradient-to-r from-primary-400 to-primary-700'
                  "
                  class="bg-clip-text text-transparent"
                >
                  {{ publicProfile?.username || "MianYang" }}
                </span>
              </h1>
              <p class="text-base md:text-lg" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ siteConfig?.subtitle || "真实经历永远比叙述的复杂" }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Bento Grid -->
      <section class="px-6 pb-24">
        <div class="max-w-6xl mx-auto">
          <div class="bento-grid-container">
            <!-- 第一排：漫想 + 歌词片段 -->
            <!-- 漫想（最近文章） -->
            <div
              class="bento-card bento-card-lg"
              :class="{
                'translate-y-0 opacity-100': bentoVisible,
                'translate-y-10 opacity-0': !bentoVisible,
              }"
              style="transition: all 0.6s ease-out"
            >
              <div class="bento-card-header">
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center"
                    :class="isDark ? 'bg-white/10' : 'bg-amber-100'"
                  >
                    <IconPark
                      type="Tips"
                      :size="16"
                      :class="isDark ? 'text-amber-400' : 'text-amber-600'"
                    />
                  </div>
                  <h2 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                    漫想
                  </h2>
                </div>
                <a
                  href="/archive"
                  class="flex items-center text-sm"
                  :class="
                    isDark
                      ? 'text-gray-400 hover:text-primary-400'
                      : 'text-gray-500 hover:text-primary-600'
                  "
                >
                  <span>查看全部</span>
                  <IconPark type="Right" :size="12" class="ml-1" />
                </a>
              </div>
              <div class="bento-card-content">
                <div class="space-y-3">
                  <template v-if="recentArticles.length > 0">
                    <a
                      v-for="article in recentArticles"
                      :key="article.id"
                      :href="`/article/${article.id}`"
                      class="group flex items-center gap-4 p-3 rounded-xl transition-all"
                      :class="
                        isDark
                          ? 'hover:bg-white/5 border border-white/5 hover:border-white/10'
                          : 'hover:bg-gray-50 border border-gray-100 hover:border-gray-200'
                      "
                    >
                      <div
                        class="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                        :class="isDark ? 'bg-primary-500/20' : 'bg-primary-100'"
                      >
                        <IconPark
                          type="DocDetail"
                          :size="18"
                          :class="isDark ? 'text-primary-400' : 'text-primary-600'"
                        />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div
                          class="text-sm font-medium truncate"
                          :class="isDark ? 'text-gray-200' : 'text-gray-800'"
                        >
                          {{ article.title }}
                        </div>
                        <div
                          class="flex items-center gap-2 mt-1 text-xs"
                          :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                        >
                          <span v-if="article.category">{{ article.category.name }}</span>
                          <span v-if="article.category">·</span>
                          <span>{{ formatDate(article.createdAt) }}</span>
                        </div>
                      </div>
                    </a>
                  </template>
                  <div
                    v-else
                    class="text-center py-8 text-sm"
                    :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                  >
                    暂无文章
                  </div>
                </div>
              </div>
            </div>

            <!-- 歌词片段 -->
            <div
              class="bento-card bento-card-md"
              :class="{
                'translate-y-0 opacity-100': bentoVisible,
                'translate-y-10 opacity-0': !bentoVisible,
              }"
              style="transition: all 0.6s ease-out 0.15s"
            >
              <div class="bento-card-header">
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center"
                    :class="isDark ? 'bg-white/10' : 'bg-green-100'"
                  >
                    <IconPark
                      type="Music"
                      :size="16"
                      :class="isDark ? 'text-green-400' : 'text-green-600'"
                    />
                  </div>
                  <h2 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                    歌词片段
                  </h2>
                </div>
                <a
                  href="/lyrics"
                  class="flex items-center text-sm"
                  :class="
                    isDark
                      ? 'text-gray-400 hover:text-primary-400'
                      : 'text-gray-500 hover:text-primary-600'
                  "
                >
                  <span>更多</span>
                  <IconPark type="Right" :size="12" class="ml-1" />
                </a>
              </div>
              <div class="bento-card-content">
                <div class="space-y-3">
                  <template v-if="recentLyrics.length > 0">
                    <div
                      v-for="lyric in recentLyrics"
                      :key="lyric.id"
                      class="p-3 rounded-lg cursor-pointer transition-all"
                      :class="
                        isDark
                          ? 'hover:bg-white/5 border border-white/5'
                          : 'hover:bg-gray-50 border border-gray-100'
                      "
                      @click="$router.push('/lyrics')"
                    >
                      <div class="flex items-center justify-between mb-1">
                        <span
                          class="text-sm font-medium truncate"
                          :class="isDark ? 'text-gray-200' : 'text-gray-800'"
                        >
                          {{ lyric.songName }}
                        </span>
                        <span
                          class="text-xs flex-shrink-0 ml-2"
                          :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                        >
                          {{ lyric.singer }}
                        </span>
                      </div>
                      <p
                        class="text-xs italic line-clamp-2"
                        :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                        style="white-space: pre-wrap"
                      >
                        {{ lyric.lyric }}
                      </p>
                    </div>
                  </template>
                  <div
                    v-else
                    class="text-center py-8 text-sm"
                    :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                  >
                    暂无歌词
                  </div>
                </div>
              </div>
            </div>

            <!-- 第二排：图集 + 叙述 + 关于 -->
            <!-- 照片集 -->
            <div
              class="bento-card bento-card-sm"
              :class="{
                'translate-y-0 opacity-100': bentoVisible,
                'translate-y-10 opacity-0': !bentoVisible,
              }"
              style="transition: all 0.6s ease-out 0.3s"
            >
              <div class="bento-card-header">
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center"
                    :class="isDark ? 'bg-white/10' : 'bg-primary-100'"
                  >
                    <IconPark
                      type="Pic"
                      :size="16"
                      :class="isDark ? 'text-primary-400' : 'text-primary-600'"
                    />
                  </div>
                  <h2 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                    图集
                  </h2>
                </div>
                <a
                  href="/gallery"
                  class="flex items-center text-sm"
                  :class="
                    isDark
                      ? 'text-gray-400 hover:text-primary-400'
                      : 'text-gray-500 hover:text-primary-600'
                  "
                >
                  <span>更多</span>
                  <IconPark type="Right" :size="12" class="ml-1" />
                </a>
              </div>
              <div class="bento-card-content">
                <div class="grid grid-cols-3 gap-2">
                  <template v-if="recentImages.length > 0">
                    <div
                      v-for="img in recentImages.slice(0, 6)"
                      :key="img.id"
                      class="aspect-square rounded-lg overflow-hidden cursor-pointer"
                    >
                      <img
                        :src="getFullImageUrl(img.url)"
                        :alt="img.filename"
                        class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  </template>
                  <div
                    v-for="n in 6"
                    v-else
                    :key="n"
                    class="aspect-square rounded-lg"
                    :class="isDark ? 'bg-white/5' : 'bg-gray-100'"
                  ></div>
                </div>
              </div>
            </div>

            <!-- 叙述 -->
            <div
              class="bento-card bento-card-sm"
              :class="{
                'translate-y-0 opacity-100': bentoVisible,
                'translate-y-10 opacity-0': !bentoVisible,
              }"
              style="transition: all 0.6s ease-out 0.45s"
            >
              <div class="bento-card-header">
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center"
                    :class="isDark ? 'bg-white/10' : 'bg-orange-100'"
                  >
                    <IconPark
                      type="Book"
                      :size="16"
                      :class="isDark ? 'text-orange-400' : 'text-orange-600'"
                    />
                  </div>
                  <h2 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                    叙述
                  </h2>
                </div>
                <a
                  href="/narrative"
                  class="flex items-center text-sm"
                  :class="
                    isDark
                      ? 'text-gray-400 hover:text-primary-400'
                      : 'text-gray-500 hover:text-primary-600'
                  "
                >
                  <span>更多</span>
                  <IconPark type="Right" :size="12" class="ml-1" />
                </a>
              </div>
              <div class="bento-card-content">
                <div class="space-y-3">
                  <template v-if="recentNarratives.length > 0">
                    <a
                      v-for="narrative in recentNarratives.slice(0, 3)"
                      :key="narrative.id"
                      :href="`/narrative/${narrative.id}`"
                      class="block p-3 rounded-lg transition-all"
                      :class="
                        isDark
                          ? 'hover:bg-white/5 border border-white/5'
                          : 'hover:bg-gray-50 border border-gray-100'
                      "
                    >
                      <div
                        class="text-sm font-medium truncate mb-1"
                        :class="isDark ? 'text-gray-200' : 'text-gray-800'"
                      >
                        {{ narrative.title }}
                      </div>
                      <p
                        class="text-xs line-clamp-2"
                        :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                      >
                        {{ narrative.description }}
                      </p>
                    </a>
                  </template>
                  <div
                    v-else
                    class="text-center py-8 text-sm"
                    :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                  >
                    暂无叙述
                  </div>
                </div>
              </div>
            </div>

            <!-- 关于 -->
            <div
              class="bento-card bento-card-sm"
              :class="{
                'translate-y-0 opacity-100': bentoVisible,
                'translate-y-10 opacity-0': !bentoVisible,
              }"
              style="transition: all 0.6s ease-out 0.6s"
            >
              <div class="bento-card-header">
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center"
                    :class="isDark ? 'bg-white/10' : 'bg-purple-100'"
                  >
                    <IconPark
                      type="User"
                      :size="16"
                      :class="isDark ? 'text-purple-400' : 'text-purple-600'"
                    />
                  </div>
                  <h2 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                    关于我
                  </h2>
                </div>
                <a
                  href="/about"
                  class="flex items-center text-sm"
                  :class="
                    isDark
                      ? 'text-gray-400 hover:text-primary-400'
                      : 'text-gray-500 hover:text-primary-600'
                  "
                >
                  <span>更多</span>
                  <IconPark type="Right" :size="12" class="ml-1" />
                </a>
              </div>
              <div class="bento-card-content">
                <!-- 暂时置空 -->
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";
import { IconPark } from "@icon-park/vue-next/es/all";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

// Splash
const showSplash = ref(true);
const splashDismissed = ref(false);

// Hero
const bentoVisible = ref(false);
const scrollOpacity = ref(1);

// Data
interface PublicProfile {
  id: string;
  username: string;
  avatar?: string;
  tags?: string;
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

interface RecentArticle {
  id: string;
  title: string;
  createdAt: string;
  category?: { id: string; name: string };
}

interface RecentImage {
  id: string;
  url: string;
  filename: string;
}

interface RecentLyric {
  id: string;
  singer: string;
  songName: string;
  lyric: string;
}

interface RecentNarrative {
  id: string;
  title: string;
  description: string;
}

const publicProfile = ref<PublicProfile | null>(null);
const siteConfig = ref<SiteConfig | null>(null);
const recentArticles = ref<RecentArticle[]>([]);
const recentImages = ref<RecentImage[]>([]);
const recentLyrics = ref<RecentLyric[]>([]);
const recentNarratives = ref<RecentNarrative[]>([]);

const uptime = ref("");

let uptimeInterval: number | null = null;
let splashTimer: number | null = null;

const dismissSplash = () => {
  if (splashDismissed.value) return;
  splashDismissed.value = true;
  showSplash.value = false;
  appStore.setSplashActive(false);
  document.body.style.overflow = "";
  if (splashTimer) clearTimeout(splashTimer);
  // Trigger bento reveal after splash
  setTimeout(() => {
    bentoVisible.value = true;
  }, 200);
};

const calculateUptime = () => {
  const startTime = siteConfig.value?.startTime || "2024-01-01";
  const launchDate = new Date(startTime);
  const now = new Date();
  const diff = now.getTime() - launchDate.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  uptime.value = `${days}天 ${hours}时 ${minutes}分`;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}/uploads/${url}`;
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
  } catch (e) {
    console.error("获取公开用户信息失败:", e);
  }
};

const fetchRecentArticles = async () => {
  try {
    const data = await http.get<RecentArticle[]>("/article/recent?limit=3");
    recentArticles.value = data || [];
  } catch (e) {
    console.error("获取最近文章失败:", e);
  }
};

const fetchRecentImages = async () => {
  try {
    const data = await http.get<RecentImage[]>("/gallery/recent?limit=6");
    recentImages.value = data || [];
  } catch (e) {
    console.error("获取最近图片失败:", e);
  }
};

const fetchRecentLyrics = async () => {
  try {
    const data = await http.get<{ list: RecentLyric[] }>("/music?pageSize=3");
    recentLyrics.value = data.list || [];
  } catch (e) {
    console.error("获取最近歌词失败:", e);
  }
};

const fetchRecentNarratives = async () => {
  try {
    const data = await http.get<RecentNarrative[]>("/narrative");
    recentNarratives.value = (data || []).slice(0, 3);
  } catch (e) {
    console.error("获取最近叙述失败:", e);
  }
};

onMounted(() => {
  // Show splash and hide nav
  appStore.setSplashActive(true);
  document.body.style.overflow = "hidden";

  // Fetch all data immediately
  fetchConfig();
  fetchPublicProfile();
  fetchRecentArticles();
  fetchRecentImages();
  fetchRecentLyrics();
  fetchRecentNarratives();

  // Auto dismiss splash after 2.5s
  splashTimer = window.setTimeout(dismissSplash, 2500);

  // Uptime
  uptimeInterval = window.setInterval(calculateUptime, 60000);

  // Scroll fade for background
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
  if (splashTimer) clearTimeout(splashTimer);
  document.body.style.overflow = "";
  appStore.setSplashActive(false);
});
</script>

<style scoped>
/* Splash transition */
.splash-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.splash-leave-to {
  opacity: 0;
  transform: scale(1.05);
  filter: blur(10px);
}

/* 水面波纹效果 */
.ripple-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  pointer-events: none;
  z-index: 5;
}

@media (min-width: 768px) {
  .ripple-container {
    width: 200px;
    height: 200px;
  }
}

.ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(22, 93, 255, 0.5);
  transform: translate(-50%, -50%) scale(1);
  opacity: 0;
  animation: ripple-spread 3s ease-out infinite;
}

.dark .ripple {
  border-color: rgba(64, 128, 255, 0.6);
}

.ripple-1 {
  animation-delay: 0s;
}

.ripple-2 {
  animation-delay: 0.75s;
}

.ripple-3 {
  animation-delay: 1.5s;
}

.ripple-4 {
  animation-delay: 2.25s;
}

@keyframes ripple-spread {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
    border-width: 3px;
  }
  100% {
    transform: translate(-50%, -50%) scale(3.5);
    opacity: 0;
    border-width: 1px;
  }
}

/* Background */
.home-bg-light {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e0e7ff 100%);
}

.home-bg-dark {
  background: linear-gradient(135deg, #1a1625 0%, #1f1b2e 50%, #181520 100%);
}

/* Bento Grid */
.bento-grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .bento-grid-container {
    grid-template-columns: 1fr;
  }
}

.bento-card {
  border-radius: 1rem;
  backdrop-filter: blur(12px);
  overflow: hidden;
  position: relative;
  @apply border transition-all duration-300 hover:shadow-lg;
  @apply bg-white/60 border-gray-100/50;
}

.dark .bento-card {
  @apply bg-white/5 border-white/10;
}

.bento-card-lg {
  grid-column: span 8;
}

.bento-card-md {
  grid-column: span 4;
}

.bento-card-sm {
  grid-column: span 4;
}

@media (max-width: 768px) {
  .bento-card-lg,
  .bento-card-md,
  .bento-card-sm {
    grid-column: span 1;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .bento-card-lg {
    grid-column: span 8;
  }
  .bento-card-md {
    grid-column: span 4;
  }
  .bento-card-sm {
    grid-column: span 4;
  }
}

.bento-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid;
  @apply border-gray-100/50;
}

.dark .bento-card-header {
  @apply border-white/5;
}

.bento-card-content {
  padding: 1.25rem;
}

/* Line clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
