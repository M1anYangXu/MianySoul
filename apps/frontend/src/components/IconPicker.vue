<script setup lang="ts">
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";
import { iconPresets, getIconDisplayName } from "@/composables/useIcon";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const searchQuery = ref("");

const filteredPresets = computed(() => {
  if (!searchQuery.value) {
    return iconPresets;
  }
  const query = searchQuery.value.toLowerCase();
  return iconPresets.filter((icon) => icon.toLowerCase().includes(query));
});

const selectIcon = (iconName: string) => {
  localValue.value = iconName;
  searchQuery.value = "";
};

const handleInput = () => {
  // 用户直接输入图标名时自动格式化
  let val = searchQuery.value.trim();
  if (val) {
    if (!val.includes(":")) {
      val = `mdi:${val}`;
    }
    localValue.value = val;
  }
};

const onInputKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleInput();
  }
};

const previewIcon = computed(() => {
  if (searchQuery.value) {
    let val = searchQuery.value.trim();
    if (!val.includes(":")) {
      val = `mdi:${val}`;
    }
    return val;
  }
  return localValue.value;
});

const isDark = computed(() => {
  if (typeof document !== "undefined") {
    return document.documentElement.classList.contains("dark");
  }
  return false;
});
</script>

<template>
  <div class="icon-picker">
    <!-- 当前选中图标预览 -->
    <div
      v-if="localValue"
      class="mb-3 flex items-center gap-2 p-2 rounded-lg border"
      :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'"
    >
      <Icon :icon="localValue" class="w-5 h-5" />
      <span class="text-sm font-mono" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
        {{ getIconDisplayName(localValue) }}
      </span>
      <button class="ml-auto text-xs text-red-500 hover:text-red-700" @click="localValue = ''">
        清除
      </button>
    </div>

    <!-- 搜索/输入框 -->
    <div class="mb-3">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder || '搜索或输入图标名 (如 folder, mdi:star)'"
        class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 text-sm"
        :class="
          isDark
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
            : 'bg-white border-gray-300'
        "
        @keydown="onInputKeydown"
      />
      <div
        v-if="previewIcon && searchQuery"
        class="mt-2 flex items-center gap-2 text-xs"
        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
      >
        <span>预览:</span>
        <Icon :icon="previewIcon" class="w-4 h-4" />
        <span class="font-mono">{{ previewIcon }}</span>
        <button
          class="px-2 py-0.5 rounded border text-xs hover:bg-gray-100 dark:hover:bg-gray-600"
          @click="handleInput"
        >
          使用
        </button>
      </div>
    </div>

    <!-- 图标预设网格 -->
    <div class="icon-grid">
      <div
        v-for="icon in filteredPresets"
        :key="icon"
        class="icon-item"
        :class="{ active: localValue === icon }"
        :title="icon"
        @click="selectIcon(icon)"
      >
        <Icon :icon="icon" class="w-5 h-5" />
      </div>
    </div>

    <div
      v-if="filteredPresets.length === 0"
      class="text-center py-3 text-xs"
      :class="isDark ? 'text-gray-500' : 'text-gray-400'"
    >
      没有匹配的图标，您可以直接输入图标名
    </div>
  </div>
</template>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(36px, 1fr));
  gap: 6px;
  max-height: 160px;
  overflow-y: auto;
  padding: 4px;
}

.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.icon-item:hover {
  background-color: rgba(139, 92, 246, 0.1);
}

.icon-item.active {
  background-color: rgba(139, 92, 246, 0.2);
  border: 1px solid rgb(139, 92, 246);
}

.dark .icon-item:hover {
  background-color: rgba(139, 92, 246, 0.2);
}

.dark .icon-item.active {
  background-color: rgba(139, 92, 246, 0.3);
}
</style>
