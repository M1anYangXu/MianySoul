<template>
  <Transition name="slide-up">
    <div
      v-if="hasChanges"
      class="fixed bottom-0 left-0 right-0 z-50 px-4 py-4"
      :class="
        isDark ? 'bg-gray-900/95 border-t border-gray-800' : 'bg-white/95 border-t border-gray-200'
      "
      style="backdrop-filter: blur(12px)"
    >
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          <span class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            有未保存的更改
          </span>
        </div>
        <div class="flex items-center gap-3">
          <button
            class="px-4 py-2 rounded-xl font-medium transition-all duration-300"
            :class="
              isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            @click="$emit('reset')"
          >
            重置
          </button>
          <button
            class="px-6 py-2 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg"
            :disabled="saving"
            @click="$emit('save')"
          >
            <span v-if="saving" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              保存中...
            </span>
            <span v-else>保存更改</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAppStore } from "@/stores/app";

defineProps<{
  hasChanges: boolean;
  saving?: boolean;
}>();

defineEmits<{
  save: [];
  reset: [];
}>();

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
