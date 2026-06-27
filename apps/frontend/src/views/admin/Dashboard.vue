<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
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
              今天也要元气满满地创作哦
            </p>
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
            <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">今日状态</p>
            <p class="text-2xl font-bold mt-1" :class="isDark ? 'text-white' : 'text-gray-900'">
              一切正常
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            :class="isDark ? 'bg-green-500/20' : 'bg-green-100'"
          >
            ✅
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">文章总数</span>
            <span class="font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">12</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">图片数量</span>
            <span class="font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">86</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">记忆条目</span>
            <span class="font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">24</span>
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
          ✏️
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
              class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 transition-transform duration-300 group-hover:scale-110"
              :class="card.iconBg"
            >
              {{ card.icon }}
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
            ⚗️
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
                {{ card.icon }}
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
            class="w-8 h-8 rounded-lg gradient-warning flex items-center justify-center text-white text-sm"
          >
            ⚙️
          </span>
          <span>系统设置</span>
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
                {{ card.icon }}
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
import { computed } from "vue";
import { useAppStore, useUserStore } from "@/stores";
import { storeToRefs } from "pinia";

const appStore = useAppStore();
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const isDark = computed(() => appStore.themeMode === "dark");

interface CardItem {
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  glowColor?: string;
  to: string;
  todo?: boolean;
}

const contentCards: CardItem[] = [
  {
    title: "文章管理",
    description: "创作和编辑文章内容",
    icon: "📝",
    iconBg:
      "bg-gradient-to-br from-rose-100 to-pink-100 dark:bg-gradient-to-br dark:from-rose-500/20 dark:to-pink-500/20",
    glowColor: "bg-gradient-to-br from-rose-500/10 to-pink-500/10",
    to: "/admin/articles",
  },
  {
    title: "图集管理",
    description: "管理和浏览所有图片集合",
    icon: "🖼️",
    iconBg:
      "bg-gradient-to-br from-cyan-100 to-blue-100 dark:bg-gradient-to-br dark:from-cyan-500/20 dark:to-blue-500/20",
    glowColor: "bg-gradient-to-br from-cyan-500/10 to-blue-500/10",
    to: "/admin/gallery",
  },
  {
    title: "视频管理",
    description: "上传和管理视频内容",
    icon: "🎬",
    iconBg:
      "bg-gradient-to-br from-blue-100 to-indigo-100 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-indigo-500/20",
    glowColor: "bg-gradient-to-br from-blue-500/10 to-indigo-500/10",
    to: "/admin/videos",
  },
  {
    title: "记忆管理",
    description: "日记、回忆录、梦境记录",
    icon: "🧠",
    iconBg:
      "bg-gradient-to-br from-violet-100 to-purple-100 dark:bg-gradient-to-br dark:from-violet-500/20 dark:to-purple-500/20",
    glowColor: "bg-gradient-to-br from-violet-500/10 to-purple-500/10",
    to: "/admin/memory",
  },
];

const devCards: CardItem[] = [
  {
    title: "场景管理",
    description: "管理白噪音场景和音频配置",
    icon: "🎵",
    iconBg: "bg-purple-50 dark:bg-purple-500/20",
    to: "/admin/scenes",
  },
  {
    title: "音乐管理",
    description: "管理音乐库，为网易云风格播放器做准备",
    icon: "🎶",
    iconBg: "bg-rose-50 dark:bg-rose-500/20",
    to: "/admin/music",
    todo: true,
  },
  {
    title: "代码实验场",
    description: "在线代码编辑器和预览",
    icon: "💻",
    iconBg: "bg-pink-50 dark:bg-pink-500/20",
    to: "/playground",
    todo: true,
  },
];

const settingCards: CardItem[] = [
  {
    title: "用户管理",
    description: "管理系统用户和权限",
    icon: "👤",
    iconBg:
      "bg-gradient-to-br from-pink-50 to-rose-50 dark:bg-gradient-to-br dark:from-pink-500/20 dark:to-rose-500/20",
    to: "/admin/users",
  },
  {
    title: "系统配置",
    description: "配置系统参数和设置",
    icon: "⚙️",
    iconBg:
      "bg-gradient-to-br from-amber-50 to-orange-50 dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-orange-500/20",
    to: "/admin/settings",
  },
];
</script>
