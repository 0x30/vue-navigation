import type { App } from 'vue'

let configApp: ((app: App) => void) | undefined

/**
 * 在 app 挂载之前执行一些操作
 * @example
 * ```tsx
 * import { useAppBeforeMount } from '@0x30/navigation-vue'
 *
 * useAppBeforeMount((app) => {
 *   app.use(store)
 *   app.use(router)
 * })
 * ```
 */
export const useAppBeforeMount = (config: (app: App) => void) => {
  configApp = config
}

export { configApp }
