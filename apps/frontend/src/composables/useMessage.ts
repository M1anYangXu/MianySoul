import { ref } from "vue";
import type { MessageApi, DialogApi, DialogOptions } from "naive-ui";

const messageRef = ref<MessageApi | null>(null);
const dialogRef = ref<DialogApi | null>(null);

export function setMessageInstance(instance: MessageApi) {
  messageRef.value = instance;
}

export function setDialogInstance(instance: DialogApi) {
  dialogRef.value = instance;
}

function ensureMessage(): MessageApi {
  if (!messageRef.value) {
    throw new Error("Message instance not initialized");
  }
  return messageRef.value;
}

function ensureDialog(): DialogApi {
  if (!dialogRef.value) {
    throw new Error("Dialog instance not initialized");
  }
  return dialogRef.value;
}

export function useMessage() {
  return {
    success: (content: string) => ensureMessage().success(content),
    error: (content: string) => ensureMessage().error(content),
    warning: (content: string) => ensureMessage().warning(content),
    info: (content: string) => ensureMessage().info(content),
    loading: (content: string) => ensureMessage().loading(content),
  };
}

export function useDialog() {
  return {
    confirm: (options: DialogOptions) => {
      ensureDialog().warning({
        title: options.title || "确认",
        content: options.content,
        positiveText: options.positiveText || "确认",
        negativeText: options.negativeText || "取消",
        onPositiveClick: options.onPositiveClick,
        onNegativeClick: options.onNegativeClick,
      });
    },

    warning: (options: DialogOptions) => {
      ensureDialog().warning({
        title: options.title || "警告",
        content: options.content,
        positiveText: options.positiveText || "确认",
        negativeText: options.negativeText,
        onPositiveClick: options.onPositiveClick,
        onNegativeClick: options.onNegativeClick,
      });
    },

    error: (options: DialogOptions) => {
      ensureDialog().error({
        title: options.title || "错误",
        content: options.content,
        positiveText: options.positiveText || "确认",
        onPositiveClick: options.onPositiveClick,
      });
    },
  };
}
