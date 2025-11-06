/**
 * 该文件为 页面 切换监听对象
 * 在页面进行 切换的时候，会收到通知
 */

import { type AppContext, getCurrentInstance } from 'vue'
import { getExtData, setExtData } from './core'
import { getLastApp } from '../state'

interface PageMate {
  id?: string
  name?: string
  [key: string]: any
}

const usePageMate = (mate: PageMate) => {
  const context = getCurrentInstance()?.appContext
  const info = getPageMate(context) ?? {}
  setExtData(context, { __pageMateInfo: { ...info, ...mate } })
}

const getPageMate = (context: AppContext | undefined) => {
  return getExtData<{ __pageMateInfo: PageMate }>(context)?.__pageMateInfo
}

/// page change hooks set
type PageChangeHook = (from?: PageMate, to?: PageMate) => void
type PageChangeConfig = {
  /**
   * 是不是每一个 页面切换都监听到
   * 默认为 false:
   * * true: 每一次页面变动的时候 都会触发
   * * false: 只有存在 mateInfo 并且 没有设置为 useQuietPage 的页面 会触发
   */
  isEvery: boolean
}
const pageChangeSet = new Set<
  readonly [PageChangeHook, Partial<PageChangeConfig> | undefined]
>()

/// 当页面 出现变化的时候
const onPageChange = (
  func: PageChangeHook,
  config?: Partial<PageChangeConfig>,
) => {
  const val = [func, config] as const
  pageChangeSet.add(val)
  return () => pageChangeSet.delete(val)
}

const trigglePageChange = (
  from: AppContext | undefined,
  to: AppContext | undefined,
) => {
  pageChangeSet.forEach(([hook, config]) => {
    const fM = getPageMate(from)
    const tM = getPageMate(to)
    const isE = config?.isEvery ?? false
    if (
      isE || /// 如果任何页面都收集
      (fM !== undefined && tM !== undefined) // 其他情况 必须 fromPage mate 有值 以及 toPage mate 有值 以及 fromPage 不能是 quietPage
    ) {
      hook.apply(null, [fM, tM])
    }
  })
}

/**
 * 获取当前所在的页面的 mate 信息
 * @returns PageMate 信息
 */
const getCurrentPageMate = () => {
  return getPageMate(getLastApp()?._context)
}

export {
  type PageMate,
  type PageChangeHook,
  type PageChangeConfig,
  usePageMate,
  onPageChange,
  trigglePageChange,
  getCurrentPageMate,
}
