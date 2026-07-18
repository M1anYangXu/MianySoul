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
        <User class="w-7 h-7 inline mr-2" />
        用户管理
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
          <User class="w-5 h-5" />
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
          <button
            class="absolute -bottom-2 -right-2 w-10 h-10 gradient-primary rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
            @click="openImagePicker"
          >
            <Image class="w-5 h-5 text-white" />
          </button>
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
          <Edit3 class="w-5 h-5" />
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
          <Tag class="w-5 h-5" />
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
          <Wrench class="w-5 h-5" />
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
          <Mail class="w-5 h-5" />
        </span>
        <span>联系我</span>
      </h2>
      <div class="space-y-3">
        <div v-for="(item, index) in contactItems" :key="index" class="flex items-center gap-3">
          <div class="flex-1">
            <input
              v-model="item.icon"
              type="text"
              placeholder="Iconify图标名称（如：mdi:github、ri:twitter-x-fill）"
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

  <div
    v-if="showImagePicker"
    class="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
    style="z-index: 10000"
    @click.self="showImagePicker = false"
  >
    <div
      class="w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl"
      :class="isDark ? 'bg-gray-800' : 'bg-white'"
    >
      <div class="p-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">选择头像</h3>
          <button
            class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="showImagePicker = false"
          >
            ✕
          </button>
        </div>
        <div class="flex flex-wrap gap-2 mt-3">
          <button
            v-for="group in imageGroups"
            :key="group.id"
            class="px-3 py-1.5 rounded-full text-sm transition-all"
            :class="
              selectedGroupId === group.id
                ? 'bg-pink-500 text-white'
                : isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            "
            @click="selectedGroupId = group.id"
          >
            <component :is="getIconComponent(group.icon)" class="w-3 h-3 inline mr-1" />
            {{ group.name }}
          </button>
        </div>
      </div>
      <div class="p-4 overflow-y-auto max-h-[60vh]">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div
            v-for="img in filteredImages"
            :key="img.id"
            class="relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all"
            :class="
              avatarUrl === img.url
                ? 'border-primary-500 ring-4 ring-primary-500/40 shadow-lg shadow-primary-500/30'
                : isDark
                  ? 'border-gray-700 hover:border-gray-500'
                  : 'border-gray-200 hover:border-gray-400'
            "
            @click="selectAvatar(img)"
          >
            <img
              :src="getFullImageUrl(img.url)"
              :alt="img.filename"
              class="w-full h-full object-cover"
            />
            <div
              v-if="avatarUrl === img.url"
              class="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shadow-lg"
            >
              <span class="text-white text-xs font-bold">✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useAppStore } from "@/stores/app";
import { useMessage } from "@/composables/useMessage";
import { http } from "@/utils/request";
import type { UserInfo } from "@miany-soul/shared";
import { User, Edit3, Tag, Wrench, Mail, Image, Folder } from "lucide-vue-next";

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
  if (!userStore.userInfo) return;

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

const fetchUserInfo = async () => {
  try {
    const data = await http.get<UserInfo>("/auth/me");
    userStore.setUserInfo(data);
  } catch (e) {
    console.error("获取用户信息失败:", e);
  }
};

onMounted(() => {
  fetchUserInfo();
});

const showImagePicker = ref(false);
const images = ref<ImageItem[]>([]);
const imageGroups = ref<ImageGroup[]>([]);
const selectedGroupId = ref<string | null>(null);

interface ImageItem {
  id: string;
  url: string;
  filename: string;
  group?: { id: string; name: string };
}

interface ImageGroup {
  id: string;
  name: string;
  icon: string;
}

const iconOptions = [{ emoji: "📁", icon: Folder, name: "Folder" }];

const getIconComponent = (emoji: string) => {
  return iconOptions.find((opt) => opt.emoji === emoji)?.icon || Folder;
};

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
};

const filteredImages = computed(() => {
  if (!selectedGroupId.value) {
    return [];
  }
  return images.value.filter((img) => img.group?.id === selectedGroupId.value);
});

const fetchImages = async () => {
  try {
    const data = await http.get<{ list: Image[] }>("/gallery/images?pageSize=100");
    images.value = data.list || [];
    imageGroups.value = await http.get<ImageGroup[]>("/gallery/groups");
    const defaultGroup = imageGroups.value.find((g) => g.name === "默认分组");
    selectedGroupId.value = defaultGroup?.id || imageGroups.value[0]?.id || null;
  } catch (e) {
    images.value = [];
    imageGroups.value = [];
    selectedGroupId.value = null;
  }
};

const openImagePicker = () => {
  fetchImages();
  showImagePicker.value = true;
};

const selectAvatar = (img: Image) => {
  avatarUrl.value = img.url;
  showImagePicker.value = false;
  success("头像选择成功");
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
