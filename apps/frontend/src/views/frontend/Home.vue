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
      <div v-else class="w-full h-full" :class="isDark ? 'home-bg-dark' : 'home-bg-light'"></div>
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

    <section id="bento-grid" data-section="bento" class="py-24 px-6 relative z-10">
      <div class="max-w-6xl mx-auto">
        <div class="bento-grid-container">
          <div
            class="bento-card bento-card-lg bento-card-articles"
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 ml-1"
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
              </a>
            </div>
            <div class="bento-card-content">
              <div class="space-y-4">
                <div
                  v-for="n in 3"
                  :key="n"
                  class="group flex gap-4 p-3 rounded-xl cursor-pointer transition-all"
                  :class="[
                    isDark
                      ? 'hover:bg-white/5 border border-white/5 hover:border-white/10'
                      : 'hover:bg-gray-50 border border-gray-100 hover:border-gray-200',
                  ]"
                >
                  <div
                    class="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                    :class="isDark ? 'bg-primary-500/20' : 'bg-primary-100'"
                  >
                    <div
                      class="w-4 h-4 rounded animate-pulse"
                      :class="isDark ? 'bg-primary-400/50' : 'bg-primary-200'"
                    ></div>
                  </div>
                  <div class="flex-1 min-w-0 space-y-2">
                    <div
                      class="h-4 rounded animate-pulse"
                      :class="isDark ? 'bg-white/20' : 'bg-gray-200'"
                      style="width: 70%"
                    ></div>
                    <div class="flex items-center gap-2">
                      <div
                        class="h-3 rounded animate-pulse"
                        :class="isDark ? 'bg-white/20' : 'bg-gray-200'"
                        style="width: 40px"
                      ></div>
                      <div
                        class="h-3 rounded animate-pulse"
                        :class="isDark ? 'bg-white/20' : 'bg-gray-200'"
                        style="width: 60px"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bento-card bento-card-md bento-card-gallery"
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
                  :class="isDark ? 'bg-white/10' : 'bg-cyan-100'"
                >
                  <IconPark
                    type="Pic"
                    :size="16"
                    :class="isDark ? 'text-cyan-400' : 'text-cyan-600'"
                  />
                </div>
                <h2 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                  照片集
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 ml-1"
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
              </a>
            </div>
            <div class="bento-card-content">
              <div class="grid grid-cols-3 gap-2">
                <div
                  v-for="n in 6"
                  :key="n"
                  class="aspect-square rounded-lg overflow-hidden cursor-pointer"
                >
                  <div
                    class="w-full h-full animate-pulse"
                    :class="isDark ? 'bg-white/10' : 'bg-gray-200'"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bento-card bento-card-sm bento-card-ideas"
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
                  :class="isDark ? 'bg-white/10' : 'bg-amber-100'"
                >
                  <IconPark
                    type="Magic"
                    :size="16"
                    :class="isDark ? 'text-cyan-400' : 'text-cyan-600'"
                  />
                </div>
                <h2 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                  灵感碎片
                </h2>
              </div>
            </div>
            <div class="bento-card-content">
              <div class="space-y-3">
                <div
                  v-for="n in 4"
                  :key="n"
                  class="p-2 rounded-lg space-y-1.5"
                  :class="isDark ? 'bg-white/5' : 'bg-gray-50'"
                >
                  <div
                    class="h-3 rounded animate-pulse"
                    :class="isDark ? 'bg-white/20' : 'bg-gray-200'"
                    style="width: 80%"
                  ></div>
                  <div
                    class="h-3 rounded animate-pulse"
                    :class="isDark ? 'bg-white/20' : 'bg-gray-200'"
                    style="width: 60%"
                  ></div>
                  <div
                    class="h-2 rounded animate-pulse"
                    :class="isDark ? 'bg-white/10' : 'bg-gray-100'"
                    style="width: 40%"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bento-card bento-card-sm bento-card-music"
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
                  :class="isDark ? 'bg-white/10' : 'bg-green-100'"
                >
                  <IconPark
                    type="Music"
                    :size="16"
                    :class="isDark ? 'text-green-400' : 'text-green-600'"
                  />
                </div>
                <h2 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                  推荐音乐
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 ml-1"
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
              </a>
            </div>
            <div class="bento-card-content">
              <div class="space-y-3">
                <div
                  v-for="n in 4"
                  :key="n"
                  class="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all"
                  :class="[
                    isDark
                      ? 'hover:bg-white/5 border border-white/5 hover:border-white/10'
                      : 'hover:bg-gray-50 border border-gray-100 hover:border-gray-200',
                  ]"
                >
                  <div
                    class="w-8 h-8 rounded-lg flex-shrink-0 animate-pulse"
                    :class="isDark ? 'bg-white/10' : 'bg-gray-200'"
                  ></div>
                  <div class="flex-1 min-w-0 space-y-1">
                    <div
                      class="h-3 rounded animate-pulse"
                      :class="isDark ? 'bg-white/20' : 'bg-gray-200'"
                      style="width: 70%"
                    ></div>
                    <div
                      class="h-2 rounded animate-pulse"
                      :class="isDark ? 'bg-white/10' : 'bg-gray-100'"
                      style="width: 50%"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bento-card bento-card-sm bento-card-lyrics"
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
                  :class="isDark ? 'bg-white/10' : 'bg-orange-100'"
                >
                  <IconPark
                    type="Quote"
                    :size="16"
                    :class="isDark ? 'text-orange-400' : 'text-orange-600'"
                  />
                </div>
                <h2 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                  音乐片段
                </h2>
              </div>
            </div>
            <div class="bento-card-content">
              <div class="flex flex-col items-center justify-center py-6 text-center">
                <div
                  class="h-4 rounded animate-pulse"
                  :class="isDark ? 'bg-white/20' : 'bg-gray-200'"
                  style="width: 80%"
                ></div>
                <div
                  class="h-3 rounded animate-pulse mt-4"
                  :class="isDark ? 'bg-white/10' : 'bg-gray-100'"
                  style="width: 50%"
                ></div>
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
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";
import { IconPark } from "@icon-park/vue-next/es/all";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

