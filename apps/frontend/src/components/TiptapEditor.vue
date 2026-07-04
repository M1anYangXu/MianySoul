<template>
  <div class="tiptap-editor-wrapper" :class="{ dark: dark }">
    <div class="tiptap-toolbar">
      <div class="tiptap-toolbar-left">
        <select class="tiptap-select" title="标题" @change="handleHeadingChange">
          <option value="">正文</option>
          <option value="1">标题 1</option>
          <option value="2">标题 2</option>
          <option value="3">标题 3</option>
          <option value="4">标题 4</option>
        </select>

        <span class="tiptap-divider"></span>

        <button
          class="tiptap-btn"
          :class="{ active: editor?.isActive('bold') }"
          title="加粗"
          @click="editor?.chain().focus().toggleBold().run()"
        >
          <strong>B</strong>
        </button>
        <button
          class="tiptap-btn"
          :class="{ active: editor?.isActive('italic') }"
          title="斜体"
          @click="editor?.chain().focus().toggleItalic().run()"
        >
          <em>I</em>
        </button>
        <button
          class="tiptap-btn"
          :class="{ active: editor?.isActive('underline') }"
          title="下划线"
          @click="editor?.chain().focus().toggleUnderline().run()"
        >
          <u>U</u>
        </button>
        <button
          class="tiptap-btn"
          :class="{ active: editor?.isActive('strike') }"
          title="删除线"
          @click="editor?.chain().focus().toggleStrike().run()"
        >
          <s>S</s>
        </button>

        <span class="tiptap-divider"></span>

        <div class="tiptap-color-picker">
          <button class="tiptap-btn tiptap-color-btn" title="字体颜色" @click="toggleColorPicker">
            <span class="color-icon">A</span>
            <span class="color-indicator" :style="{ backgroundColor: currentColor }"></span>
          </button>
          <div v-if="showColorPicker" class="color-picker-panel">
            <div class="color-picker-title">字体颜色</div>
            <div class="color-grid">
              <button
                v-for="color in colors"
                :key="color.value"
                class="color-item"
                :class="{ active: currentColor === color.value }"
                :style="{ backgroundColor: color.value }"
                @click="setColor(color.value)"
              ></button>
            </div>
          </div>
        </div>

        <div class="tiptap-color-picker">
          <button class="tiptap-btn tiptap-color-btn" title="背景颜色" @click="toggleBgColorPicker">
            <span class="color-icon">A</span>
            <span class="bg-color-indicator" :style="{ backgroundColor: currentBgColor }"></span>
          </button>
          <div v-if="showBgColorPicker" class="color-picker-panel">
            <div class="color-picker-title">背景颜色</div>
            <div class="color-grid">
              <button
                v-for="color in bgColors"
                :key="color.value"
                class="color-item"
                :class="{ active: currentBgColor === color.value }"
                :style="{ backgroundColor: color.value }"
                @click="setBgColor(color.value)"
              ></button>
            </div>
          </div>
        </div>

        <span class="tiptap-divider"></span>

        <button
          class="tiptap-btn"
          :class="{ active: editor?.isActive('codeBlock') }"
          title="代码块"
          @click="editor?.chain().focus().toggleCodeBlock().run()"
        >
          {}
        </button>

        <span class="tiptap-divider"></span>

        <button
          class="tiptap-btn"
          :class="{ active: editor?.isActive('bulletList') }"
          title="无序列表"
          @click="editor?.chain().focus().toggleBulletList().run()"
        >
          ☰
        </button>
        <button
          class="tiptap-btn"
          :class="{ active: editor?.isActive('orderedList') }"
          title="有序列表"
          @click="editor?.chain().focus().toggleOrderedList().run()"
        >
          ≡
        </button>
        <button
          class="tiptap-btn"
          :class="{ active: editor?.isActive('blockquote') }"
          title="引用"
          @click="editor?.chain().focus().toggleBlockquote().run()"
        >
          "
        </button>

        <span class="tiptap-divider"></span>

        <button
          class="tiptap-btn"
          title="分割线"
          @click="editor?.chain().focus().setHorizontalRule().run()"
        >
          ─
        </button>
        <button class="tiptap-btn" title="插入表格" @click="insertTable">⊞</button>

        <span class="tiptap-divider"></span>

        <button
          class="tiptap-btn"
          :class="{ active: editor?.isActive('link') }"
          title="链接"
          @click="toggleLink"
        >
          🔗
        </button>
        <button class="tiptap-btn" title="上传图片" @click="insertImage">📷</button>
      </div>

      <div class="tiptap-toolbar-right">
        <select
          class="tiptap-select tiptap-font-size-select"
          title="字号"
          @change="handleFontSizeChange"
        >
          <option value="12">12px</option>
          <option value="14">14px</option>
          <option value="16">16px</option>
          <option value="18">18px</option>
          <option value="20">20px</option>
          <option value="24">24px</option>
          <option value="28">28px</option>
          <option value="32">32px</option>
        </select>
      </div>
    </div>

    <div class="tiptap-editor-container">
      <editor-content :editor="editor" class="tiptap-editor-content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineProps, defineEmits } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { HardBreak } from "@tiptap/extension-hard-break";

