<template>
  <div class="min-h-screen py-24 px-6 relative overflow-hidden">
    <div
      class="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 blur-3xl"
      style="transform: translate(-20%, -20%)"
    ></div>
    <div
      class="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl"
      style="transform: translate(20%, 20%)"
    ></div>

    <div class="max-w-6xl mx-auto relative z-10">
      <!-- 返回按钮 -->
      <button
        class="flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition-all hover:scale-105"
        :class="
          isDark
            ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            : 'bg-white/50 text-gray-600 hover:bg-white/70'
        "
        @click="$router.back()"
      >
        <ChevronLeft class="w-5 h-5" />
        <span>返回列表</span>
      </button>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-20">
        <div
          class="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto"
        ></div>
        <p class="mt-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'">加载中...</p>
      </div>

      <!-- 内容区域 -->
      <div v-else-if="narrative" class="flex flex-col lg:flex-row gap-8">
        <!-- 左侧媒体区域 -->
        <div class="lg:w-3/5">
          <div class="relative rounded-2xl overflow-hidden shadow-2xl">
            <div class="relative h-64 md:h-80 lg:h-[500px]">
              <template
                v-if="
                  currentMediaIndex >= 0 && narrative.media && narrative.media[currentMediaIndex]
                "
              >
                <img
                  v-if="narrative.media[currentMediaIndex].type === 'image'"
                  :src="getFullImageUrl(narrative.media[currentMediaIndex].mediaUrl)"
                  :alt="narrative.title"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gray-900 flex items-center justify-center">
                  <Video class="w-16 h-16 text-gray-600" />
                </div>
              </template>
              <template v-else>
                <div class="w-full h-full bg-gray-900 flex items-center justify-center">
                  <Video class="w-16 h-16 text-gray-600" />
                </div>
              </template>
            </div>

            <!-- 媒体切换卡牌 -->
            <div v-if="narrative.media && narrative.media.length > 1" class="p-4 bg-gray-900/80">
              <div class="flex gap-3 overflow-x-auto pb-2">
                <div
                  v-for="(media, index) in narrative.media"
                  :key="media.id || index"
                  class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 hover:scale-105"
                  :class="[
                    index === currentMediaIndex
                      ? 'border-primary-500 ring-2 ring-primary-500/30 shadow-lg shadow-primary-500/20'
                      : isDark
                        ? 'border-gray-600 hover:border-gray-500'
                        : 'border-gray-400 hover:border-gray-300',
                  ]"
                  @click="currentMediaIndex = index"
                >
                  <img
                    v-if="media.type === 'image'"
                    :src="getFullImageUrl(media.mediaUrl)"
                    :alt="`${index + 1}`"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full bg-gray-700 flex items-center justify-center">
                    <Video class="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 导航按钮 -->
            <div
              v-if="narrative.media && narrative.media.length > 1"
              class="absolute top-1/2 -translate-y-1/2 left-4"
            >
              <button
                class="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                :class="
                  isDark
                    ? 'bg-black/50 text-white hover:bg-black/70'
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                "
                style="backdrop-filter: blur(8px)"
                @click="currentMediaIndex = Math.max(0, currentMediaIndex - 1)"
              >
                <ChevronLeft class="w-5 h-5" />
              </button>
            </div>
            <div
              v-if="narrative.media && narrative.media.length > 1"
              class="absolute top-1/2 -translate-y-1/2 right-4"
            >
              <button
                class="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                :class="
                  isDark
                    ? 'bg-black/50 text-white hover:bg-black/70'
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                "
                style="backdrop-filter: blur(8px)"
                @click="
                  currentMediaIndex = Math.min(
                    (narrative.media.length || 1) - 1,
                    currentMediaIndex + 1
                  )
                "
              >
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>

            <!-- 页码指示 -->
            <div
              v-if="narrative.media && narrative.media.length > 1"
              class="absolute top-4 right-4"
            >
              <span
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="isDark ? 'bg-black/50 text-white' : 'bg-white/80 text-gray-700'"
                style="backdrop-filter: blur(8px)"
              >
                {{ currentMediaIndex + 1 }} / {{ narrative.media.length }}
              </span>
            </div>
          </div>
        </div>

        <!-- 右侧描述区域 -->
        <div class="lg:w-2/5 flex flex-col">
          <div class="flex items-center gap-3 mb-6">
            <span
              class="px-3 py-1 rounded-md text-xs font-medium"
              :class="
                narrative.type === 'video'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-violet-500/20 text-violet-400'
              "
            >
              {{ narrative.type === "video" ? "视频" : "图片" }}
            </span>
          </div>
          <h1
            class="text-3xl md:text-4xl font-bold mb-6"
            :class="isDark ? 'text-white' : 'text-gray-900'"
          >
            {{ narrative.title }}
          </h1>
          <div class="flex-1">
            <p class="text-lg leading-relaxed" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              {{ narrative.description }}
            </p>
          </div>
          <div class="mt-8 pt-6 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span
                  class="w-2 h-2 rounded-full"
                  :class="narrative.type === 'video' ? 'bg-blue-500' : 'bg-violet-500'"
                ></span>
                <span class="text-sm" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  {{ (narrative.media && narrative.media.length) || 0 }} 个{{
                    narrative.type === "video" ? "视频" : "图片"
                  }}
                </span>
              </div>
              <span class="text-sm" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                {{ narrative.createdAt ? new Date(narrative.createdAt).toLocaleDateString() : "" }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 未找到 -->
      <div v-else class="text-center py-20">
        <div
          class="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
          :class="isDark ? 'bg-gray-800' : 'bg-gray-100'"
        >
          <BookOpen class="w-10 h-10 opacity-50" />
        </div>
        <h3 class="text-xl font-semibold mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
          叙述不存在
        </h3>
        <button
          class="mt-4 px-6 py-2 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-all"
          @click="$router.back()"
        >
          返回列表
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { BookOpen, ChevronLeft, ChevronRight, Video } from "lucide-vue-next";
import { useRoute } from "vue-router";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";

const route = useRoute();
const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${import.meta.env.VITE_API_BASE_URL}${url}`;
};

const loading = ref(true);
const narrative = ref<any>(null);
const currentMediaIndex = ref(0);

const fetchNarrative = async () => {
  loading.value = true;
  try {
    const id = route.params.id as string;
    narrative.value = await http.get(`/narrative/${id}`);
    currentMediaIndex.value = 0;
  } catch (e) {
    console.error("获取叙述详情失败:", e);
    narrative.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchNarrative();
});
</script>
