<template>
  <div class="min-h-screen p-6">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            足迹管理
          </h1>
          <p class="mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            记录去过的城市和地方
          </p>
        </div>
        <button
          class="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
          @click="openAddModal"
        >
          + 添加足迹
        </button>
      </div>

      <div class="grid gap-4">
        <div
          v-for="footprint in footprints"
          :key="footprint.id"
          class="rounded-xl p-4 hover:shadow-lg transition-all"
          :class="
            isDark
              ? 'bg-gray-800/60 border border-gray-700/30 hover:bg-gray-800/80'
              : 'bg-white/60 border border-gray-200/30 hover:bg-white/80'
          "
          style="backdrop-filter: blur(12px)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-xl">📍</span>
                <span
                  class="text-lg font-semibold"
                  :class="isDark ? 'text-white' : 'text-gray-900'"
                >
                  {{ footprint.province }} · {{ footprint.city }}
                </span>
              </div>
              <div class="mt-2">
                <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  去过的地方：
                </span>
                <div class="flex flex-wrap gap-2 mt-1">
                  <span
                    v-for="(place, index) in getPlaces(footprint.places)"
                    :key="index"
                    class="px-2 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-md"
                  >
                    {{ place }}
                  </span>
                  <span
                    v-if="!footprint.places"
                    class="text-sm"
                    :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                  >
                    暂无记录
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="px-3 py-1 text-sm rounded-md transition-colors"
                :class="
                  isDark
                    ? 'text-gray-300 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                "
                @click="openEditModal(footprint)"
              >
                编辑
              </button>
              <button
                class="px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
                @click="deleteFootprint(footprint.id)"
              >
                删除
              </button>
            </div>
          </div>
        </div>

        <div v-if="footprints.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🌍</div>
          <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">还没有记录任何足迹</p>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
            点击上方按钮开始添加
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="rounded-xl p-6 w-full max-w-md" :class="isDark ? 'bg-gray-800' : 'bg-white'">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ editingFootprint ? "编辑足迹" : "添加足迹" }}
          </h2>
          <button
            class="text-xl transition-colors"
            :class="isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'"
            @click="closeModal"
          >
            ×
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
              省份
            </label>
            <input
              v-model="form.province"
              type="text"
              placeholder="如：湖北省"
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-purple-500 transition-colors"
              :class="
                isDark
                  ? 'bg-white/10 border-white/20 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              "
            />
          </div>

          <div>
            <label class="block text-sm mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
              城市
            </label>
            <input
              v-model="form.city"
              type="text"
              placeholder="如：武汉市"
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-purple-500 transition-colors"
              :class="
                isDark
                  ? 'bg-white/10 border-white/20 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              "
            />
          </div>

          <div>
            <label class="block text-sm mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
              去过的地方
            </label>
            <textarea
              v-model="form.placesInput"
              placeholder="用逗号隔开多个地方，如：东西湖，东湖，臧龙岛"
              rows="3"
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-purple-500 resize-none transition-colors"
              :class="
                isDark
                  ? 'bg-white/10 border-white/20 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              "
              @keydown.enter.prevent="handlePlacesInput"
            ></textarea>
            <p class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
              提示：输入完成后按回车确认修改
            </p>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            class="flex-1 px-4 py-2 rounded-lg transition-colors"
            :class="
              isDark
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            @click="closeModal"
          >
            取消
          </button>
          <button
            class="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            @click="saveFootprint"
          >
            {{ editingFootprint ? "保存修改" : "添加" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAppStore } from "@/stores/app";
import { useMessage } from "@/composables";
import { http } from "@/utils/request";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");
const { error, success } = useMessage();

interface Footprint {
  id: string;
  province: string;
  city: string;
  places: string;
  createdAt: string;
  updatedAt: string;
}

const footprints = ref<Footprint[]>([]);
const showModal = ref(false);
const editingFootprint = ref<Footprint | null>(null);

const form = ref({
  province: "",
  city: "",
  placesInput: "",
});

const getPlaces = (places: string): string[] => {
  if (!places) return [];
  return places
    .split(/[,，]/)
    .map((p) => p.trim())
    .filter(Boolean);
};

const loadFootprints = async () => {
  try {
    const data = await http.get<Footprint[]>("/footprint/footprints");
    footprints.value = data;
  } catch (e) {
    error("加载足迹失败");
  }
};

const openAddModal = () => {
  editingFootprint.value = null;
  form.value = {
    province: "",
    city: "",
    placesInput: "",
  };
  showModal.value = true;
};

const openEditModal = (footprint: Footprint) => {
  editingFootprint.value = footprint;
  form.value = {
    province: footprint.province,
    city: footprint.city,
    placesInput: footprint.places,
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingFootprint.value = null;
};

const handlePlacesInput = () => {};

const saveFootprint = async () => {
  if (!form.value.province || !form.value.city) {
    error("请填写省份和城市");
    return;
  }

  try {
    if (editingFootprint.value) {
      await http.put(`/footprint/footprints/${editingFootprint.value.id}`, {
        province: form.value.province,
        city: form.value.city,
        places: form.value.placesInput,
      });
      success("更新成功");
    } else {
      await http.post("/footprint/footprints", {
        province: form.value.province,
        city: form.value.city,
        places: form.value.placesInput,
      });
      success("添加成功");
    }
    closeModal();
    await loadFootprints();
  } catch (e) {
    error(editingFootprint.value ? "更新失败" : "添加失败");
  }
};

const deleteFootprint = async (id: string) => {
  if (!confirm("确定要删除这个足迹吗？")) return;
  try {
    await http.delete(`/footprint/footprints/${id}`);
    success("删除成功");
    await loadFootprints();
  } catch (e) {
    error("删除失败");
  }
};

onMounted(() => {
  loadFootprints();
});
</script>
