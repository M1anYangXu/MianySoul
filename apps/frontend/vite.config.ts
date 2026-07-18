import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const backendPortPath = resolve(__dirname, "../backend/.port");

function readBackendPort(): number {
  try {
    const content = fs.readFileSync(backendPortPath, "utf-8");
    const port = parseInt(content.trim(), 10);
    return isNaN(port) ? 3000 : port;
  } catch {
    return 3000;
  }
}

const backendPort = readBackendPort();

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
        target: `http://127.0.0.1:${backendPort}`,
        changeOrigin: true,
      },
      "/uploads": {
        target: `http://127.0.0.1:${backendPort}`,
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
