<template>
  <div class="narrative-page max-w-6xl mx-auto">
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
            <BookOpen class="w-7 h-7 inline mr-2" />
            {{ moduleName }}
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ moduleDescription }}
          </p>
        </div>
        <button
          class="px-6 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          @click="openDialog()"
        >
          + 新建叙述
        </button>
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center py-8"
      :class="isDark ? 'text-gray-400' : 'text-gray-500'"
    >
      加载中...
    </div>
    <div
      v-else-if="narratives.length === 0"
      class="text-center py-12 rounded-xl border-2 border-dashed"
      :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'"
    >
      <BookOpen
        class="w-12 h-12 mx-auto mb-3"
        :class="isDark ? 'text-gray-500' : 'text-gray-400'"
      />
      <p>还没有叙述</p>
      <p class="text-sm mt-1">记录下过去的故事吧</p>
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="item in narratives"
        :key="item.id"
        class="narrative-card relative rounded-2xl border overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5"
        :class="[
          isDark
            ? 'bg-gray-800/60 border-gray-700/30 hover:border-amber-500/40'
            : 'bg-white/70 border-gray-200/50 hover:border-amber-300/60',
        ]"
        style="backdrop-filter: blur(12px)"
      >
        <div
          class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 opacity-0 hover:opacity-100 transition-opacity duration-300"
        ></div>
        <div class="p-5">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-2">
              <h3
                class="text-lg font-semibold transition-colors duration-300"
                :class="
                  isDark ? 'text-white hover:text-amber-400' : 'text-gray-900 hover:text-amber-600'
                "
              >
                {{ item.title }}
              </h3>
              <span
                class="px-2.5 py-1 rounded-md text-xs font-medium"
                :class="
                  item.type === 'video'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-violet-500/20 text-violet-400'
                "
              >
                {{ item.type === "video" ? "视频" : "图片" }}
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <button
                class="px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105"
                :class="
                  isDark
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                "
                @click="openDialog(item)"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                class="px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105"
                :class="
                  isDark
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                    : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                "
                @click="deleteNarrative(item)"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <p
            class="text-sm leading-relaxed line-clamp-3 mb-4"
            :class="isDark ? 'text-gray-300' : 'text-gray-600'"
          >
            {{ item.description }}
          </p>

          <div v-if="item.media.length > 0" class="flex gap-2 overflow-x-auto pb-2">
            <div
              v-for="(media, index) in item.media.slice(0, 6)"
              :key="media.id"
              class="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border transition-all duration-300 hover:scale-105"
              :class="isDark ? 'border-gray-700' : 'border-gray-200'"
            >
              <img
                v-if="media.type === 'image'"
                :src="getFullImageUrl(media.mediaUrl)"
                :alt="`媒体${index + 1}`"
                class="w-full h-full object-cover"
              />
              <div v-else class="relative w-full h-full bg-gray-700">
                <img
                  v-if="media.thumbnail && media.thumbnail !== media.mediaUrl"
                  :src="getFullImageUrl(media.thumbnail)"
                  :alt="`视频${index + 1}`"
                  class="w-full h-full object-cover"
                />
                <video
                  v-else
                  :src="getFullImageUrl(media.mediaUrl)"
                  class="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
                <div class="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Video class="w-6 h-6 text-white" />
                </div>
              </div>
              <span
                v-if="index === 5 && item.media.length > 6"
                class="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium"
              >
                +{{ item.media.length - 5 }}
              </span>
            </div>
          </div>

          <div
            class="mt-4 flex items-center justify-between pt-3 border-t"
            :class="isDark ? 'border-gray-700' : 'border-gray-200'"
          >
            <div class="flex items-center gap-2">
              <span
                class="w-2 h-2 rounded-full"
                :class="item.type === 'video' ? 'bg-blue-500' : 'bg-violet-500'"
              ></span>
              <span class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                {{ item.media.length }} 个{{ item.type === "video" ? "视频" : "图片" }}
              </span>
            </div>
            <span class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
              {{ item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "" }}
            </span>
          </div>
        </div>

        <div
          class="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-2xl opacity-0 hover:opacity-10 transition-all duration-500"
          :class="
            item.type === 'video'
              ? 'bg-gradient-to-br from-blue-500 to-indigo-500'
              : 'bg-gradient-to-br from-violet-500 to-purple-500'
          "
        ></div>
      </div>
    </div>

    <!-- 新建/编辑对话框 -->
    <div
      v-if="showDialog"
      class="fixed inset-0 z-50 flex items-center justify-center"
      @click.self="closeDialog()"
    >
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div
        class="relative w-full max-w-2xl mx-4 rounded-2xl border shadow-2xl max-h-[90vh] overflow-hidden"
        :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
      >
        <div class="px-6 py-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ editingItem ? "编辑叙述" : "新建叙述" }}
            </h2>
            <button
              class="p-2 rounded-lg transition-all"
              :class="
                isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              "
              @click="closeDialog()"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div class="space-y-5">
            <div>
              <label
                class="block text-sm font-medium mb-2"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                标题
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300"
                :class="
                  isDark
                    ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                    : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
                "
                placeholder="输入叙述标题"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium mb-2"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                描述
                <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none transition-all duration-300"
                :class="
                  isDark
                    ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                    : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
                "
                placeholder="写下这段故事..."
              ></textarea>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label
                  class="text-sm font-medium"
                  :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                >
                  类型与媒体
                </label>
                <div class="flex items-center gap-2">
                  <div
                    class="flex rounded-lg overflow-hidden border"
                    :class="isDark ? 'border-gray-600' : 'border-gray-200'"
                  >
                    <button
                      class="px-4 py-1.5 text-sm font-medium transition-all"
                      :class="
                        form.type === 'image'
                          ? 'bg-violet-500 text-white'
                          : isDark
                            ? 'bg-gray-700 text-gray-400 hover:text-gray-200'
                            : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                      "
                      @click="
                        form.type = 'image';
                        form.media = [];
                      "
                    >
                      <ImageIcon class="w-4 h-4 inline mr-1" />
                      图片
                    </button>
                    <button
                      class="px-4 py-1.5 text-sm font-medium transition-all"
                      :class="
                        form.type === 'video'
                          ? 'bg-violet-500 text-white'
                          : isDark
                            ? 'bg-gray-700 text-gray-400 hover:text-gray-200'
                            : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                      "
                      @click="
                        form.type = 'video';
                        form.media = [];
                      "
                    >
                      <Video class="w-4 h-4 inline mr-1" />
                      视频
                    </button>
                  </div>
                </div>
              </div>

              <div
                class="relative rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer"
                :class="
                  form.media.length > 0
                    ? isDark
                      ? 'border-gray-600 bg-gray-700/30'
                      : 'border-gray-300 bg-gray-50'
                    : isDark
                      ? 'border-gray-700 hover:border-gray-500 bg-gray-800/30'
                      : 'border-gray-200 hover:border-gray-400 bg-white/50'
                "
                @click="openMediaPicker"
              >
                <template v-if="form.media.length === 0">
                  <component
                    :is="form.type === 'image' ? ImageIcon : Video"
                    class="w-12 h-12 mx-auto mb-3"
                    :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                  />
                  <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    {{ form.type === "video" ? "点击选择视频" : "点击选择图片" }}
                  </p>
                </template>
                <template v-else>
                  <div class="flex flex-wrap gap-3 justify-center">
                    <div
                      v-for="(media, index) in form.media"
                      :key="media.id || index"
                      class="relative w-20 h-20 rounded-lg overflow-hidden border"
                      :class="isDark ? 'border-gray-700' : 'border-gray-200'"
                    >
                      <img
                        v-if="media.type === 'image'"
                        :src="getFullImageUrl(media.mediaUrl)"
                        :alt="`媒体${index + 1}`"
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="relative w-full h-full bg-gray-700">
                        <img
                          v-if="media.thumbnail && media.thumbnail !== media.mediaUrl"
                          :src="getFullImageUrl(media.thumbnail)"
                          :alt="`视频${index + 1}`"
                          class="w-full h-full object-cover"
                        />
                        <video
                          v-else
                          :src="getFullImageUrl(media.mediaUrl)"
                          class="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                        <div class="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Video class="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <button
                        class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                        @click.stop="removeMedia(index)"
                      >
                        <X class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p class="mt-4 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    已选择 {{ form.media.length }} 个{{
                      form.type === "video" ? "视频" : "图片"
                    }}，点击继续添加
                  </p>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div
          class="px-6 py-4 border-t flex justify-end space-x-3"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <button
            class="px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
            :class="
              isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            @click="closeDialog()"
          >
            取消
          </button>
          <button
            class="px-6 py-2.5 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-all duration-300"
            @click="saveNarrative()"
          >
            {{ editingItem ? "保存" : "创建" }}
          </button>
        </div>
      </div>
    </div>

    <!-- 图片选择弹窗 -->
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
            <ImageIcon
              class="w-12 h-12 mx-auto mb-3"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'"
            />
            <p>该分组暂无图片</p>
            <p class="text-sm mt-1">请选择其他分组或先上传图片</p>
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="img in filteredImages"
              :key="img.id"
              class="relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all"
              :class="
                tempSelectedImages.includes(img.url)
                  ? 'border-primary-500 ring-4 ring-primary-500/40 shadow-lg shadow-primary-500/30'
                  : isDark
                    ? 'border-gray-700 hover:border-gray-500'
                    : 'border-gray-200 hover:border-gray-400'
              "
              @click="toggleTempImage(img)"
            >
              <img
                :src="getFullImageUrl(img.url)"
                :alt="img.filename"
                class="w-full h-32 object-cover"
              />
              <div
                v-if="tempSelectedImages.includes(img.url)"
                class="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shadow-lg"
              >
                <span class="text-white text-xs font-bold">✓</span>
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
            @click="showImagePicker = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-xl gradient-success text-white text-sm font-medium"
            @click="confirmImages"
          >
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 视频选择弹窗 -->
    <div
      v-if="showVideoPicker"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showVideoPicker = false"
    >
      <div
        class="w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div class="p-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">选择视频</h3>
            <button
              class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="showVideoPicker = false"
            >
              ✕
            </button>
          </div>
          <div class="flex flex-wrap gap-2 mt-3">
            <button
              v-for="group in videoGroups"
              :key="group.id"
              class="px-3 py-1.5 rounded-full text-sm transition-all"
              :class="
                selectedVideoGroupId === group.id
                  ? 'bg-pink-500 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              "
              @click="selectVideoGroup(group.id)"
            >
              {{ group.icon }} {{ group.name }}
            </button>
          </div>
        </div>
        <div class="p-4 overflow-y-auto max-h-[60vh]">
          <div
            v-if="videosLoading"
            class="text-center py-8"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            加载中...
          </div>
          <div
            v-else-if="videos.length === 0"
            class="text-center py-12"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            <Video
              class="w-12 h-12 mx-auto mb-3"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'"
            />
            <p>该分组暂无视频</p>
            <p class="text-sm mt-1">请选择其他分组或先上传视频</p>
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="video in videos"
              :key="video.id"
              class="relative aspect-video cursor-pointer rounded-lg overflow-hidden border-2 transition-all"
              :class="
                tempSelectedVideos.includes(video.url)
                  ? 'border-primary-500 ring-4 ring-primary-500/40 shadow-lg shadow-primary-500/30'
                  : isDark
                    ? 'border-gray-700 hover:border-gray-500'
                    : 'border-gray-200 hover:border-gray-400'
              "
              @click="toggleTempVideo(video)"
            >
              <img
                v-if="video.thumbnail"
                :src="getFullImageUrl(video.thumbnail)"
                :alt="video.filename"
                class="w-full h-full object-cover"
              />
              <video
                v-else
                :src="getFullImageUrl(video.url)"
                class="w-full h-full object-cover"
                muted
              />
              <div class="absolute inset-0 flex items-center justify-center bg-black/30">
                <div class="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                  <Video class="w-6 h-6 text-white" />
                </div>
              </div>
              <div
                v-if="tempSelectedVideos.includes(video.url)"
                class="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shadow-lg"
              >
                <span class="text-white text-xs font-bold">✓</span>
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
            @click="showVideoPicker = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-xl gradient-success text-white text-sm font-medium"
            @click="confirmVideos"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { BookOpen, Edit3, Trash2, X, Video, ImageIcon } from "lucide-vue-next";
