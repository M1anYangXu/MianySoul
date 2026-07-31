import { ref, computed } from "vue";
import { http } from "@/utils/request";
import {
  type ModuleConfig,
  type ModuleConfigs,
  type ModuleKey,
  type PageConfig,
  type PageConfigs,
  type PageKey,
  type SiteConfig,
  defaultModuleConfigs,
  defaultPageConfigs,
  getDefaultSiteConfig,
} from "@miany-soul/shared";

export type { ModuleConfig, ModuleConfigs, ModuleKey, PageConfig, PageConfigs, PageKey, SiteConfig };

const configCache = ref<SiteConfig | null>(null);
const configLoading = ref(false);

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
      return configCache.value || getDefaultSiteConfig();
    }

    if (configCache.value && !force) {
      return configCache.value;
    }

    configLoading.value = true;
    try {
      const data = await http.get<SiteConfig>("/config");
      const merged = { ...getDefaultSiteConfig(), ...data };
      merged.modules = { ...defaultModuleConfigs, ...data?.modules };
      merged.pages = { ...defaultPageConfigs, ...data?.pages };
      configCache.value = merged;
      return merged;
    } catch {
      const defaultConfig = getDefaultSiteConfig();
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
    return configCache.value || getDefaultSiteConfig();
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
