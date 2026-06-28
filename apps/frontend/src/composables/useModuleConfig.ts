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
  music: ModuleConfig;
  settings: ModuleConfig;
}

export type ModuleKey = keyof ModuleConfigs;

interface SiteConfig {
  logo: string;
  title: string;
  subtitle: string;
  description: string;
  copyright: string;
  icp: string;
  modules: ModuleConfigs;
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
  settings: {
    name: "系统配置",
    description: "配置网站的基本信息和外观设置",
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
});

export const useModuleConfig = () => {
  const moduleNames = computed(() => {
    return configCache.value?.modules || defaultModuleConfigs;
  });

  const getModuleName = (key: keyof ModuleConfigs): string => {
    return moduleNames.value[key]?.name || defaultModuleConfigs[key].name;
  };

  const getModuleDescription = (key: keyof ModuleConfigs): string => {
    return moduleNames.value[key]?.description || defaultModuleConfigs[key].description;
  };

  const loadConfig = async (): Promise<SiteConfig> => {
    if (configLoading.value && !configCache.value) {
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

    if (configCache.value) {
      return configCache.value;
    }

    configLoading.value = true;
    try {
      const data = await http.get<SiteConfig>("/config");
      const merged = { ...getDefaultConfig(), ...data };
      merged.modules = { ...defaultModuleConfigs, ...data?.modules };
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
    loadConfig,
    refreshConfig,
    getConfig,
    configLoading,
  };
};
