<template>
  <div class="admin-root space-y-5" :data-admin-module="'dashboard'">
    <!-- Welcome Header -->
    <div class="admin-page-header">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            :class="isDark ? 'bg-blue-500/20' : 'bg-blue-50'"
          >
            <IconPark type="Home" :size="24" :class="isDark ? 'text-blue-400' : 'text-blue-600'" />
          </div>
          <div>
            <h1 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              欢迎回来，{{ userInfo?.username }}
            </h1>
            <p class="text-sm mt-0.5" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ dailyQuote }}
              <span v-if="quoteFrom" class="opacity-60 ml-1">—— {{ quoteFrom }}</span>
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            :class="isDark ? 'bg-gray-800' : 'bg-gray-100'"
          >
            <span class="text-base">{{ weatherEmoji }}</span>
            <span class="text-sm font-medium" :class="isDark ? 'text-gray-200' : 'text-gray-700'">
              {{ currentDay }}
            </span>
            <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ temperature }}°C
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Storage + Todos -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Storage Card -->
      <div class="admin-card">
        <div class="flex items-center justify-between mb-4">
          <h3
            class="font-semibold flex items-center gap-2 text-sm"
            :class="isDark ? 'text-white' : 'text-gray-900'"
          >
            <IconPark type="HardDisk" :size="18" />
            存储用量
          </h3>
          <span
            class="text-sm font-medium tabular-nums"
            :class="isDark ? 'text-gray-300' : 'text-gray-700'"
          >
            {{ formatSize(storageUsed) }} / {{ formatSize(storageTotal) }}
          </span>
        </div>
        <div class="grid grid-cols-3 gap-3 mb-4">
          <div
            v-for="item in storageItems"
            :key="item.label"
            class="flex items-center gap-2 p-2 rounded-lg"
            :class="isDark ? 'bg-gray-800/60' : 'bg-gray-50'"
          >
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="item.iconBg"
            >
              <IconPark :type="item.icon" :size="16" :class="item.iconColor" />
            </div>
            <div class="min-w-0">
              <p
                class="text-xs font-medium truncate"
                :class="isDark ? 'text-gray-200' : 'text-gray-700'"
              >
                {{ item.label }}
              </p>
              <p class="text-xs tabular-nums" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ formatSize(item.size) }}
              </p>
            </div>
          </div>
        </div>
        <div class="pt-3 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              已使用 {{ storagePercent.toFixed(1) }}%
            </span>
            <span class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              剩余 {{ formatSize(storageTotal - storageUsed) }}
            </span>
          </div>
          <div
            class="h-2 rounded-full overflow-hidden"
            :class="isDark ? 'bg-gray-700' : 'bg-gray-100'"
          >
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="isDark ? 'bg-blue-500' : 'bg-blue-500'"
              :style="{ width: progressBarWidth }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Todos Card -->
      <div class="admin-card">
        <div class="flex items-center justify-between mb-4">
          <h3
            class="font-semibold flex items-center gap-2 text-sm"
            :class="isDark ? 'text-white' : 'text-gray-900'"
          >
            <IconPark type="List" :size="18" />
            待办事项
          </h3>
          <span class="text-xs tabular-nums" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            {{ completedCount }}/{{ todos.length }}
          </span>
        </div>
        <div class="flex gap-2 mb-3">
          <input
            v-model="newTodo"
            type="text"
            placeholder="添加待办事项..."
            class="admin-input flex-1"
            @keyup.enter="addTodo"
          />
          <button class="btn-admin-md btn-admin-primary" @click="addTodo">
            <IconPark type="Plus" :size="14" />
            添加
          </button>
        </div>
        <div class="max-h-[180px] overflow-y-auto space-y-1 pr-1">
          <div
            v-for="(todo, index) in todos"
            :key="index"
            class="flex items-center gap-2 py-1.5 px-2 rounded-md transition-colors"
            :class="isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'"
          >
            <button
              class="w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0"
              :class="
                todo.completed
                  ? 'bg-blue-500 border-blue-500'
                  : isDark
                    ? 'border-gray-600 hover:border-blue-400'
                    : 'border-gray-300 hover:border-blue-400'
              "
              @click="toggleTodo(index)"
            >
              <IconPark v-if="todo.completed" type="Check" :size="10" class="text-white" />
            </button>
            <span
              class="flex-1 text-sm truncate"
              :class="[
                isDark ? 'text-gray-300' : 'text-gray-700',
                todo.completed ? 'line-through opacity-50' : '',
              ]"
            >
              {{ todo.text }}
            </span>
            <button
              class="p-1 rounded transition-colors flex-shrink-0"
              :class="
                isDark
                  ? 'text-gray-500 hover:bg-gray-700 hover:text-red-400'
                  : 'text-gray-400 hover:bg-red-50 hover:text-red-500'
              "
              @click="deleteTodo(index)"
            >
              <IconPark type="Close" :size="12" />
            </button>
          </div>
          <div
            v-if="todos.length === 0"
            class="text-center py-4 text-sm"
            :class="isDark ? 'text-gray-500' : 'text-gray-400'"
          >
            暂无待办事项
          </div>
        </div>
      </div>
    </div>

    <!-- Resource Management -->
    <div class="admin-card">
      <div class="flex items-center justify-between mb-4">
        <h3
          class="font-semibold flex items-center gap-2 text-sm"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <IconPark type="Pic" :size="18" />
          资源管理
        </h3>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <router-link
          v-for="card in resourceCards"
          :key="card.title"
          :to="card.to"
          class="p-4 rounded-lg border transition-all hover:border-blue-400"
          :class="
            isDark
              ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
              : 'bg-white border-gray-200 hover:shadow-md'
          "
        >
          <div class="flex items-center justify-between mb-2">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="card.iconBg">
              <IconPark :type="card.icon" :size="20" :class="card.iconColor" />
            </div>
            <span
              v-if="card.count !== undefined"
              class="px-2 py-0.5 rounded-full text-xs font-medium tabular-nums"
              :class="isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'"
            >
              {{ card.count }}
            </span>
          </div>
          <h4 class="font-medium text-sm" :class="isDark ? 'text-gray-100' : 'text-gray-800'">
            {{ card.title }}
          </h4>
          <p class="text-xs mt-0.5" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
            {{ card.description }}
          </p>
        </router-link>
      </div>
    </div>

    <!-- Content Creation -->
    <div class="admin-card">
      <div class="flex items-center justify-between mb-4">
        <h3
          class="font-semibold flex items-center gap-2 text-sm"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <IconPark type="Edit" :size="18" />
          内容创作
        </h3>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <router-link
          v-for="card in contentCards"
          :key="card.title"
          :to="card.to"
          class="p-4 rounded-lg border transition-all hover:border-blue-400"
          :class="
            isDark
              ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
              : 'bg-white border-gray-200 hover:shadow-md'
          "
        >
          <div class="flex items-center justify-between mb-2">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="card.iconBg">
              <IconPark :type="card.icon" :size="20" :class="card.iconColor" />
            </div>
            <span
              v-if="card.count !== undefined"
              class="px-2 py-0.5 rounded-full text-xs font-medium tabular-nums"
              :class="isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'"
            >
              {{ card.count }}
            </span>
          </div>
          <h4 class="font-medium text-sm" :class="isDark ? 'text-gray-100' : 'text-gray-800'">
            {{ card.title }}
          </h4>
          <p class="text-xs mt-0.5" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
            {{ card.description }}
          </p>
        </router-link>
      </div>
    </div>

    <!-- Site Configuration -->
    <div class="admin-card">
      <div class="flex items-center justify-between mb-4">
        <h3
          class="font-semibold flex items-center gap-2 text-sm"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <IconPark type="Setting" :size="18" />
          网站配置
        </h3>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <router-link
          v-for="card in siteConfigCards"
          :key="card.title"
          :to="card.to"
          class="p-4 rounded-lg border transition-all hover:border-blue-400"
          :class="
            isDark
              ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
              : 'bg-white border-gray-200 hover:shadow-md'
          "
        >
          <div class="flex items-center justify-between mb-2">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="card.iconBg">
              <IconPark :type="card.icon" :size="20" :class="card.iconColor" />
            </div>
          </div>
          <h4 class="font-medium text-sm" :class="isDark ? 'text-gray-100' : 'text-gray-800'">
            {{ card.title }}
          </h4>
          <p class="text-xs mt-0.5" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
            {{ card.description }}
          </p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useAppStore, useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import axios from "axios";
