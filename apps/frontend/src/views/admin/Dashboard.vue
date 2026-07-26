<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div
        class="lg:col-span-2 group relative overflow-hidden rounded-2xl p-4 transition-all duration-500"
        :class="
          isDark
            ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800'
            : 'bg-gradient-to-br from-white via-gray-50 to-white'
        "
        style="backdrop-filter: blur(20px)"
      >
        <div class="absolute inset-0 opacity-30">
          <div
            class="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl"
            :class="isDark ? 'bg-purple-500/30' : 'bg-purple-200'"
          ></div>
          <div
            class="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl"
            :class="isDark ? 'bg-pink-500/30' : 'bg-pink-200'"
          ></div>
        </div>
        <div class="relative z-10 flex flex-col items-center justify-center h-full gap-1">
          <div class="text-4xl">{{ weatherEmoji }}</div>
          <p class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ currentDay }}
          </p>
          <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            {{ temperature }}°C
          </p>
        </div>
      </div>

      <div
        class="lg:col-span-8 group relative overflow-hidden rounded-2xl p-6 transition-all duration-500"
        :class="
          isDark
            ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800'
            : 'bg-gradient-to-br from-white via-gray-50 to-white'
        "
        style="backdrop-filter: blur(20px)"
      >
        <div class="absolute inset-0 opacity-30">
          <div
            class="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl"
            :class="isDark ? 'bg-purple-500/30' : 'bg-purple-200'"
          ></div>
          <div
            class="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl"
            :class="isDark ? 'bg-pink-500/30' : 'bg-pink-200'"
          ></div>
        </div>
        <div class="relative z-10">
          <h1 class="text-3xl font-bold mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
            欢迎回来，{{ userInfo?.username }} ✨
          </h1>
          <p class="text-lg" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
            {{ dailyQuote }}
            <span v-if="quoteFrom" class="text-sm opacity-60 ml-2">—— {{ quoteFrom }}</span>
          </p>
        </div>
      </div>

      <div
        class="lg:col-span-2 group relative overflow-hidden rounded-2xl p-4 transition-all duration-500 hover:shadow-xl"
        :class="
          isDark
            ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800'
            : 'bg-gradient-to-br from-white via-gray-50 to-white'
        "
        style="backdrop-filter: blur(20px)"
      >
        <div class="absolute inset-0 opacity-30">
          <div
            class="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl"
            :class="isDark ? 'bg-purple-500/30' : 'bg-purple-200'"
          ></div>
          <div
            class="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl"
            :class="isDark ? 'bg-pink-500/30' : 'bg-pink-200'"
          ></div>
        </div>
        <a
          href="/"
          target="_blank"
          class="relative z-10 flex flex-col items-center justify-center h-full text-center group"
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110"
            :class="isDark ? 'bg-white/10' : 'bg-white'"
          >
            <Globe class="w-6 h-6" :class="isDark ? 'text-white' : 'text-violet-600'" />
          </div>
          <h3 class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">前往前台</h3>
        </a>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div
        class="lg:col-span-6 rounded-2xl p-4 transition-all duration-500"
        :class="
          isDark
            ? 'bg-gray-800/80 border border-gray-700/50'
            : 'bg-white/80 border border-gray-200/50'
        "
        style="backdrop-filter: blur(20px)"
      >
        <div class="flex items-center justify-between mb-3">
          <h3
            class="font-semibold flex items-center gap-2"
            :class="isDark ? 'text-white' : 'text-gray-900'"
          >
            <HardDrive class="w-5 h-5" />
            存储用量
          </h3>
          <span class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ formatSize(storageUsed) }} / {{ formatSize(storageTotal) }}
          </span>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'"
            >
              <Image class="w-4 h-4" :class="isDark ? 'text-cyan-400' : 'text-cyan-600'" />
            </div>
            <div class="min-w-0">
              <p
                class="text-xs font-medium truncate"
                :class="isDark ? 'text-white' : 'text-gray-900'"
              >
                图片
              </p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ formatSize(imageStorage) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="isDark ? 'bg-blue-500/20' : 'bg-blue-100'"
            >
              <Video class="w-4 h-4" :class="isDark ? 'text-blue-400' : 'text-blue-600'" />
            </div>
            <div class="min-w-0">
              <p
                class="text-xs font-medium truncate"
                :class="isDark ? 'text-white' : 'text-gray-900'"
              >
                视频
              </p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ formatSize(videoStorage) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="isDark ? 'bg-green-500/20' : 'bg-green-100'"
            >
              <Music class="w-4 h-4" :class="isDark ? 'text-green-400' : 'text-green-600'" />
            </div>
            <div class="min-w-0">
              <p
                class="text-xs font-medium truncate"
                :class="isDark ? 'text-white' : 'text-gray-900'"
              >
                音频
              </p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ formatSize(audioStorage) }}
              </p>
            </div>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              已使用 {{ storagePercent.toFixed(1) }}%
            </span>
            <span class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              剩余 {{ formatSize(storageTotal - storageUsed) }}
            </span>
          </div>
          <div class="flex gap-1">
            <div
              v-for="i in 20"
              :key="i"
              class="flex-1 h-1.5 rounded-full transition-all duration-500"
              :class="
                i <= Math.ceil(storagePercent / 5)
                  ? 'gradient-primary'
                  : isDark
                    ? 'bg-gray-700'
                    : 'bg-gray-200'
              "
            ></div>
          </div>
        </div>
      </div>

      <div
        class="lg:col-span-6 rounded-2xl p-4 transition-all duration-500"
        :class="
          isDark
            ? 'bg-gray-800/80 border border-gray-700/50'
            : 'bg-white/80 border border-gray-200/50'
        "
        style="backdrop-filter: blur(20px)"
      >
        <div class="flex items-center justify-between mb-3">
          <h3
            class="font-semibold flex items-center gap-2"
            :class="isDark ? 'text-white' : 'text-gray-900'"
          >
            <ClipboardList class="w-5 h-5" />
            待办事项
          </h3>
          <span class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            {{ completedCount }}/{{ todos.length }}
          </span>
        </div>
        <div class="flex gap-3">
          <input
            v-model="newTodo"
            type="text"
            placeholder="添加待办..."
            class="flex-1 px-2 py-1.5 rounded-lg text-xs border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-500'
                : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400'
            "
            @keyup.enter="addTodo"
          />
          <div class="flex-1 max-h-[120px] overflow-y-auto space-y-1.5">
            <div
              v-for="(todo, index) in todos"
              :key="index"
              class="flex items-center gap-2 text-xs"
            >
              <button
                class="w-3 h-3 rounded-full border flex items-center justify-center transition-all flex-shrink-0"
                :class="
                  todo.completed
                    ? 'bg-violet-500 border-violet-500'
                    : isDark
                      ? 'border-gray-500 hover:border-violet-400'
                      : 'border-gray-300 hover:border-violet-400'
                "
                @click="toggleTodo(index)"
              >
                <span v-if="todo.completed" class="text-white text-[10px]">✓</span>
              </button>
              <span
                class="flex-1 truncate"
                :class="[
                  isDark ? 'text-gray-300' : 'text-gray-700',
                  todo.completed ? 'line-through opacity-50' : '',
                ]"
              >
                {{ todo.text }}
              </span>
              <button
                class="text-[10px] p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                @click="deleteTodo(index)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h2
        class="text-lg font-semibold mb-4 flex items-center space-x-2"
        :class="isDark ? 'text-white' : 'text-gray-900'"
      >
        <span
          class="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-sm"
        >
          <Image class="w-4 h-4" />
        </span>
        <span>资源管理</span>
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          v-for="card in resourceCards"
          :key="card.title"
          :to="card.to"
          class="group relative overflow-hidden rounded-xl p-5 transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
          :class="
            isDark
              ? 'bg-gray-800/60 border border-gray-700/30'
              : 'bg-white/60 border border-gray-200/30'
          "
          style="backdrop-filter: blur(12px)"
        >
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            :class="card.glowColor"
          ></div>
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-3">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                :class="card.iconBg"
              >
                <component
                  :is="card.icon"
                  class="w-6 h-6"
                  :class="isDark ? 'text-white' : 'text-gray-700'"
                />
              </div>
              <span
                v-if="card.count !== undefined && card.count > 0"
                class="px-2.5 py-1 rounded-full text-xs font-bold tabular-nums backdrop-blur-md border transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm"
                :class="
                  isDark
                    ? 'bg-white/10 text-white border-white/20'
                    : 'bg-black/5 text-gray-700 border-black/10'
                "
              >
                {{ card.count }}
              </span>
            </div>
            <h3 class="font-semibold mb-1" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ card.title }}
            </h3>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ card.description }}
            </p>
          </div>
        </router-link>
      </div>
    </div>

    <div>
      <h2
        class="text-lg font-semibold mb-4 flex items-center space-x-2"
        :class="isDark ? 'text-white' : 'text-gray-900'"
      >
        <span
          class="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-sm"
        >
          <PenTool class="w-4 h-4" />
        </span>
        <span>内容创作</span>
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          v-for="card in contentCards"
          :key="card.title"
          :to="card.to"
          class="group relative overflow-hidden rounded-xl p-5 transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
          :class="
            isDark
              ? 'bg-gray-800/60 border border-gray-700/30'
              : 'bg-white/60 border border-gray-200/30'
          "
          style="backdrop-filter: blur(12px)"
        >
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            :class="card.glowColor"
          ></div>
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-3">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                :class="card.iconBg"
              >
                <component
                  :is="card.icon"
                  class="w-6 h-6"
                  :class="isDark ? 'text-white' : 'text-gray-700'"
                />
              </div>
              <span
                v-if="card.count !== undefined && card.count > 0"
                class="px-2.5 py-1 rounded-full text-xs font-bold tabular-nums backdrop-blur-md border transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm"
                :class="
                  isDark
                    ? 'bg-white/10 text-white border-white/20'
                    : 'bg-black/5 text-gray-700 border-black/10'
                "
              >
                {{ card.count }}
              </span>
            </div>
            <h3 class="font-semibold mb-1" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ card.title }}
            </h3>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ card.description }}
            </p>
          </div>
        </router-link>
      </div>
    </div>

    <div>
      <h2
        class="text-lg font-semibold mb-4 flex items-center space-x-2"
        :class="isDark ? 'text-white' : 'text-gray-900'"
      >
        <span
          class="w-8 h-8 rounded-lg gradient-danger flex items-center justify-center text-white text-sm"
        >
          <Globe class="w-4 h-4" />
        </span>
        <span>网站配置</span>
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          v-for="card in siteConfigCards"
          :key="card.title"
          :to="card.to"
          class="group relative overflow-hidden rounded-xl p-5 transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
          :class="
            isDark
              ? 'bg-gray-800/60 border border-gray-700/30'
              : 'bg-white/60 border border-gray-200/30'
          "
          style="backdrop-filter: blur(12px)"
        >
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-3">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                :class="card.iconBg"
              >
                <component
                  :is="card.icon"
                  class="w-6 h-6"
                  :class="isDark ? 'text-white' : 'text-gray-700'"
                />
              </div>
            </div>
            <h3 class="font-semibold mb-1" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ card.title }}
            </h3>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ card.description }}
            </p>
          </div>
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
import {
  FileText,
  Image,
  Video,
  Music,
  Heart,
  FileMusic,
  ClipboardList,
  User,
  PenTool,
  BookOpen,
  Info,
  Settings,
  Globe,
  HardDrive,
} from "lucide-vue-next";

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

