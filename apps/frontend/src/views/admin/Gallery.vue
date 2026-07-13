<template>
  <div class="gallery-page max-w-6xl mx-auto">
    <div
      class="mb-6 px-6 py-4 rounded-xl"
      :class="
        isDark
          ? 'bg-gray-800/40 border border-gray-700/30'
          : 'bg-white/40 border border-gray-200/30'
      "
      style="backdrop-filter: blur(12px)"
    >
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            <Image class="w-7 h-7 inline mr-2" />
            {{ moduleName }}
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ moduleDescription }}
          </p>
        </div>
        <button
          class="px-6 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          @click="openGroupDialog()"
        >
          + 新建分组
        </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="group in groups"
          :key="group.id"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2"
          :class="[
            selectedGroup?.id === group.id
              ? isDark
                ? 'bg-violet-500 text-white'
                : 'bg-violet-500 text-white'
              : isDark
                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200',
          ]"
          @click="selectGroup(group)"
        >
          <component :is="getIconComponent(group.icon || '📁')" class="w-4 h-4" />
          <span>{{ group.name }}</span>
          <span
            class="px-2 py-0.5 rounded-full text-xs"
            :class="
              isDark
                ? selectedGroup?.id === group.id
                  ? 'bg-white/20'
                  : 'bg-gray-700'
                : selectedGroup?.id === group.id
                  ? 'bg-white/20'
                  : 'bg-gray-100'
            "
          >
            {{ group._count.images }}
          </span>
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <button
          v-if="selectedGroup && !selectedGroup.isDefault"
          class="px-3 py-2 text-sm rounded-lg transition-all"
          :class="
            isDark
              ? 'text-gray-400 hover:text-white hover:bg-gray-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          "
          @click="openGroupDialog(selectedGroup)"
        >
          <Edit3 class="w-4 h-4 inline mr-1" />
          编辑分组
        </button>
        <button
          v-if="selectedGroup && !selectedGroup.isDefault"
          class="px-3 py-2 text-sm rounded-lg transition-all"
          :class="
            isDark
              ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
              : 'text-red-500 hover:text-red-600 hover:bg-red-50'
          "
          @click="deleteGroup(selectedGroup)"
        >
          <Trash2 class="w-4 h-4 inline mr-1" />
          删除分组
        </button>
      </div>
    </div>

    <!-- 图片区域 -->
    <div v-if="selectedGroup" class="space-y-4">
      <!-- 上传按钮 -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            <component :is="getIconComponent(selectedGroup.icon)" class="w-5 h-5 inline mr-2" />
            {{ selectedGroup.name }}
          </h2>
          <p
            v-if="selectedGroup.description"
            class="text-sm"
            :class="isDark ? 'text-gray-400' : 'text-gray-600'"
          >
            {{ selectedGroup.description }}
          </p>
        </div>
        <div class="flex space-x-3">
          <button
            class="px-6 py-2.5 rounded-lg gradient-secondary text-white font-medium flex items-center space-x-2 hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            @click="showUploadDialog = true"
          >
            <Upload class="w-4 h-4" />
            <span>上传图片</span>
          </button>
        </div>
      </div>

      <!-- 图片网格 -->
      <div
        v-if="imagesLoading"
        class="text-center py-8"
        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
      >
        加载中...
      </div>
      <div
        v-else-if="images.length === 0"
        class="text-center py-12 rounded-xl border-2 border-dashed"
        :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'"
      >
        <Image class="w-12 h-12 mx-auto mb-3" :class="isDark ? 'text-gray-500' : 'text-gray-400'" />
        <p>该分组还没有图片</p>
        <p class="text-sm mt-1">点击上方按钮上传图片</p>
      </div>
      <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        <div
          v-for="img in images"
          :key="img.id"
          class="relative group rounded-lg overflow-hidden border"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <img
            :src="getFullImageUrl(img.url)"
            :alt="img.filename"
            class="w-full aspect-square object-cover"
          />
          <div
            class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center"
          >
            <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                class="p-2 rounded-lg bg-white/90 text-gray-700 hover:bg-white"
                @click="openMoveDialog(img)"
              >
                <Folder class="w-4 h-4" />
              </button>
              <button
                class="p-2 rounded-lg bg-red-500/90 text-white hover:bg-red-500"
                @click="deleteImage(img)"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div
            class="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <p class="text-xs text-white truncate">{{ img.filename }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 分组编辑弹窗 -->
    <div
      v-if="showGroupDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showGroupDialog = false"
    >
      <div
        class="w-full max-w-sm p-5 rounded-xl shadow-xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <h2 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ editingGroup ? "编辑分组" : "新建分组" }}
        </h2>
        <div class="space-y-3">
          <input
            v-model="groupForm.name"
            type="text"
            placeholder="分组名称"
            class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'"
          />
          <textarea
            v-model="groupForm.description"
            rows="2"
            placeholder="分组描述（可选）"
            class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'"
          ></textarea>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in iconOptions"
              :key="option.emoji"
              class="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
              :class="
                groupForm.icon === option.emoji
                  ? 'ring-2 ring-purple-500 bg-purple-100 dark:bg-purple-900/30'
                  : ''
              "
              @click="groupForm.icon = option.emoji"
            >
              <component
                :is="option.icon"
                class="w-4 h-4"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              />
            </button>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
              在前台展示
            </span>
            <button
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
              :class="
                groupForm.isVisible
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30'
                  : isDark
                    ? 'bg-gray-600'
                    : 'bg-gray-300'
              "
              @click="groupForm.isVisible = !groupForm.isVisible"
            >
              <span
                class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ease-in-out shadow-md"
                :class="groupForm.isVisible ? 'translate-x-5' : 'translate-x-0.5'"
              ></span>
            </button>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-4">
          <button
            class="px-4 py-2 rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'"
            @click="showGroupDialog = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-lg gradient-primary text-white text-sm font-medium"
            :disabled="!groupForm.name.trim()"
            @click="saveGroup"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 上传弹窗 -->
    <div
      v-if="showUploadDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showUploadDialog = false"
    >
      <div
        class="w-full max-w-lg p-5 rounded-xl shadow-xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <h2 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
          上传图片
        </h2>
        <div class="space-y-4">
          <div
            class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
            :class="isDark ? 'border-gray-700' : 'border-gray-300'"
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <Upload
              class="w-12 h-12 mx-auto mb-3"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'"
            />
            <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              点击或拖拽图片到此处上传
            </p>
            <p class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
              支持 JPG、PNG、GIF、WebP、SVG
            </p>
          </div>
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          />
          <div v-if="uploading" class="space-y-3 py-4">
            <div
              class="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"
            ></div>
            <div class="space-y-2">
              <div v-for="(progress, index) in uploadProgress" :key="index" class="space-y-1">
                <div class="flex items-center justify-between text-sm">
                  <span :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                    {{ progress.filename }}
                  </span>
                  <span :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                    {{ progress.percent }}%
                  </span>
                </div>
                <div
                  class="h-2 rounded-full overflow-hidden"
                  :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"
                >
                  <div
                    class="h-full gradient-primary transition-all duration-300"
                    :style="{ width: progress.percent + '%' }"
                  ></div>
                </div>
              </div>
            </div>
            <p class="text-sm text-center" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              {{ uploadStatus }}
            </p>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-4">
          <button
            class="px-4 py-2 rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'"
            @click="showUploadDialog = false"
          >
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 移动图片弹窗 -->
    <div
      v-if="showMoveDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showMoveDialog = false"
    >
      <div
        class="w-full max-w-sm p-5 rounded-xl shadow-xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <h2 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
          移动图片
        </h2>
        <div class="space-y-2">
          <div
            v-for="group in availableGroups"
            :key="group.id"
            class="p-3 rounded-lg border cursor-pointer transition-all"
            :class="[
              movingImage?.groupId === group.id
                ? isDark
                  ? 'bg-gray-700 border-purple-500'
                  : 'bg-purple-50 border-purple-500'
                : isDark
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : 'bg-white border-gray-200 hover:border-gray-300',
            ]"
            @click="moveImageTo(group)"
          >
            <div class="flex items-center space-x-2">
              <component :is="getIconComponent(group.icon)" class="w-4 h-4" />
              <span class="text-sm" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ group.name }}
              </span>
              <span
                v-if="group.isDefault"
                class="text-xs px-1 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
              >
                默认
              </span>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-4">
          <button
            class="px-4 py-2 rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'"
            @click="showMoveDialog = false"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";
