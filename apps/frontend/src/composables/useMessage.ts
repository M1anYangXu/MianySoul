import { ref } from "vue";

export type MessageType = "success" | "error" | "warning" | "info" | "loading";

export interface MessageItem {
  id: number;
  type: MessageType;
  content: string;
  duration: number;
  timer?: number;
}

let messageId = 0;
const messages = ref<MessageItem[]>([]);

function removeMessage(id: number) {
  const idx = messages.value.findIndex((m) => m.id === id);
  if (idx >= 0) {
    const item = messages.value[idx];
    if (item.timer) {
      clearTimeout(item.timer);
    }
    messages.value.splice(idx, 1);
  }
}

function pushMessage(type: MessageType, content: string, duration = 3000) {
  const id = ++messageId;
  const item: MessageItem = { id, type, content, duration };
  messages.value.push(item);
  if (duration > 0 && type !== "loading") {
    item.timer = window.setTimeout(() => removeMessage(id), duration);
  }
  return id;
}

export function useMessage() {
  return {
    success: (content: string) => pushMessage("success", content),
    error: (content: string) => pushMessage("error", content, 4000),
    warning: (content: string) => pushMessage("warning", content, 4000),
    info: (content: string) => pushMessage("info", content),
    loading: (content: string) => {
      const id = pushMessage("loading", content, 0);
      return { close: () => removeMessage(id) };
    },
  };
}

export function useMessageStore() {
  return {
    messages,
    removeMessage,
  };
}
