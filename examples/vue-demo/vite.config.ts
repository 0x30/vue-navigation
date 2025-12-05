import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

export default defineConfig({
  base: '/vue-navigation/vue/',
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@0x30/navigation-core': resolve(__dirname, '../../packages/navigation-core/src/index.ts'),
      '@0x30/navigation-vue': resolve(__dirname, '../../packages/navigation-vue/src/index.ts'),
    },
  },
})
