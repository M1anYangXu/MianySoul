import { useMessage as useNaiveMessage, useDialog as useNaiveDialog } from "naive-ui";

let messageInstance: ReturnType<typeof useNaiveMessage> | null = null;
let dialogInstance: ReturnType<typeof useNaiveDialog> | null = null;

/**
 * 全局消息提示
 */
export function useMessage() {
  if (!messageInstance) {
    messageInstance = useNaiveMessage();
  }

  return {
    success: (content: string) => messageInstance!.success(content),
    error: (content: string) => messageInstance!.error(content),
    warning: (content: string) => messageInstance!.warning(content),
    info: (content: string) => messageInstance!.info(content),
    loading: (content: string) => messageInstance!.loading(content),
  };
}

/**
 * 全局确认弹窗
 */
export function useDialog() {
  if (!dialogInstance) {
    dialogInstance = useNaiveDialog();
  }

  return {
    confirm: (options: {
      title?: string;
      content: string;
      positiveText?: string;
      negativeText?: string;
      onPositiveClick?: () => void;
      onNegativeClick?: () => void;
    }) => {
      dialogInstance!.confirm({
        title: options.title || "确认",
        content: options.content,
        positiveText: options.positiveText || "确认",
        negativeText: options.negativeText || "取消",
        onPositiveClick: options.onPositiveClick,
        onNegativeClick: options.onNegativeClick,
      });
    },

    warning: (options: {
      title?: string;
      content: string;
      positiveText?: string;
      onPositiveClick?: () => void;
    }) => {
      dialogInstance!.warning({
        title: options.title || "警告",
        content: options.content,
        positiveText: options.positiveText || "确认",
        onPositiveClick: options.onPositiveClick,
      });
    },

    error: (options: {
      title?: string;
      content: string;
      positiveText?: string;
      onPositiveClick?: () => void;
    }) => {
      dialogInstance!.error({
        title: options.title || "错误",
        content: options.content,
        positiveText: options.positiveText || "确认",
        onPositiveClick: options.onPositiveClick,
      });
    },
  };
}
