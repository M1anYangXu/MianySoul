<template>
  <Transition name="arco-mask">
    <div
      v-if="dialogs.length > 0"
      class="fixed inset-0 z-[3000] bg-black/45 backdrop-blur-sm flex items-center justify-center px-4"
      @click.self="onCancel(dialogs[0])"
    >
      <Transition name="arco-modal" appear>
        <div
          v-if="dialogs[0]"
          :key="dialogs[0].id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        >
          <div class="flex items-start gap-3 px-6 pt-6 pb-2">
            <div
              class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
              :class="iconWrapClass(dialogs[0].type)"
            >
              <IconPark
                :type="iconType(dialogs[0].type)"
                size="16"
                :fill="iconColor(dialogs[0].type)"
                theme="outline"
              />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {{ dialogs[0].title || defaultTitle(dialogs[0].type) }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ dialogs[0].content }}
              </p>
            </div>
          </div>
          <div class="flex justify-end gap-2 px-6 py-4 bg-gray-50 dark:bg-gray-900/40">
            <button
              v-if="dialogs[0].negativeText !== null"
              class="px-4 py-1.5 text-sm rounded-md font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              @click="onCancel(dialogs[0])"
            >
              {{ dialogs[0].negativeText || "取消" }}
            </button>
            <button
              class="px-4 py-1.5 text-sm rounded-md font-medium text-white transition-colors"
              :class="
                dialogs[0].danger
                  ? 'bg-danger-500 hover:bg-danger-600'
                  : 'bg-primary-500 hover:bg-primary-600'
              "
              @click="onConfirm(dialogs[0])"
            >
              {{ dialogs[0].positiveText || "确认" }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { IconPark } from "@icon-park/vue-next/es/all";
import { useDialogStore, type DialogItem } from "@/composables";

const { dialogs, closeDialog } = useDialogStore();

function iconType(t: DialogItem["type"]): string {
  switch (t) {
    case "warning":
      return "Caution";
    case "error":
      return "CloseOne";
    default:
      return "Help";
  }
}

function iconColor(t: DialogItem["type"]): string {
  switch (t) {
    case "warning":
      return "#ff7d00";
    case "error":
      return "#f53f3f";
    default:
      return "#165dff";
  }
}

function iconWrapClass(t: DialogItem["type"]): string {
  switch (t) {
    case "warning":
      return "bg-warning-50";
    case "error":
      return "bg-danger-50";
    default:
      return "bg-primary-50";
  }
}

function defaultTitle(t: DialogItem["type"]): string {
  switch (t) {
    case "warning":
      return "警告";
    case "error":
      return "错误";
    default:
      return "确认";
  }
}

function onCancel(d: DialogItem) {
  d.onNegativeClick?.();
  closeDialog(d.id);
}

async function onConfirm(d: DialogItem) {
  await d.onPositiveClick?.();
  closeDialog(d.id);
}
</script>

<style scoped>
.arco-mask-enter-active,
.arco-mask-leave-active {
  transition: opacity 0.25s ease;
}
.arco-mask-enter-from,
.arco-mask-leave-to {
  opacity: 0;
}

.arco-modal-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 0.69, 0.1, 1);
}
.arco-modal-leave-active {
  transition: all 0.2s ease;
}
.arco-modal-enter-from {
  opacity: 0;
  transform: scale(0.96) translateY(-8px);
}
.arco-modal-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
