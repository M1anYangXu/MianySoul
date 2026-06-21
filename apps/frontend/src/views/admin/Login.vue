<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">后台登录</h1>

      <n-form ref="formRef" :model="form" :rules="rules">
        <n-form-item path="username" label="用户名">
          <n-input v-model:value="form.username" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="form.password"
            type="password"
            placeholder="请输入密码"
            show-password-on="click"
          />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" block :loading="loading" @click="handleLogin">登录</n-button>
        </n-form-item>
      </n-form>

      <p class="text-center text-gray-500 text-sm mt-4">默认账号：admin / admin123</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NForm, NFormItem, NInput, NButton } from "naive-ui";
import type { FormInst, FormRules } from "naive-ui";
import { http } from "@/utils";
import { useUserStore } from "@/stores";
import { useMessage } from "@/composables";
import { UserRole } from "@miany-soul/shared";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const { success, error } = useMessage();

const formRef = ref<FormInst | null>(null);
const loading = ref(false);

const form = reactive({
  username: "",
  password: "",
});

const rules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const handleLogin = async () => {
  await formRef.value?.validate();

  loading.value = true;
  try {
    const data = await http.post<{
      accessToken: string;
      refreshToken: string;
      user: { id: string; username: string; email: string; role: string; avatar?: string };
    }>("/auth/login", form);

    userStore.login({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role as UserRole,
        avatar: data.user.avatar,
        createdAt: "",
        updatedAt: "",
      },
    });

    // 手动同步 localStorage，确保 persist 立即生效
    try {
      localStorage.setItem(
        "user-store",
        JSON.stringify({
          token: data.accessToken,
          refreshToken: data.refreshToken,
          userInfo: {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            role: data.user.role,
            avatar: data.user.avatar,
            createdAt: "",
            updatedAt: "",
          },
        })
      );
    } catch (e) {
      // ignore
    }

    success("登录成功");

    const redirect = route.query.redirect as string;
    router.push(redirect || { name: "AdminDashboard" });
  } catch (err) {
    error("登录失败，请检查用户名和密码");
  } finally {
    loading.value = false;
  }
};
</script>
