import { Component, Transition, TransitionProps, createApp, ref } from 'vue'

/**
   * 动态弹出视图方法
   * 
   * ```ts
   * const { show, close } = Popup();
  
    show(
      <button
        onClick={async () => {
          await close();
          console.log("leaved.");
        }}
      >
        close
      </button>
    );
   * ```
   * 
   * @param options 配置对象，同 Transition，属性
   */
const Popup = (options?: TransitionProps & { root?: Element }) => {
  /// create document
  const container = document.createElement('div')
  ;(options?.root ?? document.body).appendChild(container)

  const isShowRef = ref(false)
  const componentRef = ref<Component>()

  const hiddenModal = () => {
    isShowRef.value = false
    componentRef.value = undefined
  }

  // 外部调用 promise resolve
  let __resolve: () => void
  const close = () => {
    return new Promise<void>((resolve) => {
      __resolve = () => resolve()
      hiddenModal()
    })
  }

  const app = createApp(() => (
    <Transition
      {...options}
      // overwrite onAfterLeave
      onAfterLeave={(el) => {
        if (options?.onAfterLeave) {
          if (typeof options.onAfterLeave === 'function') {
            options.onAfterLeave(el)
          } else {
            options.onAfterLeave.forEach((f) => f(el))
          }
        }

        app.unmount()
        document.body.removeChild(container)
        __resolve?.()
      }}
    >
      {isShowRef.value ? componentRef.value : null}
    </Transition>
  ))

  const show = (component: Component) => {
    app.mount(container)
    componentRef.value = component
    isShowRef.value = true
  }

  return [show, close] as const
}

export { Popup }
