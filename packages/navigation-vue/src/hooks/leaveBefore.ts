import { type AppContext, getCurrentInstance, onUnmounted } from 'vue'
import {
  ExtensionHooks,
  getValueFromAppContext,
  setValueToAppContext,
} from './core'

/**
 * 在页面即将返回的时候，会调用hook方法，返回是否可以返回
 * 该方法，如果在某个页面多次注册，会覆盖请注意
 */
const useLeaveBefore = (hook: (() => boolean) | (() => Promise<boolean>)) => {
  setLeaveBefore(getCurrentInstance()?.appContext, hook)
  onUnmounted(() => {
    setLeaveBefore(getCurrentInstance()?.appContext, undefined)
  })
}

const getLeaveBefore = (context: AppContext | undefined) =>
  getValueFromAppContext<(() => boolean) | (() => Promise<boolean>)>(
    context,
    ExtensionHooks.onLeaveBefore,
  )

const setLeaveBefore = (context: AppContext | undefined, func?: () => void) =>
  setValueToAppContext(context, ExtensionHooks.onLeaveBefore, func)

export { useLeaveBefore, setLeaveBefore, getLeaveBefore }
