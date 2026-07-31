<script setup lang="ts">
import { ref, computed } from "vue";
import { IconPark } from "@icon-park/vue-next/es/all";
import { iconPresets, resolveIconParkType, getIconDisplayName } from "@/composables/useIcon";

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
  return iconPresets.filter(
    (icon) => icon.type.toLowerCase().includes(query) || icon.label.toLowerCase().includes(query)
  );
});

const selectIcon = (iconType: string) => {
  localValue.value = iconType;
  searchQuery.value = "";
};

const previewType = computed(() => {
  if (searchQuery.value) {
    // 用户输入时尝试匹配预设
    const matched = iconPresets.find(
      (p) => p.type.toLowerCase() === searchQuery.value.trim().toLowerCase()
    );
    if (matched) return matched.type;
  }
  return resolveIconParkType(localValue.value);
});
</script>

<template>
  <div class="icon-picker">
    <!-- 当前选中图标预览 -->
    <div
      v-if="localValue"
      class="mb-3 flex items-center gap-2 p-2 rounded-md border bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
    >
      <IconPark :type="previewType" :size="18" />
      <span class="text-sm font-mono text-gray-600 dark:text-gray-300">
        {{ getIconDisplayName(localValue) }}
      </span>
      <button
        class="ml-auto text-xs text-danger-500 hover:text-danger-600"
        @click="localValue = ''"
      >
        清除
      </button>
    </div>

    <!-- 搜索框 -->
    <div class="mb-3">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder || '搜索图标（中英文均可）'"
        class="w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        @keydown.enter="selectIcon(searchQuery.trim())"
      />
    </div>

    <!-- 图标预设网格 -->
    <div class="icon-grid">
      <div
        v-for="icon in filteredPresets"
        :key="icon.type"
        class="icon-item"
        :class="{ active: resolveIconParkType(localValue) === icon.type }"
        :title="`${icon.type} - ${icon.label}`"
        @click="selectIcon(icon.type)"
      >
        <IconPark :type="icon.type" :size="18" />
      </div>
    </div>

    <div
      v-if="filteredPresets.length === 0"
      class="text-center py-3 text-xs text-gray-400 dark:text-gray-500"
    >
      没有匹配的图标
    </div>
  </div>
</template>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(36px, 1fr));
  gap: 6px;
  max-height: 120px;
  overflow-y: auto;
  padding: 4px;
}

.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #4b5563;
}

.dark .icon-item {
  color: #d1d5db;
}

.icon-item:hover {
  background-color: rgba(22, 93, 255, 0.1);
}

.icon-item.active {
  background-color: rgba(22, 93, 255, 0.15);
  border: 1px solid #165dff;
}

.dark .icon-item:hover {
  background-color: rgba(22, 93, 255, 0.2);
}

.dark .icon-item.active {
  background-color: rgba(22, 93, 255, 0.3);
}
</style>
