<template>
  <TransitionGroup
    name="arco-msg"
    tag="div"
    class="fixed top-6 left-1/2 -translate-x-1/2 z-[3000] flex flex-col items-center gap-3 pointer-events-none"
  >
    <div
      v-for="msg in messages"
      :key="msg.id"
      class="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-md shadow-md backdrop-blur min-w-[240px] max-w-[480px] text-sm"
      :class="barClass(msg.type)"
      @click="removeMessage(msg.id)"
    >
      <IconPark
        :type="iconType(msg.type)"
        :size="16"
        :theme="msg.type === 'loading' ? 'outline' : 'filled'"
        :fill="iconColor(msg.type)"
      />
      <span class="flex-1">{{ msg.content }}</span>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { IconPark } from "@icon-park/vue-next/es/all";
import { useMessageStore, type MessageType } from "@/composables";

const { messages, removeMessage } = useMessageStore();

function iconType(t: MessageType): string {
  switch (t) {
    case "success":
      return "CheckOne";
    case "error":
      return "CloseOne";
    case "warning":
      return "Caution";
    case "loading":
      return "Loading";
    default:
      return "Info";
  }
}

function iconColor(t: MessageType): string {
  switch (t) {
    case "success":
      return "#00b42a";
    case "error":
      return "#f53f3f";
    case "warning":
      return "#ff7d00";
    case "loading":
      return "#165dff";
    default:
      return "#165dff";
  }
}

function barClass(t: MessageType): string {
  const base = "bg-white dark:bg-gray-800 border ";
  switch (t) {
    case "success":
      return base + "border-success-200 text-gray-800 dark:text-gray-100";
    case "error":
      return base + "border-danger-200 text-gray-800 dark:text-gray-100";
    case "warning":
      return base + "border-warning-200 text-gray-800 dark:text-gray-100";
    case "loading":
      return base + "border-primary-200 text-gray-800 dark:text-gray-100";
    default:
      return base + "border-primary-200 text-gray-800 dark:text-gray-100";
  }
}
</script>

<style scoped>
.arco-msg-enter-active,
.arco-msg-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 0.69, 0.1, 1);
}
.arco-msg-enter-from {
  opacity: 0;
  transform: translateY(-16px);
}
.arco-msg-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
