import { ref } from "vue";

export interface DialogOptions {
  title?: string;
  content: string;
  positiveText?: string;
  negativeText?: string;
  onPositiveClick?: () => void | Promise<void>;
  onNegativeClick?: () => void;
  /** 危险确认（确认按钮显示为 danger 色） */
  danger?: boolean;
}

export interface DialogItem extends DialogOptions {
  id: number;
  type: "confirm" | "warning" | "error";
}

let dialogId = 0;
const dialogs = ref<DialogItem[]>([]);

function closeDialog(id: number) {
  const idx = dialogs.value.findIndex((d) => d.id === id);
  if (idx >= 0) dialogs.value.splice(idx, 1);
}

function openDialog(type: DialogItem["type"], options: DialogOptions) {
  const id = ++dialogId;
  dialogs.value.push({ id, type, ...options });
}

export function useDialog() {
  return {
    confirm: (options: DialogOptions) => openDialog("confirm", options),
    warning: (options: DialogOptions) => openDialog("warning", options),
    error: (options: DialogOptions) => openDialog("error", options),
  };
}

export function useDialogStore() {
  return {
    dialogs,
    closeDialog,
  };
}
