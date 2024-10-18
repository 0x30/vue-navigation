import type { App } from 'vue'

let configApp: ((app: App) => void) | undefined

/**
 * useAppBeforeMount() 用于在 app 挂载之前执行一些操作
 * example:
 * ```tsx
 * import { useAppBeforeMount } from '@0x30/vue-navigation'
 * 
 * useAppBeforeMount((app) => {
 *  app.use(store)
 *  app.use(router)
 * })
 * @param config  app 挂载之前执行的操作
 */
const useAppBeforeMount = (config: (app: App) => void) => {
  configApp = config
}

export { configApp }
export { useAppBeforeMount }
