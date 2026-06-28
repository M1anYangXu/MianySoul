<template>
  <div class="memory-page max-w-5xl mx-auto">
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
            🧠 {{ moduleName }}
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ moduleDescription }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex space-x-1 p-1 rounded-xl" :class="isDark ? 'bg-gray-700' : 'bg-gray-100'">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200"
        :class="
          activeTab === tab.key
            ? isDark
              ? 'bg-gray-600 text-white shadow-md'
              : 'bg-white text-gray-900 shadow-sm'
            : isDark
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
        "
        @click="activeTab = tab.key"
      >
        <span>{{ tab.icon }}</span>
        <span>{{ tab.name }}</span>
      </button>
    </div>

    <!-- 日记 Tab -->
    <div v-if="activeTab === 'diary'" class="mt-6">
      <div class="flex justify-end mb-4">
        <button
          class="px-4 py-2 rounded-lg gradient-danger text-white text-sm font-medium"
          @click="openDiaryDialog()"
        >
          + 写日记
        </button>
      </div>
      <div
        v-if="diaryLoading"
        class="text-center py-8"
        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
      >
        加载中...
      </div>
      <div
        v-else-if="diaries.length === 0"
        class="text-center py-12 rounded-xl border-2 border-dashed"
        :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'"
      >
        <div class="text-4xl mb-3">📔</div>
        <p>还没有日记</p>
        <p class="text-sm mt-1">记录下今天的心情吧</p>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="item in diaries"
          :key="item.id"
          class="rounded-2xl border shadow-md overflow-hidden"
          :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <div class="p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <span
                  class="text-base font-medium"
                  :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                >
                  {{ formatDate(item.diaryDate) }}
                </span>
                <span v-if="item.weather" class="text-xl">{{ getWeatherEmoji(item.weather) }}</span>
                <span v-if="item.mood" class="text-xl">{{ getMoodEmoji(item.mood) }}</span>
                <span
                  v-if="item.isOutside"
                  class="text-sm px-2 py-0.5 rounded-full"
                  :class="isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'"
                >
                  🚶 外出
                </span>
              </div>
              <div class="flex gap-2">
                <button
                  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                  @click="openDiaryDialog(item)"
                >
                  ✏️
                </button>
                <button
                  class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                  @click="deleteDiary(item)"
                >
                  🗑️
                </button>
              </div>
            </div>

            <!-- 图片展示 -->
            <div v-if="item.images && item.images.length > 0" class="mb-3">
              <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <div
                  v-for="(img, index) in item.images"
                  :key="index"
                  class="flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden"
                >
                  <img
                    :src="getFullImageUrl(img.imageUrl)"
                    :alt="formatDate(item.diaryDate)"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <p
              class="text-base whitespace-pre-wrap leading-relaxed"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              {{ item.content }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 回忆录 Tab -->
    <div v-if="activeTab === 'memoir'" class="mt-6">
      <div class="flex justify-end mb-4">
        <button
          class="px-4 py-2 rounded-lg gradient-warning text-white text-sm font-medium"
          @click="openCategoryDialog()"
        >
          + 新建分类
        </button>
      </div>
      <div
        v-if="memoirLoading"
        class="text-center py-8"
        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
      >
        加载中...
      </div>
      <div
        v-else-if="categories.length === 0"
        class="text-center py-12 rounded-xl border-2 border-dashed"
        :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'"
      >
        <div class="text-4xl mb-3">📖</div>
        <p>还没有回忆录分类</p>
        <p class="text-sm mt-1">创建你的第一个回忆分类吧</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="group p-4 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-all"
          :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
          @click="goToCategory(cat)"
        >
          <div class="flex items-start justify-between mb-2">
            <span class="text-2xl">{{ cat.icon }}</span>
            <div class="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              <button
                class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                @click.stop="openCategoryDialog(cat)"
              >
                ✏️
              </button>
              <button
                class="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
                @click.stop="deleteCategory(cat)"
              >
                🗑️
              </button>
            </div>
          </div>
          <h3 class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ cat.name }}
          </h3>
          <p
            v-if="cat.description"
            class="text-xs mt-1"
            :class="isDark ? 'text-gray-400' : 'text-gray-600'"
          >
            {{ cat.description }}
          </p>
          <p class="text-xs mt-2" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
            {{ cat._count.entries }} 个回忆
          </p>
        </div>
      </div>
    </div>

    <!-- 梦境 Tab -->
    <div v-if="activeTab === 'dream'" class="mt-6">
      <div class="flex justify-end mb-4">
        <button
          class="px-4 py-2 rounded-lg gradient-primary text-white text-sm font-medium"
          @click="openDreamDialog()"
        >
          + 记录梦境
        </button>
      </div>
      <div
        v-if="dreamLoading"
        class="text-center py-8"
        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
      >
        加载中...
      </div>
      <div
        v-else-if="dreams.length === 0"
        class="text-center py-12 rounded-xl border-2 border-dashed"
        :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'"
      >
        <div class="text-4xl mb-3">🌙</div>
        <p>还没有梦境记录</p>
        <p class="text-sm mt-1">记录下你记得的梦</p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="item in dreams"
          :key="item.id"
          class="p-4 rounded-xl border shadow-sm"
          :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <div class="flex items-start justify-between mb-2">
            <span class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
              {{ formatDate(item.dreamDate) }}
            </span>
            <div class="flex space-x-1">
              <button
                class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                @click="openDreamDialog(item)"
              >
                ✏️
              </button>
              <button
                class="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
                @click="deleteDream(item)"
              >
                🗑️
              </button>
            </div>
          </div>
          <p
            class="text-sm whitespace-pre-wrap"
            :class="isDark ? 'text-gray-300' : 'text-gray-700'"
          >
            {{ item.content }}
          </p>
        </div>
      </div>
    </div>

    <!-- 日记弹窗 -->
    <div
      v-if="showDiaryDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showDiaryDialog = false"
    >
      <div
        class="w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 rounded-xl shadow-xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <h2 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ editingDiary ? "编辑日记" : "写日记" }}
        </h2>
        <div class="space-y-4">
          <!-- 天气选择 -->
          <div>
            <label class="block text-sm mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              天气
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="w in weatherOptions"
                :key="w.value"
                class="px-3 py-2 rounded-lg text-lg transition-all"
                :class="
                  diaryForm.weather === w.value
                    ? 'bg-pink-100 dark:bg-pink-900/40 ring-2 ring-pink-500'
                    : isDark
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                "
                @click="diaryForm.weather = diaryForm.weather === w.value ? '' : w.value"
              >
                {{ w.emoji }}
              </button>
            </div>
          </div>

          <!-- 心情选择 -->
          <div>
            <label class="block text-sm mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              心情
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="m in moodOptions"
                :key="m.value"
                class="px-3 py-2 rounded-lg text-lg transition-all"
                :class="
                  diaryForm.mood === m.value
                    ? 'bg-pink-100 dark:bg-pink-900/40 ring-2 ring-pink-500'
                    : isDark
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                "
                @click="diaryForm.mood = diaryForm.mood === m.value ? '' : m.value"
              >
                {{ m.emoji }}
              </button>
            </div>
          </div>

          <!-- 是否外出 -->
          <div class="flex items-center space-x-3">
            <label class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              今日是否外出
            </label>
            <button
              class="relative w-12 h-6 rounded-full transition-colors"
              :class="diaryForm.isOutside ? 'bg-pink-500' : 'bg-gray-300 dark:bg-gray-600'"
              @click="diaryForm.isOutside = !diaryForm.isOutside"
            >
              <span
                class="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                :class="diaryForm.isOutside ? 'left-7' : 'left-1'"
              ></span>
            </button>
            <span class="text-sm" :class="diaryForm.isOutside ? 'text-pink-500' : 'text-gray-400'">
              {{ diaryForm.isOutside ? "是" : "否" }}
            </span>
          </div>

          <!-- 图片选择 -->
          <div>
            <label class="block text-sm mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              图片（可选）
            </label>
            <div class="flex space-x-3">
              <button
                class="flex-1 px-3 py-2 rounded-lg border border-dashed text-sm flex items-center justify-center space-x-2"
                :class="
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-600'
                "
                @click="openImagePicker"
              >
                <span>🖼️</span>
                <span>{{ diaryForm.imageUrls.length > 0 ? "添加图片" : "从图集中选择" }}</span>
              </button>
              <button
                v-if="diaryForm.imageUrls.length > 0"
                class="px-3 py-2 rounded-lg border text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                @click="diaryForm.imageUrls = []"
              >
                清空
              </button>
            </div>
            <div v-if="diaryForm.imageUrls.length > 0" class="mt-2 flex flex-wrap gap-2">
              <div
                v-for="(url, index) in diaryForm.imageUrls"
                :key="index"
                class="relative w-24 h-24 rounded-lg overflow-hidden"
              >
                <img
                  :src="getFullImageUrl(url)"
                  :alt="`图片${index + 1}`"
                  class="w-full h-full object-cover"
                />
                <button
                  class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-sm hover:bg-black/80"
                  @click="diaryForm.imageUrls.splice(index, 1)"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- 内容 -->
          <div>
            <label class="block text-sm mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              内容 *
            </label>
            <textarea
              v-model="diaryForm.content"
              rows="6"
              placeholder="记录今天发生的事情..."
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              :class="
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              "
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-6">
          <button
            class="px-4 py-2 rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'"
            @click="showDiaryDialog = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-lg gradient-danger text-white text-sm font-medium"
            :disabled="!diaryForm.content.trim()"
            @click="saveDiary"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 日记图片选择弹窗 -->
    <div
      v-if="showImagePicker"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showImagePicker = false"
    >
      <div
        class="w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div class="p-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">选择图片</h3>
            <button
              class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="showImagePicker = false"
            >
              ✕
            </button>
          </div>
          <!-- 分组选择器 -->
          <div class="flex flex-wrap gap-2 mt-3">
            <button
              v-for="group in imageGroups"
              :key="group.id"
              class="px-3 py-1.5 rounded-full text-sm transition-all"
              :class="
                selectedGroupId === group.id
                  ? 'bg-pink-500 text-white'
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
              class="relative cursor-pointer rounded-lg overflow-hidden border-2 hover:border-pink-500 transition-all group"
              :class="
                diaryForm.imageUrls.includes(img.url)
                  ? 'border-pink-500 ring-2 ring-pink-500/50'
                  : isDark
                    ? 'border-gray-700'
                    : 'border-gray-200'
              "
              @click="selectImage(img)"
            >
              <img
                :src="getFullImageUrl(img.url)"
                :alt="img.filename"
                class="w-full h-32 object-cover"
              />
              <div
                v-if="diaryForm.imageUrls.includes(img.url)"
                class="absolute inset-0 bg-black/40 flex items-center justify-center"
              >
                <span class="text-white text-xl">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类弹窗 -->
    <div
      v-if="showCategoryDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showCategoryDialog = false"
    >
      <div
        class="w-full max-w-sm p-5 rounded-xl shadow-xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <h2 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ editingCategory ? "编辑分类" : "新建分类" }}
        </h2>
        <div class="space-y-3">
          <input
            v-model="categoryForm.name"
            type="text"
            placeholder="分类名称"
            class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-rose-500"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'"
          />
          <textarea
            v-model="categoryForm.description"
            rows="2"
            placeholder="分类描述（可选）"
            class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none text-sm"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'"
          ></textarea>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="emoji in emojiOptions"
              :key="emoji"
              class="w-8 h-8 rounded text-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="
                categoryForm.icon === emoji
                  ? 'ring-2 ring-rose-500 bg-rose-100 dark:bg-rose-900/30'
                  : ''
              "
              @click="categoryForm.icon = emoji"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-4">
          <button
            class="px-4 py-2 rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'"
            @click="showCategoryDialog = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-lg gradient-warning text-white text-sm font-medium"
            :disabled="!categoryForm.name.trim()"
            @click="saveCategory"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 梦境弹窗 -->
    <div
      v-if="showDreamDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showDreamDialog = false"
    >
      <div
        class="w-full max-w-lg p-5 rounded-xl shadow-xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <h2 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ editingDream ? "编辑梦境" : "记录梦境" }}
        </h2>
        <textarea
          v-model="dreamForm.content"
          rows="8"
          placeholder="记录你梦到了什么..."
          class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'"
        ></textarea>
        <div class="flex justify-end space-x-2 mt-4">
          <button
            class="px-4 py-2 rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'"
            @click="showDreamDialog = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-lg gradient-primary text-white text-sm font-medium"
            :disabled="!dreamForm.content.trim()"
            @click="saveDream"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";
