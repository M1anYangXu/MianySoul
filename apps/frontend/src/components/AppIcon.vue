<script setup lang="ts">
import { computed } from "vue";
import { IconPark } from "@icon-park/vue-next/es/all";
import { resolveIconParkType, isEmoji } from "@/composables/useIcon";

const {
  icon,
  size,
  class: iconClass,
} = defineProps<{
  icon: string;
  size?: string | number;
  class?: string;
}>();

const showEmoji = computed(() => isEmoji(icon));
const iconParkType = computed(() => resolveIconParkType(icon));

const fontSize = computed(() => {
  if (!size) return undefined;
  return typeof size === "number" ? `${size}px` : size;
});
</script>

<template>
  <IconPark v-if="!showEmoji" :type="iconParkType" :size="size || 16" :class="iconClass" />
  <span v-else :class="iconClass" :style="{ fontSize }">
    {{ icon }}
  </span>
</template>
