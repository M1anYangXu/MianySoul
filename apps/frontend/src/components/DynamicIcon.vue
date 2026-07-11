<script setup lang="ts">
import { computed, markRaw } from "vue";
import * as LucideIcons from "lucide-vue-next";

const props = defineProps<{
  name: string;
}>();

const iconComponent = computed(() => {
  const pascalName = props.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  const icon = (LucideIcons as Record<string, any>)[pascalName];
  return icon ? markRaw(icon) : null;
});
</script>

<template>
  <component :is="iconComponent" v-if="iconComponent" />
</template>
