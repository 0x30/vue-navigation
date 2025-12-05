import { type ReactNode, useEffect, useRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'

interface TransitionCallbacks {
  onEnter?: (el: Element, done: () => void) => void
  onLeave?: (el: Element, done: () => void) => void
  root?: Element
}

/**
 * 动态弹出视图方法 (React 版本)
 *
 * ```tsx
 * const [show, close] = Popup({
 *   onEnter(el, done) {
 *     animate(el, { opacity: [0, 1], onComplete: done })
 *   },
 *   onLeave(el, done) {
 *     animate(el, { opacity: [1, 0], onComplete: done })
 *   }
 * })
 *
 * show(<div>Hello</div>)
 * // later...
 * await close()
 * ```
 */
export const Popup = (options?: TransitionCallbacks) => {
  // create container
  const container = document.createElement('div')
  ;(options?.root ?? document.body).appendChild(container)

  let root: Root | null = null
  let currentElement: Element | null = null
  let closeResolve: (() => void) | null = null
  let showResolve: (() => void) | null = null
  let enterCalled = false

  const close = (): Promise<void> => {
    return new Promise((resolve) => {
      closeResolve = () => {
        // cleanup
        root?.unmount()
        root = null
        container.parentNode?.removeChild(container)
        resolve()
      }

      if (currentElement && options?.onLeave) {
        options.onLeave(currentElement, () => {
          closeResolve?.()
        })
      } else {
        closeResolve?.()
      }
    })
  }

  const show = (content: ReactNode): Promise<void> => {
    return new Promise((resolve) => {
      showResolve = resolve
      enterCalled = false

      const PopupContent = () => {
        const ref = useRef<HTMLDivElement>(null)
        
        useEffect(() => {
          if (ref.current && !enterCalled) {
            enterCalled = true
            currentElement = ref.current
            if (options?.onEnter) {
              options.onEnter(ref.current, () => {
                showResolve?.()
              })
            } else {
              showResolve?.()
            }
          }
        }, [])

        return <div ref={ref}>{content}</div>
      }

      root = createRoot(container)
      root.render(<PopupContent />)
    })
  }

  return [show, close] as const
}
