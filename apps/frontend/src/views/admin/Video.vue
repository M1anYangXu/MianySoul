<template>
  <div class="video-page max-w-6xl mx-auto">
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
            🎬 {{ moduleName }}
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

    <!-- 分组列表 -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
      <div
        v-for="group in groups"
        :key="group.id"
        class="relative p-4 rounded-xl border cursor-pointer transition-all"
        :class="[
          selectedGroup?.id === group.id
            ? isDark
              ? 'bg-gray-700 border-purple-500 ring-2 ring-purple-500/30'
              : 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/30'
            : isDark
              ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
              : 'bg-white border-gray-200 hover:border-gray-300',
          group.isDefault ? 'ring-1 ring-purple-500/50' : '',
        ]"
        @click="selectGroup(group)"
      >
        <div class="flex items-start justify-between">
          <span class="text-2xl">{{ group.icon }}</span>
          <div class="flex space-x-1 opacity-0 hover:opacity-100 transition-opacity">
            <button
              v-if="!group.isDefault"
              class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              @click.stop="openGroupDialog(group)"
            >
              ✏️
            </button>
            <button
              v-if="!group.isDefault"
              class="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
              @click.stop="deleteGroup(group)"
            >
              🗑️
            </button>
          </div>
        </div>
        <h3 class="font-semibold text-sm mt-2" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ group.name }}
          <span
            v-if="group.isDefault"
            class="text-xs ml-1 px-1 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
          >
            默认
          </span>
        </h3>
        <p class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
          {{ group._count.videos }} 个视频
        </p>
      </div>
    </div>

    <!-- 视频区域 -->
    <div v-if="selectedGroup" class="space-y-4">
      <!-- 上传按钮 -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ selectedGroup.icon }} {{ selectedGroup.name }}
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
            <span>📤</span>
            <span>上传视频</span>
          </button>
        </div>
      </div>

      <!-- 视频网格 -->
      <div
        v-if="videosLoading"
        class="text-center py-8"
        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
      >
        加载中...
      </div>
      <div
        v-else-if="videos.length === 0"
        class="text-center py-12 rounded-xl border-2 border-dashed"
        :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'"
      >
        <div class="text-4xl mb-3">🎬</div>
        <p>该分组还没有视频</p>
        <p class="text-sm mt-1">点击上方按钮上传视频</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="video in videos"
          :key="video.id"
          class="relative group rounded-lg overflow-hidden border"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <div class="aspect-video bg-gray-900 dark:bg-gray-800 flex items-center justify-center">
            <video
              :src="getFullVideoUrl(video.url)"
              :poster="video.thumbnail ? getFullVideoUrl(video.thumbnail) : ''"
              class="w-full h-full object-cover"
              controls
              muted
            />
          </div>
          <div
            class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center"
          >
            <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                class="p-2 rounded-lg bg-white/90 text-gray-700 hover:bg-white"
                @click="openMoveDialog(video)"
              >
                📁
              </button>
              <button
                class="p-2 rounded-lg bg-red-500/90 text-white hover:bg-red-500"
                @click="deleteVideo(video)"
              >
                🗑️
              </button>
            </div>
          </div>
          <div
            class="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/60 to-transparent"
          >
            <p class="text-xs text-white truncate">{{ video.filename }}</p>
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
              v-for="emoji in iconOptions"
              :key="emoji"
              class="w-8 h-8 rounded text-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="
                groupForm.icon === emoji
                  ? 'ring-2 ring-purple-500 bg-purple-100 dark:bg-purple-900/30'
                  : ''
              "
              @click="groupForm.icon = emoji"
            >
              {{ emoji }}
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
          上传视频
        </h2>
        <div class="space-y-4">
          <div
            class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
            :class="isDark ? 'border-gray-700' : 'border-gray-300'"
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <div class="text-4xl mb-3">📤</div>
            <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              点击或拖拽视频到此处上传
            </p>
            <p class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
              支持 MP4、WebM、AVI、MOV
            </p>
          </div>
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="video/*"
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

    <!-- 移动视频弹窗 -->
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
          移动视频
        </h2>
        <div class="space-y-2">
          <div
            v-for="group in availableGroups"
            :key="group.id"
            class="p-3 rounded-lg border cursor-pointer transition-all"
            :class="[
              movingVideo?.groupId === group.id
                ? isDark
                  ? 'bg-gray-700 border-purple-500'
                  : 'bg-purple-50 border-purple-500'
                : isDark
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : 'bg-white border-gray-200 hover:border-gray-300',
            ]"
            @click="moveVideoTo(group)"
          >
            <div class="flex items-center space-x-2">
              <span>{{ group.icon }}</span>
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
          <div
            class="p-3 rounded-lg border cursor-pointer transition-all"
            :class="[
              !movingVideo?.groupId
                ? isDark
                  ? 'bg-gray-700 border-purple-500'
                  : 'bg-purple-50 border-purple-500'
                : isDark
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : 'bg-white border-gray-200 hover:border-gray-300',
            ]"
            @click="moveVideoTo(null)"
          >
            <div class="flex items-center space-x-2">
              <span>📁</span>
              <span class="text-sm" :class="isDark ? 'text-white' : 'text-gray-900'">不分组</span>
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
import { getAccessToken } from "@/utils/auth-token";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");
const { success, error } = useMessage();
const { getModuleName, getModuleDescription, loadConfig } = useModuleConfig();

