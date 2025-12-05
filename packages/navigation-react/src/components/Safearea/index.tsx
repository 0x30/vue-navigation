import { type FC, type ReactNode } from 'react'
import './index.scss'

interface SafeareaProps {
  children?: ReactNode
  className?: string
}

/**
 * 底部安全区域
 */
export const SafeBottomSpace: FC<SafeareaProps> = ({ className }) => (
  <div className={`safe-height-bottom ${className ?? ''}`} />
)

/**
 * 顶部安全区域
 */
export const SafeTopSpace: FC<SafeareaProps> = ({ className }) => (
  <div className={`safe-height-top ${className ?? ''}`} />
)

/**
 * 左侧安全区域
 */
export const SafeLeftSpace: FC<SafeareaProps> = ({ className }) => (
  <div className={`safe-height-left ${className ?? ''}`} />
)

/**
 * 右侧安全区域
 */
export const SafeRightSpace: FC<SafeareaProps> = ({ className }) => (
  <div className={`safe-height-right ${className ?? ''}`} />
)
