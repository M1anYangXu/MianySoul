<template>
  <div class="memoir-entries-page max-w-3xl mx-auto px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="router.push({ name: 'AdminMemory' })"
        >
          ←
        </button>
        <div>
          <h1
            class="text-2xl font-bold flex items-center space-x-2"
            :class="isDark ? 'text-white' : 'text-gray-900'"
          >
            <span>{{ category?.icon }}</span>
            <span>{{ category?.name }}</span>
          </h1>
          <p
            v-if="category?.description"
            class="text-sm mt-1"
            :class="isDark ? 'text-gray-400' : 'text-gray-600'"
          >
            {{ category.description }}
          </p>
        </div>
      </div>
      <button
        class="px-4 py-2 rounded-lg gradient-danger text-white text-sm font-medium"
        @click="openEntryDialog()"
      >
        + 新建回忆
      </button>
    </div>

    <div
      v-if="loading"
      class="text-center py-12"
      :class="isDark ? 'text-gray-400' : 'text-gray-500'"
    >
      加载中...
    </div>
    <div
      v-else-if="entries.length === 0"
      class="text-center py-16 rounded-2xl border-2 border-dashed"
      :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'"
    >
      <div class="text-4xl mb-3">📝</div>
      <p>还没有任何回忆</p>
      <p class="text-sm mt-1">记录下这个分类的第一个故事吧</p>
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="entry in entries"
        :key="entry.id"
        class="p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200"
        :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
      >
        <div class="flex items-start justify-between mb-2">
          <div>
            <h3 class="font-semibold text-lg" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ entry.title }}
            </h3>
            <p
              v-if="entry.eventDate"
              class="text-xs mt-1"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'"
            >
              {{ formatDate(entry.eventDate) }}
            </p>
          </div>
          <div class="flex space-x-1">
            <button
              class="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              @click="openEntryDialog(entry)"
            >
              ✏️
            </button>
            <button
              class="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
              @click="deleteEntry(entry)"
            >
              🗑️
            </button>
          </div>
        </div>
        <div v-if="entry.imageUrl" class="mb-3">
          <img
            :src="getFullImageUrl(entry.imageUrl)"
            :alt="entry.title"
            class="w-full h-48 object-cover rounded-lg"
          />
        </div>
        <p class="text-sm whitespace-pre-wrap" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
          {{ entry.content }}
        </p>
      </div>
    </div>

    <!-- 条目编辑弹窗 -->
    <div
      v-if="showEntryDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showEntryDialog = false"
    >
      <div
        class="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-2xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <h2 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ editingEntry ? "编辑回忆" : "新建回忆" }}
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              标题 *
            </label>
            <input
              v-model="entryForm.title"
              type="text"
              placeholder="如：毕业典礼、运动会..."
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500"
              :class="
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              "
            />
          </div>
          <div>
            <label class="block text-sm mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              关联图片（可选）
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
                <span>{{ entryForm.imageUrl ? "更换图片" : "从图集中选择" }}</span>
              </button>
              <button
                v-if="entryForm.imageUrl"
                class="px-3 py-2 rounded-lg border text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                @click="entryForm.imageUrl = ''"
              >
                移除
              </button>
            </div>
            <div v-if="entryForm.imageUrl" class="mt-2">
              <img
                :src="getFullImageUrl(entryForm.imageUrl)"
                alt="预览"
                class="w-24 h-24 object-cover rounded-lg"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              事件日期（可选）
            </label>
            <input
              v-model="entryForm.eventDate"
              type="date"
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500"
              :class="
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              "
            />
          </div>
          <div>
            <label class="block text-sm mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              内容 *
            </label>
            <textarea
              v-model="entryForm.content"
              rows="10"
              placeholder="详细记录这段回忆..."
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono text-sm"
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
            @click="showEntryDialog = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-lg gradient-danger text-white text-sm font-medium"
            :disabled="!entryForm.title || !entryForm.content"
            @click="saveEntry"
          >
            保存
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
          <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            从已上传的图集中选择一张图片
          </p>
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
            v-else-if="images.length === 0"
            class="text-center py-12"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            <div class="text-4xl mb-3">📷</div>
            <p>还没有上传图片</p>
            <p class="text-sm mt-1">请先在图集管理中上传图片</p>
          </div>
          <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            <div
              v-for="img in images"
              :key="img.url"
              class="relative cursor-pointer rounded-lg overflow-hidden border-2 hover:border-pink-500 transition-all"
              :class="
                entryForm.imageUrl === img.url
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
                class="w-full aspect-square object-cover"
              />
              <div
                v-if="entryForm.imageUrl === img.url"
                class="absolute inset-0 bg-black/40 flex items-center justify-center"
              >
                <span class="text-white text-xl">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";
