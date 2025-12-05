# 导航

Navigation 提供了一套完整的导航 API，用于管理页面栈。

## push

推入新页面到栈顶。

::: code-group

```tsx [Vue]
import { push } from '@0x30/navigation-vue'

// 基础用法
push(<DetailPage />)

// 传递参数
push(<DetailPage id={1} name="test" />)

// 等待页面进入完成
await push(<DetailPage />)
```

```tsx [React]
import { push } from '@0x30/navigation-react'

// 基础用法
push(<DetailPage />)

// 传递参数
push(<DetailPage id={1} name="test" />)

// 等待页面进入完成
await push(<DetailPage />)
```

:::

## back

返回上一页。

::: code-group

```tsx [Vue]
import { back } from '@0x30/navigation-vue'

// 返回上一页
back()

// 等待返回完成
await back()
```

```tsx [React]
import { back } from '@0x30/navigation-react'

// 返回上一页
back()

// 等待返回完成
await back()
```

:::

## replace

替换当前页面。

::: code-group

```tsx [Vue]
import { replace } from '@0x30/navigation-vue'

// 替换为新页面
replace(<NewPage />)
```

```tsx [React]
import { replace } from '@0x30/navigation-react'

// 替换为新页面
replace(<NewPage />)
```

:::

## blackBoxBack

静默返回多层页面，中间页面不会触发动画和生命周期。

::: code-group

```tsx [Vue]
import { blackBoxBack } from '@0x30/navigation-vue'

// 静默返回 2 层
// 页面栈：A -> B -> C -> D
// 执行后：A -> B（C 和 D 被静默移除）
blackBoxBack(2)
```

```tsx [React]
import { blackBoxBack } from '@0x30/navigation-react'

// 静默返回 2 层
// 页面栈：A -> B -> C -> D
// 执行后：A -> B（C 和 D 被静默移除）
blackBoxBack(2)
```

:::

适用场景：
- 多步骤流程完成后直接返回首页
- 跳过中间过渡页面

## backToHome

返回到首页，清除中间所有页面。

::: code-group

```tsx [Vue]
import { backToHome } from '@0x30/navigation-vue'

// 返回首页
backToHome()
```

```tsx [React]
import { backToHome } from '@0x30/navigation-react'

// 返回首页
backToHome()
```

:::

## goBack

返回指定层数。

::: code-group

```tsx [Vue]
import { goBack } from '@0x30/navigation-vue'

// 返回 2 层
goBack(2)
```

```tsx [React]
import { goBack } from '@0x30/navigation-react'

// 返回 2 层
goBack(2)
```

:::

## to

导航到指定路径（URL 路径）。

::: code-group

```tsx [Vue]
import { to } from '@0x30/navigation-vue'

// 导航到指定路径
to('/user/123')
```

```tsx [React]
import { to } from '@0x30/navigation-react'

// 导航到指定路径
to('/user/123')
```

:::

## Navigator 组件

应用的根导航容器。

```tsx
import { Navigator } from '@0x30/navigation-vue'

<Navigator 
  homePage={<HomePage />}
  onMounted={() => console.log('导航已挂载')}
/>
```

### Props

| 属性 | 类型 | 说明 |
|------|------|------|
| `homePage` | `ReactNode / VNode` | 首页组件 |
| `onMounted` | `() => void` | 导航挂载完成回调 |