import { http } from "@/utils/request";
import { useModuleConfig } from "@/composables";
import { IconPark } from "@icon-park/vue-next/es/all";

const appStore = useAppStore();
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const isDark = computed(() => appStore.themeMode === "dark");
const { getModuleName, getModuleDescription, loadConfig } = useModuleConfig();

const dailyQuote = ref("正在获取每日一言...");
const quoteFrom = ref("");

const weatherEmoji = ref("☀️");
const temperature = ref(0);

const imageStorage = ref(0);
const videoStorage = ref(0);
const audioStorage = ref(0);

const storageUsed = ref(0);
const storageTotal = ref(0);

const storagePercent = computed(() => {
  if (storageTotal.value === 0) return 0;
  return (storageUsed.value / storageTotal.value) * 100;
});

const progressBarWidth = computed(() => {
  const pct = Math.min(storagePercent.value, 100);
  if (pct > 0 && pct < 1) return "1%";
  if (pct >= 1) return pct + "%";
  return "0%";
});

const formatSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const currentDay = computed(() => {
  const now = new Date();
  return weekDays[now.getDay()];
});

const articleCount = ref(0);
const imageCount = ref(0);
const diaryCount = ref(0);
const lyricCount = ref(0);
const videoCount = ref(0);
const narrativeCount = ref(0);
const audioCount = ref(0);

