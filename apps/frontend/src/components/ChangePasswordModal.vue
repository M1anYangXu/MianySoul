<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    leave-active-class="transition-all duration-150 ease-in"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        @click="handleClose"
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      ></div>
      <div
        class="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden"
        :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'"
      >
        <div class="p-6 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Lock class="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">修改密码</h3>
              <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">请输入当前密码和新密码</p>
            </div>
          </div>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">当前密码</label>
            <input
              v-model="oldPassword"
              type="password"
              placeholder="请输入当前密码"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white text-black placeholder-gray-400'"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">新密码</label>
            <input
              v-model="newPassword"
              type="password"
              placeholder="请输入新密码（至少6位）"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white text-black placeholder-gray-400'"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">确认新密码</label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white text-black placeholder-gray-400'"
            />
          </div>
        </div>
        <div class="p-6 border-t flex justify-end space-x-3" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
          <button
            @click="handleClose"
            class="px-5 py-2.5 border rounded-xl font-medium transition-colors"
            :class="isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
          >
            取消
          </button>
          <button
            @click="handleSubmit"
            :disabled="loading"
            class="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {{ loading ? '修改中...' : '确认修改' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Lock } from "lucide-vue-next";
import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/stores/user";
import { useMessage } from "@/composables";

defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

const router = useRouter();
const appStore = useAppStore();
const userStore = useUserStore();
const { success, error, warning } = useMessage();

const isDark = computed(() => appStore.themeMode === "dark");

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);

const handleClose = () => {
  emit("update:visible", false);
  oldPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
};

const handleSubmit = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    warning("请填写所有密码字段");
    return;
  }
  
  if (newPassword.value !== confirmPassword.value) {
    warning("新密码和确认密码不一致");
    return;
  }
  
  if (newPassword.value.length < 6) {
    warning("密码长度至少需要6位");
    return;
  }
  
  loading.value = true;
  try {
    await userStore.changePassword(oldPassword.value, newPassword.value);
    success("密码修改成功，请使用新密码重新登录");
    userStore.logout();
    router.push({ name: "AdminLogin" });
  } catch (err: any) {
    error(err.message || "密码修改失败，请检查旧密码是否正确");
  } finally {
    loading.value = false;
  }
};
</script>