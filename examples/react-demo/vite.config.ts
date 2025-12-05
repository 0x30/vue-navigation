import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/vue-navigation/react/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@0x30/navigation-core': resolve(__dirname, '../../packages/navigation-core/src/index.ts'),
      '@0x30/navigation-react': resolve(__dirname, '../../packages/navigation-react/src/index.ts'),
    },
  },
}))