import { useMessage } from "@/composables";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");
const { success, error } = useMessage();

const categoryId = computed(() => route.params.categoryId as string);

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string | null;
}

interface Entry {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  eventDate: string | null;
  createdAt: string;
}

interface Image {
  url: string;
  filename: string;
}

const category = ref<Category | null>(null);
const entries = ref<Entry[]>([]);
const loading = ref(true);
const showEntryDialog = ref(false);
const editingEntry = ref<Entry | null>(null);
const entryForm = reactive({
  title: "",
  content: "",
  imageUrl: "",
  eventDate: "",
});

const showImagePicker = ref(false);
const images = ref<Image[]>([]);
const imagesLoading = ref(false);

const getFullImageUrl = (url: string) => {
  if (url.startsWith("http")) return url;
  return `${import.meta.env.VITE_API_BASE_URL}${url}`;
};

const fetchData = async () => {
  loading.value = true;
  try {
    const cats = await http.get<Category[]>("/memoir/categories");
    category.value = cats.find((c) => c.id === categoryId.value) || null;
    entries.value = await http.get<Entry[]>(`/memoir/categories/${categoryId.value}/entries`);
  } catch (e: any) {
    error(e.message || "加载失败");
  } finally {
    loading.value = false;
  }
};

const fetchImages = async () => {
  imagesLoading.value = true;
  try {
    images.value = await http.get<Image[]>("/gallery/images");
  } catch (e: any) {
    images.value = [];
  } finally {
    imagesLoading.value = false;
  }
};

const openImagePicker = () => {
  fetchImages();
  showImagePicker.value = true;
};

const selectImage = (img: Image) => {
  entryForm.imageUrl = img.url;
  showImagePicker.value = false;
};

const openEntryDialog = (entry?: Entry) => {
  if (entry) {
    editingEntry.value = entry;
    entryForm.title = entry.title;
    entryForm.content = entry.content;
    entryForm.imageUrl = entry.imageUrl || "";
    entryForm.eventDate = entry.eventDate ? entry.eventDate.split("T")[0] : "";
  } else {
    editingEntry.value = null;
    entryForm.title = "";
    entryForm.content = "";
    entryForm.imageUrl = "";
    entryForm.eventDate = "";
  }
  showEntryDialog.value = true;
};

const saveEntry = async () => {
  try {
    const payload = {
      title: entryForm.title,
      content: entryForm.content,
      imageUrl: entryForm.imageUrl || null,
      eventDate: entryForm.eventDate ? new Date(entryForm.eventDate).toISOString() : null,
    };
    if (editingEntry.value) {
      await http.put(`/memoir/entries/${editingEntry.value.id}`, payload);
      success("更新成功");
    } else {
      await http.post(`/memoir/categories/${categoryId.value}/entries`, payload);
      success("创建成功");
    }
    showEntryDialog.value = false;
    await fetchData();
  } catch (e: any) {
    error(e.message || "保存失败");
  }
};

const deleteEntry = async (entry: Entry) => {
  if (!confirm(`确定删除「${entry.title}」吗？`)) return;
  try {
    await http.delete(`/memoir/entries/${entry.id}`);
    success("删除成功");
    await fetchData();
  } catch (e: any) {
    error(e.message || "删除失败");
  }
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("zh-CN");
};

onMounted(fetchData);
</script>