import { useMessage, useModuleConfig } from "@/composables";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");
const { success, error } = useMessage();
const { getModuleName, getModuleDescription } = useModuleConfig();

const moduleName = computed(() => getModuleName("narrative"));
const moduleDescription = computed(() => getModuleDescription("narrative"));

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
};

const loading = ref(false);
const narratives = ref<any[]>([]);
const showDialog = ref(false);
const editingItem = ref<any>(null);
const showImagePicker = ref(false);
const showVideoPicker = ref(false);

const images = ref<any[]>([]);
const imagesLoading = ref(false);
const imageGroups = ref<any[]>([]);
const selectedGroupId = ref<string | null>(null);
const tempSelectedImages = ref<string[]>([]);

const videos = ref<any[]>([]);
const videosLoading = ref(false);
const videoGroups = ref<any[]>([]);
const selectedVideoGroupId = ref<string | null>(null);
const tempSelectedVideos = ref<string[]>([]);

const filteredImages = computed(() => {
  if (!selectedGroupId.value) {
    return [];
  }
  return images.value.filter((img) => img.group?.id === selectedGroupId.value);
});

const form = ref({
  title: "",
  description: "",
  type: "image",
  media: [] as { id?: string; mediaUrl: string; thumbnail?: string; type?: string }[],
});

