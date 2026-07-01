<template>
  <div class="settings-page max-w-4xl mx-auto overflow-x-hidden">
    <div
      class="mb-6 px-6 py-4 rounded-xl"
      :class="
        isDark
          ? 'bg-gray-800/40 border border-gray-700/30'
          : 'bg-white/40 border border-gray-200/30'
      "
      style="backdrop-filter: blur(12px)"
    >
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            ⚙️ {{ moduleNames.settings?.name || "系统配置" }}
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ moduleNames.settings?.description || "配置网站的基本信息和外观设置" }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex space-x-1 p-1 rounded-xl mb-6" :class="isDark ? 'bg-gray-700' : 'bg-gray-100'">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200"
        :class="
          activeTab === tab.key
            ? isDark
              ? 'bg-gray-600 text-white shadow-md'
              : 'bg-white text-gray-900 shadow-sm'
            : isDark
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
        "
        @click="activeTab = tab.key"
      >
        <span>{{ tab.icon }}</span>
        <span>{{ tab.name }}</span>
      </button>
    </div>

    <div v-if="activeTab === 'site'" class="space-y-6">
      <div
        class="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
        :class="isDark ? 'bg-gray-800/60 border-gray-700/30' : 'bg-white/60 border-gray-200/30'"
        style="backdrop-filter: blur(12px)"
      >
        <h2
          class="text-lg font-semibold mb-4 flex items-center space-x-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-sm"
          >
            🖼️
          </span>
          <span>网站 Logo</span>
        </h2>
        <div class="flex items-center space-x-6">
          <div class="relative">
            <div
              class="w-20 h-20 rounded-xl overflow-hidden border-2 shadow-lg gradient-primary"
              :class="isDark ? 'border-gray-600/50' : 'border-white/50'"
            >
              <img
                v-if="form.logo"
                :src="form.logo"
                alt="网站 Logo"
                class="w-full h-full object-contain"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="text-white text-2xl font-bold">M</span>
              </div>
            </div>
            <label
              class="absolute -bottom-2 -right-2 w-10 h-10 gradient-primary rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <input type="file" accept="image/*" class="hidden" @change="handleLogoUpload" />
              <span class="text-white text-lg">📷</span>
            </label>
          </div>
          <div>
            <p class="text-sm mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              支持 JPG、PNG、SVG 格式
            </p>
            <button
              v-if="form.logo"
              class="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              @click="removeLogo"
            >
              移除 Logo
            </button>
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
        :class="isDark ? 'bg-gray-800/60 border-gray-700/30' : 'bg-white/60 border-gray-200/30'"
        style="backdrop-filter: blur(12px)"
      >
        <h2
          class="text-lg font-semibold mb-4 flex items-center space-x-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-8 h-8 rounded-lg gradient-success flex items-center justify-center text-white text-sm"
          >
            📝
          </span>
          <span>网站信息</span>
        </h2>
        <div class="space-y-4">
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              网站标题
            </label>
            <input
              v-model="form.title"
              type="text"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300"
              :class="
                isDark
                  ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                  : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
              "
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              副标题
            </label>
            <input
              v-model="form.subtitle"
              type="text"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300"
              :class="
                isDark
                  ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                  : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
              "
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              网站描述
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none transition-all duration-300"
              :class="
                isDark
                  ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                  : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
              "
            ></textarea>
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
        :class="isDark ? 'bg-gray-800/60 border-gray-700/30' : 'bg-white/60 border-gray-200/30'"
        style="backdrop-filter: blur(12px)"
      >
        <h2
          class="text-lg font-semibold mb-4 flex items-center space-x-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-8 h-8 rounded-lg gradient-info flex items-center justify-center text-white text-sm"
          >
            🖼️
          </span>
          <span>首页壁纸</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              ☀️ 亮主题壁纸
            </label>
            <div
              v-if="form.homeWallpaperLight"
              class="relative w-full aspect-video rounded-xl overflow-hidden border group mb-2"
              :class="isDark ? 'border-gray-600' : 'border-gray-200'"
            >
              <img
                :src="getFullImageUrl(form.homeWallpaperLight)"
                alt="亮主题壁纸"
                class="w-full h-full object-cover"
                @error="form.homeWallpaperLight = ''"
              />
              <button
                type="button"
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition-opacity"
                @click="form.homeWallpaperLight = ''"
              >
                移除图片
              </button>
            </div>
            <button
              type="button"
              class="w-full px-4 py-2.5 rounded-xl border border-dashed text-sm flex items-center justify-center gap-2 transition-all"
              :class="
                isDark
                  ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:bg-gray-700/30'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
              "
              @click="openImagePicker('light')"
            >
              <span>📷</span>
              <span>{{ form.homeWallpaperLight ? "更换图片" : "从图集选择图片" }}</span>
            </button>
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              🌙 暗主题壁纸
            </label>
            <div
              v-if="form.homeWallpaperDark"
              class="relative w-full aspect-video rounded-xl overflow-hidden border group mb-2"
              :class="isDark ? 'border-gray-600' : 'border-gray-200'"
            >
              <img
                :src="getFullImageUrl(form.homeWallpaperDark)"
                alt="暗主题壁纸"
                class="w-full h-full object-cover"
                @error="form.homeWallpaperDark = ''"
              />
              <button
                type="button"
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition-opacity"
                @click="form.homeWallpaperDark = ''"
              >
                移除图片
              </button>
            </div>
            <button
              type="button"
              class="w-full px-4 py-2.5 rounded-xl border border-dashed text-sm flex items-center justify-center gap-2 transition-all"
              :class="
                isDark
                  ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:bg-gray-700/30'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
              "
              @click="openImagePicker('dark')"
            >
              <span>📷</span>
              <span>{{ form.homeWallpaperDark ? "更换图片" : "从图集选择图片" }}</span>
            </button>
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
        :class="isDark ? 'bg-gray-800/60 border-gray-700/30' : 'bg-white/60 border-gray-200/30'"
        style="backdrop-filter: blur(12px)"
      >
        <h2
          class="text-lg font-semibold mb-4 flex items-center space-x-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-8 h-8 rounded-lg gradient-warning flex items-center justify-center text-white text-sm"
          >
            🦶
          </span>
          <span>页脚信息</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              版权信息
            </label>
            <input
              v-model="form.copyright"
              type="text"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300"
              :class="
                isDark
                  ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                  : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
              "
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              备案信息
            </label>
            <input
              v-model="form.icp"
              type="text"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300"
              :class="
                isDark
                  ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                  : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
              "
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'modules'" class="space-y-6">
      <div
        v-for="(module, key) in moduleList"
        :key="key"
        class="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
        :class="isDark ? 'bg-gray-800/60 border-gray-700/30' : 'bg-white/60 border-gray-200/30'"
        style="backdrop-filter: blur(12px)"
      >
        <h2
          class="text-lg font-semibold mb-4 flex items-center space-x-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
            :class="module.gradient"
          >
            {{ module.icon }}
          </span>
          <span>{{ module.label }}</span>
        </h2>
        <div class="space-y-4">
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              模块名称
            </label>
            <input
              v-model="
                form.modules[
                  key as
                    | 'article'
                    | 'memory'
                    | 'gallery'
                    | 'video'
                    | 'music'
                    | 'scenes'
                    | 'activity'
                    | 'settings'
                ].name
              "
              type="text"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300"
              :class="
                isDark
                  ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                  : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
              "
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              描述信息
            </label>
            <input
              v-model="
                form.modules[
                  key as
                    | 'article'
                    | 'memory'
                    | 'gallery'
                    | 'video'
                    | 'music'
                    | 'scenes'
                    | 'activity'
                    | 'settings'
                ].description
              "
              type="text"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300"
              :class="
                isDark
                  ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                  : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
              "
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'pages'" class="space-y-6">
      <div
        v-for="(page, key) in pagesList"
        :key="key"
        class="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
        :class="isDark ? 'bg-gray-800/60 border-gray-700/30' : 'bg-white/60 border-gray-200/30'"
        style="backdrop-filter: blur(12px)"
      >
        <h2
          class="text-lg font-semibold mb-4 flex items-center space-x-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
            :class="page.gradient"
          >
            {{ page.icon }}
          </span>
          <span>{{ page.label }}</span>
        </h2>
        <div class="space-y-4">
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              页面标题
            </label>
            <input
              v-model="
                form.pages[
                  key as
                    | 'archive'
                    | 'categories'
                    | 'tags'
                    | 'lyrics'
                    | 'gallery'
                    | 'scenes'
                    | 'about'
                ].title
              "
              type="text"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300"
              :class="
                isDark
                  ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                  : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
              "
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              页面副标题
            </label>
            <input
              v-model="
                form.pages[
                  key as
                    | 'archive'
                    | 'categories'
                    | 'tags'
                    | 'lyrics'
                    | 'gallery'
                    | 'scenes'
                    | 'about'
                ].subtitle
              "
              type="text"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300"
              :class="
                isDark
                  ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                  : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
              "
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end mt-6">
      <button
        class="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        :disabled="saving"
        @click="saveAll"
      >
        {{ saving ? "保存中..." : "保存更改" }}
      </button>
    </div>

    <div
      v-if="showImagePicker"
      class="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
      style="z-index: 10000"
      @click.self="showImagePicker = false"
    >
      <div
        class="w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div class="p-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">选择图片</h3>
            <button
              class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="showImagePicker = false"
            >
              ✕
            </button>
          </div>
          <div class="flex flex-wrap gap-2 mt-3">
            <button
              v-for="group in imageGroups"
              :key="group.id"
              class="px-3 py-1.5 rounded-full text-sm transition-all"
              :class="
                selectedGroupId === group.id
                  ? 'bg-pink-500 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              "
              @click="selectedGroupId = group.id"
            >
              {{ group.icon }} {{ group.name }}
            </button>
          </div>
        </div>
        <div class="p-4 overflow-y-auto max-h-[60vh]">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="img in filteredImages"
              :key="img.id"
              class="relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all"
              :class="
                selectedWallpaper === img.url
                  ? 'border-pink-500 ring-2 ring-pink-500/50'
                  : isDark
                    ? 'border-gray-700'
                    : 'border-gray-200'
              "
              @click="selectImage(img)"
            >
              <img
                :src="getFullImageUrl(img.url)"
                :alt="img.filename"
                class="w-full h-full object-cover"
              />
              <div
                v-if="selectedWallpaper === img.url"
                class="absolute inset-0 bg-black/30 flex items-center justify-center"
              >
                <span class="text-white text-xl">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref } from "vue";
import { useAppStore } from "@/stores/app";
import { useMessage, useModuleConfig } from "@/composables";
import { http } from "@/utils/request";

const appStore = useAppStore();
const { success, error, info } = useMessage();
const { refreshConfig } = useModuleConfig();

const isDark = computed(() => appStore.themeMode === "dark");

interface ModuleConfig {
  name: string;
  description: string;
}

interface ModuleConfigs {
  article: ModuleConfig;
  memory: ModuleConfig;
  gallery: ModuleConfig;
  video: ModuleConfig;
  music: ModuleConfig;
  scenes: ModuleConfig;
  activity: ModuleConfig;
  settings: ModuleConfig;
}

interface PageConfig {
  title: string;
  subtitle: string;
}

interface PageConfigs {
  archive: PageConfig;
  categories: PageConfig;
  tags: PageConfig;
  lyrics: PageConfig;
  gallery: PageConfig;
  scenes: PageConfig;
  about: PageConfig;
}

interface SiteConfig {
  logo: string;
  title: string;
  subtitle: string;
  description: string;
  copyright: string;
  icp: string;
  homeWallpaperLight: string;
  homeWallpaperDark: string;
  modules: ModuleConfigs;
  pages: PageConfigs;
}

const defaultModuleConfigs: ModuleConfigs = {
  article: {
    name: "文章管理",
    description: "创作和编辑文章内容",
  },
  memory: {
    name: "记忆管理",
    description: "记录生活中的每一个精彩瞬间",
  },
  gallery: {
    name: "图集管理",
    description: "上传和管理图片资源",
  },
  video: {
    name: "视频管理",
    description: "上传和管理视频内容",
  },
  music: {
    name: "歌词管理",
    description: "收藏和管理音乐歌词",
  },
  scenes: {
    name: "场景配置",
    description: "管理场景图片和背景音乐",
  },
  activity: {
    name: "系统记录",
    description: "查看系统操作日志和活动记录",
  },
  settings: {
    name: "系统配置",
    description: "配置网站的基本信息和外观设置",
  },
};

const defaultPageConfigs: PageConfigs = {
  archive: {
    title: "归档",
    subtitle: "记录我的思考与感悟",
  },
  categories: {
    title: "分类",
    subtitle: "按分类浏览全部内容",
  },
  tags: {
    title: "标签云",
    subtitle: "探索文章的标签世界",
  },
  lyrics: {
    title: "歌词墙",
    subtitle: "那些打动我的旋律",
  },
  gallery: {
    title: "精选图集",
    subtitle: "记录生活中的美好瞬间",
  },
  scenes: {
    title: "场景",
    subtitle: "选择一个场景，放松心情",
  },
  about: {
    title: "关于我",
    subtitle: "了解更多关于这个网站和我",
  },
};

const defaultConfig: SiteConfig = {
  logo: "",
  title: "MianySoul",
  subtitle: "创作者的灵感空间",
  description: "一个专为创作者打造的内容管理平台，支持图片、视频、文章等多种内容形式的创作与管理。",
  copyright: "© 2024 MianySoul",
  icp: "",
  homeWallpaperLight: "",
  homeWallpaperDark: "",
  modules: JSON.parse(JSON.stringify(defaultModuleConfigs)),
  pages: JSON.parse(JSON.stringify(defaultPageConfigs)),
};

const deepClone = <T,>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

const form = reactive<SiteConfig>(deepClone(defaultConfig));
const originalValues = reactive<SiteConfig>(deepClone(defaultConfig));
const loading = ref(false);
const saving = ref(false);
const activeTab = ref("site");

const tabs = [
  { key: "site", name: "网站信息", icon: "🌐" },
  { key: "modules", name: "模块配置", icon: "📦" },
  { key: "pages", name: "页面配置", icon: "📄" },
];

const moduleList = {
  article: { label: "文章管理", icon: "📝", gradient: "gradient-primary" },
  memory: { label: "记忆管理", icon: "🧠", gradient: "gradient-danger" },
  gallery: { label: "图集管理", icon: "🖼️", gradient: "gradient-success" },
  video: { label: "视频管理", icon: "🎬", gradient: "gradient-warning" },
  music: { label: "歌词管理", icon: "🎵", gradient: "gradient-secondary" },
  scenes: { label: "场景配置", icon: "🌄", gradient: "gradient-info" },
  activity: { label: "系统记录", icon: "📊", gradient: "gradient-warning" },
  settings: { label: "系统配置", icon: "⚙️", gradient: "gradient-info" },
};

const pagesList = {
  archive: { label: "归档页面", icon: "📚", gradient: "gradient-primary" },
  categories: { label: "分类页面", icon: "📁", gradient: "gradient-success" },
  tags: { label: "标签页面", icon: "🏷️", gradient: "gradient-secondary" },
  lyrics: { label: "歌词页面", icon: "🎵", gradient: "gradient-warning" },
  gallery: { label: "图集页面", icon: "🖼️", gradient: "gradient-info" },
  scenes: { label: "场景页面", icon: "🌄", gradient: "gradient-danger" },
  about: { label: "关于页面", icon: "👤", gradient: "gradient-primary" },
};

const moduleNames = computed(() => form.modules);

const deepMerge = (target: any, source: any) => {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
};

const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null)
    return false;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  return true;
};

const loadConfig = async () => {
  loading.value = true;
  try {
    const data = await http.get<SiteConfig>("/config");
    const merged = deepMerge(defaultConfig, data || {});
    const cloned = deepClone(merged);
    Object.assign(form, cloned);
    form.modules = deepClone(cloned.modules);
    form.pages = deepClone(cloned.pages);
    Object.assign(originalValues, deepClone(merged));
    originalValues.modules = deepClone(cloned.modules);
    originalValues.pages = deepClone(cloned.pages);
  } catch (err: any) {
    const cloned = deepClone(defaultConfig);
    Object.assign(form, cloned);
    form.modules = deepClone(cloned.modules);
    form.pages = deepClone(cloned.pages);
    Object.assign(originalValues, deepClone(defaultConfig));
    originalValues.modules = deepClone(cloned.modules);
    originalValues.pages = deepClone(cloned.pages);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadConfig();
});

interface Image {
  id: string;
  url: string;
  filename: string;
  group?: { id: string; name: string; icon: string };
}

interface ImageGroup {
  id: string;
  name: string;
  icon: string;
  isDefault?: boolean;
}

const showImagePicker = ref(false);
const images = ref<Image[]>([]);
const imageGroups = ref<ImageGroup[]>([]);
const selectedGroupId = ref<string | null>(null);
const selectedWallpaperType = ref<"light" | "dark">("light");
const selectedWallpaper = ref("");

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
};

const filteredImages = computed(() => {
  if (!selectedGroupId.value) {
    return [];
  }
  return images.value.filter((img) => img.group?.id === selectedGroupId.value);
});

const fetchImages = async () => {
  try {
    images.value = await http.get<Image[]>("/gallery/images");
    imageGroups.value = await http.get<ImageGroup[]>("/gallery/groups");
    const defaultGroup = imageGroups.value.find((g) => g.name === "默认分组");
    selectedGroupId.value = defaultGroup?.id || null;
  } catch (e) {
    images.value = [];
    imageGroups.value = [];
    selectedGroupId.value = null;
  }
};

const openImagePicker = (type: "light" | "dark") => {
  selectedWallpaperType.value = type;
  selectedWallpaper.value = type === "light" ? form.homeWallpaperLight : form.homeWallpaperDark;
  fetchImages();
  showImagePicker.value = true;
};

const selectImage = (img: Image) => {
  if (selectedWallpaperType.value === "light") {
    form.homeWallpaperLight = img.url;
  } else {
    form.homeWallpaperDark = img.url;
  }
  showImagePicker.value = false;
};

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      form.logo = e.target?.result as string;
      success("Logo 上传成功");
    };
    reader.readAsDataURL(file);
  }
};

const removeLogo = () => {
  form.logo = "";
  success("Logo 已移除");
};

const saveAll = async () => {
  const hasChanges = !deepEqual(form, originalValues);

  if (!hasChanges) {
    info("没有需要保存的更改");
    return;
  }

  saving.value = true;
  try {
    const data = await http.put<SiteConfig>("/config", form);
    const merged = deepMerge(defaultConfig, data || {});
    const cloned = deepClone(merged);
    Object.assign(originalValues, cloned);
    originalValues.modules = deepClone(cloned.modules);
    originalValues.pages = deepClone(cloned.pages);
    await refreshConfig();
    success("配置保存成功");
  } catch (err: any) {
    error(err.message || "保存失败");
  } finally {
    saving.value = false;
  }
};
</script>
