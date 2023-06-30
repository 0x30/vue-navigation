const randomId = () => `_${Math.random().toString(32).slice(2)}`

const disableBodyPointerEvents = () => {
  document.body.style.pointerEvents = 'none'
}

const enableBodyPointerEvents = () => {
  document.body.style.pointerEvents = 'auto'
}

const applyFuns = (funcs?: (() => void)[]) => {
  funcs?.forEach((func) => func.apply?.(null))
}

export {
  applyFuns,
  randomId,
  disableBodyPointerEvents,
  enableBodyPointerEvents,
}
