<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h1 class="text-2xl font-bold mb-4">测试页</h1>
    <p class="text-gray-600 mb-4">这是一个需要登录才能访问的页面，用于验证登录与权限功能。</p>

    <div class="space-y-4">
      <div class="p-4 bg-gray-50 rounded">
        <h2 class="font-semibold mb-2">用户信息</h2>
        <p>用户名：{{ userStore.userInfo?.username }}</p>
        <p>角色：{{ userStore.userInfo?.role }}</p>
        <p>邮箱：{{ userStore.userInfo?.email }}</p>
      </div>

      <div class="p-4 bg-gray-50 rounded">
        <h2 class="font-semibold mb-2">API 测试</h2>
        <n-space>
          <n-button @click="testProtected">测试受保护接口</n-button>
          <n-button :disabled="!userStore.isAdmin" @click="testAdmin">测试管理员接口</n-button>
        </n-space>
        <div v-if="testResult" class="mt-4 p-2 bg-blue-50 rounded text-sm">
          {{ testResult }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NButton, NSpace } from "naive-ui";
import { http } from "@/utils";
import { useUserStore } from "@/stores";
import { useMessage } from "@/composables";

const userStore = useUserStore();
const { success, error } = useMessage();
const testResult = ref("");

const testProtected = async () => {
  try {
    const data = await http.get<{ message: string; user: { id: string; username: string } }>(
      "/test/protected"
    );
    testResult.value = JSON.stringify(data, null, 2);
    success("接口调用成功");
  } catch (err) {
    error("接口调用失败");
    testResult.value = "";
  }
};

const testAdmin = async () => {
  try {
    const data = await http.get<{ message: string }>("/test/admin");
    testResult.value = JSON.stringify(data, null, 2);
    success("管理员接口调用成功");
  } catch (err) {
    error("管理员接口调用失败");
    testResult.value = "";
  }
};
</script>
