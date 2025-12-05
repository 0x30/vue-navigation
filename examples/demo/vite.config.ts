import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    react({
      include: /src\/react\/.*\.[tj]sx?$/,
    }),
  ],
  resolve: {
    alias: {
      '@0x30/navigation-core': resolve(__dirname, '../../packages/navigation-core/src/index.ts'),
      '@0x30/navigation-vue': resolve(__dirname, '../../packages/navigation-vue/src/index.ts'),
      '@0x30/navigation-react': resolve(__dirname, '../../packages/navigation-react/src/index.ts'),
    },
  },
  optimizeDeps: {
    include: ['vue', 'react', 'react-dom'],
  },
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        vue: resolve(__dirname, 'vue/index.html'),
        react: resolve(__dirname, 'react/index.html'),
      },
    },
  },
})