const fetchNarratives = async () => {
  loading.value = true;
  try {
    const res = await http.get<{ list: any[] }>("/narrative/admin/list");
    narratives.value = res.list || res;
  } catch (e) {
    console.error("获取叙述列表失败:", e);
  } finally {
    loading.value = false;
  }
};

const openDialog = (item?: any) => {
  if (item) {
    editingItem.value = item;
    form.value = {
      title: item.title,
      description: item.description,
      type: item.type,
      media: item.media.map((m: any) => ({
        id: m.id,
        mediaUrl: m.mediaUrl,
        thumbnail: m.thumbnail,
        type: m.type,
      })),
    };
  } else {
    editingItem.value = null;
    form.value = {
      title: "",
      description: "",
      type: "image",
      media: [],
    };
  }
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
  editingItem.value = null;
  form.value = {
    title: "",
    description: "",
    type: "image",
    media: [],
  };
};

const fetchImages = async () => {
  imagesLoading.value = true;
  try {
    const imgData = await http.get<any>("/gallery/images?pageSize=100");
    images.value = (imgData.list || []).map((img: any) => ({
      id: img.id,
      url: img.url,
      filename: img.filename,
      group: img.group ? { id: img.group.id, name: img.group.name, icon: img.group.icon } : null,
    }));
    imageGroups.value = await http.get<any[]>("/gallery/groups");
    const defaultGroup = imageGroups.value.find((g) => g.name === "默认分组");
    selectedGroupId.value = defaultGroup?.id || imageGroups.value[0]?.id || null;
  } catch (e) {
    images.value = [];
    imageGroups.value = [];
    selectedGroupId.value = null;
  } finally {
    imagesLoading.value = false;
  }
};

