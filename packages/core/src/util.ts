const randomId = () => `_${Math.random().toString(32).slice(2)}`

const disableBodyPointerEvents = () => {
  document.body.style.pointerEvents = 'none'
}

const enableBodyPointerEvents = () => {
  document.body.style.pointerEvents = 'auto'
}

const applyFuns = (funcs?: (() => void)[], params?: any[]) => {
  funcs?.forEach((func) => (func as any)?.(...(params ?? [])))
}

export {
  applyFuns,
  randomId,
  disableBodyPointerEvents,
  enableBodyPointerEvents,
}
