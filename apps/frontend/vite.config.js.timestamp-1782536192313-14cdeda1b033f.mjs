// ../frontend/vite.config.js
import { defineConfig } from "file:///home/devbox/project/miany-soul/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.43/node_modules/vite/dist/node/index.js";
import vue from "file:///home/devbox/project/miany-soul/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vite@5.4.21_@types+node@20.19.43__vue@3.5.38_typescript@5.9.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "/home/devbox/project/miany-soul/apps/frontend";
var vite_config_default = defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  server: {
    // 🔐 关键配置：禁止修改
    port: 5173,
    host: "0.0.0.0",
    proxy: {
      // 🔐 关键配置：禁止修改
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true
      },
      // 🔐 关键配置：禁止修改
      "/uploads": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "naive-ui": ["naive-ui"],
          "vue-vendor": ["vue", "vue-router", "pinia"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vZnJvbnRlbmQvdml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9kZXZib3gvcHJvamVjdC9taWFueS1zb3VsL2FwcHMvZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2RldmJveC9wcm9qZWN0L21pYW55LXNvdWwvYXBwcy9mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9kZXZib3gvcHJvamVjdC9taWFueS1zb3VsL2FwcHMvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjsvLyBcdUQ4M0RcdUREMTAgXHU4QjY2XHU1NDRBOiBcdTZCNjRcdTkxNERcdTdGNkVcdTY1ODdcdTRFRjZcdTc5ODFcdTZCNjJcdTk2OEZcdTYxMEZcdTRGRUVcdTY1MzlcdUZGMDFcbi8vIFx1NTk4Mlx1OTcwMFx1NEZFRVx1NjUzOVx1OEJGN1x1NTE0OFx1NjdFNVx1NzcwQlx1OTg3OVx1NzZFRVx1NjgzOVx1NzZFRVx1NUY1NVx1NzY4NCBDT05GSUdfR1VBUkQubWRcbi8vIFx1NTE3M1x1OTUyRVx1OTE0RFx1N0Y2RVx1RkYxQVx1N0FFRlx1NTNFMyA1MTczXHVGRjBDXHU0RUUzXHU3NDA2XHU2MzA3XHU1NDExIDEyNy4wLjAuMTozMDAwXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFt2dWUoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICAvLyBcdUQ4M0RcdUREMTAgXHU1MTczXHU5NTJFXHU5MTREXHU3RjZFXHVGRjFBXHU3OTgxXHU2QjYyXHU0RkVFXHU2NTM5XG4gICAgcG9ydDogNTE3MyxcbiAgICBob3N0OiBcIjAuMC4wLjBcIixcbiAgICBwcm94eToge1xuICAgICAgLy8gXHVEODNEXHVERDEwIFx1NTE3M1x1OTUyRVx1OTE0RFx1N0Y2RVx1RkYxQVx1Nzk4MVx1NkI2Mlx1NEZFRVx1NjUzOVxuICAgICAgXCIvYXBpXCI6IHtcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly8xMjcuMC4wLjE6MzAwMFwiLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICB9LFxuICAgICAgLy8gXHVEODNEXHVERDEwIFx1NTE3M1x1OTUyRVx1OTE0RFx1N0Y2RVx1RkYxQVx1Nzk4MVx1NkI2Mlx1NEZFRVx1NjUzOVxuICAgICAgXCIvdXBsb2Fkc1wiOiB7XG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vMTI3LjAuMC4xOjMwMDBcIixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogXCJkaXN0XCIsXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgXCJuYWl2ZS11aVwiOiBbXCJuYWl2ZS11aVwiXSxcbiAgICAgICAgICBcInZ1ZS12ZW5kb3JcIjogW1widnVlXCIsIFwidnVlLXJvdXRlclwiLCBcInBpbmlhXCJdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBR0EsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZUFBZTtBQUx4QixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxDQUFDO0FBQUEsRUFDZixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQy9CO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBO0FBQUEsSUFFTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUE7QUFBQSxNQUVMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNoQjtBQUFBO0FBQUEsTUFFQSxZQUFZO0FBQUEsUUFDVixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osWUFBWSxDQUFDLFVBQVU7QUFBQSxVQUN2QixjQUFjLENBQUMsT0FBTyxjQUFjLE9BQU87QUFBQSxRQUM3QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
