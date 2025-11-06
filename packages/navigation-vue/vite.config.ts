import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NavigationVue',
      fileName: 'navigation-vue',
    },
    rollupOptions: {
      external: ['vue', '@0x30/navigation-core'],
      output: {
        globals: {
          vue: 'Vue',
          '@0x30/navigation-core': 'NavigationCore',
        },
      },
    },
  },
  plugins: [vueJsx(), dts({ rollupTypes: true })],
})
