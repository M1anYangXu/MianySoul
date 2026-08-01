<script setup lang="ts">
import { computed, ref, watch, onErrorCaptured } from "vue";
import { IconPark } from "@icon-park/vue-next/es/all";
import { resolveIconParkType } from "@/composables/useIcon";

const props = defineProps<{
  name: string;
  size?: string | number;
  class?: string;
  style?: Record<string, any>;
}>();

const iconParkType = computed(() => resolveIconParkType(props.name || ""));
const hasError = ref(false);

// 当图标名称变化时重置错误状态
watch(
  () => props.name,
  () => {
    hasError.value = false;
  }
);

// 捕获 IconPark 组件抛出的错误（如无效图标名）
// 返回 false 阻止错误向上传播，避免整个页面渲染失败
onErrorCaptured((err) => {
  console.warn("[DynamicIcon] 图标渲染失败，使用默认图标:", props.name, err.message);
  hasError.value = true;
  return false;
});
</script>

<template>
  <IconPark
    v-if="!hasError"
    :type="iconParkType"
    :size="size || 24"
    :class="$props.class"
    :style="style"
  />
  <!-- 错误兜底：显示一个简单的占位方块 -->
  <span
    v-else
    :class="$props.class"
    :style="style"
    style="display: inline-flex; align-items: center; justify-content: center"
  >
    <IconPark type="Pic" :size="size || 24" />
  </span>
</template>
