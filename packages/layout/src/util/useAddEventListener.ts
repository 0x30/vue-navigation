import { type Ref, onMounted, onUnmounted } from 'vue'

const useAddEventListener = <K extends keyof HTMLElementEventMap>(
  containRef: Ref<HTMLDivElement | undefined>,
  type: K,
  listener: (ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) => {
  onMounted(() => {
    containRef.value?.addEventListener(type, listener, options)
  })
  onUnmounted(() => {
    containRef.value?.removeEventListener(type, listener)
  })
}

export { useAddEventListener }
