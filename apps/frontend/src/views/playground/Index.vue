<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">实验场</h1>
      <p class="text-gray-600 mb-8">这里是一个纯净的实验区域，用于测试各种功能。</p>
      <n-button type="primary" @click="$router.push('/')">返回首页</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
</script>
