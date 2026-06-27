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
            🎵 音乐歌词管理
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            管理歌词段的信息，用于前端花哨展示
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useAppStore } from "@/stores/app";
import { useMessage } from "@/composables/useMessage";
import { http } from "@/utils/request";

const appStore = useAppStore();
const { success, error, warning } = useMessage();

const isDark = computed(() => appStore.themeMode === "dark");

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
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  sortOrder: 0,
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
  form.sortOrder = 0;
  showModal.value = true;
};

const openEditModal = (lyric: MusicLyric) => {
  editingLyric.value = lyric;
  form.singer = lyric.singer;
  form.songName = lyric.songName;
  form.lyric = lyric.lyric;
  form.sortOrder = lyric.sortOrder;
  showModal.value = true;
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
        sortOrder: form.sortOrder,
      });
      success("歌词更新成功");
    } else {
      await http.post("/music", {
        singer: form.singer,
        songName: form.songName,
        lyric: form.lyric,
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

onMounted(() => {
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
