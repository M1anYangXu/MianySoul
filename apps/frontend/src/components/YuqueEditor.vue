<template>
  <div ref="wrapperRef" class="yuque-editor-wrapper">
    <YuqueRichText
      ref="editorRef"
      :value="modelValue"
      :isview="isView"
      @on-change="handleChange"
      @on-load="handleLoad"
      @on-save="$emit('onSave', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, nextTick } from "vue";
import { YuqueRichText } from "yuque-rich-text";
import type { IEditorRef } from "yuque-rich-text";

const props = defineProps<{
  modelValue: string;
  isView?: boolean;
  uploadImage?: (opt: {
    data: string | File;
  }) => Promise<{ url: string; size: number; filename: string }>;
}>();

const emit = defineEmits(["update:modelValue", "onSave", "onLoad"]);

const editorRef = ref<IEditorRef>();
const wrapperRef = ref<HTMLDivElement>();
let iframeLoaded = false;

const handleChange = (content: string) => {
  emit("update:modelValue", content);
};

const handleLoad = () => {
  emit("onLoad");
  if (!iframeLoaded && props.uploadImage) {
    iframeLoaded = true;
    injectUploadHandler();
  }
};

const injectUploadHandler = () => {
  const iframe = document.querySelector(".yuque-editor-wrapper iframe") as HTMLIFrameElement;
  if (!iframe) return;

  const win = iframe.contentWindow;
  if (!win || !win.editor) {
    setTimeout(injectUploadHandler, 100);
    return;
  }

  const editor = win.editor;
  if (editor && editor.kernel) {
    const imageUploader = editor.kernel.getService?.({ value: "IImageUploader" });
    if (imageUploader) {
      imageUploader.upload = async (file: any) => {
        const result = await props.uploadImage!({ data: file });
        return result;
      };
    }
  }
};

watch(
  () => props.uploadImage,
  (newHandler) => {
    if (newHandler && iframeLoaded) {
      injectUploadHandler();
    }
  }
);

defineExpose({
  appendContent: async (html: string, breakLine?: boolean) => {
    await nextTick();
    if (wrapperRef.value) {
      const iframe = wrapperRef.value.querySelector("iframe") as HTMLIFrameElement;
      if (iframe && iframe.contentWindow && iframe.contentWindow.editor) {
        const editor = iframe.contentWindow.editor;
        if (editor && editor.kernel) {
          iframe.focus();
          editor.execCommand("focus");
          if (breakLine) {
            editor.execCommand("breakLine");
          }
          editor.kernel.execCommand("insertHTML", html);
          editor.renderer?.scrollToCurrentSelection?.();
          return;
        }
      }
    }
    editorRef.value?.appendContent(html, breakLine);
  },
  setContent: (content: string, type?: "text/lake" | "text/html") => {
    editorRef.value?.setContent(content, type);
  },
  getContent: (type: "lake" | "text/html") => {
    return editorRef.value?.getContent(type);
  },
  isEmpty: () => {
    return editorRef.value?.isEmpty();
  },
  getSummaryContent: () => {
    return editorRef.value?.getSummaryContent();
  },
  wordCount: () => {
    return editorRef.value?.wordCount();
  },
  focusToStart: (offset?: number) => {
    editorRef.value?.focusToStart(offset);
  },
  insertBreakLine: () => {
    editorRef.value?.insertBreakLine();
  },
});
</script>

<style scoped>
.yuque-editor-wrapper {
  width: 100%;
  height: 100%;
}
</style>