import { useMessage, useModuleConfig } from "@/composables";
import {
  Folder,
  Image,
  Palette,
  Sunrise,
  Film,
  Camera,
  Video,
  Paintbrush,
  Save,
  FolderOpen,
  Upload,
  Edit3,
  Trash2,
} from "lucide-vue-next";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");
const { success, error } = useMessage();
const { getModuleName, getModuleDescription, loadConfig } = useModuleConfig();

const moduleName = computed(() => getModuleName("gallery"));
const moduleDescription = computed(() => getModuleDescription("gallery"));

const iconOptions = [
  { emoji: "📁", icon: Folder, name: "Folder" },
  { emoji: "🖼️", icon: Image, name: "Image" },
  { emoji: "🎨", icon: Palette, name: "Palette" },
  { emoji: "🌅", icon: Sunrise, name: "Sunrise" },
  { emoji: "🎭", icon: Film, name: "Film" },
  { emoji: "📷", icon: Camera, name: "Camera" },
  { emoji: "🎬", icon: Video, name: "Video" },
  { emoji: "🖍️", icon: Paintbrush, name: "Paintbrush" },
  { emoji: "💾", icon: Save, name: "Save" },
  { emoji: "📂", icon: FolderOpen, name: "FolderOpen" },
];

const getIconComponent = (emoji: string) => {
  return iconOptions.find((opt) => opt.emoji === emoji)?.icon || Folder;
};

interface ImageGroup {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  isDefault: boolean;
  isVisible: boolean;
  sortOrder: number;
  _count: { images: number };
}

