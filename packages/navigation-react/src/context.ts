import { createContext, useContext } from 'react'
import type { ReactRouterStackItem } from './state'

/**
 * Page Context - 每个页面的上下文
 */
interface PageContextValue {
  item: ReactRouterStackItem
  updateHooks: (hooks: Partial<ReactRouterStackItem['hooks']>) => void
}

export const PageContext = createContext<PageContextValue | null>(null)

/**
 * 获取当前页面的上下文
 */
export const usePageContext = () => {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error('usePageContext must be used within a PageProvider')
  }
  return context
}

/**
 * 安全获取页面上下文（不抛出错误）
 */
export const usePageContextSafe = () => {
  return useContext(PageContext)
}
