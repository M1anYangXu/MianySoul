<template>
  <div class="max-w-2xl mx-auto">
    <div
      class="mb-8 px-6 py-4 rounded-xl"
      :class="
        isDark
          ? 'bg-gray-800/40 border border-gray-700/30'
          : 'bg-white/40 border border-gray-200/30'
      "
      style="backdrop-filter: blur(12px)"
    >
      <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
        ⚙️ 系统配置
      </h1>
      <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
        配置网站的基本信息和外观设置
      </p>
    </div>

    <div
      class="rounded-2xl border p-6 mb-6 transition-all duration-300 hover:shadow-lg"
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
      class="rounded-2xl border p-6 mb-6 transition-all duration-300 hover:shadow-lg"
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
      class="rounded-2xl border p-6 mb-6 transition-all duration-300 hover:shadow-lg"
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

    <div class="flex justify-end">
      <button
        class="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        :disabled="saving"
        @click="saveAll"
      >
        {{ saving ? "保存中..." : "保存更改" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref } from "vue";
import { useAppStore } from "@/stores/app";
import { useMessage } from "@/composables/useMessage";
import { http } from "@/utils/request";

const appStore = useAppStore();
const { success, error, info } = useMessage();

const isDark = computed(() => appStore.themeMode === "dark");

interface SiteConfig {
  logo: string;
  title: string;
  subtitle: string;
  description: string;
  copyright: string;
  icp: string;
}

const defaultConfig: SiteConfig = {
  logo: "",
  title: "MianySoul",
  subtitle: "创作者的灵感空间",
  description: "一个专为创作者打造的内容管理平台，支持图片、视频、文章等多种内容形式的创作与管理。",
  copyright: "© 2024 MianySoul",
  icp: "",
};

const form = reactive<SiteConfig>({ ...defaultConfig });
const originalValues = reactive<SiteConfig>({ ...defaultConfig });
const loading = ref(false);
const saving = ref(false);

const loadConfig = async () => {
  loading.value = true;
  try {
    const data = await http.get<SiteConfig>("/config");
    const merged = { ...defaultConfig, ...(data || {}) };
    Object.assign(form, merged);
    Object.assign(originalValues, merged);
  } catch (err: any) {
    Object.assign(form, defaultConfig);
    Object.assign(originalValues, defaultConfig);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadConfig();
});

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
  const hasChanges =
    form.logo !== originalValues.logo ||
    form.title !== originalValues.title ||
    form.subtitle !== originalValues.subtitle ||
    form.description !== originalValues.description ||
    form.copyright !== originalValues.copyright ||
    form.icp !== originalValues.icp;

  if (!hasChanges) {
    info("没有需要保存的更改");
    return;
  }

  saving.value = true;
  try {
    const data = await http.put<SiteConfig>("/config", form);
    Object.assign(originalValues, data);
    success("配置保存成功");
  } catch (err: any) {
    error(err.message || "保存失败");
  } finally {
    saving.value = false;
  }
};
</script>
