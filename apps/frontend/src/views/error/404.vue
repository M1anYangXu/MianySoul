<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <p class="text-gray-600 mb-8">页面不存在</p>
      <n-button type="primary" @click="$router.push('/')">返回首页</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
</script>
