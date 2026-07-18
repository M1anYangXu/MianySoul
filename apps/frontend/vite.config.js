import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "path";
import fs from "fs";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var backendPortPath = resolve(__dirname, "../backend/.port");
function readBackendPort() {
  try {
    var content = fs.readFileSync(backendPortPath, "utf-8");
    var port = parseInt(content.trim(), 10);
    return isNaN(port) ? 3000 : port;
  } catch (_a) {
    return 3000;
  }
}
var backendPort = readBackendPort();
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
    proxy: {
      "/api": {
        target: "http://127.0.0.1:".concat(backendPort),
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://127.0.0.1:".concat(backendPort),
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
