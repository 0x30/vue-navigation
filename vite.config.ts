import { defineConfig } from "vite";
import jsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [jsx()],
  resolve: {
    alias: {
      // 直接引用 packages 的源码，而不是编译后的 dist 文件
      "@0x30/vue-navigation": resolve(fileURLToPath(new URL(".", import.meta.url)), "packages/core/src/index.ts"),
      "@0x30/vue-navigation-layout": resolve(fileURLToPath(new URL(".", import.meta.url)), "packages/layout/src/index.ts"),
    },
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ["vue"],
  },
});
