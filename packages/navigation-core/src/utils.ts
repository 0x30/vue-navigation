/**
 * 生成随机 ID
 */
export const randomId = () => `_${Math.random().toString(32).slice(2)}`

/**
 * 批量执行函数
 */
export const applyFuns = (funcs?: ((...arg: any) => any)[], params?: any[]) => {
  funcs?.forEach((func) => func?.(...(params ?? [])))
}
