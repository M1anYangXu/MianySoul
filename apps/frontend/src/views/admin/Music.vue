<template>
  <div class="max-w-6xl mx-auto">
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
            🎵 {{ moduleName }}
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ moduleDescription }}
          </p>
        </div>
        <button
          class="px-6 py-2.5 gradient-success text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          @click="openAddModal"
        >
          + 添加歌词
        </button>
      </div>
    </div>

    <div class="table-container">
      <div class="p-5 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
        <div class="flex items-center gap-3">
          <div class="relative flex-1 max-w-md">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索歌手、歌名或歌词..."
              class="w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 text-base"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
            />
          </div>
          <button
            class="px-5 py-3 rounded-xl border transition-colors text-base font-medium"
            :class="
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            "
            @click="searchKeyword = ''"
          >
            重置
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>歌手</th>
              <th>歌名</th>
              <th>歌词段</th>
              <th>状态</th>
              <th>排序</th>
              <th class="text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lyric in filteredLyrics" :key="lyric.id">
              <td>
                <span class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ lyric.singer }}
                </span>
              </td>
              <td>
                <span class="font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-800'">
                  {{ lyric.songName }}
                </span>
              </td>
              <td class="lyric-cell">
                <div
                  class="cursor-help"
                  :class="isDark ? 'text-gray-400' : 'text-gray-600'"
                  :title="lyric.lyric"
                >
                  {{ truncateText(lyric.lyric, 30) }}
                </div>
              </td>
              <td>
                <span
                  class="status-badge"
                  :class="lyric.isActive ? 'status-badge-active' : 'status-badge-inactive'"
                >
                  {{ lyric.isActive ? "启用" : "禁用" }}
                </span>
              </td>
              <td>
                <span :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  {{ lyric.sortOrder }}
                </span>
              </td>
              <td>
                <div class="flex items-center justify-center space-x-2">
                  <button class="btn-action btn-action-edit" @click="openEditModal(lyric)">
                    编辑
                  </button>
                  <button class="btn-action btn-action-status" @click="toggleLyricStatus(lyric)">
                    {{ lyric.isActive ? "禁用" : "启用" }}
                  </button>
                  <button class="btn-action btn-action-danger" @click="deleteLyric(lyric)">
                    删除
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="lyrics.length === 0">
              <td
                colspan="6"
                class="py-16 text-center"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                暂无歌词数据
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-2xl rounded-xl shadow-xl overflow-hidden"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div class="p-6 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <h2 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-black'">
            {{ editingLyric ? "编辑歌词" : "添加歌词" }}
          </h2>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              歌手
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.singer"
              type="text"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
              placeholder="例如: 周杰伦"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              歌名
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.songName"
              type="text"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
              placeholder="例如: 晴天"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              歌词段
              <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.lyric"
              rows="6"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 resize-none"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
              placeholder="输入歌词内容，支持换行"
            ></textarea>
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              封面图片
            </label>
            <div class="flex space-x-3">
              <button
                class="flex-1 px-4 py-3 rounded-xl border border-dashed text-sm flex items-center justify-center space-x-2 transition-colors"
                :class="
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                "
                @click="openCoverPicker"
              >
                <span>🖼️</span>
                <span>{{ form.coverImage ? "更换封面" : "从图集中选择封面" }}</span>
              </button>
              <button
                v-if="form.coverImage"
                class="px-4 py-3 rounded-xl border text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                @click="form.coverImage = ''"
              >
                移除
              </button>
            </div>
            <div v-if="form.coverImage" class="mt-3">
              <div class="relative w-32 h-32 rounded-lg overflow-hidden">
                <img
                  :src="getFullImageUrl(form.coverImage)"
                  alt="封面预览"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              排序
            </label>
            <input
              v-model.number="form.sortOrder"
              type="number"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
              placeholder="0"
            />
          </div>
        </div>

        <div
          class="p-6 border-t flex justify-end space-x-4"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <button
            class="px-6 py-2.5 border rounded-xl font-medium transition-colors"
            :class="
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            "
            @click="closeModal"
          >
            取消
          </button>
          <button
            :disabled="saving"
            class="px-6 py-2.5 gradient-success text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            @click="saveLyric"
          >
            {{ saving ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>

    <!-- 封面图片选择弹窗 -->
    <div
      v-if="showCoverPicker"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showCoverPicker = false"
    >
      <div
        class="w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div class="p-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              选择封面图片
            </h3>
            <button
              class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="showCoverPicker = false"
            >
              ✕
            </button>
          </div>
          <div class="flex flex-wrap gap-2 mt-3">
            <button
              v-for="group in imageGroups"
              :key="group.id"
              class="px-3 py-1.5 rounded-full text-sm transition-all"
              :class="
                selectedGroupId === group.id
                  ? 'bg-cyan-500 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              "
              @click="selectedGroupId = group.id"
            >
              {{ group.icon }} {{ group.name }}
            </button>
          </div>
        </div>
        <div class="p-4 overflow-y-auto max-h-[60vh]">
          <div
            v-if="imagesLoading"
            class="text-center py-8"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            加载中...
          </div>
          <div
            v-else-if="filteredImages.length === 0"
            class="text-center py-12"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            <div class="text-4xl mb-3">📷</div>
            <p>该分组暂无图片</p>
            <p class="text-sm mt-1">请选择其他分组或先上传图片</p>
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="img in filteredImages"
              :key="img.id"
              class="relative cursor-pointer rounded-lg overflow-hidden border-2 hover:border-cyan-500 transition-all group"
              :class="
                form.coverImage === img.url
                  ? 'border-cyan-500 ring-2 ring-cyan-500/50'
                  : isDark
                    ? 'border-gray-700'
                    : 'border-gray-200'
              "
              @click="selectCoverImage(img)"
            >
              <img
                :src="getFullImageUrl(img.url)"
                :alt="img.filename"
                class="w-full h-32 object-cover"
              />
              <div
                v-if="form.coverImage === img.url"
                class="absolute inset-0 bg-black/40 flex items-center justify-center"
              >
                <span class="text-white text-xl">✓</span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="p-4 border-t flex justify-end space-x-3"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <button
            class="px-4 py-2 rounded-xl border text-sm font-medium transition-colors"
            :class="
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            "
            @click="showCoverPicker = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-xl gradient-success text-white text-sm font-medium"
            @click="confirmCoverImage"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useAppStore } from "@/stores/app";
import { useMessage, useModuleConfig } from "@/composables";
import { http } from "@/utils/request";

const appStore = useAppStore();
const { success, error, warning } = useMessage();
const { getModuleName, getModuleDescription, loadConfig } = useModuleConfig();

const isDark = computed(() => appStore.themeMode === "dark");

const moduleName = computed(() => getModuleName("music"));
const moduleDescription = computed(() => getModuleDescription("music"));

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

interface MusicLyric {
  id: string;
  singer: string;
  songName: string;
  lyric: string;
  coverImage?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Image {
  id: string;
  url: string;
  filename: string;
  group?: { id: string; name: string };
}

interface ImageGroup {
  id: string;
  name: string;
  icon: string;
}

const lyrics = ref<MusicLyric[]>([]);
const searchKeyword = ref("");
const showModal = ref(false);
const editingLyric = ref<MusicLyric | null>(null);
const saving = ref(false);

const form = reactive({
  singer: "",
  songName: "",
  lyric: "",
  coverImage: "",
  sortOrder: 0,
});

const showCoverPicker = ref(false);
const images = ref<Image[]>([]);
const imagesLoading = ref(false);
const imageGroups = ref<ImageGroup[]>([]);
const selectedGroupId = ref<string | null>(null);
const tempCoverImage = ref("");

const filteredImages = computed(() => {
  if (!selectedGroupId.value) {
    return [];
  }
  return images.value.filter((img) => img.group?.id === selectedGroupId.value);
});

const filteredLyrics = computed(() => {
  if (!searchKeyword.value) return lyrics.value;
  const keyword = searchKeyword.value.toLowerCase();
  return lyrics.value.filter(
    (lyric) =>
      lyric.singer.toLowerCase().includes(keyword) ||
      lyric.songName.toLowerCase().includes(keyword) ||
      lyric.lyric.toLowerCase().includes(keyword)
  );
});

const fetchLyrics = async () => {
  try {
    lyrics.value = await http.get<MusicLyric[]>("/music?activeOnly=false");
  } catch (err) {
    error("获取歌词列表失败");
  }
};

const openAddModal = () => {
  editingLyric.value = null;
  form.singer = "";
  form.songName = "";
  form.lyric = "";
  form.coverImage = "";
  form.sortOrder = 0;
  showModal.value = true;
};

const openEditModal = (lyric: MusicLyric) => {
  editingLyric.value = lyric;
  form.singer = lyric.singer;
  form.songName = lyric.songName;
  form.lyric = lyric.lyric;
  form.coverImage = lyric.coverImage || "";
  form.sortOrder = lyric.sortOrder;
  showModal.value = true;
};

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
};

const fetchImages = async () => {
  imagesLoading.value = true;
  try {
    images.value = await http.get<Image[]>("/gallery/images");
    imageGroups.value = await http.get<ImageGroup[]>("/gallery/groups");
    const defaultGroup = imageGroups.value.find((g) => g.name === "默认分组");
    selectedGroupId.value = defaultGroup?.id || null;
  } catch (e: any) {
    images.value = [];
    imageGroups.value = [];
    selectedGroupId.value = null;
  } finally {
    imagesLoading.value = false;
  }
};

const openCoverPicker = () => {
  tempCoverImage.value = form.coverImage;
  fetchImages();
  showCoverPicker.value = true;
};

const selectCoverImage = (img: Image) => {
  tempCoverImage.value = img.url;
};

const confirmCoverImage = () => {
  form.coverImage = tempCoverImage.value;
  showCoverPicker.value = false;
};

const closeModal = () => {
  showModal.value = false;
  editingLyric.value = null;
};

const saveLyric = async () => {
  if (!form.singer || !form.songName || !form.lyric) {
    warning("请填写所有必填项");
    return;
  }

  saving.value = true;
  try {
    if (editingLyric.value) {
      await http.put(`/music/${editingLyric.value.id}`, {
        singer: form.singer,
        songName: form.songName,
        lyric: form.lyric,
        coverImage: form.coverImage,
        sortOrder: form.sortOrder,
      });
      success("歌词更新成功");
    } else {
      await http.post("/music", {
        singer: form.singer,
        songName: form.songName,
        lyric: form.lyric,
        coverImage: form.coverImage,
        sortOrder: form.sortOrder,
      });
      success("歌词添加成功");
    }
    closeModal();
    await fetchLyrics();
  } catch (err) {
    error(editingLyric.value ? "更新歌词失败" : "添加歌词失败");
  } finally {
    saving.value = false;
  }
};

const toggleLyricStatus = async (lyric: MusicLyric) => {
  try {
    await http.put(`/music/${lyric.id}`, {
      isActive: !lyric.isActive,
    });
    success(lyric.isActive ? "歌词已禁用" : "歌词已启用");
    await fetchLyrics();
  } catch (err) {
    error("操作失败");
  }
};

const deleteLyric = async (lyric: MusicLyric) => {
  try {
    await http.delete(`/music/${lyric.id}`);
    success("歌词删除成功");
    await fetchLyrics();
  } catch (err) {
    error("删除失败");
  }
};

onMounted(async () => {
  await loadConfig();
  fetchLyrics();
});
</script>

<style scoped>
.cursor-help {
  cursor: help;
}

.cursor-help:hover {
  opacity: 0.8;
}

.lyric-cell {
  max-width: 400px;
  white-space: normal;
}
</style>
