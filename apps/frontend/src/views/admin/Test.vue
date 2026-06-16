<template>
  <div class="max-w-4xl mx-auto">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">测试页</h1>
      <p class="text-gray-500 dark:text-gray-400">验证登录与权限功能</p>
    </div>

    <!-- 用户信息卡片 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6">
      <h2 class="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4 flex items-center space-x-2">
        <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm">👤</span>
        <span>用户信息</span>
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">用户名</p>
          <p class="font-medium text-gray-800 dark:text-gray-100">{{ userStore.userInfo?.username || "-" }}</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">角色</p>
          <p class="font-medium text-gray-800 dark:text-gray-100">
            <span 
              class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
              :class="userStore.isAdmin ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'"
            >
              {{ userStore.isAdmin ? "管理员" : "普通用户" }}
            </span>
          </p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">邮箱</p>
          <p class="font-medium text-gray-800 dark:text-gray-100">{{ userStore.userInfo?.email || "-" }}</p>
        </div>
      </div>
    </div>

    <!-- 权限状态卡片 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
      <h2 class="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4 flex items-center space-x-2">
        <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm">🔐</span>
        <span>权限状态</span>
      </h2>
      <div class="space-y-3">
        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 rounded-full bg-green-500"></div>
            <span class="text-gray-700 dark:text-gray-200">已登录</span>
          </div>
          <span class="text-sm text-green-600 dark:text-green-400 font-medium">✓ 正常</span>
        </div>
        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 rounded-full" :class="userStore.isAdmin ? 'bg-green-500' : 'bg-gray-400'"></div>
            <span class="text-gray-700 dark:text-gray-200">管理员权限</span>
          </div>
          <span 
            class="text-sm font-medium"
            :class="userStore.isAdmin ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'"
          >
            {{ userStore.isAdmin ? "✓ 拥有" : "✗ 无" }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores";

const userStore = useUserStore();
</script>