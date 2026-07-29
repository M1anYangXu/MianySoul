<template>
  <div class="audio-page max-w-6xl mx-auto">
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
            <Music class="w-7 h-7 inline mr-2" />
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
          <AppIcon :icon="group.icon" :size="16" />
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
            {{ group._count.audios }}
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

    <div v-if="selectedGroup" class="space-y-4">
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
            class="px-6 py-2.5 rounded-lg gradient-secondary text-white font-medium flex items-center space-x-2 hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            @click="showUploadDialog = true"
          >
            <Upload class="w-4 h-4" />
            <span>上传音频</span>
          </button>
        </div>
      </div>

      <div
        v-if="audiosLoading"
        class="text-center py-8"
        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
      >
        加载中...
      </div>
      <div
        v-else-if="audios.length === 0"
        class="text-center py-12 rounded-xl border-2 border-dashed"
        :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'"
      >
        <Music class="w-12 h-12 mx-auto mb-3" :class="isDark ? 'text-gray-500' : 'text-gray-400'" />
        <p>该分组还没有音频</p>
        <p class="text-sm mt-1">点击上方按钮上传音频</p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="audio in audios"
          :key="audio.id"
          class="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-md group"
          :class="
            isDark
              ? 'bg-gray-800/60 border-gray-700/50 hover:border-cyan-500/30'
              : 'bg-white border-gray-200/50 hover:border-cyan-200'
          "
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center"
            :class="isDark ? 'bg-gray-700' : 'bg-gray-100'"
          >
            <Music class="w-6 h-6" :class="isDark ? 'text-gray-500' : 'text-gray-400'" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-medium truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ audio.filename }}
              </h3>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ formatFileSize(audio.size) }}
              </span>
              <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ audio.mimetype }}
              </span>
              <span v-if="audio.duration" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ formatDuration(audio.duration) }}
              </span>
            </div>
          </div>

          <div class="flex-shrink-0 flex items-center gap-4">
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="[
                playingId === audio.id
                  ? 'text-violet-500 animate-pulse'
                  : isDark
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-gray-900',
              ]"
              title="播放"
              @click="toggleAudio(audio)"
            >
              <component :is="playingId === audio.id ? Pause : Play" class="w-5 h-5" />
            </button>
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              "
              title="移动到分组"
              @click="openMoveDialog(audio)"
            >
              <Folder class="w-5 h-5" />
            </button>
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
              :class="
                isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
              "
              title="删除"
              @click="deleteAudio(audio)"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

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
          <div>
            <label class="block text-sm mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              图标
            </label>
            <IconPicker v-model="groupForm.icon" placeholder="搜索或输入图标名" />
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
          上传音频
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
              点击或拖拽音频到此处上传
            </p>
            <p class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
              支持 MP3、WAV、OGG、M4A
            </p>
          </div>
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="audio/*"
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
          移动音频
        </h2>
        <div class="space-y-2">
          <div
            v-for="group in availableGroups"
            :key="group.id"
            class="p-3 rounded-lg border cursor-pointer transition-all"
            :class="[
              movingAudio?.groupId === group.id
                ? isDark
                  ? 'bg-gray-700 border-purple-500'
                  : 'bg-purple-50 border-purple-500'
                : isDark
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : 'bg-white border-gray-200 hover:border-gray-300',
            ]"
            @click="moveAudioTo(group)"
          >
            <div class="flex items-center space-x-2">
              <AppIcon :icon="group.icon" :size="16" />
              <span class="text-sm" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ group.name }}
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
import { ref, reactive, onMounted, computed, watch, onUnmounted } from "vue";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";
import { useMessage, useModuleConfig } from "@/composables";
import AppIcon from "@/components/AppIcon.vue";
import IconPicker from "@/components/IconPicker.vue";
import { useIcon } from "@/composables/useIcon";
import { Upload, Edit3, Trash2, Play, Pause } from "lucide-vue-next";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");
const { success, error } = useMessage();
const { getModuleName, getModuleDescription, loadConfig } = useModuleConfig();
const { formatIconName } = useIcon();

const moduleName = computed(() => getModuleName("audio"));
const moduleDescription = computed(() => getModuleDescription("audio"));

interface AudioGroup {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  isDefault: boolean;
  _count: { audios: number };
}

interface Audio {
  id: string;
  groupId: string | null;
  filename: string;
  url: string;
  size: number;
  mimetype: string;
  duration?: number;
}

const groups = ref<AudioGroup[]>([]);
const selectedGroup = ref<AudioGroup | null>(null);
const audios = ref<Audio[]>([]);
const audiosLoading = ref(true);

const showGroupDialog = ref(false);
const editingGroup = ref<AudioGroup | null>(null);
const groupForm = reactive({ name: "", description: "", icon: "📁" });

