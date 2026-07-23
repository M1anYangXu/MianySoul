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

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="text-center mb-16">
        <h1
          class="text-4xl md:text-5xl font-bold mb-4"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            :class="
              isDark
                ? 'bg-gradient-to-r from-primary-400 via-accent-400 to-primary-500'
                : 'bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700'
            "
            class="bg-clip-text text-transparent"
          >
            {{ selectedNarrative ? selectedNarrative.title : pageTitle }}
          </span>
        </h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">
          {{
            selectedNarrative ? selectedNarrative.description.slice(0, 50) + "..." : pageSubtitle
          }}
        </p>
      </div>

      <!-- 返回按钮 -->
      <Transition name="fade">
        <div v-if="selectedNarrative" class="mb-8 flex justify-center">
          <button
            class="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
            :class="
              isDark
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-lg'
            "
            style="backdrop-filter: blur(8px)"
            @click="closeDetail"
          >
            <ArrowLeft class="w-4 h-4" />
            <span>返回列表</span>
          </button>
        </div>
      </Transition>

      <!-- 列表视图 -->
      <Transition name="list-fade" mode="out-in">
        <div v-if="!selectedNarrative" key="list" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div
            v-for="(item, index) in narratives"
            :key="item.id"
            class="narrative-card-wrapper group"
            :class="{
              'translate-y-0 opacity-100': cardsVisible,
              'translate-y-16 opacity-0': !cardsVisible,
            }"
            :style="{
              transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.1 * index}s`,
            }"
          >
            <div class="relative cursor-pointer group" @click="openDetail(item)">
              <div
                class="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                :class="item.type === 'video' ? 'bg-blue-500/30' : 'bg-violet-500/30'"
                style="transform: scale(0.9); filter: blur(40px)"
              ></div>

              <div
                class="relative rounded-3xl overflow-hidden transition-all duration-700"
                :class="[
                  isDark
                    ? 'bg-gray-800/80 border border-gray-700/40'
                    : 'bg-white/80 border border-gray-200/60',
                ]"
                style="backdrop-filter: blur(20px)"
              >
                <div class="relative h-64 md:h-72 overflow-hidden">
                  <template v-if="item.media && item.media.length > 0 && item.media[0]">
                    <img
                      v-if="item.media[0].type === 'image'"
                      :src="getFullImageUrl(item.media[0].mediaUrl)"
                      :alt="item.title"
                      class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125"
                    />
                    <div
                      v-else
                      class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
                    >
                      <Video
                        class="w-16 h-16 text-gray-500 group-hover:text-gray-400 transition-colors"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
                    >
                      <Video class="w-16 h-16 text-gray-500" />
                    </div>
                  </template>

                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                  ></div>

                  <div class="absolute top-4 left-4">
                    <span
                      class="px-4 py-2 rounded-full text-xs font-bold tracking-wider"
                      :class="
                        item.type === 'video'
                          ? 'bg-blue-500 text-white'
                          : 'bg-violet-500 text-white'
                      "
                    >
                      {{ item.type === "video" ? "视频" : "图片" }}
                    </span>
                  </div>

                  <div
                    class="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                  >
                    <div class="flex items-center gap-2">
                      <div
                        v-for="(_, i) in Math.min((item.media && item.media.length) || 0, 4)"
                        :key="i"
                        class="w-2 h-2 rounded-full"
                        :class="item.type === 'video' ? 'bg-blue-400' : 'bg-violet-400'"
                        :style="{ opacity: 1 - i * 0.2 }"
                      ></div>
                      <span
                        v-if="(item.media && item.media.length) || 0 > 4"
                        class="text-xs"
                        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                      >
                        +{{ (item.media && item.media.length) || 0 - 4 }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="p-6 relative">
                  <h3
                    class="text-xl font-bold mb-3 transition-all duration-300 group-hover:text-primary-500"
                    :class="isDark ? 'text-white' : 'text-gray-900'"
                  >
                    {{ item.title }}
                  </h3>
                  <p
                    class="text-sm leading-relaxed line-clamp-3 mb-4"
                    :class="isDark ? 'text-gray-400' : 'text-gray-600'"
                  >
                    {{ item.description }}
                  </p>

                  <div class="flex items-center justify-between">
                    <div
                      class="flex items-center gap-2 px-3 py-1.5 rounded-full"
                      :class="isDark ? 'bg-gray-700/50' : 'bg-gray-100/50'"
                    >
                      <span
                        class="w-2 h-2 rounded-full"
                        :class="item.type === 'video' ? 'bg-blue-500' : 'bg-violet-500'"
                      ></span>
                      <span
                        class="text-xs font-medium"
                        :class="isDark ? 'text-gray-300' : 'text-gray-600'"
                      >
                        {{ (item.media && item.media.length) || 0 }} 个{{
                          item.type === "video" ? "视频" : "图片"
                        }}
                      </span>
                    </div>

                    <button
                      class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                      :class="[
                        item.type === 'video'
                          ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                          : 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20',
                      ]"
                    >
                      <span>查看详情</span>
                      <ArrowUpRight class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div
                  class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  :class="
                    item.type === 'video'
                      ? 'from-blue-500 to-cyan-500'
                      : 'from-violet-500 to-purple-500'
                  "
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 详情视图 -->
        <div v-else key="detail" class="animate-fade-in">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- 左侧媒体区域 -->
            <div class="lg:w-3/5">
              <div class="relative rounded-2xl overflow-hidden shadow-2xl">
                <div class="relative h-64 md:h-80 lg:h-[450px]">
                  <template
                    v-if="
                      currentMediaIndex >= 0 &&
                      selectedNarrative.media &&
                      selectedNarrative.media[currentMediaIndex]
                    "
                  >
                    <img
                      v-if="selectedNarrative.media[currentMediaIndex].type === 'image'"
                      :src="getFullImageUrl(selectedNarrative.media[currentMediaIndex].mediaUrl)"
                      :alt="selectedNarrative.title"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full bg-gray-900 flex items-center justify-center">
                      <Video class="w-20 h-20 text-gray-600" />
                    </div>
                  </template>
                  <template v-else>
                    <div class="w-full h-full bg-gray-900 flex items-center justify-center">
                      <Video class="w-20 h-20 text-gray-600" />
                    </div>
                  </template>
                </div>

                <!-- 媒体切换卡牌 -->
                <div
                  v-if="selectedNarrative.media && selectedNarrative.media.length > 1"
                  class="p-4 bg-gray-900/90"
                >
                  <div class="flex gap-3 overflow-x-auto pb-2">
                    <div
                      v-for="(media, index) in selectedNarrative.media"
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
                      <div
                        v-else
                        class="w-full h-full bg-gray-700 flex items-center justify-center"
                      >
                        <Video class="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 导航按钮 -->
                <div
                  v-if="selectedNarrative.media && selectedNarrative.media.length > 1"
                  class="absolute top-1/2 -translate-y-1/2 left-4"
                >
                  <button
                    class="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    :class="
                      isDark
                        ? 'bg-black/50 text-white hover:bg-black/70'
                        : 'bg-white/80 text-gray-700 hover:bg-white'
                    "
                    style="backdrop-filter: blur(8px)"
                    @click="currentMediaIndex = Math.max(0, currentMediaIndex - 1)"
                  >
                    <ChevronLeft class="w-6 h-6" />
                  </button>
                </div>
                <div
                  v-if="selectedNarrative.media && selectedNarrative.media.length > 1"
                  class="absolute top-1/2 -translate-y-1/2 right-4"
                >
                  <button
                    class="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    :class="
                      isDark
                        ? 'bg-black/50 text-white hover:bg-black/70'
                        : 'bg-white/80 text-gray-700 hover:bg-white'
                    "
                    style="backdrop-filter: blur(8px)"
                    @click="
                      currentMediaIndex = Math.min(
                        (selectedNarrative.media.length || 1) - 1,
                        currentMediaIndex + 1
                      )
                    "
                  >
                    <ChevronRight class="w-6 h-6" />
                  </button>
                </div>

                <!-- 页码指示 -->
                <div
                  v-if="selectedNarrative.media && selectedNarrative.media.length > 1"
                  class="absolute top-4 right-4"
                >
                  <span
                    class="px-4 py-2 rounded-full text-sm font-medium"
                    :class="isDark ? 'bg-black/50 text-white' : 'bg-white/80 text-gray-700'"
                    style="backdrop-filter: blur(8px)"
                  >
                    {{ currentMediaIndex + 1 }} / {{ selectedNarrative.media.length }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 右侧描述区域 -->
            <div class="lg:w-2/5 flex flex-col">
              <div class="mb-4">
                <span
                  class="px-4 py-2 rounded-full text-xs font-bold tracking-wider"
                  :class="
                    selectedNarrative.type === 'video'
                      ? 'bg-blue-500 text-white'
                      : 'bg-violet-500 text-white'
                  "
                >
                  {{ selectedNarrative.type === "video" ? "视频" : "图片" }}
                </span>
              </div>
              <div class="flex-1 overflow-y-auto">
                <p
                  class="text-xl leading-loose"
                  :class="isDark ? 'text-gray-200' : 'text-gray-800'"
                >
                  {{ selectedNarrative.description }}
                </p>
              </div>
              <div
                class="mt-8 pt-6 border-t"
                :class="isDark ? 'border-gray-700' : 'border-gray-200'"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span
                      class="w-2 h-2 rounded-full"
                      :class="selectedNarrative.type === 'video' ? 'bg-blue-500' : 'bg-violet-500'"
                    ></span>
                    <span class="text-sm" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                      {{ (selectedNarrative.media && selectedNarrative.media.length) || 0 }} 个{{
                        selectedNarrative.type === "video" ? "视频" : "图片"
                      }}
                    </span>
                  </div>
                  <span class="text-sm" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                    {{
                      selectedNarrative.createdAt
                        ? new Date(selectedNarrative.createdAt).toLocaleDateString()
                        : ""
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <div v-if="!selectedNarrative && narratives.length === 0" class="text-center py-32">
        <div
          class="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center"
          :class="isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'"
        >
          <BookOpen class="w-12 h-12" :class="isDark ? 'text-gray-600' : 'text-gray-400'" />
        </div>
        <h3 class="text-2xl font-bold mb-3" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
          暂无叙述
        </h3>
        <p :class="isDark ? 'text-gray-500' : 'text-gray-400'" class="text-lg">
          记录下过去的故事，让回忆永远留存
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  Video,
  ArrowUpRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-vue-next";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
};

const narratives = ref<any[]>([]);
const cardsVisible = ref(false);
const selectedNarrative = ref<any>(null);
const currentMediaIndex = ref(0);

const pageTitle = ref("往事叙述");
const pageSubtitle = ref("每一张照片，都是一段故事的开始");

const fetchNarratives = async () => {
  try {
    narratives.value = await http.get("/narrative");
  } catch (e) {
    console.error("获取叙述失败:", e);
  }
};

const openDetail = (item: any) => {
  selectedNarrative.value = item;
  currentMediaIndex.value = 0;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const closeDetail = () => {
  selectedNarrative.value = null;
};

onMounted(() => {
  fetchNarratives();
  setTimeout(() => {
    cardsVisible.value = true;
  }, 300);
});
</script>

<style scoped>
.narrative-card-wrapper {
  perspective: 1200px;
}

.narrative-card-wrapper:hover .relative.rounded-3xl {
  transform: translateY(-12px);
  box-shadow:
    0 30px 60px -15px rgba(139, 92, 246, 0.3),
    0 0 50px rgba(139, 92, 246, 0.15);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 0.4s ease;
}

.list-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
