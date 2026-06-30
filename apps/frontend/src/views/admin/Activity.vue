<template>
  <div class="activity-page max-w-4xl mx-auto overflow-x-hidden">
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
            📋 系统记录
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            查看系统自动记录的操作日志和动态
          </p>
        </div>
        <button
          v-if="activityList.length > 0"
          class="px-4 py-2 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
          @click="clearActivities"
        >
          清空记录
        </button>
      </div>
    </div>

    <div
      class="rounded-2xl border p-6"
      :class="isDark ? 'bg-gray-800/60 border-gray-700/30' : 'bg-white/60 border-gray-200/30'"
      style="backdrop-filter: blur(12px)"
    >
      <div class="flex flex-wrap items-center gap-4 mb-6">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            筛选：
          </span>
          <div class="flex flex-wrap gap-2">
            <button
              class="px-3 py-1.5 text-sm rounded-lg transition-colors"
              :class="
                activityFilterType === ''
                  ? isDark
                    ? 'bg-violet-500 text-white'
                    : 'bg-violet-100 text-violet-700'
                  : isDark
                    ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              "
              @click="activityFilterType = ''"
            >
              全部
            </button>
            <button
              v-for="type in activityTypes"
              :key="type"
              class="px-3 py-1.5 text-sm rounded-lg transition-colors"
              :class="
                activityFilterType === type
                  ? isDark
                    ? 'bg-violet-500 text-white'
                    : 'bg-violet-100 text-violet-700'
                  : isDark
                    ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              "
              @click="activityFilterType = type"
            >
              {{ type }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="activityLoading" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2"
          :class="isDark ? 'border-violet-500' : 'border-violet-600'"
        ></div>
      </div>

      <div v-else-if="activityList.length === 0" class="text-center py-12">
        <div class="text-4xl mb-4">📭</div>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">暂无系统记录</p>
        <p class="text-sm mt-2" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
          系统会自动记录文章、图片、歌词、场景的新增操作
        </p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="item in activityList"
          :key="item.id"
          class="flex items-start gap-4 p-4 rounded-xl border transition-all"
          :class="isDark ? 'bg-gray-700/50 border-gray-600/30' : 'bg-white/60 border-gray-200/30'"
        >
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            :class="getActivityTypeBg(item.type)"
          >
            {{ getActivityTypeIcon(item.type) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ item.targetName || "系统操作" }}
              </span>
              <span
                class="text-xs font-medium px-2 py-0.5 rounded-full"
                :class="isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'"
              >
                {{ item.type }}
              </span>
            </div>
            <p class="text-sm mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ item.description }}
            </p>
            <span class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
              {{ formatActivityTime(item.createdAt) }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="activityTotal > activityLimit" class="flex items-center justify-center gap-4 mt-6">
        <button
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :class="
            isDark
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          "
          :disabled="activityPage === 1"
          @click="activityPage--"
        >
          上一页
        </button>
        <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
          第 {{ activityPage }} / {{ Math.ceil(activityTotal / activityLimit) }} 页
        </span>
        <button
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :class="
            isDark
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          "
          :disabled="activityPage >= Math.ceil(activityTotal / activityLimit)"
          @click="activityPage++"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useAppStore } from "@/stores/app";
import { useMessage } from "@/composables";
import { http } from "@/utils/request";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");
const { error, success } = useMessage();

const activityList = ref<any[]>([]);
const activityTotal = ref(0);
const activityPage = ref(1);
const activityLimit = ref(20);
const activityLoading = ref(false);
const activityFilterType = ref("");
const activityTypes = ref<string[]>([]);

const fetchActivities = async () => {
  activityLoading.value = true;
  try {
    const params: any = {
      page: activityPage.value,
      limit: activityLimit.value,
    };
    if (activityFilterType.value) {
      params.type = activityFilterType.value;
    }
    const data = await http.get<{
      list: any[];
      total: number;
      types: string[];
    }>("/activity/admin/list", { params });
    activityList.value = data.list;
    activityTotal.value = data.total;
    activityTypes.value = data.types;
  } catch (err: any) {
    error(err.message || "获取系统记录失败");
  } finally {
    activityLoading.value = false;
  }
};

const clearActivities = async () => {
  if (!confirm("确定要清空所有系统记录吗？此操作不可恢复。")) {
    return;
  }
  try {
    await http.delete("/activity");
    activityList.value = [];
    activityTotal.value = 0;
    activityPage.value = 1;
    success("系统记录已清空");
  } catch (err: any) {
    error(err.message || "清空失败");
  }
};

const getActivityTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    文章: "📝",
    图片: "🖼️",
    歌词: "🎵",
    场景: "🌄",
  };
  return icons[type] || "📋";
};

const getActivityTypeBg = (type: string) => {
  const bgs: Record<string, string> = {
    文章: "bg-gradient-to-br from-violet-100 to-purple-100 dark:bg-gradient-to-br dark:from-violet-500/20 dark:to-purple-500/20",
    图片: "bg-gradient-to-br from-cyan-100 to-blue-100 dark:bg-gradient-to-br dark:from-cyan-500/20 dark:to-blue-500/20",
    歌词: "bg-gradient-to-br from-green-100 to-emerald-100 dark:bg-gradient-to-br dark:from-green-500/20 dark:to-emerald-500/20",
    场景: "bg-gradient-to-br from-amber-100 to-orange-100 dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-orange-500/20",
  };
  return (
    bgs[type] ||
    "bg-gradient-to-br from-gray-100 to-gray-200 dark:bg-gradient-to-br dark:from-gray-500/20 dark:to-gray-600/20"
  );
};

const formatActivityTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  fetchActivities();
});

watch([activityPage, activityFilterType], () => {
  fetchActivities();
});
</script>