const moduleName = computed(() => getModuleName("video"));
const moduleDescription = computed(() => getModuleDescription("video"));

const iconOptions = ["📁", "🎬", "🎥", "📽️", "🎞️", "📺", "🎟️", "📹", "💾", "📂"];

interface VideoGroup {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  isDefault: boolean;
  sortOrder: number;
  _count: { videos: number };
}

interface Video {
  id: string;
  groupId: string | null;
  filename: string;
  url: string;
  thumbnail: string | null;
  size: number;
  mimetype: string;
  duration: number | null;
  createdAt: string;
}

const groups = ref<VideoGroup[]>([]);
const selectedGroup = ref<VideoGroup | null>(null);
const videos = ref<Video[]>([]);
const videosLoading = ref(true);

const showGroupDialog = ref(false);
const editingGroup = ref<VideoGroup | null>(null);
const groupForm = reactive({ name: "", description: "", icon: "📁" });

const showUploadDialog = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const uploadProgress = ref<Array<{ filename: string; percent: number }>>([]);
const uploadStatus = ref("");

const showMoveDialog = ref(false);
const movingVideo = ref<Video | null>(null);

const availableGroups = computed(() => {
  return groups.value;
});

const getFullVideoUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  // 确保返回正确的路径
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
};

const fetchGroups = async () => {
  try {
    groups.value = await http.get<VideoGroup[]>("/video/groups");
    const defaultGroup = groups.value.find((g) => g.isDefault);
    selectedGroup.value = defaultGroup || groups.value[0] || null;
  } catch (e) {
    error(e instanceof Error ? e.message : "加载分组失败");
  }
};

const fetchVideos = async () => {
  if (!selectedGroup.value) return;
  videosLoading.value = true;
  try {
    videos.value = await http.get<Video[]>(`/video/groups/${selectedGroup.value.id}/videos`);
  } catch (e) {
    error(e instanceof Error ? e.message : "加载视频失败");
  } finally {
    videosLoading.value = false;
  }
};

const selectGroup = (group: VideoGroup) => {
  selectedGroup.value = group;
};

const openGroupDialog = (group?: VideoGroup) => {
  if (group) {
    editingGroup.value = group;
    groupForm.name = group.name;
    groupForm.description = group.description || "";
    groupForm.icon = group.icon;
  } else {
    editingGroup.value = null;
    groupForm.name = "";
    groupForm.description = "";
    groupForm.icon = "📁";
  }
  showGroupDialog.value = true;
};

const saveGroup = async () => {
  try {
    if (editingGroup.value) {
      await http.put(`/video/groups/${editingGroup.value.id}`, groupForm);
      success("更新成功");
    } else {
      await http.post("/video/groups", groupForm);
      success("创建成功");
    }
    showGroupDialog.value = false;
    await fetchGroups();
    await fetchVideos();
  } catch (e) {
    error(e instanceof Error ? e.message : "保存失败");
  }
};

const deleteGroup = async (group: VideoGroup) => {
  if (!confirm(`确定删除「${group.name}」分组吗？`)) return;
  try {
    await http.delete(`/video/groups/${group.id}`);
    success("删除成功");
    await fetchGroups();
    if (selectedGroup.value?.id === group.id) {
      selectedGroup.value = groups.value[0] || null;
      await fetchVideos();
    }
  } catch (e) {
    error(e instanceof Error ? e.message : "删除失败");
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

      const formData = new FormData();
      formData.append("files", file);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `${import.meta.env.VITE_API_BASE_URL}/api/video/upload?groupId=${selectedGroup.value!.id}`
        );

        const token = getAccessToken();
        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            uploadProgress.value[i] = { filename: file.name, percent };
          }
        });

        xhr.addEventListener("load", () => {
          uploadProgress.value[i] = { filename: file.name, percent: 100 };
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error("上传失败"));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("网络错误"));
        });

        xhr.send(formData);
      });
    }

    uploadStatus.value = "上传完成！";
    success(`成功上传 ${files.length} 个视频`);
    showUploadDialog.value = false;
    await fetchVideos();
  } catch (e) {
    error(e instanceof Error ? e.message : "上传失败");
  } finally {
    uploading.value = false;
    uploadProgress.value = [];
    uploadStatus.value = "";
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  }
};

const openMoveDialog = (video: Video) => {
  movingVideo.value = video;
  showMoveDialog.value = true;
};

const moveVideoTo = async (group: VideoGroup | null) => {
  if (!movingVideo.value) return;
  try {
    await http.put(`/video/videos/${movingVideo.value.id}/move`, {
      groupId: group?.id || null,
    });
    success("移动成功");
    showMoveDialog.value = false;
    movingVideo.value = null;
    await fetchVideos();
  } catch (e) {
    error(e instanceof Error ? e.message : "移动失败");
  }
};

const deleteVideo = async (video: Video) => {
  if (!confirm(`确定删除「${video.filename}」吗？`)) return;
  try {
    await http.delete(`/video/videos/${video.id}`);
    success("删除成功");
    await fetchVideos();
  } catch (e) {
    error(e instanceof Error ? e.message : "删除失败");
  }
};

watch(selectedGroup, () => {
  fetchVideos();
});

onMounted(async () => {
  await loadConfig();
  await fetchGroups();
});
</script>
