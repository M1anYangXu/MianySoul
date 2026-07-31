<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center px-6">
      <h1 class="text-7xl font-bold text-primary-500 mb-4">404</h1>
      <p class="text-gray-600 dark:text-gray-300 mb-8 text-base">页面不存在</p>
      <button
        class="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
        @click="$router.push('/')"
      >
        返回首页
      </button>
    </div>
  </div>
</template>
