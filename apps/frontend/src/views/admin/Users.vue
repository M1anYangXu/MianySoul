<template>
  <div class="max-w-2xl mx-auto">
    <div
      class="mb-8 px-6 py-4 rounded-xl"
      :class="
        isDark
          ? 'bg-gray-800/40 border border-gray-700/30'
          : 'bg-white/40 border border-gray-200/30'
      "
      style="backdrop-filter: blur(12px)"
    >
      <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
        👤 用户管理
      </h1>
      <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
        管理您的个人信息和账户设置
      </p>
    </div>

    <div
      class="rounded-2xl border p-6 mb-6 transition-all duration-300 hover:shadow-lg"
      :class="isDark ? 'bg-gray-800/60 border-gray-700/30' : 'bg-white/60 border-gray-200/30'"
      style="backdrop-filter: blur(12px)"
    >
      <h2
        class="text-lg font-semibold mb-4 flex items-center space-x-2"
        :class="isDark ? 'text-white' : 'text-gray-900'"
      >
        <span
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm"
        >
          👤
        </span>
        <span>头像</span>
      </h2>
      <div class="flex items-center space-x-6">
        <div class="relative">
          <div
            class="w-24 h-24 rounded-full overflow-hidden border-4 shadow-lg"
            :class="isDark ? 'border-gray-700/50' : 'border-white/50'"
            :style="{ backgroundColor: avatarColor }"
          >
            <img v-if="avatarUrl" :src="avatarUrl" alt="头像" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-3xl" :class="isDark ? 'text-white' : 'text-gray-700'">
                {{ userStore.userInfo?.username?.charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
          <label
            class="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
            <span class="text-white text-lg">📷</span>
          </label>
        </div>
        <div>
          <p class="text-sm mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            支持 JPG、PNG、GIF 格式
          </p>
          <button
            v-if="avatarUrl"
            class="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            @click="removeAvatar"
          >
            移除头像
          </button>
        </div>
      </div>
    </div>

    <div
      class="rounded-2xl border p-6 mb-6 transition-all duration-300 hover:shadow-lg"
      :class="isDark ? 'bg-gray-800/60 border-gray-700/30' : 'bg-white/60 border-gray-200/30'"
      style="backdrop-filter: blur(12px)"
    >
      <h2
        class="text-lg font-semibold mb-4 flex items-center space-x-2"
        :class="isDark ? 'text-white' : 'text-gray-900'"
      >
        <span
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm"
        >
          ✏️
        </span>
        <span>基本信息</span>
      </h2>
      <div class="space-y-4">
        <div>
          <label
            class="block text-sm font-medium mb-2"
            :class="isDark ? 'text-gray-300' : 'text-gray-700'"
          >
            用户名
          </label>
          <input
            v-model="form.username"
            type="text"
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300"
            :class="
              isDark
                ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
            "
          />
        </div>
        <div>
          <label
            class="block text-sm font-medium mb-2"
            :class="isDark ? 'text-gray-300' : 'text-gray-700'"
          >
            邮箱
          </label>
          <input
            v-model="form.email"
            type="email"
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300"
            :class="
              isDark
                ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
            "
          />
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        class="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        :disabled="saving"
        @click="saveAll"
      >
        {{ saving ? "保存中..." : "保存更改" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useAppStore } from "@/stores/app";
import { useMessage } from "@/composables/useMessage";

const userStore = useUserStore();
const appStore = useAppStore();
const { success, error, info } = useMessage();

const isDark = computed(() => appStore.themeMode === "dark");

const avatarUrl = ref("");
const avatarColor = computed(() => {
  const colors = [
    "#0ea5e9",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#6366f1",
    "#14b8a6",
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
});

const originalValues = reactive({
  username: userStore.userInfo?.username || "",
  email: userStore.userInfo?.email || "",
  avatar: userStore.userInfo?.avatar || "",
});

const saving = ref(false);
const isLoaded = ref(false);

const syncUserData = () => {
  if (isLoaded.value || !userStore.userInfo) return;

  form.username = userStore.userInfo.username || "";
  form.email = userStore.userInfo.email || "";
  originalValues.username = userStore.userInfo.username || "";
  originalValues.email = userStore.userInfo.email || "";
  originalValues.avatar = userStore.userInfo.avatar || "";
  avatarUrl.value = userStore.userInfo.avatar || "";
  isLoaded.value = true;
};

watch(() => userStore.userInfo, syncUserData, { immediate: true });

onMounted(() => {
  syncUserData();
});

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarUrl.value = e.target?.result as string;
      success("头像上传成功");
    };
    reader.readAsDataURL(file);
  }
};

const removeAvatar = () => {
  avatarUrl.value = "";
  success("头像已移除");
};

const saveAll = async () => {
  let hasChanges = false;
  const updateData: { username?: string; email?: string; avatar?: string } = {};

  if (form.username !== originalValues.username) {
    updateData.username = form.username;
    hasChanges = true;
  }

  if (form.email !== originalValues.email) {
    updateData.email = form.email;
    hasChanges = true;
  }

  if (avatarUrl.value !== originalValues.avatar) {
    updateData.avatar = avatarUrl.value;
    hasChanges = true;
  }

  if (!hasChanges) {
    info("没有需要保存的更改");
    return;
  }

  saving.value = true;
  try {
    const result = await userStore.updateProfile(updateData);
    originalValues.username = form.username;
    originalValues.email = form.email;
    if (result.avatar !== undefined) {
      originalValues.avatar = result.avatar;
      avatarUrl.value = result.avatar;
    }
    success("保存成功");
  } catch (err: any) {
    error(err.message || "保存失败");
  } finally {
    saving.value = false;
  }
};
</script>
