const randomId = () => `_${Math.random().toString(32).slice(2)}`

const applyFuns = (funcs?: ((...arg: any) => any)[], params?: any[]) => {
  funcs?.forEach((func) => (func as any)?.(...(params ?? [])))
}

export { applyFuns, randomId }
