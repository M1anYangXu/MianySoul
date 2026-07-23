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
            <Headphones class="w-7 h-7 inline mr-2" />
            {{ moduleName }}
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ moduleDescription }}
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
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
          <DynamicIcon :name="scene.icon" class="w-10 h-10" />
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
              <Edit3 class="w-4 h-4" />
            </button>
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              "
              :title="scene.isActive ? '禁用' : '启用'"
              @click="toggleSceneStatus(scene)"
            >
              <component :is="scene.isActive ? Pause : Play" class="w-4 h-4" />
            </button>
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
              :class="
                isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
              "
              title="删除"
              @click="deleteScene(scene)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="scenes.length === 0" class="text-center py-16">
        <DynamicIcon
          name="Mountain"
          class="w-16 h-16 mx-auto mb-4"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'"
        />
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

        <div class="p-6 max-h-[65vh] overflow-y-auto">
          <div class="flex gap-4 mb-4">
            <div class="w-[140px]">
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
                class="w-full px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 text-sm"
                :class="[
                  isDark
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                    : 'border-gray-200 bg-white text-black placeholder-gray-400',
                  editingScene ? 'opacity-50 cursor-not-allowed' : '',
                ]"
                placeholder="rain"
              />
            </div>

            <div class="w-[120px]">
              <label
                class="block text-sm font-medium mb-2"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                名称
              </label>
              <input
                v-model="form.name"
                type="text"
                class="w-full px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 text-sm"
                :class="
                  isDark
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                    : 'border-gray-200 bg-white text-black placeholder-gray-400'
                "
                placeholder="雨天"
              />
            </div>

            <div class="flex-1 min-w-0">
              <label
                class="block text-sm font-medium mb-2"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                图标
              </label>
              <div class="flex gap-2">
                <input
                  v-model="form.icon"
                  type="text"
                  class="flex-1 px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 text-sm"
                  :class="
                    isDark
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                      : 'border-gray-200 bg-white text-black placeholder-gray-400'
                  "
                  placeholder="输入 lucide 图标名，参考 https://lucide.dev/icons"
                />
                <button
                  class="px-3 py-2.5 rounded-xl border font-medium transition-colors flex-shrink-0 flex items-center gap-2"
                  :class="
                    isDark
                      ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  "
                  title="选择图标颜色"
                  @click="showColorPicker = true"
                >
                  <DynamicIcon
                    v-if="form.icon"
                    :name="form.icon"
                    class="w-4 h-4"
                    :style="{ color: form.color }"
                  />
                  <div class="w-4 h-4 rounded" :style="{ backgroundColor: form.color }"></div>
                </button>
              </div>
            </div>
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

  <div
    v-if="showColorPicker"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="showColorPicker = false"
  >
    <div
      class="w-full max-w-md rounded-xl shadow-xl overflow-hidden"
      :class="isDark ? 'bg-gray-800' : 'bg-white'"
    >
      <div class="p-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
        <h3 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-black'">选择颜色</h3>
      </div>
      <div class="p-6">
        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-12 h-12 rounded-xl border-2 border-gray-300 shadow-lg"
            :style="{ backgroundColor: form.color }"
          ></div>
          <input
            v-model="form.color"
            type="color"
            class="w-12 h-12 rounded-lg cursor-pointer border-0"
          />
          <input
            v-model="form.color"
            type="text"
            class="flex-1 px-4 py-2 rounded-lg border text-sm font-mono"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-200 bg-white text-black'
            "
          />
        </div>
        <div class="grid grid-cols-8 gap-2">
          <button
            v-for="color in presetColors"
            :key="color"
            class="w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110"
            :class="
              form.color === color
                ? 'border-white ring-2 ring-offset-2 ring-cyan-500'
                : 'border-transparent'
            "
            :style="{ backgroundColor: color }"
            @click="form.color = color"
          ></button>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            class="px-4 py-2 rounded-lg border font-medium transition-colors"
            :class="
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            "
            @click="showColorPicker = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-lg bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors"
            @click="showColorPicker = false"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useAppStore } from "@/stores/app";
import { useMessage, useModuleConfig } from "@/composables";
import { http } from "@/utils/request";
import { Edit3, Pause, Play, Trash2, Search, Headphones } from "lucide-vue-next";
import DynamicIcon from "@/components/DynamicIcon.vue";

const appStore = useAppStore();
const { success, error, warning } = useMessage();
const { getModuleName, getModuleDescription, loadConfig } = useModuleConfig();

const isDark = computed(() => appStore.themeMode === "dark");
const moduleName = computed(() => getModuleName("scenes"));
const moduleDescription = computed(() => getModuleDescription("scenes"));

const presetColors = [
  "#6366f1",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#64748b",
  "#1e293b",
  "#0f172a",
];

interface Scene {
  sceneId: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  audioUrl: string;
  isActive: boolean;
}

const scenes = ref<Scene[]>([]);
const searchKeyword = ref("");
const showModal = ref(false);
const showColorPicker = ref(false);
const editingScene = ref<Scene | null>(null);
const saving = ref(false);
const showDeleteConfirm = ref(false);
const deletingScene = ref<Scene | null>(null);

const form = reactive({
  sceneId: "",
  name: "",
  icon: "",
  color: "#6366f1",
  description: "",
  audioUrl: "",
});

const filteredScenes = computed(() => {
  if (!searchKeyword.value) return scenes.value;
  const keyword = searchKeyword.value.toLowerCase();
  return scenes.value.filter(
    (scene) =>
      scene.name.toLowerCase().includes(keyword) || scene.sceneId.toLowerCase().includes(keyword)
  );
});

interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const fetchScenes = async () => {
  try {
    const data = await http.get<PaginationResult<Scene>>("/scene?activeOnly=false");
    scenes.value = data.list;
  } catch (err) {
    error("获取场景列表失败");
  }
};

const openAddModal = () => {
  editingScene.value = null;
  form.sceneId = "";
  form.name = "";
  form.icon = "";
  form.color = "#6366f1";
  form.description = "";
  form.audioUrl = "";
  showModal.value = true;
};

const openEditModal = (scene: Scene) => {
  editingScene.value = scene;
  form.sceneId = scene.sceneId;
  form.name = scene.name;
  form.icon = scene.icon;
  form.color = scene.color || "#6366f1";
  form.description = scene.description || "";
  form.audioUrl = scene.audioUrl;
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
        color: form.color,
        description: form.description,
        audioUrl: form.audioUrl,
      });
      success("场景更新成功");
    } else {
      await http.post("/scene", {
        sceneId: form.sceneId,
        name: form.name,
        icon: form.icon,
        color: form.color,
        description: form.description,
        audioUrl: form.audioUrl,
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

onMounted(async () => {
  await loadConfig();
  fetchScenes();
});
</script>
