# Hero 动画

Hero 动画是一种跨页面元素共享的过渡效果，让两个页面之间的相同元素平滑过渡。

## 基础使用

::: code-group

```tsx [Vue]
import { defineComponent } from 'vue'
import { useHero, push, NavPage } from '@0x30/navigation-vue'

// 列表页
const ListPage = defineComponent({
  setup() {
    const { heroRef } = useHero('item-1')
    
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
    const { heroRef } = useHero('item-1')
    
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
  const { heroRef } = useHero('item-1')
  
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
  const { heroRef } = useHero('item-1')
  
  return (
    <NavPage>
      <img ref={heroRef} src="/avatar.jpg" />
    </NavPage>
  )
}
```

:::

## useHero API

```tsx
const {
  heroRef,      // 绑定到元素的 ref
  onEnter,      // 自定义进入动画
  onLeave,      // 自定义退出动画
} = useHero(id, options?)
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | Hero 元素的唯一标识，两个页面需要使用相同的 id |
| `options` | `UseHeroOptions` | 可选配置 |

### Options

```tsx
interface UseHeroOptions {
  onEnter?: HeroEnterHandler  // 自定义进入动画
  onLeave?: HeroLeaveHandler  // 自定义退出动画
}
```

## 自定义动画

::: code-group

```tsx [Vue]
import { defineComponent } from 'vue'
import { useHero, NavPage } from '@0x30/navigation-vue'
import { animate } from 'animejs'

const DetailPage = defineComponent({
  setup() {
    const { heroRef, onEnter, onLeave } = useHero('avatar')
    
    onEnter((ctx) => {
      const { el, from, to, done } = ctx
      animate(el, {
        left: [from.left, to.left],
        top: [from.top, to.top],
        width: [from.width, to.width],
        height: [from.height, to.height],
        duration: 400,
        ease: 'outExpo',
        onComplete: done
      })
    })
    
    onLeave((ctx) => {
      const { el, from, to, done } = ctx
      animate(el, {
        left: [from.left, to.left],
        top: [from.top, to.top],
        width: [from.width, to.width],
        height: [from.height, to.height],
        duration: 300,
        onComplete: done
      })
    })

    return () => (
      <NavPage>
        <img ref={heroRef} src="/avatar.jpg" />
      </NavPage>
    )
  }
})
```

```tsx [React]
import { useHero, NavPage } from '@0x30/navigation-react'
import { animate } from 'animejs'

function DetailPage() {
  const { heroRef, onEnter, onLeave } = useHero('avatar')
  
  onEnter((ctx) => {
    const { el, from, to, done } = ctx
    animate(el, {
      left: [from.left, to.left],
      top: [from.top, to.top],
      width: [from.width, to.width],
      height: [from.height, to.height],
      duration: 400,
      ease: 'outExpo',
      onComplete: done
    })
  })
  
  onLeave((ctx) => {
    const { el, from, to, done } = ctx
    animate(el, {
      left: [from.left, to.left],
      top: [from.top, to.top],
      width: [from.width, to.width],
      height: [from.height, to.height],
      duration: 300,
      onComplete: done
    })
  })

  return (
    <NavPage>
      <img ref={heroRef} src="/avatar.jpg" />
    </NavPage>
  )
}
```

:::
```

## HeroAnimationContext

动画回调接收的上下文对象：

```tsx
interface HeroAnimationContext {
  el: HTMLElement       // Hero 元素
  from: HeroTransform   // 源位置/大小
  to: HeroTransform     // 目标位置/大小
  done: () => void      // 完成回调
}

interface HeroTransform {
  left: number
  top: number
  width: number
  height: number
}
```

## 最佳实践

### 1. 确保相同 ID

两个页面的 Hero 元素必须使用相同的 ID：

```tsx
// ✅ 正确
useHero('product-123')  // 页面 A
useHero('product-123')  // 页面 B

// ❌ 错误
useHero('product-a')    // 页面 A
useHero('product-b')    // 页面 B
```

### 2. 元素类型一致

建议两个页面的 Hero 元素使用相同的元素类型：

```tsx
// ✅ 推荐
<img ref={heroRef} />  // 页面 A
<img ref={heroRef} />  // 页面 B

// ⚠️ 可行但效果可能不理想
<img ref={heroRef} />  // 页面 A
<div ref={heroRef} />  // 页面 B
```

### 3. 动态 ID

对于列表项，使用动态 ID：

```tsx
function ListItem({ item }) {
  const { heroRef } = useHero(`item-${item.id}`)
  
  return <img ref={heroRef} src={item.image} />
}
```
