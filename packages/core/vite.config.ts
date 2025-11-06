import { defineConfig } from 'vite'
import jsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  plugins: [jsx(), dts({ rollupTypes: true }), cssInjectedByJsPlugin()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'vueNavigation',
      fileName: 'vue-navigation',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue', '@0x30/navigation-core', '@0x30/navigation-vue'],
      output: {
        globals: {
          vue: 'Vue',
          '@0x30/navigation-core': 'NavigationCore',
          '@0x30/navigation-vue': 'NavigationVue',
        },
      },
    },
  },
})
