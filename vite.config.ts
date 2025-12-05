import { defineConfig } from "vite";

// 根目录只提供静态的 landing page
export default defineConfig({
  base: "",
  server: {
    proxy: {
      '/vue': {
        target: 'http://localhost:5173',
        changeOrigin: true,
      },
      '/react': {
        target: 'http://localhost:5174',
        changeOrigin: true,
      },
    },
  },
});
