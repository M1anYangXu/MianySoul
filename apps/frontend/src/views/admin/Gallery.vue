<template>
  <div class="gallery-page w-full admin-root" :data-admin-module="'gallery'">
    <div class="admin-page-header">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            <IconPark type="Pic" :size="28" class="inline mr-2" />
            {{ moduleName }}
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ moduleDescription }}
          </p>
        </div>
        <button class="btn-admin-lg btn-admin-primary" @click="openGroupDialog()">
          + 新建分组
        </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="group in groups"
          :key="group.id"
          class="admin-chip flex items-center space-x-2"
          :class="{ 'admin-chip-active': selectedGroup?.id === group.id }"
          @click="selectGroup(group)"
        >
          <AppIcon :icon="group.icon || 'mdi:folder'" :size="16" />
          <span>{{ group.name }}</span>
          <span class="chip-count">
            {{ group._count.images }}
          </span>
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <button
          v-if="selectedGroup && !selectedGroup.isDefault"
          class="btn-admin-sm btn-admin-ghost"
          @click="openGroupDialog(selectedGroup)"
        >
          <IconPark type="Editor" :size="16" class="inline mr-1" />
          编辑分组
        </button>
        <button
          v-if="selectedGroup && !selectedGroup.isDefault"
          class="btn-admin-sm btn-admin-danger"
          @click="deleteGroup(selectedGroup)"
        >
          <IconPark type="Delete" :size="16" class="inline mr-1" />
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
            <AppIcon :icon="selectedGroup.icon" :size="20" class="inline mr-2" />
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
            class="btn-admin-lg btn-admin-primary flex items-center space-x-2"
            @click="showUploadDialog = true"
          >
            <IconPark type="UploadOne" :size="16" />
            <span>上传图片</span>
          </button>
          <button
            class="btn-admin-lg flex items-center space-x-2"
            :class="batchMode ? 'btn-admin-danger' : 'btn-admin-ghost'"
            @click="toggleBatchMode"
          >
            <IconPark type="List" :size="16" />
            <span>{{ batchMode ? "退出批量" : "批量操作" }}</span>
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
        <IconPark
          type="Pic"
          :size="48"
          class="mx-auto mb-3"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'"
        />
        <p>该分组还没有图片</p>
        <p class="text-sm mt-1">点击上方按钮上传图片</p>
      </div>
      <div
        v-else
        class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2"
      >
        <div
          v-for="img in images"
          :key="img.id"
          class="relative group rounded-lg overflow-hidden border cursor-pointer"
          :class="[
            isDark ? 'border-gray-700' : 'border-gray-200',
            batchMode && selectedImages.has(img.id) ? 'ring-2 ring-purple-500' : '',
          ]"
          @click="handleImageClick(img)"
        >
          <img
            :src="getFullImageUrl(img.url)"
            :alt="img.filename"
            class="w-full aspect-square object-cover"
          />
          <!-- 批量模式选择框 -->
          <div v-if="batchMode" class="absolute top-2 left-2 z-10">
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all"
              :class="
                selectedImages.has(img.id)
                  ? 'bg-purple-500 border-purple-500'
                  : 'bg-black/40 border-white/80'
              "
            >
              <IconPark
                v-if="selectedImages.has(img.id)"
                type="CheckOne"
                :size="14"
                class="text-white"
              />
            </div>
          </div>
          <!-- 悬浮操作 -->
          <div
            v-if="!batchMode"
            class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center"
          >
            <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                class="p-2 rounded-lg bg-white/90 text-gray-700 hover:bg-white"
                title="预览"
                @click.stop="previewImage(img)"
              >
                <IconPark type="PreviewOpen" :size="16" />
              </button>
              <button
                class="p-2 rounded-lg bg-white/90 text-gray-700 hover:bg-white"
                title="移动"
                @click.stop="openMoveDialog(img)"
              >
                <IconPark type="FolderClose" :size="16" />
              </button>
              <button
                class="p-2 rounded-lg bg-white/90 text-gray-700 hover:bg-white"
                title="复制链接"
                @click.stop="copyImageLink(img)"
              >
                <IconPark type="Copy" :size="16" />
              </button>
              <button
                class="p-2 rounded-lg bg-red-500/90 text-white hover:bg-red-500"
                title="删除"
                @click.stop="deleteImage(img)"
              >
                <IconPark type="Delete" :size="16" />
              </button>
            </div>
          </div>
          <div
            class="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/60 to-transparent transition-opacity"
            :class="batchMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
          >
            <p class="text-xs text-white truncate">{{ img.filename }}</p>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="images.length > 0" class="mt-6 flex items-center justify-between">
        <span :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          共 {{ pagination.total }} 张图片
        </span>
        <div v-if="pagination.total > pagination.limit" class="flex items-center space-x-2">
          <button
            :disabled="pagination.page === 1"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            :class="
              isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            @click="prevPage"
          >
            上一页
          </button>
          <span class="font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
            {{ pagination.page }} / {{ Math.ceil(pagination.total / pagination.limit) }}
          </span>
          <button
            :disabled="pagination.page >= Math.ceil(pagination.total / pagination.limit)"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            :class="
              isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            @click="nextPage"
          >
            下一页
          </button>
        </div>
      </div>

      <!-- 批量操作浮动栏 -->
      <div
        v-if="batchMode"
        class="sticky bottom-4 mt-4 flex items-center justify-between rounded-xl p-4 shadow-lg"
        :class="isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'"
      >
        <span class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
          已选 {{ selectedImages.size }} 项
        </span>
        <div class="flex items-center space-x-2">
          <button
            class="btn-admin-sm btn-admin-primary"
            :disabled="selectedImages.size === 0"
            @click="openBatchMoveDialog"
          >
            <IconPark type="FolderClose" :size="16" class="inline mr-1" />
            批量移动
          </button>
          <button
            class="btn-admin-sm btn-admin-danger"
            :disabled="selectedImages.size === 0"
            @click="batchDelete"
          >
            <IconPark type="Delete" :size="16" class="inline mr-1" />
            批量删除
          </button>
          <button class="btn-admin-sm btn-admin-ghost" @click="toggleBatchMode">取消</button>
        </div>
      </div>
    </div>

    <!-- 分组编辑弹窗 -->
    <div v-if="showGroupDialog" class="admin-modal-backdrop" @click.self="showGroupDialog = false">
      <div class="admin-modal admin-modal-md">
        <h2 class="admin-modal-title">
          {{ editingGroup ? "编辑分组" : "新建分组" }}
        </h2>
        <div class="space-y-3">
          <input
            v-model="groupForm.name"
            type="text"
            placeholder="分组名称"
            class="admin-input w-full px-3 py-2 rounded-lg border"
          />
          <textarea
            v-model="groupForm.description"
            rows="2"
            placeholder="分组描述（可选）"
            class="admin-input w-full px-3 py-2 rounded-lg border resize-none text-sm"
          ></textarea>
          <div>
            <label class="block text-sm mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              图标
            </label>
            <IconPicker v-model="groupForm.icon" placeholder="搜索或输入图标名" />
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
        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="showGroupDialog = false">
            取消
          </button>
          <button
            class="btn-admin-sm btn-admin-primary"
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
      class="admin-modal-backdrop"
      @click.self="showUploadDialog = false"
    >
      <div class="admin-modal admin-modal-lg">
        <h2 class="admin-modal-title">上传图片</h2>
        <div class="space-y-4">
          <div
            class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
            :class="isDark ? 'border-gray-700' : 'border-gray-300'"
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <IconPark
              type="UploadOne"
              :size="48"
              class="mx-auto mb-3"
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
                    class="h-full bg-blue-500 transition-all duration-300"
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
        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="showUploadDialog = false">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 移动图片弹窗 -->
    <div v-if="showMoveDialog" class="admin-modal-backdrop" @click.self="closeMoveDialog">
      <div class="admin-modal admin-modal-sm">
        <h2 class="admin-modal-title">
          {{ batchMoveDialog ? "批量移动图片" : "移动图片" }}
        </h2>
        <div class="space-y-2">
          <div
            v-for="group in availableGroups"
            :key="group.id"
            class="p-3 rounded-lg border cursor-pointer transition-all"
            :class="[
              (!batchMoveDialog && movingImage?.groupId === group.id) ||
              (batchMoveDialog && selectedGroup?.id === group.id)
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
              <AppIcon :icon="group.icon" :size="16" />
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
        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="closeMoveDialog">取消</button>
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
import AppIcon from "@/components/AppIcon.vue";
import IconPicker from "@/components/IconPicker.vue";
import { useIcon } from "@/composables/useIcon";
import { IconPark } from "@icon-park/vue-next/es/all";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");
const { success, error } = useMessage();
const { getModuleName, getModuleDescription, loadConfig } = useModuleConfig();
const { formatIconName } = useIcon();

