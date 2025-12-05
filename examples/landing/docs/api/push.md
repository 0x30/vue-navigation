# push

推入新页面到页面栈顶部。

## 签名

```tsx
function push(page: ReactNode | VNode): Promise<void>
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `page` | `ReactNode \| VNode` | 要推入的页面组件 |

## 返回值

`Promise<void>` - 页面进入动画完成后 resolve。

## 示例

### 基础用法

::: code-group

```tsx [Vue]
import { push } from '@0x30/navigation-vue'

// 推入页面
push(<DetailPage />)
```

```tsx [React]
import { push } from '@0x30/navigation-react'

// 推入页面
push(<DetailPage />)
```

:::

### 传递参数

::: code-group

```tsx [Vue]
import { push } from '@0x30/navigation-vue'

push(<DetailPage id={1} name="test" />)
```

```tsx [React]
import { push } from '@0x30/navigation-react'

push(<DetailPage id={1} name="test" />)
```

:::

### 等待动画完成

::: code-group

```tsx [Vue]
import { push } from '@0x30/navigation-vue'

await push(<DetailPage />)
console.log('页面已完全进入')
```

```tsx [React]
import { push } from '@0x30/navigation-react'

await push(<DetailPage />)
console.log('页面已完全进入')
```

:::

### 链式导航

::: code-group

```tsx [Vue]
import { push } from '@0x30/navigation-vue'

async function navigateToCheckout() {
  await push(<CartPage />)
  await push(<AddressPage />)
  await push(<PaymentPage />)
}
```

```tsx [React]
import { push } from '@0x30/navigation-react'

async function navigateToCheckout() {
  await push(<CartPage />)
  await push(<AddressPage />)
  await push(<PaymentPage />)
}
```

:::

## 注意事项

- 推入的页面应该使用 `NavPage`、`Page` 或 `SidePage` 包裹
- 推入页面会触发当前页面的 `onWillDisappear` 和 `onDidDisappear`
- 推入页面会触发新页面的 `onWillAppear` 和 `onDidAppear`
