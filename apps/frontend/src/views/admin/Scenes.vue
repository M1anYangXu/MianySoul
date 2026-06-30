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
            🌄 场景管理
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            管理白噪音场景的信息
          </p>
        </div>
        <button
          class="px-6 py-2.5 gradient-success text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          @click="openAddModal"
        >
          + 添加场景
        </button>
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
            placeholder="搜索场景名称..."
            class="w-full pl-11 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 text-base"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                : 'border-gray-200 bg-white text-black placeholder-gray-400'
            "
          />
        </div>
        <button
          class="px-5 py-2.5 rounded-xl border transition-colors text-base font-medium"
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

    <div class="space-y-3">
      <div
        v-for="scene in filteredScenes"
        :key="scene.sceneId"
        class="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-md group"
        :class="
          isDark
            ? 'bg-gray-800/60 border-gray-700/50 hover:border-cyan-500/30'
            : 'bg-white border-gray-200/50 hover:border-cyan-200'
        "
      >
        <div class="flex-shrink-0">
          <span class="text-3xl">{{ scene.icon }}</span>
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
              @click="openEditModal(scene)"
            >
              {{ scene.name }}
            </h3>
            <span
              class="w-2 h-2 rounded-full flex-shrink-0"
              :class="scene.isActive ? 'bg-green-500' : 'bg-yellow-500'"
            ></span>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">ID: {{ scene.sceneId }}</span>
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              排序 {{ scene.sortOrder }}
            </span>
            <span
              v-if="scene.description"
              class="truncate"
              :class="isDark ? 'text-gray-400' : 'text-gray-500'"
            >
              {{ scene.description }}
            </span>
          </div>
        </div>

        <div class="flex-shrink-0 flex items-center gap-4">
          <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            {{ scene.isActive ? "启用" : "禁用" }}
          </span>
          <div class="flex items-center gap-2">
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              "
              title="编辑"
              @click="openEditModal(scene)"
            >
              ✏️
            </button>
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              "
              :title="scene.isActive ? '禁用' : '启用'"
              @click="toggleSceneStatus(scene)"
            >
              {{ scene.isActive ? "⏸️" : "▶️" }}
            </button>
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
              :class="
                isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
              "
              title="删除"
              @click="deleteScene(scene)"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div v-if="scenes.length === 0" class="text-center py-16">
        <div class="text-5xl mb-4">🌄</div>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">暂无场景数据</p>
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
            {{ editingScene ? "编辑场景" : "添加场景" }}
          </h2>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              场景ID
            </label>
            <input
              v-model="form.sceneId"
              type="text"
              :disabled="!!editingScene"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="[
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400',
                editingScene ? 'opacity-50 cursor-not-allowed' : '',
              ]"
              placeholder="例如: rain"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              名称
            </label>
            <input
              v-model="form.name"
              type="text"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
              placeholder="例如: 雨天"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              图标
            </label>
            <input
              v-model="form.icon"
              type="text"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
              placeholder="例如: 🌧️"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              描述
            </label>
            <textarea
              v-model="form.description"
              rows="2"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 resize-none"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
              placeholder="描述这个场景..."
            ></textarea>
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              背景图片
            </label>
            <div
              v-if="form.image"
              class="relative w-full aspect-video rounded-xl overflow-hidden border group mb-2"
              :class="isDark ? 'border-gray-600' : 'border-gray-200'"
            >
              <img
                :src="getFullImageUrl(form.image)"
                alt="背景"
                class="w-full h-full object-cover"
                @error="form.image = ''"
              />
              <button
                type="button"
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition-opacity"
                @click="form.image = ''"
              >
                移除图片
              </button>
            </div>
            <button
              type="button"
              class="w-full px-4 py-2.5 rounded-xl border border-dashed text-sm flex items-center justify-center gap-2 transition-all"
              :class="
                isDark
                  ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:bg-gray-700/30'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
              "
              @click="openImagePicker"
            >
              <span>📷</span>
              <span>{{ form.image ? "更换图片" : "从图集选择图片" }}</span>
            </button>
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              音频URL
            </label>
            <input
              v-model="form.audioUrl"
              type="url"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
              placeholder="https://..."
            />
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
            @click="saveScene"
          >
            {{ saving ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 图片选择弹窗 -->
  <div
    v-if="showImagePicker"
    class="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
    style="z-index: 10000"
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
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div
            v-for="img in filteredImages"
            :key="img.id"
            class="relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all"
            :class="
              form.image === img.url
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
              class="w-full h-full object-cover"
            />
            <div
              v-if="form.image === img.url"
              class="absolute inset-0 bg-black/30 flex items-center justify-center"
            >
              <span class="text-white text-xl">✓</span>
            </div>
          </div>
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
        确定要删除场景「{{ deletingScene?.name }}」吗？此操作不可恢复。
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
          @click="confirmDeleteScene"
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
import { useMessage } from "@/composables/useMessage";
import { http } from "@/utils/request";

const appStore = useAppStore();
const { success, error, warning } = useMessage();

const isDark = computed(() => appStore.themeMode === "dark");

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
};

interface Scene {
  sceneId: string;
  name: string;
  icon: string;
  description?: string;
  image: string;
  audioUrl: string;
  sortOrder: number;
  isActive: boolean;
}

interface Image {
  id: string;
  url: string;
  filename: string;
  group?: { id: string; name: string; icon: string };
}

interface ImageGroup {
  id: string;
  name: string;
  icon: string;
  isDefault?: boolean;
}

const scenes = ref<Scene[]>([]);
const searchKeyword = ref("");
const showModal = ref(false);
const editingScene = ref<Scene | null>(null);
const saving = ref(false);
const showDeleteConfirm = ref(false);
const deletingScene = ref<Scene | null>(null);

const showImagePicker = ref(false);
const images = ref<Image[]>([]);
const imageGroups = ref<ImageGroup[]>([]);
const selectedGroupId = ref<string | null>(null);

const filteredImages = computed(() => {
  if (!selectedGroupId.value) {
    return [];
  }
  return images.value.filter((img) => img.group?.id === selectedGroupId.value);
});

const fetchImages = async () => {
  try {
    images.value = await http.get<Image[]>("/gallery/images");
    imageGroups.value = await http.get<ImageGroup[]>("/gallery/groups");
    const defaultGroup = imageGroups.value.find((g) => g.name === "默认分组");
    selectedGroupId.value = defaultGroup?.id || null;
  } catch (e) {
    images.value = [];
    imageGroups.value = [];
    selectedGroupId.value = null;
  }
};

const openImagePicker = () => {
  fetchImages();
  showImagePicker.value = true;
};

const selectImage = (img: Image) => {
  form.image = img.url;
  showImagePicker.value = false;
};

const form = reactive({
  sceneId: "",
  name: "",
  icon: "",
  description: "",
  image: "",
  audioUrl: "",
  sortOrder: 0,
});

const filteredScenes = computed(() => {
  if (!searchKeyword.value) return scenes.value;
  const keyword = searchKeyword.value.toLowerCase();
  return scenes.value.filter(
    (scene) =>
      scene.name.toLowerCase().includes(keyword) || scene.sceneId.toLowerCase().includes(keyword)
  );
});

const fetchScenes = async () => {
  try {
    scenes.value = await http.get<Scene[]>("/scene?activeOnly=false");
  } catch (err) {
    error("获取场景列表失败");
  }
};

const openAddModal = () => {
  editingScene.value = null;
  form.sceneId = "";
  form.name = "";
  form.icon = "";
  form.description = "";
  form.image = "";
  form.audioUrl = "";
  form.sortOrder = 0;
  showModal.value = true;
};

const openEditModal = (scene: Scene) => {
  editingScene.value = scene;
  form.sceneId = scene.sceneId;
  form.name = scene.name;
  form.icon = scene.icon;
  form.description = scene.description || "";
  form.image = scene.image;
  form.audioUrl = scene.audioUrl;
  form.sortOrder = scene.sortOrder;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingScene.value = null;
};

const saveScene = async () => {
  if (!form.sceneId || !form.name || !form.icon || !form.audioUrl) {
    warning("请填写所有必填项");
    return;
  }

  saving.value = true;
  try {
    if (editingScene.value) {
      await http.put(`/scene/${form.sceneId}`, {
        name: form.name,
        icon: form.icon,
        description: form.description,
        image: form.image,
        audioUrl: form.audioUrl,
        sortOrder: form.sortOrder,
      });
      success("场景更新成功");
    } else {
      await http.post("/scene", {
        sceneId: form.sceneId,
        name: form.name,
        icon: form.icon,
        description: form.description,
        image: form.image,
        audioUrl: form.audioUrl,
        sortOrder: form.sortOrder,
      });
      success("场景添加成功");
    }
    closeModal();
    await fetchScenes();
  } catch (err) {
    error(editingScene.value ? "更新场景失败" : "添加场景失败");
  } finally {
    saving.value = false;
  }
};

const toggleSceneStatus = async (scene: Scene) => {
  try {
    await http.put(`/scene/${scene.sceneId}`, {
      isActive: !scene.isActive,
    });
    success(scene.isActive ? "场景已禁用" : "场景已启用");
    await fetchScenes();
  } catch (err) {
    error("操作失败");
  }
};

const deleteScene = (scene: Scene) => {
  deletingScene.value = scene;
  showDeleteConfirm.value = true;
};

const confirmDeleteScene = async () => {
  if (!deletingScene.value) return;
  try {
    await http.delete(`/scene/${deletingScene.value.sceneId}`);
    success("场景删除成功");
    showDeleteConfirm.value = false;
    deletingScene.value = null;
    await fetchScenes();
  } catch (err) {
    error("删除失败");
  }
};

onMounted(() => {
  fetchScenes();
});
</script>
