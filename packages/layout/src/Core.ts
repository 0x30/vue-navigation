import { cloneVNode, type Slot, type VNodeProps } from 'vue'

export const cloneSlot = (
  slot?: Slot,
  extraProps?: (Record<string, unknown> & VNodeProps) | null,
  mergeRef?: boolean
) => {
  const elements = slot?.()
  if (elements === undefined || elements.length > 1) return undefined
  const element = elements[0]
  return cloneVNode(element, extraProps, mergeRef)
}