const heroVisible = ref(false);
const bentoVisible = ref(false);
const scrollOpacity = ref(1);

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

const publicProfile = ref<PublicProfile | null>(null);
const siteConfig = ref<SiteConfig | null>(null);
const visibleCharCount = ref(0);
const uptime = ref("");

let uptimeInterval: number | null = null;

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

const setupScrollReveal = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-section");
          if (id === "bento") bentoVisible.value = true;
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
  fetchConfig();
  fetchPublicProfile();
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

.home-bg-light {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e0e7ff 100%);
  position: relative;
}

.home-bg-light::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
}

.home-bg-dark {
  background: linear-gradient(135deg, #1a1625 0%, #1f1b2e 50%, #181520 100%);
  position: relative;
}

.home-bg-dark::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E");
  pointer-events: none;
}

.bento-grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto auto;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .bento-grid-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
}

.bento-card {
  border-radius: 1rem;
  backdrop-filter: blur(12px);
  overflow: hidden;
  position: relative;
}

.bento-card {
  @apply border;
  @apply transition-all duration-300 hover:shadow-lg;
}

.bento-card {
  @apply bg-white/60 border-gray-100/50;
}

.dark .bento-card {
  @apply bg-white/5 border-white/10;
}

.bento-card-lg {
  grid-column: span 8;
  grid-row: span 1;
}

.bento-card-md {
  grid-column: span 4;
  grid-row: span 1;
}

.bento-card-sm {
  grid-column: span 4;
  grid-row: span 1;
}

@media (max-width: 768px) {
  .bento-card-lg,
  .bento-card-md,
  .bento-card-sm {
    grid-column: span 1;
    grid-row: span 1;
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

@media (min-width: 1025px) {
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
</style>
