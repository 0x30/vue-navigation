import { type AppContext, getCurrentInstance } from 'vue'
import { applyFuns } from '@0x30/navigation-core'
import {
  ExtensionHooks,
  addValueToAppContext,
  getValueFromAppContext,
} from './core'

export const onPageAfterEnter = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onAfterEnter,
    hook
  )
}

export const onPageAfterLeave = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onAfterLeave,
    hook
  )
}

export const onPageBeforeEnter = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onBeforeEnter,
    hook
  )
}

export const onPageBeforeLeave = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onBeforeLeave,
    hook
  )
}

export const triggerTransitionHooks = (
  context: AppContext | undefined,
  type:
    | ExtensionHooks.onAfterEnter
    | ExtensionHooks.onAfterLeave
    | ExtensionHooks.onBeforeEnter
    | ExtensionHooks.onBeforeLeave
) => {
  const hooks = getValueFromAppContext<(() => void)[]>(context, type)
  applyFuns(hooks)
}