const storageUsed = computed(() => {
  return imageStorage.value + videoStorage.value + audioStorage.value;
});
const storageTotal = ref(32212254720);

const storagePercent = computed(() => {
  return (storageUsed.value / storageTotal.value) * 100;
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
    const data = await http.get<{
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
    }>("/stats");
    articleCount.value = data.articleCount;
    imageCount.value = data.imageCount;
    diaryCount.value = data.diaryCount;
    lyricCount.value = data.lyricCount || 0;
    videoCount.value = data.videoCount || 0;
    narrativeCount.value = data.narrativeCount || 0;
    audioCount.value = data.audioCount || 0;
    imageStorage.value = data.imageTotalSize || 0;
    videoStorage.value = data.videoTotalSize || 0;
    audioStorage.value = data.audioTotalSize || 0;
  } catch {
    articleCount.value = 0;
    imageCount.value = 0;
    diaryCount.value = 0;
    lyricCount.value = 0;
    videoCount.value = 0;
    narrativeCount.value = 0;
    audioCount.value = 0;
  }
};

onMounted(async () => {
  await loadConfig();
  fetchHitokoto();
  fetchStats();
  loadTodos();
  fetchWeather();
});

const resourceCards = computed(() => [
  {
    moduleKey: "gallery" as const,
    icon: Image,
    iconBg:
      "bg-gradient-to-br from-cyan-100 to-blue-100 dark:bg-gradient-to-br dark:from-cyan-500/20 dark:to-blue-500/20",
    glowColor: "bg-gradient-to-br from-cyan-500/10 to-blue-500/10",
    to: "/admin/gallery",
    count: imageCount.value,
    title: getModuleName("gallery"),
    description: getModuleDescription("gallery"),
  },
  {
    moduleKey: "video" as const,
    icon: Video,
    iconBg:
      "bg-gradient-to-br from-blue-100 to-indigo-100 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-indigo-500/20",
    glowColor: "bg-gradient-to-br from-blue-500/10 to-indigo-500/10",
    to: "/admin/videos",
    count: videoCount.value,
    title: getModuleName("video"),
    description: getModuleDescription("video"),
  },
  {
    moduleKey: "audio" as const,
    icon: Music,
    iconBg:
      "bg-gradient-to-br from-green-100 to-emerald-100 dark:bg-gradient-to-br dark:from-green-500/20 dark:to-emerald-500/20",
    glowColor: "bg-gradient-to-br from-green-500/10 to-emerald-500/10",
    to: "/admin/audio",
    count: audioCount.value,
    title: getModuleName("audio"),
    description: getModuleDescription("audio"),
  },
]);