const props = defineProps<{
  modelValue: string;
  dark?: boolean;
}>();

const emit = defineEmits<{
  update: [value: string];
}>();

const showColorPicker = ref(false);
const showBgColorPicker = ref(false);
const currentColor = ref("#333333");
const currentBgColor = ref("#ffffff");

const colors = [
  { value: "#333333" },
  { value: "#ef4444" },
  { value: "#f97316" },
  { value: "#f59e0b" },
  { value: "#84cc16" },
  { value: "#10b981" },
  { value: "#06b6d4" },
  { value: "#3b82f6" },
  { value: "#8b5cf6" },
  { value: "#ec4899" },
  { value: "#6b7280" },
  { value: "#9ca3af" },
];

const bgColors = [
  { value: "#ffffff" },
  { value: "#fee2e2" },
  { value: "#fed7aa" },
  { value: "#fef08a" },
  { value: "#dcfce7" },
  { value: "#cffafe" },
  { value: "#dbeafe" },
  { value: "#f3e8ff" },
  { value: "#fce7f3" },
];

const editor = useEditor({
  content: props.modelValue || "<p>开始编辑...</p>",
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4],
      },
    }),
    Image,
    Underline,
    Strike,
    Link.configure({ openOnClick: false }),
    Placeholder.configure({ placeholder: "开始编辑..." }),
    TextStyle,
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableCell,
    TableHeader,
    Dropcursor,
    HardBreak,
  ],
  onUpdate: ({ editor }) => {
    emit("update", editor.getHTML());
  },
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && editor.value) {
      const currentContent = editor.value.getHTML();
      if (currentContent !== newValue) {
        editor.value.commands.setContent(newValue);
      }
    }
  },
  { immediate: false }
);

const handleHeadingChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  const level = parseInt(target.value);
  if (editor.value) {
    if (level) {
      editor.value.chain().focus().toggleHeading({ level }).run();
    } else {
      editor.value.chain().focus().toggleHeading({ level: 1 }).run();
      editor.value.chain().focus().toggleHeading({ level: 2 }).run();
      editor.value.chain().focus().toggleHeading({ level: 3 }).run();
      editor.value.chain().focus().toggleHeading({ level: 4 }).run();
    }
  }
};

const handleFontSizeChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  const fontSize = target.value + "px";
  if (editor.value) {
    editor.value.chain().focus().setTextStyle({ fontSize }).run();
  }
};

const toggleColorPicker = () => {
  showColorPicker.value = !showColorPicker.value;
  showBgColorPicker.value = false;
};

const toggleBgColorPicker = () => {
  showBgColorPicker.value = !showBgColorPicker.value;
  showColorPicker.value = false;
};

const setColor = (color: string) => {
  currentColor.value = color;
  if (editor.value) {
    editor.value.chain().focus().setColor(color).run();
  }
  showColorPicker.value = false;
};

