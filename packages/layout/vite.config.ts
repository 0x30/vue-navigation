import { defineConfig } from 'vite'
import jsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { resolve } from 'path'
import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  plugins: [jsx(), dts({ rollupTypes: true }), cssInjectedByJsPlugin()],
  resolve: {
    alias: {
      '@0x30/vue-navigation': resolve(fileURLToPath(new URL('.', import.meta.url)), '../core/src/index.ts'),
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'vueNavigationLayout',
      fileName: 'vue-navigation-layout',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue', 'animejs', '@0x30/vue-navigation'],
      output: {
        globals: {
          vue: 'Vue',
          animejs: 'animejs',
          '@0x30/vue-navigation': 'vueNavigation',
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
})
