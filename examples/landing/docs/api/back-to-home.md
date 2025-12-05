# backToHome

返回到首页，清除中间所有页面。

## 签名

```tsx
function backToHome(): Promise<void>
```

## 返回值

`Promise<void>` - 返回完成后 resolve。

## 示例

### 基础用法

```tsx
import { backToHome } from '@0x30/navigation-vue'

// 无论当前在哪一层，都返回首页
backToHome()
```

### 退出登录

```tsx
async function logout() {
  await api.logout()
  backToHome()
}
```

### 深层页面返回

```tsx
// 页面栈：首页 -> 分类 -> 商品列表 -> 商品详情 -> 购物车 -> 结算
// 执行 backToHome() 后直接回到首页

function SettlePage() {
  const handleComplete = () => {
    showToast('支付成功')
    backToHome()
  }

  return (
    <NavPage>
      <button onClick={handleComplete}>完成支付</button>
    </NavPage>
  )
}
```

## 注意事项

- 相当于 `blackBoxBack(栈深度 - 1)`
- 中间页面不会触发生命周期
- 首页的 `onWillAppear` 和 `onDidAppear` 会被触发
