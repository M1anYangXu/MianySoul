<template>
  <div class="space-y-8">
    <!-- 内容创作组 -->
    <section>
      <h2
        class="text-lg font-semibold mb-4 flex items-center space-x-2"
        :class="isDark ? 'text-white' : 'text-black'"
      >
        <span
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm"
        >
          ✏️
        </span>
        <span>内容创作</span>
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link
          v-for="card in contentCards"
          :key="card.title"
          :to="card.to"
          class="group block p-5 rounded-xl border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <div class="flex items-start space-x-4">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
              :class="card.bgColor"
            >
              {{ card.icon }}
            </div>
            <div class="flex-1">
              <h3
                class="font-semibold mb-1 flex items-center space-x-2"
                :class="isDark ? 'text-white' : 'text-black'"
              >
                <span>{{ card.title }}</span>
                <span
                  v-if="card.todo"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                >
                  TODO
                </span>
              </h3>
              <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                {{ card.description }}
              </p>
            </div>
          </div>
        </router-link>
      </div>
    </section>

    <!-- 实验开发组 -->
    <section>
      <h2
        class="text-lg font-semibold mb-4 flex items-center space-x-2"
        :class="isDark ? 'text-white' : 'text-black'"
      >
        <span
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm"
        >
          ⚗️
        </span>
        <span>实验开发</span>
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link
          v-for="card in devCards"
          :key="card.title"
          :to="card.to"
          class="group block p-5 rounded-xl border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <div class="flex items-start space-x-4">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
              :class="card.bgColor"
            >
              {{ card.icon }}
            </div>
            <div class="flex-1">
              <h3
                class="font-semibold mb-1 flex items-center space-x-2"
                :class="isDark ? 'text-white' : 'text-black'"
              >
                <span>{{ card.title }}</span>
                <span
                  v-if="card.todo"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                >
                  TODO
                </span>
              </h3>
              <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                {{ card.description }}
              </p>
            </div>
          </div>
        </router-link>
      </div>
    </section>

    <!-- 系统设置组 -->
    <section>
      <h2
        class="text-lg font-semibold mb-4 flex items-center space-x-2"
        :class="isDark ? 'text-white' : 'text-black'"
      >
        <span
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm"
        >
          ⚙️
        </span>
        <span>系统设置</span>
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link
          v-for="card in settingCards"
          :key="card.title"
          :to="card.to"
          class="group block p-5 rounded-xl border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <div class="flex items-start space-x-4">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
              :class="card.bgColor"
            >
              {{ card.icon }}
            </div>
            <div class="flex-1">
              <h3
                class="font-semibold mb-1 flex items-center space-x-2"
                :class="isDark ? 'text-white' : 'text-black'"
              >
                <span>{{ card.title }}</span>
                <span
                  v-if="card.todo"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                >
                  TODO
                </span>
              </h3>
              <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                {{ card.description }}
              </p>
            </div>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAppStore } from "@/stores";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

interface CardItem {
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  to: string;
  todo?: boolean;
}

const contentCards: CardItem[] = [
  {
    title: "图集管理",
    description: "管理和浏览所有图片集合",
    icon: "🖼️",
    bgColor: "bg-cyan-50 dark:bg-cyan-500/20",
    to: "/admin/gallery",
  },
  {
    title: "视频管理",
    description: "上传和管理视频内容",
    icon: "🎬",
    bgColor: "bg-blue-50 dark:bg-blue-500/20",
    to: "/admin/videos",
    todo: true,
  },
  {
    title: "文章管理",
    description: "创作和编辑文章内容",
    icon: "📝",
    bgColor: "bg-indigo-50 dark:bg-indigo-500/20",
    to: "/admin/articles",
    todo: true,
  },
  {
    title: "记忆管理",
    description: "日记、回忆录、梦境记录",
    icon: "🧠",
    bgColor:
      "bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:bg-gradient-to-br dark:from-pink-500/20 dark:via-rose-500/20 dark:to-purple-500/20",
    to: "/admin/memory",
  },
];

const devCards: CardItem[] = [
  {
    title: "场景管理",
    description: "管理白噪音场景和音频配置",
    icon: "🎵",
    bgColor: "bg-purple-50 dark:bg-purple-500/20",
    to: "/admin/scenes",
  },
  {
    title: "音乐管理",
    description: "管理音乐曲库，为网易云风格播放器做准备",
    icon: "🎶",
    bgColor: "bg-rose-50 dark:bg-rose-500/20",
    to: "/admin/music",
    todo: true,
  },
  {
    title: "代码实验场",
    description: "在线代码编辑器和预览",
    icon: "💻",
    bgColor: "bg-pink-50 dark:bg-pink-500/20",
    to: "/playground",
    todo: true,
  },
];

const settingCards: CardItem[] = [
  {
    title: "用户管理",
    description: "管理系统用户和权限",
    icon: "👥",
    bgColor: "bg-amber-50 dark:bg-amber-500/20",
    to: "/admin/users",
  },
  {
    title: "系统配置",
    description: "配置系统参数和设置",
    icon: "⚙️",
    bgColor: "bg-orange-50 dark:bg-orange-500/20",
    to: "/admin/settings",
  },
];
</script>