const moduleName = computed(() => getModuleName("gallery"));
const moduleDescription = computed(() => getModuleDescription("gallery"));

interface ImageGroup {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  isDefault: boolean;
  isVisible: boolean;
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

const pagination = reactive({
  page: 1,
  limit: 24,
  total: 0,
});

const batchMode = ref(false);
const selectedImages = ref<Set<string>>(new Set());
const batchMoveDialog = ref(false);

const showGroupDialog = ref(false);
const editingGroup = ref<ImageGroup | null>(null);
const groupForm = reactive({ name: "", description: "", icon: "mdi:folder", isVisible: true });

const showUploadDialog = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const uploadProgress = ref<Array<{ filename: string; percent: number }>>([]);
const uploadStatus = ref("");

const showMoveDialog = ref(false);
const movingImage = ref<ImageItem | null>(null);

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
    const data = await http.get<PaginationResult<ImageItem>>(
      `/gallery/groups/${selectedGroup.value.id}/images?page=${pagination.page}&limit=${pagination.limit}`
    );
    if (Array.isArray(data)) {
      images.value = data;
      pagination.total = data.length;
    } else {
      images.value = data.list || [];
      pagination.total = data.total || 0;
    }
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
    groupForm.icon = "mdi:folder";
    groupForm.isVisible = true;
  }
  showGroupDialog.value = true;
};

