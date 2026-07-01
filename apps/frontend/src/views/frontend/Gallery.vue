<template>
  <div class="min-h-screen py-24 px-6">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h1
          class="text-4xl md:text-5xl font-bold mb-4"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            :class="
              isDark
                ? 'bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400'
                : 'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600'
            "
            class="bg-clip-text text-transparent"
          >
            {{ pageTitle }}
          </span>
        </h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">
          {{ pageSubtitle }}
        </p>
      </div>

      <!-- 分组筛选 -->
      <div class="flex flex-wrap justify-center gap-2 mb-12">
        <button
          v-for="group in imageGroups"
          :key="group.id"
          class="px-4 py-2 rounded-full text-sm font-medium transition-all"
          :class="
            selectedGroupId === group.id
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
              : isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          "
          @click="selectGroup(group.id)"
        >
          {{ group.icon }} {{ group.name }}
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="(image, index) in galleryImages"
          :key="image.id"
          class="group relative rounded-lg overflow-hidden cursor-pointer aspect-square"
          :class="[
            galleryVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
            isDark ? 'bg-gray-800' : 'bg-gray-100',
          ]"
          :style="{ transition: `all 0.6s ease-out ${0.08 * index}s` }"
          @click="openImagePreview(image)"
        >
          <img
            :src="image.url"
            :alt="image.filename"
            class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            :class="imageLoaded[image.id] ? 'opacity-100' : 'opacity-0'"
            @load="onImageLoaded(image.id)"
          />
          <div
            v-if="!imageLoaded[image.id]"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div
              class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              :class="isDark ? 'border-gray-600' : 'border-gray-300'"
            ></div>
          </div>
          <div
            class="absolute inset-0 transition-colors duration-300"
            :class="
              isDark ? 'bg-white/0 group-hover:bg-white/10' : 'bg-black/0 group-hover:bg-black/5'
            "
          ></div>
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <Teleport to="body">
        <div v-if="selectedImage" class="fixed inset-0 z-[100]">
          <!-- 背景遮罩层 -->
          <div class="absolute inset-0 bg-black/90" @click="closeImagePreview"></div>

          <!-- 关闭按钮 -->
          <button
            class="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-[101]"
            @click="closeImagePreview"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- 图片（点击图片也能关闭） -->
          <div class="absolute inset-0 flex items-center justify-center p-4">
            <img
              :src="selectedImage.url"
              :alt="selectedImage.filename"
              class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-pointer"
              @click="closeImagePreview"
            />
          </div>

          <!-- 文件名 -->
          <div
            class="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 text-white text-sm backdrop-blur-sm"
          >
            {{ selectedImage.filename }}
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";
import { useModuleConfig } from "@/composables/useModuleConfig";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

const { getPageTitle, getPageSubtitle } = useModuleConfig();
const pageTitle = computed(() => getPageTitle("gallery"));
const pageSubtitle = computed(() => getPageSubtitle("gallery"));

interface ImageItem {
  id: string;
  url: string;
  filename: string;
  createdAt: string;
}

interface ImageGroup {
  id: string;
  name: string;
  icon: string;
  isVisible: boolean;
}

const galleryImages = ref<ImageItem[]>([]);
const galleryVisible = ref(false);
const selectedImage = ref<ImageItem | null>(null);
const imageGroups = ref<ImageGroup[]>([]);
const selectedGroupId = ref<string | null>(null);
const imageLoaded = ref<Record<string, boolean>>({});

const onImageLoaded = (id: string) => {
  imageLoaded.value[id] = true;
};

const openImagePreview = (image: ImageItem) => {
  selectedImage.value = image;
  document.body.style.overflow = "hidden";
};

const closeImagePreview = () => {
  selectedImage.value = null;
  document.body.style.overflow = "";
};

const fetchGallery = async (groupId?: string) => {
  try {
    const params: any = { limit: 100 };
    if (groupId && groupId !== "all") {
      params.groupId = groupId;
    }
    const data = await http.get<ImageItem[]>("/gallery/recent", { params });
    imageLoaded.value = {};
    galleryImages.value = data;
  } catch (e) {
    console.error("获取图片失败:", e);
  }
};

const fetchGroups = async () => {
  try {
    const data = await http.get<ImageGroup[]>("/gallery/groups/public");
    imageGroups.value = data;
  } catch (e) {
    console.error("获取分组失败:", e);
    imageGroups.value = [];
  }
};

const selectGroup = (groupId: string) => {
  selectedGroupId.value = groupId;
  galleryVisible.value = false;
  fetchGallery(groupId);
  setTimeout(() => {
    galleryVisible.value = true;
  }, 100);
};

onMounted(async () => {
  await fetchGroups();
  if (imageGroups.value.length > 0) {
    selectedGroupId.value = imageGroups.value[0].id;
    fetchGallery(imageGroups.value[0].id);
  }
  setTimeout(() => {
    galleryVisible.value = true;
  }, 100);
});
</script>
