<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">Hello World</h1>
    <p class="text-gray-600 mb-8">TypeScript 全栈基础框架</p>
    <div class="space-x-4">
      <n-button type="primary" @click="$router.push('/admin')">进入后台</n-button>
      <n-button @click="$router.push('/playground')">实验场</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
</script>