interface TodoItem {
  text: string;
  completed: boolean;
}

const todos = ref<TodoItem[]>([]);
const newTodo = ref("");

const completedCount = computed(() => todos.value.filter((t) => t.completed).length);

const loadTodos = () => {
  try {
    const saved = localStorage.getItem("dashboard-todos");
    if (saved) {
      todos.value = JSON.parse(saved);
    }
  } catch {
    todos.value = [];
  }
};

const saveTodos = () => {
  localStorage.setItem("dashboard-todos", JSON.stringify(todos.value));
};

const addTodo = () => {
  const text = newTodo.value.trim();
  if (!text) return;
  todos.value.push({ text, completed: false });
  newTodo.value = "";
  saveTodos();
};

const toggleTodo = (index: number) => {
  todos.value[index].completed = !todos.value[index].completed;
  saveTodos();
};

const deleteTodo = (index: number) => {
  todos.value.splice(index, 1);
  saveTodos();
};

const fetchWeather = () => {
  http.get<{ amapKey?: string }>("/config").then((configResponse) => {
    const amapKey = configResponse.amapKey || "";

    if (!amapKey) {
      temperature.value = 25;
      weatherEmoji.value = "☀️";
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        const regeoRes = await fetch(
          `https://restapi.amap.com/v3/geocode/regeo?key=${amapKey}&location=${longitude},${latitude}`
        );
        const regeoData = await regeoRes.json();
        const adcode = regeoData.regeocode?.addressComponent?.adcode || "110101";

        const weatherRes = await fetch(
          `https://restapi.amap.com/v3/weather/weatherInfo?key=${amapKey}&city=${adcode}`
        );
        const weatherData = await weatherRes.json();

        if (weatherData.lives && weatherData.lives.length > 0) {
          const live = weatherData.lives[0];
          temperature.value = parseInt(live.temperature) || 25;
          updateWeatherEmoji(live.weather);
        } else {
          temperature.value = 25;
          weatherEmoji.value = "☀️";
        }
      },
      () => {
        temperature.value = 25;
        weatherEmoji.value = "☀️";
      }
    );
  });
};

