import { ref, computed } from "vue";
import { http } from "@/utils/request";

export interface ModuleConfig {
  name: string;
  description: string;
}

export interface ModuleConfigs {
  article: ModuleConfig;
  memory: ModuleConfig;
  gallery: ModuleConfig;
  video: ModuleConfig;
  audio: ModuleConfig;
  music: ModuleConfig;
  settings: ModuleConfig;
  siteinfo: ModuleConfig;
  narrative: ModuleConfig;
  users: ModuleConfig;
  [key: string]: ModuleConfig;
}

export type ModuleKey = keyof ModuleConfigs;

export interface PageConfig {
  title: string;
  subtitle: string;
}

export interface PageConfigs {
  archive: PageConfig;
  categories: PageConfig;
  lyrics: PageConfig;
  gallery: PageConfig;
  about: PageConfig;
  memory: PageConfig;
}

export type PageKey = keyof PageConfigs;

interface SiteConfig {
  logo: string;
  title: string;
  subtitle: string;
  description: string;
  copyright: string;
  icp: string;
  modules: ModuleConfigs;
  pages: PageConfigs;
  homeWallpaperLight: string;
  homeWallpaperDark: string;
  lightThemeColor: string;
  darkThemeColor: string;
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
  audio: {
    name: "音频",
    description: "上传和管理音频文件",
  },
  narrative: {
    name: "叙述",
    description: "记录过去的故事，上传图片或视频并编写描述",
  },
  music: {
    name: "音乐",
    description: "收藏和管理音乐歌词",
  },
  settings: {
    name: "系统配置",
    description: "配置后台模块和前台页面信息",
  },
  siteinfo: {
    name: "网站信息",
    description: "配置网站基本信息和外观设置",
  },
  users: {
    name: "用户",
    description: "管理网站用户账号",
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
  about: {
    title: "关于我",
    subtitle: "了解更多关于这个网站和我",
  },
  memory: {
    title: "记忆",
    subtitle: "记录生活中的每一个精彩瞬间",
  },
};

const configCache = ref<SiteConfig | null>(null);
const configLoading = ref(false);

const getDefaultConfig = (): SiteConfig => ({
  logo: "",
  title: "MianySoul",
  subtitle: "创作者的灵感空间",
  description: "一个专为创作者打造的内容管理平台，支持图片、视频、文章等多种内容形式的创作与管理。",
  copyright: "© 2024 MianySoul",
  icp: "",
  modules: { ...defaultModuleConfigs },
  pages: { ...defaultPageConfigs },
  homeWallpaperLight: "",
  homeWallpaperDark: "",
  lightThemeColor: "#14b8a6",
  darkThemeColor: "#d946ef",
});

export const useModuleConfig = () => {
  const moduleNames = computed(() => {
    return configCache.value?.modules || defaultModuleConfigs;
  });

  const pageConfigs = computed(() => {
    return configCache.value?.pages || defaultPageConfigs;
  });

  const getModuleName = (key: keyof ModuleConfigs): string => {
    return moduleNames.value[key]?.name || defaultModuleConfigs[key].name;
  };

  const getModuleDescription = (key: keyof ModuleConfigs): string => {
    return moduleNames.value[key]?.description || defaultModuleConfigs[key].description;
  };

  const getPageConfig = (key: keyof PageConfigs): PageConfig => {
    return pageConfigs.value[key] || defaultPageConfigs[key];
  };

  const getPageTitle = (key: keyof PageConfigs): string => {
    return getPageConfig(key).title;
  };

  const getPageSubtitle = (key: keyof PageConfigs): string => {
    return getPageConfig(key).subtitle;
  };

  const loadConfig = async (force = false): Promise<SiteConfig> => {
    if (configLoading.value && !configCache.value && !force) {
      await new Promise((resolve) => {
        const check = setInterval(() => {
          if (!configLoading.value || configCache.value) {
            clearInterval(check);
            resolve(null);
          }
        }, 50);
      });
      return configCache.value || getDefaultConfig();
    }

    if (configCache.value && !force) {
      return configCache.value;
    }

    configLoading.value = true;
    try {
      const data = await http.get<SiteConfig>("/config");
      const merged = { ...getDefaultConfig(), ...data };
      merged.modules = { ...defaultModuleConfigs, ...data?.modules };
      merged.pages = { ...defaultPageConfigs, ...data?.pages };
      configCache.value = merged;
      return merged;
    } catch {
      const defaultConfig = getDefaultConfig();
      configCache.value = defaultConfig;
      return defaultConfig;
    } finally {
      configLoading.value = false;
    }
  };

  const refreshConfig = async () => {
    configCache.value = null;
    return await loadConfig();
  };

  const getConfig = (): SiteConfig => {
    return configCache.value || getDefaultConfig();
  };

  return {
    moduleNames,
    getModuleName,
    getModuleDescription,
    pageConfigs,
    configCache,
    getPageConfig,
    getPageTitle,
    getPageSubtitle,
    loadConfig,
    refreshConfig,
    getConfig,
    configLoading,
  };
};
