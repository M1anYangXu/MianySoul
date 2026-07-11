<template>
  <div class="max-w-4xl mx-auto">
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
            <Globe class="w-7 h-7 inline mr-2" />
            {{ moduleName }}
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ moduleDescription }}
          </p>
        </div>
        <button
          class="px-6 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          @click="openAddModal"
        >
          + 添加足迹
        </button>
      </div>
    </div>

    <div
      class="rounded-xl border shadow-sm p-4 mb-6"
      :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex flex-1 min-w-[200px] items-center gap-2">
          <div class="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索城市或地点..."
              class="w-full pl-9 pr-4 py-2.5 rounded-lg border focus:outline-none focus:border-purple-500 transition-colors"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
              @keyup.enter="handleSearch"
            />
          </div>
          <button
            class="px-4 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity"
            @click="handleSearch"
          >
            搜索
          </button>
        </div>

        <div class="relative">
          <button
            type="button"
            class="px-4 py-2.5 rounded-lg border min-w-[140px] flex items-center justify-between gap-2 transition-colors"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600'
                : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
            "
            @click="provinceDropdownOpen = !provinceDropdownOpen"
          >
            <span class="truncate">{{ selectedProvince || "全部省份" }}</span>
            <svg
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': provinceDropdownOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <Transition
            enter-active-class="transition-all duration-150 ease-out"
            leave-active-class="transition-all duration-100 ease-in"
            enter-from-class="opacity-0 -translate-y-1 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 -translate-y-1 scale-95"
          >
            <div
              v-if="provinceDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-20"
            >
              <button
                class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                :class="
                  !selectedProvince
                    ? 'text-purple-500 font-medium'
                    : isDark
                      ? 'text-gray-300'
                      : 'text-gray-700'
                "
                @click="selectProvince('')"
              >
                全部省份
              </button>
              <button
                v-for="province in provinces"
                :key="province"
                class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                :class="
                  selectedProvince === province
                    ? 'text-purple-500 font-medium'
                    : isDark
                      ? 'text-gray-300'
                      : 'text-gray-700'
                "
                @click="selectProvince(province)"
              >
                {{ province }}
              </button>
            </div>
          </Transition>
        </div>

        <button
          v-if="searchKeyword || selectedProvince"
          class="px-4 py-2.5 rounded-lg border transition-colors"
          :class="
            isDark
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          "
          @click="resetFilters"
        >
          重置
        </button>
      </div>
    </div>

    <div
      v-if="provinceDropdownOpen"
      class="fixed inset-0 z-10"
      @click="provinceDropdownOpen = false"
    ></div>

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
              <span class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ footprint.province }} · {{ footprint.city }}
              </span>
            </div>
            <div class="mt-2 flex items-center gap-2">
              <span class="text-sm shrink-0" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                去过的地方：
              </span>
              <div class="flex flex-wrap gap-2">
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
import { useMessage, useModuleConfig } from "@/composables";
import { http } from "@/utils/request";
import { Globe } from "lucide-vue-next";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");
const { error, success } = useMessage();
const { getModuleName, getModuleDescription, loadConfig } = useModuleConfig();

const moduleName = computed(() => getModuleName("footprint"));
const moduleDescription = computed(() => getModuleDescription("footprint"));

interface Footprint {
  id: string;
  province: string;
  city: string;
  places: string;
  createdAt: string;
  updatedAt: string;
}

const footprints = ref<Footprint[]>([]);
const allFootprints = ref<Footprint[]>([]);
const showModal = ref(false);
const editingFootprint = ref<Footprint | null>(null);

const searchKeyword = ref("");
const selectedProvince = ref("");
const provinceDropdownOpen = ref(false);

const provinces = computed(() => {
  const set = new Set<string>();
  allFootprints.value.forEach((f) => {
    if (f.province) set.add(f.province);
  });
  return Array.from(set).sort();
});

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

interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const loadFootprints = async () => {
  try {
    const data = await http.get<PaginationResult<Footprint>>("/footprint/footprints");
    allFootprints.value = data.list;
    applyFilters();
  } catch (e) {
    error("加载足迹失败");
  }
};

const applyFilters = () => {
  let filtered = [...allFootprints.value];

  if (selectedProvince.value) {
    filtered = filtered.filter((f) => f.province === selectedProvince.value);
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    filtered = filtered.filter(
      (f) => f.city.toLowerCase().includes(keyword) || f.places.toLowerCase().includes(keyword)
    );
  }

  footprints.value = filtered;
};

const handleSearch = () => {
  provinceDropdownOpen.value = false;
  applyFilters();
};

const selectProvince = (province: string) => {
  selectedProvince.value = province;
  provinceDropdownOpen.value = false;
  applyFilters();
};

const resetFilters = () => {
  searchKeyword.value = "";
  selectedProvince.value = "";
  provinceDropdownOpen.value = false;
  applyFilters();
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

onMounted(async () => {
  await loadConfig();
  loadFootprints();
});
</script>
