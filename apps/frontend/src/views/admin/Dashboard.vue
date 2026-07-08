<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div
          class="group relative overflow-hidden rounded-2xl p-8 transition-all duration-500"
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
          class="rounded-xl p-4"
          :class="
            isDark
              ? 'bg-gray-800/60 border border-gray-700/30'
              : 'bg-white/60 border border-gray-200/30'
          "
          style="backdrop-filter: blur(12px)"
        >
          <div class="flex items-center justify-between mb-3">
            <h3
              class="font-medium flex items-center gap-2"
              :class="isDark ? 'text-white' : 'text-gray-900'"
            >
              <ClipboardList class="w-4 h-4" />
              待办事项
            </h3>
            <span class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ completedCount }}/{{ todos.length }}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <input
                v-model="newTodo"
                type="text"
                placeholder="添加新的待办..."
                class="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
                :class="
                  isDark
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-500'
                    : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400'
                "
                @keyup.enter="addTodo"
              />
            </div>
            <div class="space-y-2 max-h-[120px] overflow-y-auto">
              <div
                v-for="(todo, index) in todos"
                :key="index"
                class="flex items-center gap-2 text-sm"
              >
                <button
                  class="w-4 h-4 rounded-full border flex items-center justify-center transition-all flex-shrink-0"
                  :class="
                    todo.completed
                      ? 'bg-violet-500 border-violet-500'
                      : isDark
                        ? 'border-gray-500 hover:border-violet-400'
                        : 'border-gray-300 hover:border-violet-400'
                  "
                  @click="toggleTodo(index)"
                >
                  <span v-if="todo.completed" class="text-white text-xs">✓</span>
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
                  class="text-xs p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
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

      <div
        class="group rounded-2xl p-6 transition-all duration-500 hover:shadow-xl"
        :class="
          isDark
            ? 'bg-gray-800/80 border border-gray-700/50'
            : 'bg-white/80 border border-gray-200/50'
        "
        style="backdrop-filter: blur(20px)"
      >
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">今日所在</p>
            <p class="text-2xl font-bold mt-1" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ currentCity || (locationLoading ? "定位中..." : "点击定位") }}
            </p>
          </div>
          <button
            class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 hover:scale-105"
            :class="
              isDark
                ? locationLoading
                  ? 'bg-blue-500/20 animate-pulse'
                  : 'bg-blue-500/20 hover:bg-blue-500/30'
                : locationLoading
                  ? 'bg-blue-100 animate-pulse'
                  : 'bg-blue-100 hover:bg-blue-200'
            "
            @click="getCurrentLocation"
          >
            <MapPin class="w-6 h-6" />
          </button>
        </div>
        <div class="space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">文章总数</span>
            <span class="font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ articleCount }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">图片数量</span>
            <span class="font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ imageCount }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">记忆条目</span>
            <span class="font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ diaryCount }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">歌词数量</span>
            <span class="font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ lyricCount }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">视频数量</span>
            <span class="font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ videoCount }}
            </span>
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
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
              :class="card.iconBg"
            >
              <component
                :is="card.icon"
                class="w-6 h-6"
                :class="isDark ? 'text-white' : 'text-gray-700'"
              />
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

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h2
          class="text-lg font-semibold mb-4 flex items-center space-x-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-8 h-8 rounded-lg gradient-danger flex items-center justify-center text-white text-sm"
          >
            <FlaskConical class="w-4 h-4" />
          </span>
          <span>实验开发</span>
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <router-link
            v-for="card in devCards"
            :key="card.title"
            :to="card.to"
            class="group rounded-xl p-5 transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
            :class="
              isDark
                ? 'bg-gray-800/60 border border-gray-700/30'
                : 'bg-white/60 border border-gray-200/30'
            "
            style="backdrop-filter: blur(12px)"
          >
            <div class="flex items-start space-x-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110"
                :class="card.iconBg"
              >
                <component
                  :is="card.icon"
                  class="w-5 h-5"
                  :class="isDark ? 'text-white' : 'text-gray-700'"
                />
              </div>
              <div class="flex-1">
                <h3 class="font-medium mb-1 flex items-center space-x-2">
                  <span :class="isDark ? 'text-white' : 'text-gray-900'">{{ card.title }}</span>
                  <span
                    v-if="card.todo"
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                  >
                    TODO
                  </span>
                </h3>
                <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  {{ card.description }}
                </p>
              </div>
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
            class="w-8 h-8 rounded-lg gradient-warning flex items-center justify-center text-white"
          >
            <Settings class="w-4 h-4" />
          </span>
          <span>系统管理</span>
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <router-link
            v-for="card in settingCards"
            :key="card.title"
            :to="card.to"
            class="group rounded-xl p-5 transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
            :class="
              isDark
                ? 'bg-gray-800/60 border border-gray-700/30'
                : 'bg-white/60 border border-gray-200/30'
            "
            style="backdrop-filter: blur(12px)"
          >
            <div class="flex items-start space-x-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110"
                :class="card.iconBg"
              >
                <component
                  :is="card.icon"
                  class="w-5 h-5"
                  :class="isDark ? 'text-white' : 'text-gray-700'"
                />
              </div>
              <div class="flex-1">
                <h3 class="font-medium mb-1" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ card.title }}
                </h3>
                <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  {{ card.description }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
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
  Settings,
  Headphones,
  Globe,
  User,
  MapPin,
  PenTool,
  FlaskConical,
} from "lucide-vue-next";