const fetchVideos = async () => {
  videosLoading.value = true;
  try {
    videoGroups.value = await http.get<any[]>("/video/groups");
    const defaultGroup =
      videoGroups.value.find((g) => g.name === "默认分组") || videoGroups.value[0];
    if (defaultGroup) {
      await selectVideoGroup(defaultGroup.id);
    }
  } catch (e) {
    videoGroups.value = [];
    videos.value = [];
    selectedVideoGroupId.value = null;
  } finally {
    videosLoading.value = false;
  }
};

const selectVideoGroup = async (groupId: string) => {
  selectedVideoGroupId.value = groupId;
  videosLoading.value = true;
  try {
    const videoData = await http.get<any>(`/video/groups/${groupId}/videos?pageSize=50`);
    videos.value = videoData.list || videoData;
  } catch (e) {
    videos.value = [];
  } finally {
    videosLoading.value = false;
  }
};

const openMediaPicker = () => {
  if (form.value.type === "image") {
    fetchImages();
    tempSelectedImages.value = form.value.media
      .filter((m) => m.type === "image")
      .map((m) => m.mediaUrl);
    showImagePicker.value = true;
  } else {
    fetchVideos();
    tempSelectedVideos.value = form.value.media
      .filter((m) => m.type === "video")
      .map((m) => m.mediaUrl);
    showVideoPicker.value = true;
  }
};