interface ImageItem {
  id: string;
  groupId: string | null;
  filename: string;
  url: string;
  size: number;
  mimetype: string;
  createdAt: string;
}

const groups = ref<ImageGroup[]>([]);
const selectedGroup = ref<ImageGroup | null>(null);
const images = ref<ImageItem[]>([]);
const imagesLoading = ref(true);

const showGroupDialog = ref(false);
const editingGroup = ref<ImageGroup | null>(null);
const groupForm = reactive({ name: "", description: "", icon: "📁", isVisible: true });

const showUploadDialog = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const uploadProgress = ref<Array<{ filename: string; percent: number }>>([]);
const uploadStatus = ref("");

const showMoveDialog = ref(false);
const movingImage = ref<Image | null>(null);

const availableGroups = computed(() => {
  return groups.value;
});

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  // 确保返回正确的路径
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
};

const fetchGroups = async () => {
  try {
    groups.value = await http.get<ImageGroup[]>("/gallery/groups");
    const defaultGroup = groups.value.find((g) => g.isDefault);
    selectedGroup.value = defaultGroup || groups.value[0] || null;
  } catch (e: any) {
    error(e.message || "加载分组失败");
  }
};

interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const fetchImages = async () => {
  if (!selectedGroup.value) return;
  imagesLoading.value = true;
  try {
    const data = await http.get<PaginationResult<Image>>(
      `/gallery/groups/${selectedGroup.value.id}/images`
    );
    images.value = data.list;
  } catch (e: any) {
    error(e.message || "加载图片失败");
  } finally {
    imagesLoading.value = false;
  }
};

const selectGroup = (group: ImageGroup) => {
  selectedGroup.value = group;
};

const openGroupDialog = (group?: ImageGroup) => {
  if (group) {
    editingGroup.value = group;
    groupForm.name = group.name;
    groupForm.description = group.description || "";
    groupForm.icon = group.icon;
    groupForm.isVisible = group.isVisible;
  } else {
    editingGroup.value = null;
    groupForm.name = "";
    groupForm.description = "";
    groupForm.icon = "📁";
    groupForm.isVisible = true;
  }
  showGroupDialog.value = true;
};

const saveGroup = async () => {
  try {
    if (editingGroup.value) {
      await http.put(`/gallery/groups/${editingGroup.value.id}`, groupForm);
      success("更新成功");
    } else {
      await http.post("/gallery/groups", groupForm);
      success("创建成功");
    }
    showGroupDialog.value = false;
    await fetchGroups();
    await fetchImages();
  } catch (e: any) {
    error(e.message || "保存失败");
  }
};

const deleteGroup = async (group: ImageGroup) => {
  if (!confirm(`确定删除「${group.name}」分组吗？`)) return;
  try {
    await http.delete(`/gallery/groups/${group.id}`);
    success("删除成功");
    await fetchGroups();
    if (selectedGroup.value?.id === group.id) {
      selectedGroup.value = groups.value[0] || null;
      await fetchImages();
    }
  } catch (e: any) {
    error(e.message || "删除失败");
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  await uploadFiles(Array.from(target.files));
};

const handleDrop = async (event: DragEvent) => {
  if (!event.dataTransfer?.files || event.dataTransfer.files.length === 0) return;
  await uploadFiles(Array.from(event.dataTransfer.files));
};

const uploadFiles = async (files: File[]) => {
  if (!selectedGroup.value) {
    error("请先选择一个分组");
    return;
  }
  uploading.value = true;
  uploadProgress.value = files.map((file) => ({ filename: file.name, percent: 0 }));
  uploadStatus.value = "准备上传...";

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      uploadStatus.value = `正在上传 ${file.name}...`;
      uploadProgress.value[i].percent = 10;

      const formData = new FormData();
      formData.append("file", file);

      await http.post(`/gallery/upload?groupId=${selectedGroup.value!.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      uploadProgress.value[i].percent = 100;
    }

    uploadStatus.value = "上传完成！";
    success(`成功上传 ${files.length} 张图片`);
    showUploadDialog.value = false;
    await fetchImages();
  } catch (e: any) {
    error(e.message || "上传失败");
  } finally {
    uploading.value = false;
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  }
};

const openMoveDialog = (img: Image) => {
  movingImage.value = img;
  showMoveDialog.value = true;
};

const moveImageTo = async (group: ImageGroup | null) => {
  if (!movingImage.value) return;
  try {
    await http.put(`/gallery/images/${movingImage.value.id}/move`, {
      groupId: group?.id || null,
    });
    success("移动成功");
    showMoveDialog.value = false;
    movingImage.value = null;
    await fetchImages();
  } catch (e: any) {
    error(e.message || "移动失败");
  }
};

const deleteImage = async (img: Image) => {
  if (!confirm(`确定删除「${img.filename}」吗？`)) return;
  try {
    await http.delete(`/gallery/images/${img.id}`);
    success("删除成功");
    await fetchImages();
  } catch (e: any) {
    error(e.message || "删除失败");
  }
};

watch(selectedGroup, () => {
  fetchImages();
});

onMounted(async () => {
  await loadConfig();
  await fetchGroups();
});
</script>
