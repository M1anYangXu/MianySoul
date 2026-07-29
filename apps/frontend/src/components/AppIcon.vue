<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { isIconifyFormat } from "@/composables/useIcon";

const {
  icon,
  size,
  class: iconClass,
} = defineProps<{
  icon: string;
  size?: string | number;
  class?: string;
}>();
</script>

<template>
  <!-- Iconify 格式图标 -->
  <Icon v-if="isIconifyFormat(icon)" :icon="icon" :width="size" :height="size" :class="iconClass" />
  <!-- 旧 emoji 格式，直接显示文本 -->
  <span v-else :class="iconClass" :style="{ fontSize: size ? size + 'px' : undefined }">
    {{ icon }}
  </span>
</template>
