<template>
  <div class="settings-page w-full overflow-x-hidden admin-root" :data-admin-module="'settings'">
    <div class="admin-page-header">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            <IconPark type="Setting" :size="28" class="inline mr-2" />
            系统配置
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            配置后台模块和前台页面的标题与描述
          </p>
        </div>
      </div>
    </div>

    <div class="flex space-x-2 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="admin-tab"
        :class="{ 'admin-tab-active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <span class="flex items-center gap-2">
          <IconPark :type="tab.icon" :size="16" />
          <span>{{ tab.name }}</span>
        </span>
      </button>
    </div>

    <div v-if="activeTab === 'modules'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(module, key) in moduleList" :key="key" class="admin-card p-4">
          <div class="flex items-center gap-2 mb-3">
            <span
              class="w-6 h-6 rounded-md flex items-center justify-center text-white"
              :class="module.color"
            >
              <component :is="module.icon" class="w-3 h-3" />
            </span>
            <span class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              {{ getModuleConfig(key).name }}
            </span>
          </div>
          <div class="space-y-3">
            <input
              v-model="(form.modules as Record<string, ModuleConfig>)[key].name"
              type="text"
              placeholder="模块名称"
              class="admin-input"
            />
            <input
              v-model="(form.modules as Record<string, ModuleConfig>)[key].description"
              type="text"
              placeholder="描述信息"
              class="admin-input"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'pages'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(page, key) in pagesList" :key="key" class="admin-card p-4">
          <div class="flex items-center gap-2 mb-3">
            <span
              class="w-6 h-6 rounded-md flex items-center justify-center text-white"
              :class="page.color"
            >
              <IconPark :type="page.icon" :size="12" />
            </span>
            <span class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              {{ page.label }}
            </span>
          </div>
          <div class="space-y-3">
            <input
              v-model="(form.pages as Record<string, PageConfig>)[key].title"
              type="text"
              placeholder="页面标题"
              class="admin-input"
            />
            <input
              v-model="(form.pages as Record<string, PageConfig>)[key].subtitle"
              type="text"
              placeholder="页面副标题"
              class="admin-input"
            />
          </div>
        </div>
      </div>
    </div>

    <StickyBar :has-changes="hasChanges" :saving="saving" @save="saveAll" @reset="resetForm" />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref } from "vue";
import { useAppStore } from "@/stores/app";
import { useMessage, useModuleConfig } from "@/composables";
import { http } from "@/utils/request";
import { IconPark } from "@icon-park/vue-next/es/all";
import StickyBar from "@/components/StickyBar.vue";

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
  audio: ModuleConfig;
  users: ModuleConfig;
  settings: ModuleConfig;
  siteinfo: ModuleConfig;
  [key: string]: ModuleConfig;
}

interface PageConfig {
  title: string;
  subtitle: string;
}

interface PageConfigs {
  archive: PageConfig;
  categories: PageConfig;
  lyrics: PageConfig;
  gallery: PageConfig;
  about: PageConfig;
  memory: PageConfig;
  [key: string]: PageConfig;
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
  lightThemeColor: string;
  darkThemeColor: string;
  modules: ModuleConfigs;
  pages: PageConfigs;
}

const defaultModuleConfigs: ModuleConfigs = {
  article: {
    name: "漫想",
    description: "记录突发奇想、宇宙思考、社会发展等各种小思考",
  },
  memory: {
    name: "记忆",
    description: "记录生活中的每一个精彩瞬间",
  },
  gallery: {
    name: "图集",
    description: "上传和管理图片资源",
  },
  video: {
    name: "视频",
    description: "上传和管理视频内容",
  },
  music: {
    name: "音乐",
    description: "收藏和管理音乐歌词",
  },
  audio: {
    name: "音频",
    description: "上传和管理音频文件",
  },
  narrative: {
    name: "叙述",
    description: "记录过去的故事，上传图片或视频并编写描述",
  },
  users: {
    name: "用户",
    description: "管理网站用户账号",
  },
  settings: {
    name: "系统配置",
    description: "配置后台模块和前台页面信息",
  },
  siteinfo: {
    name: "网站信息",
    description: "配置网站基本信息和外观设置",
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
  lyrics: {
    title: "歌词墙",
    subtitle: "那些打动我的旋律",
  },
  gallery: {
    title: "精选图集",
    subtitle: "记录生活中的美好瞬间",
  },
  narrative: {
    title: "往事叙述",
    subtitle: "每一张照片，都是一段故事的开始",
  },
  about: {
    title: "关于我",
    subtitle: "了解更多关于这个网站和我",
  },
  memory: {
    title: "记忆",
    subtitle: "记录生活中的每一个精彩瞬间",
  },
};

const defaultConfig: SiteConfig = {
  logo: "",
  title: "MianySoul",
  subtitle: "创作者的灵感空间",
  description: "一个专为创作者打造的内容管理平台，支持图片、视频、文章等多种内容形式的创作与管理。",
  copyright: "© 2024 MianySoul",
  icp: "",
  startTime: "",
  homeWallpaperLight: "",
  homeWallpaperDark: "",
  lightThemeColor: "#14b8a6",
  darkThemeColor: "#d946ef",
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
const activeTab = ref("modules");

const hasChanges = computed(() => {
  return JSON.stringify(form) !== JSON.stringify(originalValues);
});

const resetForm = () => {
  Object.assign(form, deepClone(originalValues));
  form.modules = deepClone(originalValues.modules);
  form.pages = deepClone(originalValues.pages);
};

const tabs = [
  { key: "modules", name: "后台配置", icon: "Tool" },
  { key: "pages", name: "前台配置", icon: "Globe" },
];

const moduleList: Record<keyof ModuleConfigs, { label: string; icon: any; color: string }> = {
  article: { label: "漫想", icon: "Tips", color: "bg-orange-500" },
  memory: { label: "记忆", icon: "Like", color: "bg-red-500" },
  gallery: { label: "图集", icon: "Pic", color: "bg-green-500" },
  video: { label: "视频", icon: "Video", color: "bg-orange-500" },
  music: { label: "音乐", icon: "Music", color: "bg-blue-500" },
  audio: { label: "音频", icon: "Music", color: "bg-blue-500" },
  narrative: { label: "叙述", icon: "Book", color: "bg-blue-500" },
  users: { label: "用户", icon: "People", color: "bg-green-500" },
  settings: { label: "系统配置", icon: "Setting", color: "bg-cyan-500" },
  siteinfo: { label: "网站信息", icon: "Globe", color: "bg-blue-500" },
};

const getModuleConfig = (key: string) => {
  return (form.modules as Record<string, ModuleConfig>)[key];
};

const pagesList: Record<keyof PageConfigs, { label: string; icon: any; color: string }> = {
  archive: { label: "归档页面", icon: "Box", color: "bg-blue-500" },
  categories: { label: "分类页面", icon: "Tag", color: "bg-green-500" },

  lyrics: { label: "歌词页面", icon: "Music", color: "bg-orange-500" },
  gallery: { label: "图集页面", icon: "Pic", color: "bg-cyan-500" },
  narrative: { label: "叙述页面", icon: "Book", color: "bg-blue-500" },
  about: { label: "关于页面", icon: "Book", color: "bg-blue-500" },
  memory: { label: "记忆页面", icon: "Like", color: "bg-red-500" },
};

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
