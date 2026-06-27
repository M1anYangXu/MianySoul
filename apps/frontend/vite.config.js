// 🔐 警告: 此配置文件禁止随意修改！
// 如需修改请先查看项目根目录的 CONFIG_GUARD.md
// 关键配置：端口 5173，代理指向 127.0.0.1:3000
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
    origin: "http://localhost:5173",
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "naive-ui": ["naive-ui"],
          "vue-vendor": ["vue", "vue-router", "pinia"],
        },
      },
    },
  },
});
