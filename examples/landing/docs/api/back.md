# back

返回上一页。

## 签名

```tsx
function back(): Promise<void>
```

## 返回值

`Promise<void>` - 页面退出动画完成后 resolve。

## 示例

### 基础用法

::: code-group

```tsx [Vue]
import { back } from '@0x30/navigation-vue'

// 返回上一页
back()
```

```tsx [React]
import { back } from '@0x30/navigation-react'

// 返回上一页
back()
```

:::

### 在按钮中使用

```tsx
<button onClick={() => back()}>返回</button>
```

### 等待返回完成

::: code-group

```tsx [Vue]
import { back } from '@0x30/navigation-vue'

await back()
console.log('已返回上一页')
```

```tsx [React]
import { back } from '@0x30/navigation-react'

await back()
console.log('已返回上一页')
```

:::

### 配合 useLeaveBefore

::: code-group

```tsx [Vue]
import { useLeaveBefore } from '@0x30/navigation-vue'

useLeaveBefore(() => {
  // 返回 false 可以阻止 back
  return confirm('确定要离开吗？')
})
```

```tsx [React]
import { useLeaveBefore } from '@0x30/navigation-react'

useLeaveBefore(() => {
  // 返回 false 可以阻止 back
  return confirm('确定要离开吗？')
})
```

:::

## 注意事项

- 如果当前是首页（栈中只有一个页面），调用 back 无效
- 返回会触发当前页面的 `onWillDisappear` 和 `onDidDisappear`
- 返回会触发上一页的 `onWillAppear` 和 `onDidAppear`
- 可以通过 `useLeaveBefore` 拦截返回操作
