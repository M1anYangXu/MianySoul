<template>
  <div class="max-w-5xl mx-auto">
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
            <ClipboardList class="w-7 h-7 inline mr-2" />
            系统记录
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            查看和管理站点活动记录
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="
              isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            @click="refreshActivities"
          >
            刷新
          </button>
          <button
            v-if="activityList.length > 0"
            class="px-4 py-2 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
            @click="clearActivities"
          >
            清空记录
          </button>
        </div>
      </div>
    </div>

    <div
      class="rounded-xl border shadow-sm"
      :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr :class="isDark ? 'border-gray-700' : 'border-gray-200'">
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                类型
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                描述
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                目标名称
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                分组
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                创建时间
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'divide-gray-700' : 'divide-gray-200'">
            <tr
              v-for="item in activityList"
              :key="item.id"
              class="hover:bg-opacity-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center"
                    :class="getActivityTypeBg(item.type)"
                  >
                    <component
                      :is="getActivityTypeIcon(item.type)"
                      class="w-4 h-4"
                      :class="isDark ? 'text-white' : 'text-gray-700'"
                    />
                  </div>
                  <span
                    class="text-sm font-medium"
                    :class="isDark ? 'text-gray-300' : 'text-gray-900'"
                  >
                    {{ item.type }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <p
                  class="text-sm max-w-md truncate"
                  :class="isDark ? 'text-gray-400' : 'text-gray-600'"
                >
                  {{ item.description }}
                </p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  {{ item.targetName || "-" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  {{ item.groupName || "-" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  {{ formatActivityTime(item.createdAt) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  class="text-red-400 hover:text-red-300 text-sm transition-colors"
                  @click="deleteActivity(item.id)"
                >
                  删除
                </button>
              </td>
            </tr>
            <tr v-if="activityList.length === 0">
              <td colspan="6" class="px-6 py-12 text-center">
                <Inbox
                  class="w-12 h-12 mx-auto mb-4"
                  :class="isDark ? 'text-gray-600' : 'text-gray-400'"
                />
                <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">暂无活动记录</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="activityTotal > 0" class="px-6 py-4 flex items-center justify-between">
        <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
          共 {{ activityTotal }} 条记录
        </span>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1.5 rounded text-sm transition-colors"
            :class="[
              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700',
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80',
            ]"
            :disabled="currentPage === 1"
            @click="currentPage > 1 && fetchActivities(currentPage - 1)"
          >
            上一页
          </button>
          <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            {{ currentPage }} / {{ totalPages }}
          </span>
          <button
            class="px-3 py-1.5 rounded text-sm transition-colors"
            :class="[
              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700',
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80',
            ]"
            :disabled="currentPage === totalPages"
            @click="currentPage < totalPages && fetchActivities(currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAppStore } from "@/stores/app";
import { useMessage } from "@/composables";
import { http } from "@/utils/request";
import {
  ClipboardList,
  FileText,
  Image,
  Music,
  Video,
  Globe,
  Headphones,
  Layers,
  Inbox,
} from "lucide-vue-next";

const appStore = useAppStore();
const isDark = ref(appStore.themeMode === "dark");
const { error, success } = useMessage();

const activityList = ref<any[]>([]);
const activityTotal = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 20;

const fetchActivities = async (page: number = 1) => {
  try {
    const data = await http.get<any>("/activity/admin/list", {
      params: { page, limit: pageSize },
    });
    activityList.value = data.list;
    activityTotal.value = data.total;
    currentPage.value = data.page;
    totalPages.value = data.totalPages;
  } catch (err: any) {
    error(err.message || "获取活动记录失败");
  }
};

const refreshActivities = () => {
  fetchActivities(currentPage.value);
};

const clearActivities = async () => {
  if (!confirm("确定要清空所有系统记录吗？此操作不可恢复。")) {
    return;
  }
  try {
    await http.delete("/activity");
    activityList.value = [];
    activityTotal.value = 0;
    currentPage.value = 1;
    totalPages.value = 1;
    success("系统记录已清空");
  } catch (err: any) {
    error(err.message || "清空失败");
  }
};

const deleteActivity = async (id: string) => {
  if (!confirm("确定要删除这条记录吗？")) {
    return;
  }
  try {
    await http.delete(`/activity/${id}`);
    success("删除成功");
    fetchActivities(currentPage.value);
  } catch (err: any) {
    error(err.message || "删除失败");
  }
};

const getActivityTypeIcon = (type: string) => {
  const icons: Record<string, any> = {
    文章: FileText,
    图片: Image,
    歌词: Music,
    视频: Video,
    足迹: Globe,
    场景: Layers,
    音频: Headphones,
  };
  return icons[type] || ClipboardList;
};

const getActivityTypeBg = (type: string) => {
  const bgs: Record<string, string> = {
    文章: "bg-gradient-to-br from-violet-100 to-purple-100 dark:bg-gradient-to-br dark:from-violet-500/20 dark:to-purple-500/20",
    图片: "bg-gradient-to-br from-cyan-100 to-blue-100 dark:bg-gradient-to-br dark:from-cyan-500/20 dark:to-blue-500/20",
    歌词: "bg-gradient-to-br from-green-100 to-emerald-100 dark:bg-gradient-to-br dark:from-green-500/20 dark:to-emerald-500/20",
    视频: "bg-gradient-to-br from-blue-100 to-indigo-100 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-indigo-500/20",
    足迹: "bg-gradient-to-br from-amber-100 to-orange-100 dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-orange-500/20",
    场景: "bg-gradient-to-br from-pink-100 to-rose-100 dark:bg-gradient-to-br dark:from-pink-500/20 dark:to-rose-500/20",
    音频: "bg-gradient-to-br from-teal-100 to-cyan-100 dark:bg-gradient-to-br dark:from-teal-500/20 dark:to-cyan-500/20",
  };
  return (
    bgs[type] ||
    "bg-gradient-to-br from-gray-100 to-gray-200 dark:bg-gradient-to-br dark:from-gray-500/20 dark:to-gray-600/20"
  );
};

const formatActivityTime = (dateStr: string) => {
  const date = new Date(dateStr);
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
</script>