const showUploadDialog = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const uploadProgress = ref<Array<{ filename: string; percent: number }>>([]);
const uploadStatus = ref("");

const showMoveDialog = ref(false);
const movingAudio = ref<Audio | null>(null);

const playingId = ref<string | null>(null);
const audioRef = ref<HTMLAudioElement | null>(null);

const availableGroups = computed(() => {
  return groups.value;
});

const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const getFullAudioUrl = (url: string): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}/uploads/${url}`;
};

const toggleAudio = (audio: Audio) => {
  if (playingId.value === audio.id) {
    audioRef.value?.pause();
    playingId.value = null;
  } else {
    audioRef.value?.pause();
    const fullUrl = getFullAudioUrl(audio.url);
    audioRef.value = new Audio(fullUrl);
    audioRef.value.play().catch((e) => {
      console.error("播放失败:", e);
      error("播放失败，请检查音频文件");
      playingId.value = null;
    });
    audioRef.value.onended = () => {
      playingId.value = null;
    };
    playingId.value = audio.id;
  }
};

const fetchGroups = async () => {
  try {
    groups.value = await http.get<AudioGroup[]>("/audio/groups");
    const defaultGroup = groups.value.find((g) => g.isDefault);
    selectedGroup.value = defaultGroup || groups.value[0] || null;
  } catch (e) {
    error(e instanceof Error ? e.message : "加载分组失败");
  }
};

interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const fetchAudios = async () => {
  if (!selectedGroup.value) return;
  audiosLoading.value = true;
  try {
    const data = await http.get<PaginationResult<Audio>>(
      `/audio/groups/${selectedGroup.value.id}/audios?pageSize=100`
    );
    audios.value = data.list;
  } catch (e) {
    error(e instanceof Error ? e.message : "加载音频失败");
  } finally {
    audiosLoading.value = false;
  }
};

const selectGroup = (group: AudioGroup) => {
  selectedGroup.value = group;
};

watch(selectedGroup, () => {
  fetchAudios();
});

const openGroupDialog = (group?: AudioGroup) => {
  if (group) {
    editingGroup.value = group;
    groupForm.name = group.name;
    groupForm.description = group.description || "";
    groupForm.icon = group.icon;
  } else {
    editingGroup.value = null;
    groupForm.name = "";
    groupForm.description = "";
    groupForm.icon = "mdi:folder";
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
      await http.put(`/audio/groups/${editingGroup.value.id}`, payload);
      success("更新成功");
    } else {
      await http.post("/audio/groups", payload);
      success("创建成功");
    }
    showGroupDialog.value = false;
    await fetchGroups();
    await fetchAudios();
  } catch (e) {
    error(e instanceof Error ? e.message : "保存失败");
  }
};

const deleteGroup = async (group: AudioGroup) => {
  if (!confirm(`确定删除「${group.name}」分组吗？`)) return;
  try {
    await http.delete(`/audio/groups/${group.id}`);
    success("删除成功");
    await fetchGroups();
    if (selectedGroup.value?.id === group.id) {
      selectedGroup.value = groups.value[0] || null;
      await fetchAudios();
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
      uploadProgress.value[i].percent = 10;

      const formData = new FormData();
      formData.append("file", file);

      await http.post(`/audio/upload?groupId=${selectedGroup.value?.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      uploadProgress.value[i].percent = 100;
    }

    uploadStatus.value = "上传完成！";
    success(`成功上传 ${files.length} 个音频`);
    showUploadDialog.value = false;
    await fetchAudios();
  } catch (e) {
    error(e instanceof Error ? e.message : "上传失败");
  } finally {
    uploading.value = false;
    if (fileInput.value) fileInput.value.value = "";
  }
};

const openMoveDialog = (audio: Audio) => {
  movingAudio.value = audio;
  showMoveDialog.value = true;
};

const moveAudioTo = async (group: AudioGroup | null) => {
  if (!movingAudio.value) return;
  try {
    await http.put(`/audio/${movingAudio.value.id}/move`, {
      groupId: group?.id || null,
    });
    success("移动成功");
    showMoveDialog.value = false;
    movingAudio.value = null;
    await fetchAudios();
    await fetchGroups();
  } catch (e) {
    error(e instanceof Error ? e.message : "移动失败");
  }
};

const deleteAudio = async (audio: Audio) => {
  if (!confirm(`确定删除「${audio.filename}」吗？`)) return;
  try {
    await http.delete(`/audio/${audio.id}`);
    success("删除成功");
    await fetchAudios();
    await fetchGroups();
  } catch (e) {
    error(e instanceof Error ? e.message : "删除失败");
  }
};

onMounted(async () => {
  await loadConfig();
  await fetchGroups();
});

onUnmounted(() => {
  audioRef.value?.pause();
});
</script>
