//       onAfterEnter,
//       onAfterLeave,
//       onBeforeEnter,
//       onBeforeLeave,

import { type AppContext, getCurrentInstance } from 'vue'
import {
  ExtensionHooks,
  addValueToAppContext,
  getValueFromAppContext,
} from './core'
import { applyFuns } from '../util'

const onPageAfterEnter = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onAfterEnter,
    hook,
  )
}
const onPageAfterLeave = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onAfterLeave,
    hook,
  )
}
const onPageBeforeEnter = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onBeforeEnter,
    hook,
  )
}
const onPageBeforeLeave = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onBeforeLeave,
    hook,
  )
}

const triggerTransitionHooks = (
  context: AppContext | undefined,
  type:
    | ExtensionHooks.onAfterEnter
    | ExtensionHooks.onAfterLeave
    | ExtensionHooks.onBeforeEnter
    | ExtensionHooks.onBeforeLeave,
) => {
  const hooks = getValueFromAppContext<(() => void)[]>(context, type)
  applyFuns(hooks)
}

export {
  onPageAfterEnter,
  onPageAfterLeave,
  onPageBeforeEnter,
  onPageBeforeLeave,
  triggerTransitionHooks,
}
