import { type AppContext, getCurrentInstance } from 'vue'
import { getExtData, setExtData } from './core'
import { routerStack, type RouterStackItem } from '@0x30/navigation-core'

export interface PageMate {
  id?: string
  name?: string
  [key: string]: any
}

export const usePageMate = (mate: PageMate) => {
  const context = getCurrentInstance()?.appContext
  const info = getPageMate(context) ?? {}
  setExtData(context, { __pageMateInfo: { ...info, ...mate } })
}

export const getPageMate = (context: AppContext | undefined) => {
  return getExtData<{ __pageMateInfo: PageMate }>(context)?.__pageMateInfo
}

/**
 * 获取当前页面的 mate
 */
export const getCurrentPageMate = () => {
  const lastItem = routerStack[routerStack.length - 1] as
    | (RouterStackItem & { context: { _context: AppContext } })
    | undefined
  return getPageMate(lastItem?.context?._context)
}

// Page change hooks
type PageChangeHook = (from?: PageMate, to?: PageMate) => void
type PageChangeConfig = {
  /**
   * 是不是每一个页面切换都监听到
   * 默认为 false:
   * * true: 每一次页面变动的时候都会触发
   * * false: 只有存在 mateInfo 并且没有设置为 useQuietPage 的页面会触发
   */
  isEvery: boolean
}

const pageChangeSet = new Set<
  readonly [PageChangeHook, Partial<PageChangeConfig> | undefined]
>()

/**
 * 当页面出现变化的时候
 */
export const onPageChange = (
  func: PageChangeHook,
  config?: Partial<PageChangeConfig>
) => {
  const val = [func, config] as const
  pageChangeSet.add(val)
  return () => pageChangeSet.delete(val)
}

export const trigglePageChange = (
  from: AppContext | undefined,
  to: AppContext | undefined
) => {
  pageChangeSet.forEach(([hook, config]) => {
    const fM = getPageMate(from)
    const tM = getPageMate(to)
    const isE = config?.isEvery ?? false
    if (isE || (fM !== undefined && tM !== undefined)) {
      hook(fM, tM)
    }
  })
}