const appStore = useAppStore();
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const isDark = computed(() => appStore.themeMode === "dark");
const { getModuleName, getModuleDescription, loadConfig } = useModuleConfig();

const dailyQuote = ref("正在获取每日一言...");
const quoteFrom = ref("");

const articleCount = ref(0);
const imageCount = ref(0);
const diaryCount = ref(0);
const lyricCount = ref(0);
const videoCount = ref(0);

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

const currentCity = ref("");
const locationLoading = ref(false);

const getCurrentLocation = async () => {
  if (!navigator.geolocation) {
    currentCity.value = "不支持定位";
    return;
  }

  locationLoading.value = true;
  try {
    const position = await new Promise<{ coords: { latitude: number; longitude: number } }>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      }
    );

    const { latitude, longitude } = position.coords;
    await getCityFromCoords(latitude, longitude);
  } catch (error) {
    currentCity.value = "定位失败";
  } finally {
    locationLoading.value = false;
  }
};

const getCityFromCoords = async (lat: number, lng: number) => {
  try {
    const response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client`, {
      params: {
        latitude: lat,
        longitude: lng,
        localityLanguage: "zh",
      },
    });
    const data = response.data;
    if (data.city) {
      currentCity.value = data.city;
    } else if (data.province) {
      currentCity.value = data.province;
    } else {
      currentCity.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  } catch (error) {
    currentCity.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
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
    }>("/stats");
    articleCount.value = data.articleCount;
    imageCount.value = data.imageCount;
    diaryCount.value = data.diaryCount;
    lyricCount.value = data.lyricCount || 0;
    videoCount.value = data.videoCount || 0;
  } catch {
    articleCount.value = 0;
    imageCount.value = 0;
    diaryCount.value = 0;
    lyricCount.value = 0;
    videoCount.value = 0;
  }
};

onMounted(async () => {
  await loadConfig();
  fetchHitokoto();
  fetchStats();
  loadTodos();
});

import type { FunctionalComponent } from "vue";

interface CardItem {
  title: string;
  description: string;
  icon: FunctionalComponent;
  iconBg: string;
  glowColor?: string;
  to: string;
  todo?: boolean;
}

interface CardConfig {
  moduleKey: "article" | "gallery" | "video" | "audio" | "memory" | "music" | "settings";
  icon: FunctionalComponent;
  iconBg: string;
  glowColor?: string;
  to: string;
}

const contentCardConfigs: CardConfig[] = [
  {
    moduleKey: "article",
    icon: FileText,
    iconBg:
      "bg-gradient-to-br from-rose-100 to-pink-100 dark:bg-gradient-to-br dark:from-rose-500/20 dark:to-pink-500/20",
    glowColor: "bg-gradient-to-br from-rose-500/10 to-pink-500/10",
    to: "/admin/articles",
  },
  {
    moduleKey: "gallery",
    icon: Image,
    iconBg:
      "bg-gradient-to-br from-cyan-100 to-blue-100 dark:bg-gradient-to-br dark:from-cyan-500/20 dark:to-blue-500/20",
    glowColor: "bg-gradient-to-br from-cyan-500/10 to-blue-500/10",
    to: "/admin/gallery",
  },
  {
    moduleKey: "video",
    icon: Video,
    iconBg:
      "bg-gradient-to-br from-blue-100 to-indigo-100 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-indigo-500/20",
    glowColor: "bg-gradient-to-br from-blue-500/10 to-indigo-500/10",
    to: "/admin/videos",
  },
  {
    moduleKey: "audio",
    icon: Music,
    iconBg:
      "bg-gradient-to-br from-green-100 to-emerald-100 dark:bg-gradient-to-br dark:from-green-500/20 dark:to-emerald-500/20",
    glowColor: "bg-gradient-to-br from-green-500/10 to-emerald-500/10",
    to: "/admin/audio",
  },
  {
    moduleKey: "memory",
    icon: Heart,
    iconBg:
      "bg-gradient-to-br from-violet-100 to-purple-100 dark:bg-gradient-to-br dark:from-violet-500/20 dark:to-purple-500/20",
    glowColor: "bg-gradient-to-br from-violet-500/10 to-purple-500/10",
    to: "/admin/memory",
  },
  {
    moduleKey: "music",
    icon: FileMusic,
    iconBg:
      "bg-gradient-to-br from-teal-100 to-emerald-100 dark:bg-gradient-to-br dark:from-teal-500/20 dark:to-emerald-500/20",
    glowColor: "bg-gradient-to-br from-teal-500/10 to-emerald-500/10",
    to: "/admin/music",
  },
];

const contentCards = computed(() => {
  return contentCardConfigs.map((config) => ({
    ...config,
    title: getModuleName(config.moduleKey),
    description: getModuleDescription(config.moduleKey),
  }));
});

const devCards: CardItem[] = [
  {
    title: "场景管理",
    description: "管理白噪音场景和音频配置",
    icon: Headphones,
    iconBg: "bg-purple-50 dark:bg-purple-500/20",
    to: "/admin/scenes",
  },
  {
    title: "足迹管理",
    description: "记录去过的城市和地方",
    icon: Globe,
    iconBg: "bg-blue-50 dark:bg-blue-500/20",
    to: "/admin/footprint",
  },
];

const settingCards = computed(() => [
  {
    title: "用户管理",
    description: "管理系统用户和权限",
    icon: User,
    iconBg:
      "bg-gradient-to-br from-pink-50 to-rose-50 dark:bg-gradient-to-br dark:from-pink-500/20 dark:to-rose-500/20",
    to: "/admin/users",
  },
  {
    title: getModuleName("settings"),
    description: getModuleDescription("settings"),
    icon: Settings,
    iconBg:
      "bg-gradient-to-br from-amber-50 to-orange-50 dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-orange-500/20",
    to: "/admin/settings",
  },
  {
    title: "系统记录",
    description: "查看系统操作日志和动态",
    icon: ClipboardList,
    iconBg:
      "bg-gradient-to-br from-blue-50 to-cyan-50 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-cyan-500/20",
    to: "/admin/activity",
  },
]);
</script>
