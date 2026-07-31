<script setup lang="ts">
import { computed } from "vue";
import { IconPark } from "@icon-park/vue-next/es/all";
import { resolveIconParkType } from "@/composables/useIcon";

const props = defineProps<{
  name: string;
  size?: string | number;
  class?: string;
  style?: Record<string, any>;
}>();

const iconParkType = computed(() => resolveIconParkType(props.name || ""));
</script>

<template>
  <IconPark :type="iconParkType" :size="size || 24" :class="$props.class" :style="style" />
</template>
