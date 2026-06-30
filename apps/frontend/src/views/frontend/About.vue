<template>
  <div class="min-h-screen py-24 px-6">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-16">
        <h1
          class="text-4xl md:text-5xl font-bold mb-4"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            :class="
              isDark
                ? 'bg-gradient-to-r from-pink-400 via-rose-400 to-red-400'
                : 'bg-gradient-to-r from-pink-600 via-rose-600 to-red-600'
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

      <div
        class="rounded-2xl p-8 mb-8"
        :class="
          isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100 shadow-lg'
        "
        style="backdrop-filter: blur(10px)"
      >
        <div class="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <div class="relative">
            <div
              class="w-32 h-32 rounded-full flex items-center justify-center text-6xl relative z-10 overflow-hidden"
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
                  src="https://neeko-copilot.bytedance.net/api/text2image?prompt=anime%20girl%20portrait%20with%20long%20black%20hair%20and%20red%20hair%20accessories%20soft%20smile%20dreamy%20atmosphere&image_size=square"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            <div
              class="absolute -inset-3 rounded-full bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 blur-xl"
            ></div>
          </div>
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-2xl font-bold mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ publicProfile?.username || "MianYang" }}
            </h2>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="mb-4">
              {{ siteConfig?.subtitle || "真实经历永远比叙述的复杂" }}
            </p>
            <div class="flex flex-wrap justify-center md:justify-start gap-3">
              <span
                v-for="(tag, idx) in profileTags"
                :key="idx"
                class="px-3 py-1 rounded-full text-xs font-medium bg-violet-500/20 text-violet-400"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div
          class="rounded-xl p-5 text-center"
          :class="isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100'"
        >
          <div
            class="text-2xl md:text-3xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent"
          >
            {{ siteStats.articles }}
          </div>
          <div class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">文章</div>
        </div>
        <div
          class="rounded-xl p-5 text-center"
          :class="isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100'"
        >
          <div
            class="text-2xl md:text-3xl font-black bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent"
          >
            {{ siteStats.images }}
          </div>
          <div class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">图片</div>
        </div>
        <div
          class="rounded-xl p-5 text-center"
          :class="isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100'"
        >
          <div
            class="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
          >
            {{ siteStats.lyrics }}
          </div>
          <div class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">歌词</div>
        </div>
        <div
          class="rounded-xl p-5 text-center"
          :class="isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100'"
        >
          <div
            class="text-2xl md:text-3xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"
          >
            {{ siteStats.articles + siteStats.images + siteStats.lyrics }}
          </div>
          <div class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">总数</div>
        </div>
      </div>

      <div class="space-y-6">
        <div
          class="rounded-2xl p-6"
          :class="isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100'"
        >
          <h3
            class="text-lg font-bold mb-4 flex items-center"
            :class="isDark ? 'text-white' : 'text-gray-900'"
          >
            <span class="text-2xl mr-3">💡</span>
            关于这个网站
          </h3>
          <div
            class="space-y-3 text-sm leading-relaxed"
            :class="isDark ? 'text-gray-400' : 'text-gray-600'"
          >
            <p v-for="(line, idx) in siteDescriptionLines" :key="idx">{{ line }}</p>
          </div>
        </div>

        <div
          class="rounded-2xl p-6"
          :class="isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100'"
        >
          <h3
            class="text-lg font-bold mb-4 flex items-center"
            :class="isDark ? 'text-white' : 'text-gray-900'"
          >
            <span class="text-2xl mr-3">🛠️</span>
            我的技术栈
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(item, idx) in techStackItems"
              :key="idx"
              class="px-3 py-1.5 rounded-lg text-sm"
              :class="getTechStackColorClass(idx)"
            >
              {{ item }}
            </span>
          </div>
        </div>

        <div
          class="rounded-2xl p-6"
          :class="isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100'"
        >
          <h3
            class="text-lg font-bold mb-4 flex items-center"
            :class="isDark ? 'text-white' : 'text-gray-900'"
          >
            <span class="text-2xl mr-3">📧</span>
            联系我
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              v-for="(item, index) in contactList"
              :key="index"
              :href="item.url"
              :target="item.isExternal ? '_blank' : '_self'"
              class="flex flex-col items-center p-4 rounded-xl transition-all hover:scale-105"
              :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'"
            >
              <span class="text-3xl mb-2">{{ item.icon }}</span>
              <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ item.name }}
              </span>
            </a>
          </div>
        </div>
      </div>

      <footer class="py-8 mt-12 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
        <div class="text-center">
          <p :class="isDark ? 'text-gray-500' : 'text-gray-400'" class="text-sm">
            © {{ new Date().getFullYear() }} {{ siteConfig?.title || "MianySoul" }}
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";
import { useModuleConfig } from "@/composables/useModuleConfig";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

