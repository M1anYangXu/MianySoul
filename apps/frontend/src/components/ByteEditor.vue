<template>
  <div ref="wrapperRef" class="byte-editor-wrapper">
    <div ref="editorRef" class="byte-editor-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import "bytemd/dist/index.css";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    readOnly?: boolean;
    uploadImage?: (files: File[]) => Promise<{ url: string; alt?: string; title?: string }[]>;
  }>(),
  {
    readOnly: false,
  }
);

const emit = defineEmits(["update:modelValue", "onLoad", "onSelectImage"]);

const wrapperRef = ref<HTMLDivElement | null>(null);
const editorRef = ref<HTMLDivElement | null>(null);

let instance: any = null;
let isInitialized = false;

const loadByteMD = async () => {
  const byteMD = await import("bytemd");
  const { Editor, Viewer } = byteMD as any;
  const gfm = (await import("@bytemd/plugin-gfm")).default;

  if (!editorRef.value) return;

  if (props.readOnly) {
    instance = new Viewer({
      target: editorRef.value,
      props: {
        value: props.modelValue,
        plugins: [gfm()],
      },
    });
  } else {
    instance = new Editor({
      target: editorRef.value,
      props: {
        value: "",
        plugins: [gfm()],
        uploadImages: props.uploadImage,
        toolbar: [
          "bold",
          "italic",
          "heading",
          "quote",
          "code",
          "link",
          {
            name: "image",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>`,
            action: () => {
              emit("onSelectImage");
            },
          },
          "list",
          "ordered-list",
          "table",
          "divider",
          "preview",
          "side-by-side",
          "fullscreen",
        ],
      },
    });

    isInitialized = true;

    setTimeout(() => {
      if (instance && props.modelValue) {
        instance.$set?.({ value: props.modelValue });
      }
    }, 50);

    instance.$on("change", (event: any) => {
      const value = typeof event.detail === "string" ? event.detail : event.detail?.value || "";
      emit("update:modelValue", value);
    });
  }

  emit("onLoad");
};

const destroyEditor = () => {
  if (instance) {
    instance.$destroy?.();
    instance = null;
    isInitialized = false;
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (instance && isInitialized) {
      const currentValue = instance.$props?.value;
      if (currentValue !== newValue) {
        instance.$set?.({ value: newValue });
      }
    }
  }
);

watch(
  () => props.readOnly,
  () => {
    destroyEditor();
    nextTick(() => {
      loadByteMD();
    });
  }
);

onMounted(() => {
  loadByteMD();
});

onUnmounted(() => {
  destroyEditor();
});

defineExpose({
  getContent: () => props.modelValue,
  setContent: (content: string) => {
    if (instance) {
      instance.$set?.({ value: content });
    }
  },
});
</script>

<style scoped>
.byte-editor-wrapper {
  width: 100%;
  height: 100%;
  min-height: 600px;
}

.byte-editor-container {
  width: 100%;
  height: 100%;
  min-height: 600px;
}
</style>
