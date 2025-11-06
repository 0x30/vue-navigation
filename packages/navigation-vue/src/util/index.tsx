export {
  disableBodyPointerEvents,
  enableBodyPointerEvents,
  initDisableAllPointerEvents,
} from './disableBodyPointerEvents'

const applyFuns = (funcs?: ((...arg: any) => any)[], params?: any[]) => {
  funcs?.forEach((func) => (func as any)?.(...(params ?? [])))
}

export { applyFuns }
