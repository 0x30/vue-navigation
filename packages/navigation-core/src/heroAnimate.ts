/**
 * Hero 动画配置
 */
export interface HeroConfig {
  /** 当前页面根元素 */
  root: Element | null
  /** 目标页面根元素（用于查找配对的 Hero 元素） */
  target: Element | null | undefined
  /** Hero ID，用于匹配 data-hero-{id} 属性 */
  id: string
}

/**
 * Hero 动画变换参数
 */
export interface HeroTransform {
  scaleX: number
  scaleY: number
  translateX: number
  translateY: number
}

/**
 * 进入动画参数
 */
export interface HeroEnterParams {
  translateX: [number, number]
  translateY: [number, number]
  scaleX: [number, number]
  scaleY: [number, number]
}

/**
 * 离开动画参数
 */
export interface HeroLeaveParams {
  translateX: number
  translateY: number
  scaleX: number
  scaleY: number
}

/**
 * Hero 动画对象
 */
export interface HeroAnimate {
  /** 当前页面的 Hero 元素 */
  hero: Element | null
  /** 目标页面的配对 Hero 元素 */
  targetHero: Element | null
  /** 变换参数（如果两个 Hero 都存在） */
  transform: HeroTransform | null
  /** 是否找到了配对的 Hero 元素 */
  matched: boolean
  /**
   * 获取进入动画参数
   * Hero 从目标位置动画到当前位置
   * 返回 any 以兼容 animejs 的 AnimationParams 类型
   */
  getEnterParams: () => any
  /**
   * 获取离开动画参数
   * Hero 从当前位置动画到目标位置
   * 返回 any 以兼容 animejs 的 AnimationParams 类型
   */
  getLeaveParams: () => any
}

/**
 * 计算 Hero 动画的变换参数
 */
const calculateTransform = (fromRect: DOMRect, toRect: DOMRect): HeroTransform => {
  const scaleX = fromRect.width / toRect.width
  const scaleY = fromRect.height / toRect.height
  const translateX = fromRect.left - toRect.left + (fromRect.width - toRect.width) / 2
  const translateY = fromRect.top - toRect.top + (fromRect.height - toRect.height) / 2
  return { scaleX, scaleY, translateX, translateY }
}

/**
 * 获取 Hero 动画对象
 * 
 * @example
 * ```tsx
 * // 在 SidePage 的 onEnter 中使用
 * const handleEnter = (ctx: SidePageAnimationContext) => {
 *   const hero = getHeroAnimate({
 *     root: ctx.mainElement,
 *     target: ctx.from,
 *     id: 'image'
 *   })
 *   
 *   // 背景动画
 *   ctx.timeline.add(ctx.backElement!, { opacity: [0, 1] })
 *   
 *   // Hero 动画
 *   if (hero.matched) {
 *     ctx.timeline.add(hero.hero!, hero.getEnterParams()!, 0)
 *   }
 * }
 * ```
 */
export const getHeroAnimate = (config: HeroConfig): HeroAnimate => {
  const { root, target, id } = config
  const selector = `[data-hero-${id}]`
  
  const hero = root?.querySelector(selector) ?? null
  const targetHero = target?.querySelector(selector) ?? null
  
  let transform: HeroTransform | null = null
  const matched = !!(hero && targetHero)
  
  if (matched) {
    const heroRect = hero!.getBoundingClientRect()
    const targetRect = targetHero!.getBoundingClientRect()
    transform = calculateTransform(targetRect, heroRect)
  }
  
  return {
    hero,
    targetHero,
    transform,
    matched,
    
    getEnterParams(): any {
      if (!transform) return null
      return {
        translateX: [transform.translateX, 0],
        translateY: [transform.translateY, 0],
        scaleX: [transform.scaleX, 1],
        scaleY: [transform.scaleY, 1],
      }
    },
    
    getLeaveParams(): any {
      if (!transform) return null
      return {
        translateX: transform.translateX,
        translateY: transform.translateY,
        scaleX: transform.scaleX,
        scaleY: transform.scaleY,
      }
    },
  }
}
