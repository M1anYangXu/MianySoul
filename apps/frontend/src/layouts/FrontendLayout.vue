<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部导航 -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-bold text-gray-900">MianySoul</h1>
        </div>
        <nav class="flex items-center space-x-4">
          <router-link to="/" class="text-gray-600 hover:text-primary-500">首页</router-link>
          <router-link to="/admin" class="text-gray-600 hover:text-primary-500">后台</router-link>
          <router-link to="/playground" class="text-gray-600 hover:text-primary-500">
            实验场
          </router-link>
        </nav>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <router-view />
    </main>

    <!-- 底部 -->
    <footer class="bg-white border-t mt-auto">
      <div class="max-w-7xl mx-auto px-4 py-4 text-center text-gray-500 text-sm">
        MianySoul - TypeScript 全栈基础框架
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts"></script>