const updateWeatherEmoji = (weatherText: string) => {
  const text = weatherText || "";
  if (text.includes("晴")) {
    weatherEmoji.value = "☀️";
  } else if (text.includes("多云") || text.includes("阴")) {
    weatherEmoji.value = "⛅";
  } else if (text.includes("雨")) {
    weatherEmoji.value = "🌧️";
  } else if (text.includes("雪")) {
    weatherEmoji.value = "❄️";
  } else if (text.includes("雾") || text.includes("霾")) {
    weatherEmoji.value = "🌫️";
  } else if (text.includes("雷")) {
    weatherEmoji.value = "⛈️";
  } else {
    weatherEmoji.value = "☀️";
  }
};

const fallbackQuotes = [
  "生活不止眼前的苟且，还有诗和远方。",
  "成功的路上并不拥挤，因为坚持的人不多。",
  "今天的努力是明天的底气。",
];

const fetchHitokoto = async () => {
  try {
    const response = await axios.get("https://v1.hitokoto.cn/", {
      params: {
        c: "i",
        encode: "json",
      },
      timeout: 5000,
    });
    dailyQuote.value = response.data.hitokoto;
    quoteFrom.value = response.data.from || "";
  } catch {
    dailyQuote.value = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    quoteFrom.value = "";
  }
};

const fetchStats = async () => {
  try {
    const [statsData, diskData] = await Promise.all([
      http
        .get<{
          articleCount: number;
          imageCount: number;
          diaryCount: number;
          lyricCount: number;
          videoCount: number;
          narrativeCount: number;
          audioCount: number;
          imageTotalSize: number;
          videoTotalSize: number;
          audioTotalSize: number;
        }>("/stats")
        .catch((e) => {
          console.error("[Dashboard] /stats 请求失败:", e);
          return null;
        }),
      http.get<{ total: number; used: number; free: number }>("/stats/disk").catch((e) => {
        console.error("[Dashboard] /stats/disk 请求失败:", e);
        return null;
      }),
    ]);

    if (statsData) {
      articleCount.value = statsData.articleCount || 0;
      imageCount.value = statsData.imageCount || 0;
      diaryCount.value = statsData.diaryCount || 0;
      lyricCount.value = statsData.lyricCount || 0;
      videoCount.value = statsData.videoCount || 0;
      narrativeCount.value = statsData.narrativeCount || 0;
      audioCount.value = statsData.audioCount || 0;
      imageStorage.value = statsData.imageTotalSize || 0;
      videoStorage.value = statsData.videoTotalSize || 0;
      audioStorage.value = statsData.audioTotalSize || 0;
    } else {
      console.warn("[Dashboard] statsData 为空，使用默认值 0");
      articleCount.value = 0;
      imageCount.value = 0;
      diaryCount.value = 0;
      lyricCount.value = 0;
      videoCount.value = 0;
      narrativeCount.value = 0;
      audioCount.value = 0;
      imageStorage.value = 0;
      videoStorage.value = 0;
      audioStorage.value = 0;
    }

    if (diskData) {
      storageTotal.value = diskData.total || 0;
      storageUsed.value = diskData.used || 0;
    } else {
      console.warn("[Dashboard] diskData 为空，使用媒体大小总和估算");
      storageUsed.value = imageStorage.value + videoStorage.value + audioStorage.value;
      storageTotal.value = storageUsed.value > 0 ? Math.floor(storageUsed.value * 3) : 0;
    }
  } catch (e) {
    console.error("[Dashboard] fetchStats 异常:", e);
    storageUsed.value = imageStorage.value + videoStorage.value + audioStorage.value;
    storageTotal.value = 0;
  }
};

onMounted(async () => {
  await loadConfig(true);
  fetchHitokoto();
  fetchStats();
  loadTodos();
  fetchWeather();
});