const setBgColor = (color: string) => {
  currentBgColor.value = color;
  if (editor.value) {
    editor.value.chain().focus().setBackgroundColor(color).run();
  }
  showBgColorPicker.value = false;
};

const toggleLink = () => {
  if (!editor.value) return;
  const previousUrl = editor.value.getAttributes("link").href;
  const url = prompt("请输入链接地址", previousUrl || "https://");
  if (url === null) return;
  if (url === "") {
    editor.value.chain().focus().extendMarkRange("link").unsetLink().run();
  } else {
    editor.value.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }
};

const insertTable = () => {
  if (editor.value) {
    editor.value.chain().focus().insertTable().run();
  }
};

const insertImage = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file && editor.value) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await fetch("/api/gallery/upload", { method: "POST", body: formData });
        const result = await response.json();
        if (result.url) {
          editor.value.chain().focus().setImage({ src: result.url }).run();
        }
      } catch (err) {
        console.error("图片上传失败:", err);
      }
    }
  };
  input.click();
};

onMounted(() => {
  setTimeout(() => {
    if (editor.value) {
      editor.value.focus();
    }
  }, 100);
});
</script>

<style scoped>
.tiptap-editor-wrapper {
  width: 100%;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

.dark .tiptap-editor-wrapper {
  background: #1a1a2e;
  border-color: #2d2d44;
}

.tiptap-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  flex-wrap: wrap;
  gap: 4px;
  position: relative;
}

.dark .tiptap-toolbar {
  background: #16162a;
  border-color: #2d2d44;
}

.tiptap-toolbar-left,
.tiptap-toolbar-right {
  display: flex;
  align-items: center;
  gap: 2px;
}

.tiptap-select {
  height: 32px;
  padding: 0 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  color: #595959;
  font-size: 14px;
  cursor: pointer;
  outline: none;
}

.dark .tiptap-select {
  background: #2d2d44;
  border-color: #3d3d5c;
  color: #a0a0b8;
}

.tiptap-select:hover {
  border-color: #1890ff;
}

.tiptap-font-size-select {
  min-width: 80px;
}

.tiptap-btn {
  min-width: 36px;
  height: 32px;
  padding: 0 8px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: #595959;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.dark .tiptap-btn {
  color: #a0a0b8;
}

.tiptap-btn:hover {
  background: #e8e8e8;
}

.dark .tiptap-btn:hover {
  background: #2d2d44;
}

.tiptap-btn.active {
  background: #1890ff;
  color: #ffffff;
}

.dark .tiptap-btn.active {
  background: #1890ff;
  color: #ffffff;
}

.tiptap-divider {
  width: 1px;
  height: 20px;
  background: #d9d9d9;
  margin: 0 4px;
}

.dark .tiptap-divider {
  background: #3d3d5c;
}

.tiptap-color-picker {
  position: relative;
}

.tiptap-color-btn {
  padding: 0 6px;
}

.color-icon {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
}

.dark .color-icon {
  color: #e8e8e8;
}

.color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-left: 4px;
  border: 1px solid #d9d9d9;
}

.bg-color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  margin-left: 4px;
  border: 1px solid #d9d9d9;
}

.color-picker-panel {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
  z-index: 1000;
  min-width: 200px;
}

.dark .color-picker-panel {
  background: #2d2d44;
}

.color-picker-title {
  font-size: 12px;
  color: #999999;
  margin-bottom: 8px;
  padding-left: 4px;
}

.dark .color-picker-title {
  color: #707088;
}