const contentCards = computed(() => [
  {
    moduleKey: "article" as const,
    icon: FileText,
    iconBg:
      "bg-gradient-to-br from-rose-100 to-pink-100 dark:bg-gradient-to-br dark:from-rose-500/20 dark:to-pink-500/20",
    glowColor: "bg-gradient-to-br from-rose-500/10 to-pink-500/10",
    to: "/admin/articles",
    count: articleCount.value,
    title: getModuleName("article"),
    description: getModuleDescription("article"),
  },
  {
    moduleKey: "memory" as const,
    icon: Heart,
    iconBg:
      "bg-gradient-to-br from-violet-100 to-purple-100 dark:bg-gradient-to-br dark:from-violet-500/20 dark:to-purple-500/20",
    glowColor: "bg-gradient-to-br from-violet-500/10 to-purple-500/10",
    to: "/admin/memory",
    count: diaryCount.value,
    title: getModuleName("memory"),
    description: getModuleDescription("memory"),
  },
  {
    moduleKey: "music" as const,
    icon: FileMusic,
    iconBg:
      "bg-gradient-to-br from-teal-100 to-emerald-100 dark:bg-gradient-to-br dark:from-teal-500/20 dark:to-emerald-500/20",
    glowColor: "bg-gradient-to-br from-teal-500/10 to-emerald-500/10",
    to: "/admin/music",
    count: lyricCount.value,
    title: getModuleName("music"),
    description: getModuleDescription("music"),
  },
  {
    moduleKey: "narrative" as const,
    icon: BookOpen,
    iconBg:
      "bg-gradient-to-br from-amber-100 to-orange-100 dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-orange-500/20",
    glowColor: "bg-gradient-to-br from-amber-500/10 to-orange-500/10",
    to: "/admin/narrative",
    count: narrativeCount.value,
    title: getModuleName("narrative"),
    description: getModuleDescription("narrative"),
  },
]);

const siteConfigCards = computed(() => [
  {
    title: "网站信息",
    description: "配置网站基本信息和外观",
    icon: Info,
    iconBg:
      "bg-gradient-to-br from-blue-50 to-cyan-50 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-cyan-500/20",
    to: "/admin/siteinfo",
  },
  {
    title: "用户管理",
    description: "管理系统用户和权限",
    icon: User,
    iconBg:
      "bg-gradient-to-br from-pink-50 to-rose-50 dark:bg-gradient-to-br dark:from-pink-500/20 dark:to-rose-500/20",
    to: "/admin/users",
  },
  {
    title: "模块配置",
    description: "配置后台模块和前台页面信息",
    icon: Settings,
    iconBg:
      "bg-gradient-to-br from-amber-50 to-yellow-50 dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-yellow-500/20",
    to: "/admin/settings",
  },
  {
    title: "网站记录",
    description: "查看网站操作日志和动态",
    icon: ClipboardList,
    iconBg:
      "bg-gradient-to-br from-blue-50 to-cyan-50 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-cyan-500/20",
    to: "/admin/activity",
  },
]);
</script>
