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
          class="w-8 h-8 rounded-lg gradient-secondary flex items-center justify-center text-white text-sm"
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
            class="absolute -bottom-2 -right-2 w-10 h-10 gradient-primary rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
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
          class="w-8 h-8 rounded-lg gradient-success flex items-center justify-center text-white text-sm"
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
          class="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-sm"
        >
          🏷️
        </span>
        <span>个人标签</span>
      </h2>
      <div>
        <label
          class="block text-sm font-medium mb-2"
          :class="isDark ? 'text-gray-300' : 'text-gray-700'"
        >
          标签（用逗号分隔）
        </label>
        <input
          v-model="form.tags"
          type="text"
          placeholder="例如：Vue.js, TypeScript, Node.js, Prisma"
          class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300"
          :class="
            isDark
              ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
              : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
          "
        />
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
          class="w-8 h-8 rounded-lg gradient-success flex items-center justify-center text-white text-sm"
        >
          🛠️
        </span>
        <span>技术栈</span>
      </h2>
      <div>
        <label
          class="block text-sm font-medium mb-2"
          :class="isDark ? 'text-gray-300' : 'text-gray-700'"
        >
          我的技术栈（用逗号分隔）
        </label>
        <input
          v-model="form.techStack"
          type="text"
          placeholder="例如：Vue 3, TypeScript, Tailwind CSS, Node.js, Fastify, Prisma"
          class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300"
          :class="
            isDark
              ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
              : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
          "
        />
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
          class="w-8 h-8 rounded-lg gradient-secondary flex items-center justify-center text-white text-sm"
        >
          📧
        </span>
        <span>联系我</span>
      </h2>
      <div class="space-y-3">
        <div v-for="(item, index) in contactItems" :key="index" class="flex items-center gap-3">
          <div class="flex-1">
            <input
              v-model="item.icon"
              type="text"
              placeholder="图标名称（如：github、email、bilibili、wechat）"
              class="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300 text-sm"
              :class="
                isDark
                  ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                  : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
              "
            />
          </div>
          <div class="flex-1">
            <input
              v-model="item.url"
              type="text"
              placeholder="链接地址"
              class="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300 text-sm"
              :class="
                isDark
                  ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                  : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
              "
            />
          </div>
          <button
            v-if="contactItems.length > 1"
            class="w-10 h-10 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all duration-300"
            @click="removeContactItem(index)"
          >
            ✕
          </button>
        </div>
        <button
          class="w-full py-2 rounded-xl border border-dashed flex items-center justify-center gap-2 text-sm transition-all duration-300 hover:border-violet-400"
          :class="
            isDark
              ? 'border-gray-600 text-gray-400 hover:text-violet-400'
              : 'border-gray-300 text-gray-500 hover:text-violet-500'
          "
          @click="addContactItem"
        >
          <span class="text-lg">+</span>
          <span>添加联系方式</span>
        </button>
      </div>
    </div>
    <button
      class="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      :disabled="saving"
      @click="saveAll"
    >
      {{ saving ? "保存中..." : "保存更改" }}
    </button>
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

interface ContactItem {
  icon: string;
  url: string;
}

const form = reactive({
  username: userStore.userInfo?.username || "",
  email: userStore.userInfo?.email || "",
  tags: userStore.userInfo?.tags || "",
  techStack: userStore.userInfo?.techStack || "",
});

const contactItems = ref<ContactItem[]>([]);

const originalContactItems = ref<ContactItem[]>([]);

const originalValues = reactive({
  username: userStore.userInfo?.username || "",
  email: userStore.userInfo?.email || "",
  avatar: userStore.userInfo?.avatar || "",
  tags: userStore.userInfo?.tags || "",
  techStack: userStore.userInfo?.techStack || "",
});

const saving = ref(false);
const isLoaded = ref(false);

const syncUserData = () => {
  if (isLoaded.value || !userStore.userInfo) return;

  form.username = userStore.userInfo.username || "";
  form.email = userStore.userInfo.email || "";
  form.tags = userStore.userInfo.tags || "";
  form.techStack = userStore.userInfo.techStack || "";
  originalValues.username = userStore.userInfo.username || "";
  originalValues.email = userStore.userInfo.email || "";
  originalValues.avatar = userStore.userInfo.avatar || "";
  originalValues.tags = userStore.userInfo.tags || "";
  originalValues.techStack = userStore.userInfo.techStack || "";
  avatarUrl.value = userStore.userInfo.avatar || "";

  if (userStore.userInfo.contactInfo) {
    try {
      const parsed = JSON.parse(userStore.userInfo.contactInfo);
      contactItems.value = Object.entries(parsed).map(([icon, url]) => ({
        icon,
        url: url as string,
      }));
    } catch {
      contactItems.value = [];
    }
  } else {
    contactItems.value = [];
  }
  if (contactItems.value.length === 0) {
    contactItems.value = [{ icon: "", url: "" }];
  }
  originalContactItems.value = JSON.parse(JSON.stringify(contactItems.value));

  isLoaded.value = true;
};

watch(() => userStore.userInfo, syncUserData, { immediate: true });

onMounted(() => {
  syncUserData();
});

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const http = await import("@/utils/request").then((m) => m.http);
      const result = await http.post("/upload/single", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      avatarUrl.value = result.url;
      success("头像上传成功");
    } catch (err: any) {
      console.error("头像上传失败:", err);
      error(err.message || "头像上传失败");
      avatarUrl.value = originalValues.avatar || "";
    }
  }
};

const removeAvatar = () => {
  avatarUrl.value = "";
  success("头像已移除");
};

const addContactItem = () => {
  contactItems.value.push({ icon: "", url: "" });
};

const removeContactItem = (index: number) => {
  contactItems.value.splice(index, 1);
};

const saveAll = async () => {
  let hasChanges = false;
  const updateData: {
    username?: string;
    email?: string;
    avatar?: string;
    tags?: string;
    techStack?: string;
    contactInfo?: string;
  } = {};

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

  if (form.tags !== originalValues.tags) {
    updateData.tags = form.tags;
    hasChanges = true;
  }

  if (form.techStack !== originalValues.techStack) {
    updateData.techStack = form.techStack;
    hasChanges = true;
  }

  const contactInfo = contactItems.value
    .filter((item) => item.icon.trim() && item.url.trim())
    .reduce(
      (acc, item) => {
        acc[item.icon.trim()] = item.url.trim();
        return acc;
      },
      {} as Record<string, string>
    );

  const contactInfoJson = JSON.stringify(contactInfo);
  const originalContactInfoJson = JSON.stringify(
    originalContactItems.value
      .filter((item) => item.icon.trim() && item.url.trim())
      .reduce(
        (acc, item) => {
          acc[item.icon.trim()] = item.url.trim();
          return acc;
        },
        {} as Record<string, string>
      )
  );

  if (contactInfoJson !== originalContactInfoJson) {
    updateData.contactInfo = contactInfoJson;
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
    originalValues.tags = form.tags;
    originalValues.techStack = form.techStack;
    originalContactItems.value = JSON.parse(JSON.stringify(contactItems.value));
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
