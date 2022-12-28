import { defineConfig } from "vite";
import jsx from "@vitejs/plugin-vue-jsx";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  plugins: [jsx(), dts()],
  build: {
    lib: {
      entry: "./src/core/index.tsx",
      name: "vueNavigation",
      fileName: "vue-navigation",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