const toggleTempImage = (img: any) => {
  const index = tempSelectedImages.value.indexOf(img.url);
  if (index > -1) {
    tempSelectedImages.value.splice(index, 1);
  } else {
    tempSelectedImages.value.push(img.url);
  }
};

const toggleTempVideo = (video: any) => {
  const index = tempSelectedVideos.value.indexOf(video.url);
  if (index > -1) {
    tempSelectedVideos.value.splice(index, 1);
  } else {
    tempSelectedVideos.value.push(video.url);
  }
};

const confirmImages = () => {
  const currentVideos = form.value.media.filter((m) => m.type === "video");
  const newImages = tempSelectedImages.value.map((url) => ({
    mediaUrl: url,
    thumbnail: url,
    type: "image",
  }));
  form.value.media = [...currentVideos, ...newImages];
  showImagePicker.value = false;
};

const confirmVideos = () => {
  const currentImages = form.value.media.filter((m) => m.type === "image");
  const newVideos = tempSelectedVideos.value.map((url) => {
    const video = videos.value.find((v) => v.url === url);
    const mediaItem: { mediaUrl: string; thumbnail?: string; type: string } = {
      mediaUrl: url,
      type: "video",
    };
    if (video && video.thumbnail && video.thumbnail !== url) {
      mediaItem.thumbnail = video.thumbnail;
    }
    return mediaItem;
  });
  form.value.media = [...currentImages, ...newVideos];
  showVideoPicker.value = false;
};

const removeMedia = (index: number) => {
  form.value.media.splice(index, 1);
};

const saveNarrative = async () => {
  if (!form.value.title.trim() || !form.value.description.trim()) {
    error("请填写标题和描述");
    return;
  }

  try {
    if (editingItem.value) {
      await http.put(`/narrative/${editingItem.value.id}`, form.value);
      success("更新成功");
    } else {
      await http.post("/narrative", form.value);
      success("创建成功");
    }
    closeDialog();
    await fetchNarratives();
  } catch (e) {
    error("保存失败");
  }
};

const deleteNarrative = async (item: any) => {
  if (!confirm(`确定要删除"${item.title}"吗？`)) return;

  try {
    await http.delete(`/narrative/${item.id}`);
    success("删除成功");
    await fetchNarratives();
  } catch (e) {
    error("删除失败");
  }
};

onMounted(() => {
  fetchNarratives();
});
</script>

<style scoped>
.narrative-card:hover {
  box-shadow:
    0 20px 40px -12px rgba(245, 158, 11, 0.2),
    0 0 30px rgba(245, 158, 11, 0.05);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
