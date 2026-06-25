<template>
  <div class="max-w-2xl mx-auto px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
          ⚙️ 系统配置
        </h1>
        <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          配置网站的基本信息和外观设置
        </p>
      </div>
    </div>

    <!-- 网站 Logo 设置 -->
    <div
      class="rounded-xl border shadow-sm p-6 mb-6"
      :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <h2
        class="text-lg font-semibold mb-4 flex items-center space-x-2"
        :class="isDark ? 'text-white' : 'text-black'"
      >
        <span
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm"
        >
          🖼️
        </span>
        <span>网站 Logo</span>
      </h2>
      <div class="flex items-center space-x-6">
        <div class="relative">
          <div
            class="w-20 h-20 rounded-xl overflow-hidden border-2 shadow-md bg-gradient-to-br from-cyan-400 to-blue-500"
            :class="isDark ? 'border-gray-600' : 'border-gray-200'"
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
            class="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
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
            class="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            @click="removeLogo"
          >
            移除 Logo
          </button>
        </div>
      </div>
    </div>

    <!-- 网站信息 -->
    <div
      class="rounded-xl border shadow-sm p-6 mb-6"
      :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <h2
        class="text-lg font-semibold mb-4 flex items-center space-x-2"
        :class="isDark ? 'text-white' : 'text-black'"
      >
        <span
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm"
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
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                : 'border-gray-200 bg-white text-black placeholder-gray-400'
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
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                : 'border-gray-200 bg-white text-black placeholder-gray-400'
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
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 resize-none"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                : 'border-gray-200 bg-white text-black placeholder-gray-400'
            "
          ></textarea>
        </div>
      </div>
    </div>

    <!-- 页脚信息 -->
    <div
      class="rounded-xl border shadow-sm p-6 mb-6"
      :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <h2
        class="text-lg font-semibold mb-4 flex items-center space-x-2"
        :class="isDark ? 'text-white' : 'text-black'"
      >
        <span
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm"
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
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                : 'border-gray-200 bg-white text-black placeholder-gray-400'
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
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                : 'border-gray-200 bg-white text-black placeholder-gray-400'
            "
          />
        </div>
      </div>
    </div>

    <!-- 保存按钮 -->
    <div class="flex justify-end space-x-4">
      <button
        class="px-6 py-2.5 border rounded-xl font-medium transition-colors"
        :class="
          isDark
            ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        "
        @click="resetForm"
      >
        重置
      </button>
      <button
        class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        @click="saveAll"
      >
        保存更改
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
    // 如果后端返回空对象，保留默认值
    const merged = { ...defaultConfig, ...(data || {}) };
    Object.assign(form, merged);
    Object.assign(originalValues, merged);
  } catch (err: any) {
    // API 失败时保留默认值，不报错
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

const resetForm = () => {
  form.logo = originalValues.logo;
  form.title = originalValues.title;
  form.subtitle = originalValues.subtitle;
  form.description = originalValues.description;
  form.copyright = originalValues.copyright;
  form.icp = originalValues.icp;
  info("已重置表单");
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
