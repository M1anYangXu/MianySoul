<template>
  <div
    class="min-h-screen relative overflow-hidden"
    :class="
      isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900'
    "
  >
    <!-- 粒子背景 -->
    <div class="absolute inset-0">
      <canvas ref="particleCanvas" class="w-full h-full"></canvas>
    </div>

    <!-- 主容器 -->
    <div class="relative z-10 flex items-center justify-center min-h-screen p-4">
      <!-- 装饰元素 -->
      <div
        class="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-br from-pink-500/30 to-violet-500/30 blur-2xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 blur-3xl animate-pulse"
        style="animation-delay: 1s"
      ></div>
      <div
        class="absolute top-1/2 right-10 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 blur-xl animate-pulse"
        style="animation-delay: 0.5s"
      ></div>

      <!-- 登录卡片 -->
      <div class="w-full max-w-md">
        <!-- 顶部浮动元素 -->
        <div class="text-center mb-8">
          <div class="inline-block relative">
            <div
              class="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl relative z-10"
              :class="isDark ? 'bg-gray-800/80' : 'bg-white/10'"
              style="backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3)"
            >
              ✨
            </div>
            <div
              class="absolute -inset-4 bg-gradient-to-r from-violet-500/40 to-fuchsia-500/40 rounded-full blur-xl animate-pulse"
            ></div>
          </div>
          <h1 class="text-4xl font-bold mt-6 mb-2" :class="isDark ? 'text-white' : 'text-white'">
            Miany Soul
          </h1>
          <p class="text-lg" :class="isDark ? 'text-gray-400' : 'text-white/70'">
            记录你的灵魂之旅
          </p>
        </div>

        <!-- 玻璃拟态卡片 -->
        <div
          class="p-8 rounded-3xl border"
          :class="isDark ? 'bg-gray-900/60 border-gray-700/50' : 'bg-white/10 border-white/20'"
          style="backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3)"
        >
          <!-- 欢迎语 -->
          <div class="text-center mb-8">
            <span
              class="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              :class="isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-white/10 text-white'"
            >
              👋 欢迎回来
            </span>
            <h2 class="text-2xl font-semibold" :class="isDark ? 'text-white' : 'text-white'">
              登录你的账号
            </h2>
          </div>

          <!-- 表单 -->
          <form class="space-y-5" @submit.prevent="handleLogin">
            <!-- 用户名 -->
            <div class="group relative">
              <div
                class="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
                :class="
                  isDark
                    ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20'
                    : 'bg-gradient-to-r from-white/10 to-white/5'
                "
              ></div>
              <div class="relative">
                <input
                  v-model="form.username"
                  type="text"
                  placeholder="用户名"
                  class="w-full px-5 py-4 rounded-2xl bg-transparent border-2 text-lg outline-none transition-all duration-300"
                  :class="
                    isDark
                      ? 'border-gray-700 text-white placeholder-gray-500 focus:border-violet-500'
                      : 'border-white/20 text-white placeholder-white/50 focus:border-violet-400'
                  "
                />
                <span
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-xl transition-transform duration-300 group-focus-within:scale-110"
                  :class="isDark ? 'text-gray-500' : 'text-white/50'"
                >
                  👤
                </span>
              </div>
            </div>

            <!-- 密码 -->
            <div class="group relative">
              <div
                class="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
                :class="
                  isDark
                    ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20'
                    : 'bg-gradient-to-r from-white/10 to-white/5'
                "
              ></div>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="密码"
                  class="w-full px-5 py-4 rounded-2xl bg-transparent border-2 text-lg outline-none transition-all duration-300"
                  :class="
                    isDark
                      ? 'border-gray-700 text-white placeholder-gray-500 focus:border-violet-500'
                      : 'border-white/20 text-white placeholder-white/50 focus:border-violet-400'
                  "
                  @keyup.enter="handleLogin"
                />
                <button
                  type="button"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-xl transition-transform duration-300 hover:scale-110"
                  :class="isDark ? 'text-gray-500' : 'text-white/50'"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? "🙈" : "👁️" }}
                </button>
              </div>
            </div>

            <!-- 登录按钮 -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-4 rounded-2xl text-white font-semibold text-lg relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              :class="loading ? 'opacity-70' : ''"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600"
              ></div>
              <div
                class="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                  style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
                ></div>
              </div>
              <span class="relative z-10 flex items-center justify-center space-x-2">
                <span
                  v-if="loading"
                  class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></span>
                <span>{{ loading ? "登录中..." : "立即登录" }}</span>
                <span
                  v-if="!loading"
                  class="transition-transform duration-300 group-hover:translate-x-1"
                >
                  🚀
                </span>
              </span>
            </button>
          </form>

          <!-- 提示信息 -->
          <div
            class="mt-6 pt-6 border-t text-center"
            :class="isDark ? 'border-gray-700' : 'border-white/10'"
          >
            <p class="text-sm" :class="isDark ? 'text-gray-500' : 'text-white/50'">
              默认账号：admin / admin123
            </p>
          </div>
        </div>

        <!-- 底部装饰 -->
        <div class="mt-6 flex justify-center space-x-2">
          <span
            v-for="i in 5"
            :key="i"
            class="w-2 h-2 rounded-full"
            :class="isDark ? 'bg-gray-700' : 'bg-white/20'"
            :style="{ animationDelay: `${i * 0.2}s` }"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppStore, useUserStore } from "@/stores";
import { http } from "@/utils";
import { useMessage } from "@/composables";
import { UserRole } from "@miany-soul/shared";

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const userStore = useUserStore();
const { success, error } = useMessage();

const isDark = computed(() => appStore.themeMode === "dark");

const loading = ref(false);
const showPassword = ref(false);
const particleCanvas = ref<HTMLCanvasElement | null>(null);
let animationId: number | null = null;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

const form = reactive({
  username: "",
  password: "",
});

const initParticles = () => {
  const canvas = particleCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const particles: Particle[] = [];
  const colors = ["#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#06b6d4", "#3b82f6"];

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.2,
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });

    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach((p2) => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p1.color;
          ctx.globalAlpha = (1 - dist / 150) * 0.2;
          ctx.stroke();
        }
      });
    });

    ctx.globalAlpha = 1;
    animationId = requestAnimationFrame(animate);
  };

  animate();
};

const handleLogin = async () => {
  if (!form.username.trim()) {
    error("请输入用户名");
    return;
  }
  if (!form.password.trim()) {
    error("请输入密码");
    return;
  }

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

onMounted(() => {
  initParticles();
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});
</script>