import { useMessage, useModuleConfig } from "@/composables";

const router = useRouter();
const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");
const { success, error } = useMessage();
const { getModuleName, getModuleDescription, loadConfig } = useModuleConfig();

const moduleName = computed(() => getModuleName("memory"));
const moduleDescription = computed(() => getModuleDescription("memory"));

const tabs = [
  { key: "diary", name: "日记", icon: "📔" },
  { key: "memoir", name: "回忆录", icon: "📖" },
  { key: "dream", name: "梦境", icon: "🌙" },
];

const activeTab = ref("diary");

const emojiOptions = ["📖", "🏫", "🎓", "💼", "🏠", "🌍", "❤️", "⭐", "🌟", "🎯"];

// ===== 日记 =====
interface DiaryImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

interface Diary {
  id: string;
  content: string;
  weather: string | null;
  mood: string | null;
  images: DiaryImage[];
  isOutside: boolean | null;
  diaryDate: string;
}

interface ImageGroup {
  id: string;
  name: string;
  icon: string;
}

interface Image {
  id: string;
  url: string;
  filename: string;
  group?: ImageGroup;
}

const weatherOptions = [
  { value: "sunny", emoji: "☀️", label: "晴" },
  { value: "cloudy", emoji: "☁️", label: "多云" },
  { value: "rainy", emoji: "🌧️", label: "雨" },
  { value: "snowy", emoji: "❄️", label: "雪" },
  { value: "windy", emoji: "💨", label: "大风" },
  { value: "foggy", emoji: "🌫️", label: "雾" },
];