const { getPageTitle, getPageSubtitle } = useModuleConfig();
const pageTitle = computed(() => getPageTitle("about"));
const pageSubtitle = computed(() => getPageSubtitle("about"));

interface PublicProfile {
  id: string;
  username: string;
  avatar?: string;
  tags?: string;
  techStack?: string;
  contactInfo?: string;
}

interface SiteConfig {
  logo: string;
  title: string;
  subtitle: string;
  description: string;
  copyright: string;
  icp: string;
}

const siteStats = ref({ articles: 0, images: 0, lyrics: 0 });
const publicProfile = ref<PublicProfile | null>(null);
const siteConfig = ref<SiteConfig | null>(null);

const siteDescriptionLines = computed(() => {
  const defaultLines = [
    "这是一个个人博客网站，记录我的思考、感悟和生活点滴。",
    "网站使用现代化的技术栈构建，采用前后端分离的架构设计。",
    "在这里你可以找到我的文章、喜欢的歌词、摄影作品，以及一些白噪音场景帮助你放松。",
  ];
  if (!siteConfig.value?.description) return defaultLines;
  return siteConfig.value.description.split(/\n+/).filter((line) => line.trim());
});

const profileTags = computed(() => {
  if (!publicProfile.value?.tags) {
    return ["Vue.js", "TypeScript", "Node.js", "Prisma"];
  }
  return publicProfile.value.tags
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
});

const techStackItems = computed(() => {
  if (!publicProfile.value?.techStack) {
    return [
      "Vue 3",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Fastify",
      "Prisma",
      "SQLite",
      "Pinia",
      "Vue Router",
    ];
  }
  return publicProfile.value.techStack
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
});

const techStackColors = [
  { dark: "bg-violet-500/20 text-violet-400", light: "bg-violet-100 text-violet-600" },
  { dark: "bg-cyan-500/20 text-cyan-400", light: "bg-cyan-100 text-cyan-600" },
  { dark: "bg-pink-500/20 text-pink-400", light: "bg-pink-100 text-pink-600" },
  { dark: "bg-emerald-500/20 text-emerald-400", light: "bg-emerald-100 text-emerald-600" },
  { dark: "bg-amber-500/20 text-amber-400", light: "bg-amber-100 text-amber-600" },
  { dark: "bg-fuchsia-500/20 text-fuchsia-400", light: "bg-fuchsia-100 text-fuchsia-600" },
  { dark: "bg-blue-500/20 text-blue-400", light: "bg-blue-100 text-blue-600" },
  { dark: "bg-rose-500/20 text-rose-400", light: "bg-rose-100 text-rose-600" },
  { dark: "bg-teal-500/20 text-teal-400", light: "bg-teal-100 text-teal-600" },
];

const getTechStackColorClass = (index: number) => {
  const color = techStackColors[index % techStackColors.length];
  return isDark.value ? color.dark : color.light;
};

interface ContactListItem {
  icon: string;
  name: string;
  url: string;
  isExternal: boolean;
}

const iconMap: Record<string, { icon: string; name: string }> = {
  github: { icon: "🐙", name: "GitHub" },
  email: { icon: "✉️", name: "邮箱" },
  bilibili: { icon: "📺", name: "B站" },
  wechat: { icon: "💬", name: "微信" },
  twitter: { icon: "🐦", name: "Twitter" },
  linkedin: { icon: "💼", name: "LinkedIn" },
  blog: { icon: "🌐", name: "博客" },
};

const contactList = computed<ContactListItem[]>(() => {
  if (!publicProfile.value?.contactInfo) {
    return [];
  }
  try {
    const parsed = JSON.parse(publicProfile.value.contactInfo) as Record<string, string>;
    return Object.entries(parsed)
      .filter(([, url]) => url && url.trim())
      .map(([key, url]) => {
        const mapping = iconMap[key] || {
          icon: "🔗",
          name: key.charAt(0).toUpperCase() + key.slice(1),
        };
        const finalUrl =
          key === "email" && !url.startsWith("mailto:")
            ? `mailto:${url}`
            : key === "bilibili" && !url.startsWith("http")
              ? `https://space.bilibili.com/${url}`
              : url;
        return {
          ...mapping,
          url: finalUrl,
          isExternal: true,
        };
      });
  } catch {
    return [];
  }
});

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
  } catch (e) {
    console.error("获取公开用户信息失败:", e);
  }
};

onMounted(() => {
  fetchStats();
  fetchConfig();
  fetchPublicProfile();
});

onUnmounted(() => {});
</script>
