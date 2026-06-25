<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
          🌄 场景管理
        </h1>
        <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          管理白噪音场景的信息
        </p>
      </div>
      <button
        class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        @click="openAddModal"
      >
        + 添加场景
      </button>
    </div>

    <div
      class="rounded-xl border shadow-sm overflow-hidden"
      :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <div class="p-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
        <div class="flex items-center gap-3">
          <div class="relative flex-1 max-w-md">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索场景名称..."
              class="w-full pl-9 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
            />
          </div>
          <button
            class="px-4 py-2.5 rounded-xl border transition-colors"
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
        <table class="w-full">
          <thead>
            <tr :class="isDark ? 'bg-gray-700' : 'bg-gray-50'">
              <th
                class="px-6 py-4 text-left text-sm font-semibold"
                :class="isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                图标
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold"
                :class="isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                场景ID
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold"
                :class="isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                名称
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold"
                :class="isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                描述
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold"
                :class="isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                状态
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold"
                :class="isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                排序
              </th>
              <th
                class="px-6 py-4 text-center text-sm font-semibold"
                :class="isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="scene in filteredScenes"
              :key="scene.sceneId"
              :class="
                isDark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'
              "
              class="border-t"
            >
              <td class="px-6 py-4">
                <span class="text-2xl">{{ scene.icon }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-mono" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  {{ scene.sceneId }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="font-medium" :class="isDark ? 'text-white' : 'text-black'">
                  {{ scene.name }}
                </span>
              </td>
              <td class="px-6 py-4 max-w-xs truncate">
                <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  {{ scene.description || "-" }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="
                    scene.isActive
                      ? 'bg-green-500 text-white dark:bg-green-600 dark:text-white'
                      : 'bg-gray-400 text-white dark:bg-gray-600 dark:text-white'
                  "
                >
                  {{ scene.isActive ? "启用" : "禁用" }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  {{ scene.sortOrder }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    class="px-3 py-1.5 text-sm rounded-lg hover:opacity-80 transition-opacity"
                    :class="isDark ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'"
                    @click="openEditModal(scene)"
                  >
                    编辑
                  </button>
                  <button
                    class="px-3 py-1.5 text-sm rounded-lg hover:opacity-80 transition-opacity"
                    :class="
                      scene.isActive
                        ? 'bg-amber-500 text-white dark:bg-amber-600 dark:text-white'
                        : 'bg-green-500 text-white dark:bg-green-600 dark:text-white'
                    "
                    @click="toggleSceneStatus(scene)"
                  >
                    {{ scene.isActive ? "禁用" : "启用" }}
                  </button>
                  <button
                    class="px-3 py-1.5 text-sm rounded-lg hover:opacity-80 transition-opacity bg-red-500 text-white dark:bg-red-600 dark:text-white"
                    @click="deleteScene(scene)"
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="scenes.length === 0">
              <td
                colspan="7"
                class="px-6 py-12 text-center"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                暂无场景数据
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
            class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
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
