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
              背景图片URL
            </label>
            <input
              v-model="form.image"
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
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useAppStore } from "@/stores/app";
import { useMessage } from "@/composables/useMessage";
import { http } from "@/utils/request";

const appStore = useAppStore();
const { success, error, warning } = useMessage();

const isDark = computed(() => appStore.themeMode === "dark");

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

const scenes = ref<Scene[]>([]);
const searchKeyword = ref("");
const showModal = ref(false);
const editingScene = ref<Scene | null>(null);
const saving = ref(false);

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
  if (!form.sceneId || !form.name || !form.icon || !form.image || !form.audioUrl) {
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

const deleteScene = async (scene: Scene) => {
  try {
    await http.delete(`/scene/${scene.sceneId}`);
    success("场景删除成功");
    await fetchScenes();
  } catch (err) {
    error("删除失败");
  }
};

onMounted(() => {
  fetchScenes();
});
</script>
