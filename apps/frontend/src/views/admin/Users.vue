<template>
  <div class="max-w-4xl mx-auto">
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
      {{ moduleName }}
    </h1>
    <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
      {{ moduleDescription }}
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
          class="w-8 h-8 rounded-lg gradient-success flex items-center justify-center text-white text-sm"
        >
          <User class="w-5 h-5" />
        </span>
        <span>基本信息</span>
      </h2>
      <div class="flex items-start space-x-8 mb-6">
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
            <ImageIcon class="w-5 h-5 text-white" />
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div>
          <label
            class="block text-sm font-medium mb-2"
            :class="isDark ? 'text-gray-300' : 'text-gray-700'"
          >
            个人标签
          </label>
          <input
            v-model="form.tags"
            type="text"
            placeholder="例如：Vue.js, TypeScript, Node.js"
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
          class="w-8 h-8 rounded-lg gradient-success flex items-center justify-center text-white text-sm"
        >
          <Wrench class="w-5 h-5" />
        </span>
        <span>技术栈</span>
      </h2>
      <div class="space-y-3">
        <div v-for="(item, index) in techStackItems" :key="index" class="flex items-center gap-3">
          <div class="flex-1">
            <input
              v-model="item.name"
              type="text"
              placeholder="技术名称"
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
              v-model="item.icon"
              type="text"
              placeholder="Iconify图标名称（如：devicon:vuejs、devicon:typescript）"
              class="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300 text-sm"
              :class="
                isDark
                  ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                  : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
              "
            />
          </div>
          <button
            v-if="techStackItems.length > 1"
            class="w-10 h-10 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all duration-300"
            @click="removeTechStackItem(index)"
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
          @click="addTechStackItem"
        >
          <span class="text-lg">+</span>
          <span>添加技术栈</span>
        </button>
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

    <StickyBar :has-changes="hasChanges" :saving="saving" @save="saveAll" @reset="resetForm" />
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
import { User, Wrench, Mail, Image as ImageIcon, Folder } from "lucide-vue-next";
import StickyBar from "@/components/StickyBar.vue";
import { useModuleConfig } from "@/composables/useModuleConfig";

const userStore = useUserStore();
const appStore = useAppStore();
const { success, error, info } = useMessage();
const { getModuleName, getModuleDescription } = useModuleConfig();

const isDark = computed(() => appStore.themeMode === "dark");

const moduleName = computed(() => getModuleName("users"));
const moduleDescription = computed(() => getModuleDescription("users"));

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

interface TechStackItem {
  icon: string;
  name: string;
}

const form = reactive({
  username: userStore.userInfo?.username || "",
  email: userStore.userInfo?.email || "",
  tags: userStore.userInfo?.tags || "",
});

const contactItems = ref<ContactItem[]>([]);
const techStackItems = ref<TechStackItem[]>([]);

const originalContactItems = ref<ContactItem[]>([]);
const originalTechStackItems = ref<TechStackItem[]>([]);

const originalValues = reactive({
  username: userStore.userInfo?.username || "",
  email: userStore.userInfo?.email || "",
  avatar: userStore.userInfo?.avatar || "",
  tags: userStore.userInfo?.tags || "",
});

const saving = ref(false);
const isLoaded = ref(false);

const hasChanges = computed(() => {
  if (form.username !== originalValues.username) return true;
  if (form.email !== originalValues.email) return true;
  if (form.tags !== originalValues.tags) return true;
  if (avatarUrl.value !== originalValues.avatar) return true;
  if (JSON.stringify(techStackItems.value) !== JSON.stringify(originalTechStackItems.value))
    return true;
  if (JSON.stringify(contactItems.value) !== JSON.stringify(originalContactItems.value))
    return true;
  return false;
});

const resetForm = () => {
  form.username = originalValues.username;
  form.email = originalValues.email;
  form.tags = originalValues.tags;
  avatarUrl.value = originalValues.avatar;
  techStackItems.value = JSON.parse(JSON.stringify(originalTechStackItems.value));
  contactItems.value = JSON.parse(JSON.stringify(originalContactItems.value));
};

const syncUserData = () => {
  if (!userStore.userInfo) return;

  form.username = userStore.userInfo.username || "";
  form.email = userStore.userInfo.email || "";
  form.tags = userStore.userInfo.tags || "";
  originalValues.username = userStore.userInfo.username || "";
  originalValues.email = userStore.userInfo.email || "";
  originalValues.avatar = userStore.userInfo.avatar || "";
  originalValues.tags = userStore.userInfo.tags || "";
  avatarUrl.value = userStore.userInfo.avatar || "";

  if (userStore.userInfo.techStack) {
    try {
      techStackItems.value = JSON.parse(userStore.userInfo.techStack);
    } catch {
      techStackItems.value = userStore.userInfo.techStack.split(",").map((name: string) => ({
        icon: "",
        name: name.trim(),
      }));
    }
  } else {
    techStackItems.value = [];
  }
  if (techStackItems.value.length === 0) {
    techStackItems.value = [{ icon: "", name: "" }];
  }
  originalTechStackItems.value = JSON.parse(JSON.stringify(techStackItems.value));

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
    const data = await http.get<{ list: ImageItem[] }>("/gallery/images?pageSize=100");
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

const selectAvatar = (img: ImageItem) => {
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

const addTechStackItem = () => {
  techStackItems.value.push({ icon: "", name: "" });
};

const removeTechStackItem = (index: number) => {
  techStackItems.value.splice(index, 1);
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

  const techStackJson = JSON.stringify(
    techStackItems.value
      .filter((item) => item.name.trim())
      .map((item) => ({
        icon: item.icon.trim(),
        name: item.name.trim(),
      }))
  );
  const originalTechStackJson = JSON.stringify(originalTechStackItems.value);
  if (techStackJson !== originalTechStackJson) {
    updateData.techStack = techStackJson;
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
    originalTechStackItems.value = JSON.parse(JSON.stringify(techStackItems.value));
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
