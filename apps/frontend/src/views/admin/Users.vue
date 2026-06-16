<template>
  <div class="max-w-2xl mx-auto">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold mb-2" :class="isDark ? 'text-white' : 'text-black'">用户管理</h1>
      <p :class="isDark ? 'text-gray-300' : 'text-gray-700'">管理您的个人信息和账户设置</p>
    </div>

    <!-- 用户头像设置 -->
    <div class="rounded-xl border shadow-sm p-6 mb-6" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <h2 class="text-lg font-semibold mb-4 flex items-center space-x-2" :class="isDark ? 'text-white' : 'text-black'">
        <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm">👤</span>
        <span>头像</span>
      </h2>
      <div class="flex items-center space-x-6">
        <div class="relative">
          <div 
            class="w-24 h-24 rounded-full overflow-hidden border-4 shadow-md"
            :class="isDark ? 'border-gray-700' : 'border-gray-100'"
            :style="{ backgroundColor: avatarColor }"
          >
            <img 
              v-if="avatarUrl" 
              :src="avatarUrl" 
              alt="头像" 
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-3xl">{{ userStore.userInfo?.username?.charAt(0).toUpperCase() }}</span>
            </div>
          </div>
          <label class="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
            <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
            <span class="text-white text-lg">📷</span>
          </label>
        </div>
        <div>
          <p class="text-sm mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">支持 JPG、PNG、GIF 格式</p>
          <button 
            v-if="avatarUrl"
            @click="removeAvatar"
            class="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          >
            移除头像
          </button>
        </div>
      </div>
    </div>

    <!-- 基本信息 -->
    <div class="rounded-xl border shadow-sm p-6 mb-6" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <h2 class="text-lg font-semibold mb-4 flex items-center space-x-2" :class="isDark ? 'text-white' : 'text-black'">
        <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm">✏️</span>
        <span>基本信息</span>
      </h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">用户名</label>
          <input 
            v-model="form.username"
            type="text"
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            :class="isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white text-black placeholder-gray-400'"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">邮箱</label>
          <input 
            v-model="form.email"
            type="email"
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            :class="isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white text-black placeholder-gray-400'"
          />
        </div>
      </div>
    </div>

    <!-- 修改密码 -->
    <div class="rounded-xl border shadow-sm p-6 mb-6" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <h2 class="text-lg font-semibold mb-4 flex items-center space-x-2" :class="isDark ? 'text-white' : 'text-black'">
        <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm">🔐</span>
        <span>修改密码</span>
      </h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">旧密码</label>
          <input 
            v-model="form.oldPassword"
            type="password"
            placeholder="请输入当前密码"
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            :class="isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white text-black placeholder-gray-400'"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">新密码</label>
          <input 
            v-model="form.newPassword"
            type="password"
            placeholder="请输入新密码（至少6位）"
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            :class="isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white text-black placeholder-gray-400'"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">确认密码</label>
          <input 
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            :class="isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white text-black placeholder-gray-400'"
          />
        </div>
      </div>
    </div>

    <!-- 保存按钮 -->
    <div class="flex justify-end space-x-4">
      <button 
        @click="resetForm"
        class="px-6 py-2.5 border rounded-xl font-medium transition-colors"
        :class="isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
      >
        重置
      </button>
      <button 
        @click="saveAll"
        class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        保存更改
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useAppStore } from "@/stores/app";
import { useMessage } from "naive-ui";

const userStore = useUserStore();
const appStore = useAppStore();
const message = useMessage();

const isDark = computed(() => appStore.themeMode === "dark");

const avatarUrl = ref("");
const avatarColor = computed(() => {
  const colors = [
    "#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b", 
    "#10b981", "#ef4444", "#6366f1", "#14b8a6"
  ];
  const username = userStore.userInfo?.username || "user";
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
});

const form = reactive({
  username: userStore.userInfo?.username || "",
  email: userStore.userInfo?.email || "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});

const originalValues = {
  username: userStore.userInfo?.username || "",
  email: userStore.userInfo?.email || ""
};

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarUrl.value = e.target?.result as string;
      message.success("头像上传成功");
    };
    reader.readAsDataURL(file);
  }
};

const removeAvatar = () => {
  avatarUrl.value = "";
  message.success("头像已移除");
};

const resetForm = () => {
  form.username = originalValues.username;
  form.email = originalValues.email;
  form.oldPassword = "";
  form.newPassword = "";
  form.confirmPassword = "";
  message.info("已重置表单");
};

const saveAll = () => {
  let hasChanges = false;
  
  if (form.username !== originalValues.username) {
    userStore.userInfo = {
      ...userStore.userInfo,
      username: form.username
    };
    originalValues.username = form.username;
    hasChanges = true;
  }
  
  if (form.email !== originalValues.email) {
    userStore.userInfo = {
      ...userStore.userInfo,
      email: form.email
    };
    originalValues.email = form.email;
    hasChanges = true;
  }
  
  if (form.oldPassword && form.newPassword && form.confirmPassword) {
    if (form.newPassword === form.confirmPassword && form.newPassword.length >= 6) {
      form.oldPassword = "";
      form.newPassword = "";
      form.confirmPassword = "";
      message.success("密码修改成功");
      hasChanges = true;
    } else {
      message.error("密码不匹配或长度不足");
      return;
    }
  }
  
  if (hasChanges) {
    message.success("保存成功");
  } else {
    message.info("没有需要保存的更改");
  }
};
</script>