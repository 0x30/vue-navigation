/**
 * 禁用/启用页面指针事件的工具
 * 用于在页面切换动画期间防止用户交互
 */

const DISABLE_POINTER_EVENTS_ID = '___disable_all_pointerevents'

const getDisableAllPointerEventsElement = () => {
  return document.querySelector(`#${DISABLE_POINTER_EVENTS_ID}`) as HTMLDivElement | null
}

/**
 * 禁用页面所有指针事件
 */
export const disableBodyPointerEvents = () => {
  const element = getDisableAllPointerEventsElement()
  if (element) {
    element.style.display = 'block'
  }
}

/**
 * 启用页面所有指针事件
 */
export const enableBodyPointerEvents = () => {
  const element = getDisableAllPointerEventsElement()
  if (element) {
    element.style.display = 'none'
  }
}

/**
 * 初始化禁用指针事件的 DOM 元素
 */
export const initDisableAllPointerEvents = () => {
  // 避免重复创建
  if (getDisableAllPointerEventsElement()) return

  const div = document.createElement('div')
  div.id = DISABLE_POINTER_EVENTS_ID
  div.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    display: none;
    z-index: 99999999;
  `.replace(/\s+/g, '')

  document.body.appendChild(div)
}