const saveGroup = async () => {
  try {
    const payload = {
      ...groupForm,
      icon: formatIconName(groupForm.icon || "mdi:folder"),
    };
    if (editingGroup.value) {
      await http.put(`/gallery/groups/${editingGroup.value.id}`, payload);
      success("更新成功");
    } else {
      await http.post("/gallery/groups", payload);
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

const openMoveDialog = (img: ImageItem) => {
  movingImage.value = img;
  showMoveDialog.value = true;
};

const moveImageTo = async (group: ImageGroup | null) => {
  try {
    if (batchMoveDialog.value) {
      if (selectedImages.value.size === 0) return;
      const ids = Array.from(selectedImages.value);
      await Promise.all(
        ids.map((id) => http.put(`/gallery/images/${id}/move`, { groupId: group?.id || null }))
      );
      success(`成功移动 ${ids.length} 张图片`);
      selectedImages.value = new Set();
      batchMode.value = false;
      batchMoveDialog.value = false;
      showMoveDialog.value = false;
      await fetchImages();
    } else {
      if (!movingImage.value) return;
      await http.put(`/gallery/images/${movingImage.value.id}/move`, {
        groupId: group?.id || null,
      });
      success("移动成功");
      showMoveDialog.value = false;
      movingImage.value = null;
      await fetchImages();
    }
  } catch (e: any) {
    error(e.message || "移动失败");
  }
};

const deleteImage = async (img: ImageItem) => {
  if (!confirm(`确定删除「${img.filename}」吗？`)) return;
  try {
    await http.delete(`/gallery/images/${img.id}`);
    success("删除成功");
    await fetchImages();
  } catch (e: any) {
    error(e.message || "删除失败");
  }
};

const toggleBatchMode = () => {
  batchMode.value = !batchMode.value;
  if (!batchMode.value) {
    selectedImages.value = new Set();
  }
};

const toggleImageSelection = (id: string) => {
  const next = new Set(selectedImages.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  selectedImages.value = next;
};

const handleImageClick = (img: ImageItem) => {
  if (batchMode.value) {
    toggleImageSelection(img.id);
  }
};

const batchDelete = async () => {
  if (selectedImages.value.size === 0) return;
  if (!confirm(`确定删除选中的 ${selectedImages.value.size} 张图片吗？`)) return;
  try {
    const ids = Array.from(selectedImages.value);
    await Promise.all(ids.map((id) => http.delete(`/gallery/images/${id}`)));
    success(`成功删除 ${ids.length} 张图片`);
    selectedImages.value = new Set();
    batchMode.value = false;
    await fetchImages();
  } catch (e: any) {
    error(e.message || "批量删除失败");
  }
};

const openBatchMoveDialog = () => {
  if (selectedImages.value.size === 0) return;
  batchMoveDialog.value = true;
  showMoveDialog.value = true;
};

const closeMoveDialog = () => {
  showMoveDialog.value = false;
  batchMoveDialog.value = false;
  movingImage.value = null;
};

const previewImage = (img: ImageItem) => {
  window.open(getFullImageUrl(img.url), "_blank");
};

const copyImageLink = async (img: ImageItem) => {
  try {
    await navigator.clipboard.writeText(getFullImageUrl(img.url));
    success("链接已复制");
  } catch (e: any) {
    error(e.message || "复制失败");
  }
};

const prevPage = () => {
  if (pagination.page > 1) {
    pagination.page--;
    fetchImages();
  }
};

const nextPage = () => {
  if (pagination.page < Math.ceil(pagination.total / pagination.limit)) {
    pagination.page++;
    fetchImages();
  }
};

watch(selectedGroup, () => {
  pagination.page = 1;
  fetchImages();
});

onMounted(async () => {
  await loadConfig();
  await fetchGroups();
});
</script>
