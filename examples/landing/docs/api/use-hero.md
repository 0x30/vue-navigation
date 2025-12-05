# useHero

创建跨页面共享元素动画（Hero Animation）。

## 签名

```tsx
function useHero(id: string, options?: UseHeroOptions): UseHeroResult

interface UseHeroOptions {
  onEnter?: HeroEnterHandler
  onLeave?: HeroLeaveHandler
}

interface UseHeroResult {
  heroRef: Ref<HTMLElement | null>  // Vue
  // 或
  heroRef: RefObject<HTMLElement>   // React
  onEnter: (handler: HeroEnterHandler) => void
  onLeave: (handler: HeroLeaveHandler) => void
}
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | Hero 元素的唯一标识 |
| `options` | `UseHeroOptions` | 可选配置 |

## 示例

### 基础用法

::: code-group

```tsx [Vue]
import { defineComponent } from 'vue'
import { useHero, push, NavPage } from '@0x30/navigation-vue'

// 列表页
const ListPage = defineComponent({
  setup() {
    const { heroRef } = useHero('avatar-1')
    
    return () => (
      <NavPage>
        <img 
          ref={heroRef} 
          src="/avatar.jpg"
          onClick={() => push(<DetailPage />)}
        />
      </NavPage>
    )
  }
})

// 详情页
const DetailPage = defineComponent({
  setup() {
    const { heroRef } = useHero('avatar-1')
    
    return () => (
      <NavPage>
        <img ref={heroRef} src="/avatar.jpg" />
      </NavPage>
    )
  }
})
```

```tsx [React]
import { useHero, push, NavPage } from '@0x30/navigation-react'

// 列表页
function ListPage() {
  const { heroRef } = useHero('avatar-1')
  
  return (
    <NavPage>
      <img 
        ref={heroRef} 
        src="/avatar.jpg"
        onClick={() => push(<DetailPage />)}
      />
    </NavPage>
  )
}

// 详情页
function DetailPage() {
  const { heroRef } = useHero('avatar-1')
  
  return (
    <NavPage>
      <img ref={heroRef} src="/avatar.jpg" />
    </NavPage>
  )
}
```

:::

### 自定义动画

::: code-group

```tsx [Vue]
import { defineComponent } from 'vue'
import { useHero, NavPage } from '@0x30/navigation-vue'
import { animate } from 'animejs'

export default defineComponent({
  setup() {
    const { heroRef, onEnter, onLeave } = useHero('product-image')
    
    onEnter(({ el, from, to, done }) => {
      animate(el, {
        left: [from.left, to.left],
        top: [from.top, to.top],
        width: [from.width, to.width],
        height: [from.height, to.height],
        borderRadius: [0, 12],
        duration: 400,
        ease: 'outExpo',
        onComplete: done
      })
    })
    
    onLeave(({ el, from, to, done }) => {
      animate(el, {
        left: [from.left, to.left],
        top: [from.top, to.top],
        width: [from.width, to.width],
        height: [from.height, to.height],
        duration: 300,
        ease: 'inOutQuad',
        onComplete: done
      })
    })

    return () => (
      <NavPage>
        <img ref={heroRef} src="/product.jpg" />
      </NavPage>
    )
  }
})
```

```tsx [React]
import { useHero, NavPage } from '@0x30/navigation-react'
import { animate } from 'animejs'

function DetailPage() {
  const { heroRef, onEnter, onLeave } = useHero('product-image')
  
  onEnter(({ el, from, to, done }) => {
    animate(el, {
      left: [from.left, to.left],
      top: [from.top, to.top],
      width: [from.width, to.width],
      height: [from.height, to.height],
      borderRadius: [0, 12],
      duration: 400,
      ease: 'outExpo',
      onComplete: done
    })
  })
  
  onLeave(({ el, from, to, done }) => {
    animate(el, {
      left: [from.left, to.left],
      top: [from.top, to.top],
      width: [from.width, to.width],
      height: [from.height, to.height],
      duration: 300,
      ease: 'inOutQuad',
      onComplete: done
    })
  })

  return (
    <NavPage>
      <img ref={heroRef} src="/product.jpg" />
    </NavPage>
  )
}
```

:::

### 动态 ID

::: code-group

```tsx [Vue]
import { defineComponent } from 'vue'
import { useHero, push } from '@0x30/navigation-vue'

export default defineComponent({
  props: ['product'],
  setup(props) {
    const { heroRef } = useHero(`product-${props.product.id}`)
    
    return () => (
      <div onClick={() => push(<ProductDetail id={props.product.id} />)}>
        <img ref={heroRef} src={props.product.image} />
        <span>{props.product.name}</span>
      </div>
    )
  }
})
```

```tsx [React]
import { useHero, push } from '@0x30/navigation-react'

function ProductItem({ product }: { product: Product }) {
  const { heroRef } = useHero(`product-${product.id}`)
  
  return (
    <div onClick={() => push(<ProductDetail id={product.id} />)}>
      <img ref={heroRef} src={product.image} />
      <span>{product.name}</span>
    </div>
  )
}
```

:::
```

## HeroAnimationContext

```tsx
interface HeroAnimationContext {
  el: HTMLElement       // Hero 元素（已设为 position: fixed）
  from: HeroTransform   // 源位置和大小
  to: HeroTransform     // 目标位置和大小
  done: () => void      // 动画完成回调
}

interface HeroTransform {
  left: number   // 距离视口左边的距离
  top: number    // 距离视口顶部的距离
  width: number  // 元素宽度
  height: number // 元素高度
}
```

## 工作原理

1. 页面 A 中有 `useHero('item-1')` 绑定的元素
2. push 到页面 B，B 中也有 `useHero('item-1')` 绑定的元素
3. 系统记录 A 中元素的位置和大小
4. 创建一个 fixed 定位的克隆元素
5. 将克隆元素从 A 的位置动画到 B 的位置
6. 动画完成后移除克隆元素，显示 B 中的真实元素

## 注意事项

- 两个页面必须使用相同的 `id`
- 元素类型建议保持一致（如都是 `<img>`）
- `done` 必须在动画完成后调用
- Hero 动画期间，原始元素会被隐藏
