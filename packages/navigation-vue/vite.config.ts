import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    vueJsx(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
    cssInjectedByJsPlugin(),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'NavigationVue',
      formats: ['es', 'umd'],
      fileName: 'navigation-vue',
    },
    rollupOptions: {
      external: ['vue', '@0x30/navigation-core', 'animejs'],
      output: {
        globals: {
          vue: 'Vue',
          '@0x30/navigation-core': 'NavigationCore',
          animejs: 'anime',
        },
      },
    },
  },
})
