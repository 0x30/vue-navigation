# replace

替换当前页面。

## 签名

```tsx
function replace(page: ReactNode | VNode): Promise<void>
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `page` | `ReactNode \| VNode` | 替换后的页面组件 |

## 返回值

`Promise<void>` - 替换完成后 resolve。

## 示例

### 基础用法

::: code-group

```tsx [Vue]
import { replace } from '@0x30/navigation-vue'

// 替换当前页面
replace(<NewPage />)
```

```tsx [React]
import { replace } from '@0x30/navigation-react'

// 替换当前页面
replace(<NewPage />)
```

:::

### 登录后替换

::: code-group

```tsx [Vue]
import { replace } from '@0x30/navigation-vue'

async function onLoginSuccess() {
  // 登录成功后替换为首页，用户无法返回登录页
  replace(<HomePage />)
}
```

```tsx [React]
import { replace } from '@0x30/navigation-react'

async function onLoginSuccess() {
  // 登录成功后替换为首页，用户无法返回登录页
  replace(<HomePage />)
}
```

:::

### 引导页完成后

::: code-group

```tsx [Vue]
import { replace } from '@0x30/navigation-vue'

function onOnboardingComplete() {
  replace(<MainPage />)
}
```

```tsx [React]
import { replace } from '@0x30/navigation-react'

function onOnboardingComplete() {
  replace(<MainPage />)
}
```

:::
```

## 注意事项

- replace 不会增加页面栈，而是替换栈顶页面
- 替换后无法通过 back 返回到被替换的页面
- 适用于登录、引导页等场景