const moodOptions = [
  { value: "happy", emoji: "😊", label: "开心" },
  { value: "calm", emoji: "😌", label: "平静" },
  { value: "excited", emoji: "🤩", label: "兴奋" },
  { value: "anxious", emoji: "😰", label: "焦虑" },
  { value: "sad", emoji: "😢", label: "难过" },
  { value: "angry", emoji: "😠", label: "生气" },
];

const diaries = ref<Diary[]>([]);
const diaryLoading = ref(true);
const showDiaryDialog = ref(false);
const editingDiary = ref<Diary | null>(null);
const diaryForm = reactive({
  content: "",
  weather: "",
  mood: "",
  imageUrls: [] as string[],
  isOutside: false,
});

const showImagePicker = ref(false);
const images = ref<Image[]>([]);
const imagesLoading = ref(false);
const imageGroups = ref<ImageGroup[]>([]);
const selectedGroupId = ref<string | null>(null);

const filteredImages = computed(() => {
  if (!selectedGroupId.value) {
    return [];
  }
  return images.value.filter((img) => img.group?.id === selectedGroupId.value);
});

const getWeatherEmoji = (weather: string) => {
  return weatherOptions.find((w) => w.value === weather)?.emoji || "";
};

const getMoodEmoji = (mood: string) => {
  return moodOptions.find((m) => m.value === mood)?.emoji || "";
};

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
};

