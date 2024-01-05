import { type HtmlHTMLAttributes, type FunctionalComponent } from 'vue'
import styles from './index.module.scss'

export const SafeBottomSpace: FunctionalComponent<{
  class?: HtmlHTMLAttributes['class']
  style?: HtmlHTMLAttributes['style']
}> = () => <div class={styles.safeHeightBottom} />

export const SafeTopSpace: FunctionalComponent<{
  class?: HtmlHTMLAttributes['class']
  style?: HtmlHTMLAttributes['style']
}> = () => <div class={styles.safeHeightTop} />

export const SafeLeftSpace: FunctionalComponent<{
  class?: HtmlHTMLAttributes['class']
  style?: HtmlHTMLAttributes['style']
}> = () => <div class={styles.safeHeightLeft} />

export const SafeRightSpace: FunctionalComponent<{
  class?: HtmlHTMLAttributes['class']
  style?: HtmlHTMLAttributes['style']
}> = () => <div class={styles.safeHeightRight} />