.color-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.color-item {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.color-item:hover {
  transform: scale(1.1);
}

.color-item.active {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.tiptap-editor-container {
  min-height: 400px;
  background: #ffffff;
}

.dark .tiptap-editor-container {
  background: #1a1a2e;
}

.tiptap-editor-content {
  padding: 24px 32px;
  min-height: 400px;
  font-size: 16px;
  line-height: 1.8;
  color: #333333;
  outline: none;
  caret-color: #1890ff;
}

.dark .tiptap-editor-content {
  color: #e8e8e8;
}

.tiptap-editor-content :deep(p) {
  margin: 10px 0;
}

.tiptap-editor-content :deep(strong) {
  font-weight: 600;
}

.tiptap-editor-content :deep(h1) {
  font-size: 32px;
  font-weight: 700;
  margin: 32px 0 20px;
  color: #1f1f1f;
  padding-bottom: 12px;
  border-bottom: 2px solid #e8e8e8;
}

.dark .tiptap-editor-content :deep(h1) {
  color: #ffffff;
  border-color: #2d2d44;
}

.tiptap-editor-content :deep(h2) {
  font-size: 24px;
  font-weight: 600;
  margin: 28px 0 16px;
  color: #262626;
}

.dark .tiptap-editor-content :deep(h2) {
  color: #f0f0f5;
}

.tiptap-editor-content :deep(h3) {
  font-size: 20px;
  font-weight: 600;
  margin: 24px 0 12px;
  color: #333333;
}

.dark .tiptap-editor-content :deep(h3) {
  color: #e8e8e8;
}

.tiptap-editor-content :deep(h4) {
  font-size: 18px;
  font-weight: 600;
  margin: 20px 0 10px;
  color: #333333;
}

.dark .tiptap-editor-content :deep(h4) {
  color: #e8e8e8;
}

.tiptap-editor-content :deep(em) {
  font-style: italic;
}

.tiptap-editor-content :deep(u) {
  text-decoration: underline;
}

.tiptap-editor-content :deep(s) {
  text-decoration: line-through;
  color: #999999;
}

.dark .tiptap-editor-content :deep(s) {
  color: #707088;
}

.tiptap-editor-content :deep(code) {
  background: #f4f4f4;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Monaco", "Menlo", "Consolas", monospace;
  font-size: 0.9em;
  color: #52c41a;
}

.dark .tiptap-editor-content :deep(code) {
  background: #2d2d44;
  color: #73d13d;
}

.tiptap-editor-content :deep(pre) {
  background: #1f1f1f;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 16px 0;
}

.tiptap-editor-content :deep(pre code) {
  background: transparent;
  padding: 0;
  color: #e8e8e8;
}

.tiptap-editor-content :deep(ul),
.tiptap-editor-content :deep(ol) {
  padding-left: 28px;
  margin: 10px 0;
}

.tiptap-editor-content :deep(li) {
  margin: 6px 0;
}

.tiptap-editor-content :deep(blockquote) {
  border-left: 4px solid #1890ff;
  padding: 12px 16px;
  margin: 16px 0;
  background: #f0f7ff;
  border-radius: 0 4px 4px 0;
  color: #666666;
}

.dark .tiptap-editor-content :deep(blockquote) {
  background: #1e3a5f;
  color: #a0a0b8;
}

.tiptap-editor-content :deep(hr) {
  border: none;
  border-top: 1px solid #e8e8e8;
  margin: 24px 0;
}

.dark .tiptap-editor-content :deep(hr) {
  border-color: #2d2d44;
}

.tiptap-editor-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.tiptap-editor-content :deep(th),
.tiptap-editor-content :deep(td) {
  border: 1px solid #d9d9d9;
  padding: 10px 12px;
  text-align: left;
}

.dark .tiptap-editor-content :deep(th),
.dark .tiptap-editor-content :deep(td) {
  border-color: #3d3d5c;
}

.tiptap-editor-content :deep(th) {
  background: #fafafa;
  font-weight: 600;
}

.dark .tiptap-editor-content :deep(th) {
  background: #16162a;
}

.tiptap-editor-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tiptap-editor-content :deep(a) {
  color: #1890ff;
  text-decoration: underline;
}

.dark .tiptap-editor-content :deep(a) {
  color: #40a9ff;
}

.tiptap-editor-content :deep(p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #bfbfbf;
  pointer-events: none;
  height: 0;
}

.dark .tiptap-editor-content :deep(p.is-editor-empty:first-child::before) {
  color: #505068;
}

.tiptap-editor-content :deep([contenteditable="true"]) {
  outline: none;
  user-select: text;
  -webkit-user-select: text;
}

.tiptap-editor-content :deep([contenteditable="true"]):focus {
  outline: none;
}
</style>