const storageItems = computed(() => [
  {
    label: "图片",
    icon: "Pic",
    size: imageStorage.value,
    iconBg: isDark.value ? "bg-cyan-500/20" : "bg-cyan-50",
    iconColor: isDark.value ? "text-cyan-400" : "text-cyan-600",
  },
  {
    label: "视频",
    icon: "Video",
    size: videoStorage.value,
    iconBg: isDark.value ? "bg-blue-500/20" : "bg-blue-50",
    iconColor: isDark.value ? "text-blue-400" : "text-blue-600",
  },
  {
    label: "音频",
    icon: "Music",
    size: audioStorage.value,
    iconBg: isDark.value ? "bg-green-500/20" : "bg-green-50",
    iconColor: isDark.value ? "text-green-400" : "text-green-600",
  },
]);

const resourceCards = computed(() => [
  {
    icon: "Pic",
    iconBg: isDark.value ? "bg-green-500/20" : "bg-green-50",
    iconColor: isDark.value ? "text-green-400" : "text-green-600",
    to: "/admin/gallery",
    count: imageCount.value,
    title: getModuleName("gallery"),
    description: getModuleDescription("gallery"),
  },
  {
    icon: "Video",
    iconBg: isDark.value ? "bg-orange-500/20" : "bg-orange-50",
    iconColor: isDark.value ? "text-orange-400" : "text-orange-600",
    to: "/admin/videos",
    count: videoCount.value,
    title: getModuleName("video"),
    description: getModuleDescription("video"),
  },
  {
    icon: "Music",
    iconBg: isDark.value ? "bg-emerald-500/20" : "bg-emerald-50",
    iconColor: isDark.value ? "text-emerald-400" : "text-emerald-600",
    to: "/admin/audio",
    count: audioCount.value,
    title: getModuleName("audio"),
    description: getModuleDescription("audio"),
  },
]);

const contentCards = computed(() => [
  {
    icon: "FileText",
    iconBg: isDark.value ? "bg-rose-500/20" : "bg-rose-50",
    iconColor: isDark.value ? "text-rose-400" : "text-rose-600",
    to: "/admin/articles",
    count: articleCount.value,
    title: getModuleName("article"),
    description: getModuleDescription("article"),
  },
  {
    icon: "Like",
    iconBg: isDark.value ? "bg-pink-500/20" : "bg-pink-50",
    iconColor: isDark.value ? "text-pink-400" : "text-pink-600",
    to: "/admin/memory",
    count: diaryCount.value,
    title: getModuleName("memory"),
    description: getModuleDescription("memory"),
  },
  {
    icon: "Music",
    iconBg: isDark.value ? "bg-teal-500/20" : "bg-teal-50",
    iconColor: isDark.value ? "text-teal-400" : "text-teal-600",
    to: "/admin/music",
    count: lyricCount.value,
    title: getModuleName("music"),
    description: getModuleDescription("music"),
  },
  {
    icon: "Book",
    iconBg: isDark.value ? "bg-amber-500/20" : "bg-amber-50",
    iconColor: isDark.value ? "text-amber-400" : "text-amber-600",
    to: "/admin/narrative",
    count: narrativeCount.value,
    title: getModuleName("narrative"),
    description: getModuleDescription("narrative"),
  },
]);

const siteConfigCards = computed(() => [
  {
    icon: "Info",
    iconBg: isDark.value ? "bg-blue-500/20" : "bg-blue-50",
    iconColor: isDark.value ? "text-blue-400" : "text-blue-600",
    title: getModuleName("siteinfo"),
    description: getModuleDescription("siteinfo"),
    to: "/admin/siteinfo",
  },
  {
    icon: "User",
    iconBg: isDark.value ? "bg-pink-500/20" : "bg-pink-50",
    iconColor: isDark.value ? "text-pink-400" : "text-pink-600",
    title: getModuleName("users"),
    description: getModuleDescription("users"),
    to: "/admin/users",
  },
  {
    icon: "Setting",
    iconBg: isDark.value ? "bg-amber-500/20" : "bg-amber-50",
    iconColor: isDark.value ? "text-amber-400" : "text-amber-600",
    title: getModuleName("settings"),
    description: getModuleDescription("settings"),
    to: "/admin/settings",
  },
]);
</script>
