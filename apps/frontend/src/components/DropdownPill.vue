<template>
  <div class="relative">
    <button
      ref="buttonRef"
      class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2"
      :class="[
        selectedOption
          ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30'
          : isDark
            ? 'bg-white/10 text-gray-300 hover:bg-white/20'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
      ]"
      @click="toggleDropdown"
    >
      {{ selectedOption ? selectedOption.label : placeholder }}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute top-full left-0 mt-2 w-40 rounded-xl shadow-xl overflow-hidden z-50"
        :class="
          isDark
            ? 'bg-gray-800/95 backdrop-blur-sm border border-white/10'
            : 'bg-white border border-gray-100'
        "
      >
        <div
          v-for="option in options"
          :key="option.value"
          class="px-4 py-2.5 text-sm cursor-pointer transition-all duration-200"
          :class="[
            selectedOption?.value === option.value
              ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-400'
              : isDark
                ? 'text-gray-300 hover:bg-white/10'
                : 'text-gray-700 hover:bg-gray-50',
          ]"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useAppStore } from "@/stores";

const props = defineProps<{
  modelValue: string | null;
  options: { value: string; label: string }[];
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void;
}>();

const appStore = useAppStore();
const isDark = ref(appStore.themeMode === "dark");

watch(
  () => appStore.themeMode,
  (newMode) => {
    isDark.value = newMode === "dark";
  }
);

const isOpen = ref(false);
const buttonRef = ref<HTMLButtonElement | null>(null);

const selectedOption = ref<{ value: string; label: string } | null>(null);

watch(
  () => props.modelValue,
  (newValue) => {
    selectedOption.value = props.options.find((o) => o.value === newValue) || null;
  },
  { immediate: true }
);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option: { value: string; label: string }) => {
  selectedOption.value = option;
  emit("update:modelValue", option.value);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (buttonRef.value && !buttonRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
