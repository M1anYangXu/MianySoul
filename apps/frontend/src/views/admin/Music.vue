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
        <div class="flex items-center space-x-3">
          <button
            class="px-4 py-2 rounded-xl border font-medium hover:opacity-90 transition-all duration-300"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            "
            @click="openCategoryModal"
          >
            📁 分类管理
          </button>
          <button
            class="px-6 py-2 gradient-success text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            @click="openAddModal"
          >
            + 添加歌词
          </button>
        </div>
      </div>
    </div>

    <div
      class="rounded-xl border p-4 mb-6"
      :class="isDark ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white border-gray-200/50'"
    >
      <div class="flex items-center gap-3">
        <div class="relative flex-1 max-w-md">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索歌手、歌名或歌词..."
            class="w-full pl-11 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 text-base"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                : 'border-gray-200 bg-white text-black placeholder-gray-400'
            "
          />
        </div>

        <div ref="filterCategoryRef" class="relative">
          <button
            type="button"
            class="px-4 py-2.5 rounded-xl border min-w-[140px] flex items-center justify-between gap-2 transition-colors"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600'
                : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
            "
            @click="filterCategoryOpen = !filterCategoryOpen"
          >
            <span class="truncate">{{ getFilterCategoryLabel() }}</span>
            <svg
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': filterCategoryOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            v-if="filterCategoryOpen"
            class="absolute z-20 mt-2 w-56 max-h-64 overflow-y-auto rounded-xl border shadow-lg"
            :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'"
          >
            <button
              type="button"
              class="w-full px-4 py-2 text-left text-sm transition-colors"
              :class="
                filterCategory === ''
                  ? isDark
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'bg-cyan-50 text-cyan-600'
                  : isDark
                    ? 'hover:bg-gray-600 text-gray-200'
                    : 'hover:bg-gray-50 text-gray-800'
              "
              @click="selectFilterCategory('')"
            >
              全部分类
            </button>
            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              class="w-full px-4 py-2 text-left text-sm transition-colors"
              :class="
                filterCategory === cat
                  ? isDark
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'bg-cyan-50 text-cyan-600'
                  : isDark
                    ? 'hover:bg-gray-600 text-gray-200'
                    : 'hover:bg-gray-50 text-gray-800'
              "
              @click="selectFilterCategory(cat)"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <button
          class="px-5 py-2.5 rounded-xl border transition-colors text-base font-medium"
          :class="
            isDark
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          "
          @click="resetFilter"
        >
          重置
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <div
        v-for="lyric in filteredLyrics"
        :key="lyric.id"
        class="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-md group"
        :class="
          isDark
            ? 'bg-gray-800/60 border-gray-700/50 hover:border-cyan-500/30'
            : 'bg-white border-gray-200/50 hover:border-cyan-200'
        "
      >
        <div class="flex-shrink-0">
          <img
            v-if="lyric.coverImage"
            :src="getFullImageUrl(lyric.coverImage)"
            :alt="lyric.songName"
            class="w-16 h-16 object-cover rounded-lg"
          />
          <span
            v-else
            class="w-16 h-16 flex items-center justify-center rounded-lg text-2xl"
            :class="isDark ? 'bg-gray-700' : 'bg-gray-100'"
          >
            🎵
          </span>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h3
              class="font-medium truncate cursor-pointer transition-colors"
              :class="
                isDark
                  ? 'text-white group-hover:text-cyan-300'
                  : 'text-gray-900 group-hover:text-cyan-600'
              "
              @click="openEditModal(lyric)"
            >
              {{ lyric.songName }}
            </h3>
            <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              - {{ lyric.singer }}
            </span>
            <span
              class="w-2 h-2 rounded-full flex-shrink-0"
              :class="lyric.isActive ? 'bg-green-500' : 'bg-yellow-500'"
            ></span>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <span
              class="truncate line-clamp-1"
              :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              :title="lyric.lyric"
            >
              {{ truncateText(lyric.lyric, 50) }}
            </span>
          </div>
        </div>

        <div class="flex-shrink-0 flex items-center gap-4">
          <span
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-600'"
          >
            {{ lyric.category }}
          </span>
          <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            排序 {{ lyric.sortOrder }}
          </span>
          <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            {{ lyric.isActive ? "启用" : "禁用" }}
          </span>
          <div class="flex items-center gap-2">
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              "
              title="编辑"
              @click="openEditModal(lyric)"
            >
              ✏️
            </button>
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              "
              :title="lyric.isActive ? '禁用' : '启用'"
              @click="toggleLyricStatus(lyric)"
            >
              {{ lyric.isActive ? "⏸️" : "▶️" }}
            </button>
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
              :class="
                isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
              "
              title="删除"
              @click="deleteLyric(lyric)"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div v-if="lyrics.length === 0" class="text-center py-16">
        <div class="text-5xl mb-4">🎵</div>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">暂无歌词数据</p>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-lg rounded-xl shadow-xl overflow-hidden"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div class="p-5 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <h2 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-black'">
            {{ editingLyric ? "编辑歌词" : "添加歌词" }}
          </h2>
        </div>

        <div class="p-5 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-sm font-medium mb-1.5"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                歌手
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.singer"
                type="text"
                class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
                :class="
                  isDark
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                    : 'border-gray-200 bg-white text-black placeholder-gray-400'
                "
                placeholder="歌手名"
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium mb-1.5"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                歌名
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.songName"
                type="text"
                class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
                :class="
                  isDark
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                    : 'border-gray-200 bg-white text-black placeholder-gray-400'
                "
                placeholder="歌曲名"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-1.5"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              歌词段
              <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.lyric"
              rows="5"
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 resize-none"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
              placeholder="输入歌词内容"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-sm font-medium mb-1.5"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                分类
              </label>
              <select
                v-model="form.category"
                class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
                :class="
                  isDark
                    ? 'border-gray-600 bg-gray-700 text-white'
                    : 'border-gray-200 bg-white text-black'
                "
              >
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label
                class="block text-sm font-medium mb-1.5"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                排序
              </label>
              <input
                v-model.number="form.sortOrder"
                type="number"
                class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
                :class="
                  isDark
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                    : 'border-gray-200 bg-white text-black placeholder-gray-400'
                "
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-1.5"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              封面图片
            </label>
            <div class="flex space-x-2">
              <button
                class="flex-1 px-3 py-2 rounded-lg border border-dashed text-sm flex items-center justify-center space-x-2 transition-colors"
                :class="
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                "
                @click="openCoverPicker"
              >
                <span>🖼️</span>
                <span>{{ form.coverImage ? "更换封面" : "选择封面" }}</span>
              </button>
              <button
                v-if="form.coverImage"
                class="px-3 py-2 rounded-lg border text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                @click="form.coverImage = ''"
              >
                移除
              </button>
            </div>
            <div v-if="form.coverImage" class="mt-2">
              <div class="relative w-24 h-24 rounded-lg overflow-hidden">
                <img
                  :src="getFullImageUrl(form.coverImage)"
                  alt="封面预览"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          class="p-5 border-t flex justify-end space-x-3"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <button
            class="px-5 py-2 border rounded-lg font-medium transition-colors"
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
            class="px-5 py-2 gradient-success text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            @click="saveLyric"
          >
            {{ saving ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showCategoryModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showCategoryModal = false"
    >
      <div
        class="w-full max-w-md rounded-xl shadow-xl overflow-hidden"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div class="p-5 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <h2 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-black'">分类管理</h2>
        </div>

        <div class="p-5">
          <div class="flex gap-2 mb-4">
            <input
              v-model="newCategory"
              type="text"
              class="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
              placeholder="新分类名称"
              @keyup.enter="addCategory"
            />
            <button
              class="px-4 py-2 gradient-success text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              @click="addCategory"
            >
              添加
            </button>
          </div>

          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div
              v-for="cat in categories"
              :key="cat"
              class="flex items-center justify-between p-3 rounded-lg"
              :class="isDark ? 'bg-gray-700' : 'bg-gray-50'"
            >
              <span :class="isDark ? 'text-gray-200' : 'text-gray-700'">{{ cat }}</span>
              <button
                v-if="cat !== '默认分类'"
                class="text-sm text-red-500 hover:text-red-600"
                @click="deleteCategory(cat)"
              >
                删除
              </button>
            </div>
          </div>

          <div v-if="categories.length === 0" class="text-center py-8">
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">暂无分类</p>
          </div>
        </div>

        <div
          class="p-5 border-t flex justify-end"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <button
            class="px-5 py-2 border rounded-lg font-medium transition-colors"
            :class="
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            "
            @click="showCategoryModal = false"
          >
            关闭
          </button>
        </div>
      </div>
    </div>

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

  <!-- 删除确认弹窗 -->
  <div
    v-if="showDeleteConfirm"
    class="fixed inset-0 z-50 flex items-center justify-center"
    style="background: rgba(0, 0, 0, 0.5)"
  >
    <div class="w-full max-w-md p-6 rounded-xl" :class="isDark ? 'bg-gray-800' : 'bg-white'">
      <h3 class="text-xl font-bold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
        确认删除
      </h3>
      <p class="mb-6" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
        确定要删除歌词「{{ deletingLyric?.songName }}」吗？此操作不可恢复。
      </p>
      <div class="flex justify-end gap-3">
        <button
          class="px-4 py-2 rounded-lg border font-medium transition-colors"
          :class="
            isDark
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          "
          @click="showDeleteConfirm = false"
        >
          取消
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
          @click="confirmDeleteLyric"
        >
          确认删除
        </button>
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
  category: string;
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
const showDeleteConfirm = ref(false);
const deletingLyric = ref<MusicLyric | null>(null);

const categories = ref<string[]>(["默认分类"]);
const showCategoryModal = ref(false);
const newCategory = ref("");

const filterCategory = ref("");
const filterCategoryOpen = ref(false);

const form = reactive({
  singer: "",
  songName: "",
  lyric: "",
  coverImage: "",
  category: "默认分类",
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
  let result = lyrics.value;
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(
      (lyric) =>
        lyric.singer.toLowerCase().includes(keyword) ||
        lyric.songName.toLowerCase().includes(keyword) ||
        lyric.lyric.toLowerCase().includes(keyword)
    );
  }
  if (filterCategory.value) {
    result = result.filter((lyric) => lyric.category === filterCategory.value);
  }
  return result;
});

const fetchLyrics = async () => {
  try {
    lyrics.value = await http.get<MusicLyric[]>("/music?activeOnly=false");
    extractCategories();
  } catch (err) {
    error("获取歌词列表失败");
  }
};

const extractCategories = () => {
  const cats = new Set<string>();
  cats.add("默认分类");
  lyrics.value.forEach((lyric) => {
    if (lyric.category) {
      cats.add(lyric.category);
    }
  });
  categories.value = Array.from(cats).sort();
};

const getFilterCategoryLabel = () => {
  if (!filterCategory.value) return "全部分类";
  return filterCategory.value;
};

const selectFilterCategory = (cat: string) => {
  filterCategory.value = cat;
  filterCategoryOpen.value = false;
};

const resetFilter = () => {
  searchKeyword.value = "";
  filterCategory.value = "";
};

const openCategoryModal = () => {
  newCategory.value = "";
  showCategoryModal.value = true;
};

const addCategory = () => {
  const name = newCategory.value.trim();
  if (!name) {
    warning("请输入分类名称");
    return;
  }
  if (categories.value.includes(name)) {
    warning("分类已存在");
    return;
  }
  categories.value.push(name);
  categories.value.sort();
  newCategory.value = "";
  success("分类添加成功");
};

const deleteCategory = async (cat: string) => {
  if (lyrics.value.some((l) => l.category === cat)) {
    warning("该分类下存在歌词，无法删除");
    return;
  }
  categories.value = categories.value.filter((c) => c !== cat);
  success("分类删除成功");
};

const openAddModal = () => {
  editingLyric.value = null;
  form.singer = "";
  form.songName = "";
  form.lyric = "";
  form.coverImage = "";
  form.category = categories.value[0] || "默认分类";
  form.sortOrder = 0;
  showModal.value = true;
};

const openEditModal = (lyric: MusicLyric) => {
  editingLyric.value = lyric;
  form.singer = lyric.singer;
  form.songName = lyric.songName;
  form.lyric = lyric.lyric;
  form.coverImage = lyric.coverImage || "";
  form.category = lyric.category || categories.value[0] || "默认分类";
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
        category: form.category,
        sortOrder: form.sortOrder,
      });
      success("歌词更新成功");
    } else {
      await http.post("/music", {
        singer: form.singer,
        songName: form.songName,
        lyric: form.lyric,
        coverImage: form.coverImage,
        category: form.category,
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

const deleteLyric = (lyric: MusicLyric) => {
  deletingLyric.value = lyric;
  showDeleteConfirm.value = true;
};

const confirmDeleteLyric = async () => {
  if (!deletingLyric.value) return;
  try {
    await http.delete(`/music/${deletingLyric.value.id}`);
    success("歌词删除成功");
    showDeleteConfirm.value = false;
    deletingLyric.value = null;
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