const fetchDiaries = async () => {
  diaryLoading.value = true;
  try {
    diaries.value = await http.get<Diary[]>("/diary");
  } catch (e: any) {
    error(e.message || "加载失败");
  } finally {
    diaryLoading.value = false;
  }
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

const openImagePicker = () => {
  fetchImages();
  showImagePicker.value = true;
};

const selectImage = (img: Image) => {
  const index = diaryForm.imageUrls.indexOf(img.url);
  if (index > -1) {
    diaryForm.imageUrls.splice(index, 1);
  } else {
    diaryForm.imageUrls.push(img.url);
  }
};

const openDiaryDialog = (item?: Diary) => {
  if (item) {
    editingDiary.value = item;
    diaryForm.content = item.content;
    diaryForm.weather = item.weather || "";
    diaryForm.mood = item.mood || "";
    diaryForm.imageUrls = item.images ? item.images.map((img) => img.imageUrl) : [];
    diaryForm.isOutside = item.isOutside || false;
  } else {
    editingDiary.value = null;
    diaryForm.content = "";
    diaryForm.weather = "";
    diaryForm.mood = "";
    diaryForm.imageUrls = [];
    diaryForm.isOutside = false;
  }
  showDiaryDialog.value = true;
};

const saveDiary = async () => {
  try {
    const payload = {
      content: diaryForm.content,
      weather: diaryForm.weather || null,
      mood: diaryForm.mood || null,
      imageUrls: diaryForm.imageUrls,
      isOutside: diaryForm.isOutside,
    };
    if (editingDiary.value) {
      await http.put(`/diary/${editingDiary.value.id}`, payload);
      success("更新成功");
    } else {
      await http.post("/diary", payload);
      success("记录成功");
    }
    showDiaryDialog.value = false;
    await fetchDiaries();
  } catch (e: any) {
    error(e.message || "保存失败");
  }
};

const deleteDiary = async (item: Diary) => {
  if (!confirm("确定删除这条日记吗？")) return;
  try {
    await http.delete(`/diary/${item.id}`);
    success("删除成功");
    await fetchDiaries();
  } catch (e: any) {
    error(e.message || "删除失败");
  }
};

// ===== 回忆录 =====
interface Category {
  id: string;
  name: string;
  icon: string;
  description: string | null;
  _count: { entries: number };
}
const categories = ref<Category[]>([]);
const memoirLoading = ref(true);
const showCategoryDialog = ref(false);
const editingCategory = ref<Category | null>(null);
const categoryForm = reactive({ name: "", description: "", icon: "📖" });

const fetchCategories = async () => {
  memoirLoading.value = true;
  try {
    categories.value = await http.get<Category[]>("/memoir/categories");
  } catch (e: any) {
    error(e.message || "加载失败");
  } finally {
    memoirLoading.value = false;
  }
};

const openCategoryDialog = (cat?: Category) => {
  if (cat) {
    editingCategory.value = cat;
    categoryForm.name = cat.name;
    categoryForm.description = cat.description || "";
    categoryForm.icon = cat.icon;
  } else {
    editingCategory.value = null;
    categoryForm.name = "";
    categoryForm.description = "";
    categoryForm.icon = "📖";
  }
  showCategoryDialog.value = true;
};

const saveCategory = async () => {
  try {
    if (editingCategory.value) {
      await http.put(`/memoir/categories/${editingCategory.value.id}`, categoryForm);
      success("更新成功");
    } else {
      await http.post("/memoir/categories", categoryForm);
      success("创建成功");
    }
    showCategoryDialog.value = false;
    await fetchCategories();
  } catch (e: any) {
    error(e.message || "保存失败");
  }
};

const deleteCategory = async (cat: Category) => {
  if (!confirm(`确定删除「${cat.name}」分类吗？`)) return;
  try {
    await http.delete(`/memoir/categories/${cat.id}`);
    success("删除成功");
    await fetchCategories();
  } catch (e: any) {
    error(e.message || "删除失败");
  }
};

const goToCategory = (cat: Category) => {
  router.push({ name: "AdminMemoirCategory", params: { categoryId: cat.id } });
};

// ===== 梦境 =====
interface Dream {
  id: string;
  content: string;
  dreamDate: string;
}
const dreams = ref<Dream[]>([]);
const dreamLoading = ref(true);
const showDreamDialog = ref(false);
const editingDream = ref<Dream | null>(null);
const dreamForm = reactive({ content: "" });

const fetchDreams = async () => {
  dreamLoading.value = true;
  try {
    dreams.value = await http.get<Dream[]>("/dream");
  } catch (e: any) {
    error(e.message || "加载失败");
  } finally {
    dreamLoading.value = false;
  }
};

const openDreamDialog = (item?: Dream) => {
  if (item) {
    editingDream.value = item;
    dreamForm.content = item.content;
  } else {
    editingDream.value = null;
    dreamForm.content = "";
  }
  showDreamDialog.value = true;
};

const saveDream = async () => {
  try {
    if (editingDream.value) {
      await http.put(`/dream/${editingDream.value.id}`, { content: dreamForm.content });
      success("更新成功");
    } else {
      await http.post("/dream", { content: dreamForm.content });
      success("记录成功");
    }
    showDreamDialog.value = false;
    await fetchDreams();
  } catch (e: any) {
    error(e.message || "保存失败");
  }
};

const deleteDream = async (item: Dream) => {
  if (!confirm("确定删除这条梦境记录吗？")) return;
  try {
    await http.delete(`/dream/${item.id}`);
    success("删除成功");
    await fetchDreams();
  } catch (e: any) {
    error(e.message || "删除失败");
  }
};

// ===== 通用 =====
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
};

watch(activeTab, (tab) => {
  if (tab === "diary") fetchDiaries();
  if (tab === "memoir") fetchCategories();
  if (tab === "dream") fetchDreams();
});

onMounted(async () => {
  await loadConfig();
  fetchDiaries();
});
</script>
