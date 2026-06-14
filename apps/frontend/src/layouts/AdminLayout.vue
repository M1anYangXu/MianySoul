<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- 侧边栏 -->
    <aside
      class="bg-gray-800 text-white transition-all duration-300"
      :class="sidebarCollapsed ? 'w-16' : 'w-64'"
    >
      <div class="h-16 flex items-center justify-center border-b border-gray-700">
        <span v-if="!sidebarCollapsed" class="font-bold">MianySoul Admin</span>
        <span v-else class="font-bold text-sm">MS</span>
      </div>
      <nav class="p-4">
        <router-link
          to="/admin"
          class="block py-2 px-4 rounded hover:bg-gray-700 mb-2"
          :class="sidebarCollapsed ? 'text-center' : ''"
        >
          <span v-if="!sidebarCollapsed">首页</span>
          <span v-else>🏠</span>
        </router-link>
        <router-link
          to="/admin/test"
          class="block py-2 px-4 rounded hover:bg-gray-700 mb-2"
          :class="sidebarCollapsed ? 'text-center' : ''"
        >
          <span v-if="!sidebarCollapsed">测试页</span>
          <span v-else>🧪</span>
        </router-link>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col">
      <!-- 头部 -->
      <header class="h-16 bg-white shadow-sm flex items-center justify-between px-4">
        <button class="text-gray-600 hover:text-gray-900" @click="toggleSidebar">
          <span v-if="sidebarCollapsed">展开</span>
          <span v-else>收起</span>
        </button>
        <div class="flex items-center space-x-4">
          <span class="text-gray-600">{{ userStore.userInfo?.username }}</span>
          <n-button type="primary" size="small" @click="handleLogout">退出登录</n-button>
        </div>
      </header>

      <!-- 内容区 -->
      <main class="flex-1 p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { NButton } from "naive-ui";
import { useAppStore, useUserStore } from "@/stores";
import { useDialog } from "@/composables";

const router = useRouter();
const appStore = useAppStore();
const userStore = useUserStore();
const { confirm } = useDialog();

const sidebarCollapsed = computed(() => appStore.sidebarCollapsed);

const toggleSidebar = () => {
  appStore.toggleSidebar();
};

const handleLogout = () => {
  confirm({
    title: "确认退出",
    content: "确定要退出登录吗？",
    positiveText: "确认",
    negativeText: "取消",
    onPositiveClick: () => {
      userStore.logout();
      router.push({ name: "AdminLogin" });
    },
  });
};
</script>
