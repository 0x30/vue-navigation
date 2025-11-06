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
      'navigation': resolve(fileURLToPath(new URL('.', import.meta.url)), '../core/src/index.ts'),
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'navigationVue',
      fileName: 'navigation-vue',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue', 'animejs', 'navigation'],
      output: {
        globals: {
          vue: 'Vue',
          animejs: 'animejs',
          'navigation': 'navigation',
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
