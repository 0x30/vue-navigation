# blackBoxBack

静默返回多层页面，中间页面不会触发动画和生命周期。

## 签名

```tsx
function blackBoxBack(count: number): Promise<void>
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `count` | `number` | 要静默返回的层数 |

## 返回值

`Promise<void>` - 返回完成后 resolve。

## 示例

### 基础用法

```tsx
import { blackBoxBack } from '@0x30/navigation-vue'

// 页面栈：A -> B -> C -> D（当前）
blackBoxBack(2)
// 结果：A -> B（C 和 D 被静默移除）
```

### 多步骤流程

```tsx
// 表单流程：首页 -> 步骤1 -> 步骤2 -> 步骤3 -> 完成页
// 完成后直接返回首页

function CompletePage() {
  const goHome = () => {
    blackBoxBack(4)  // 跳过中间所有步骤
  }

  return (
    <NavPage>
      <h1>提交成功！</h1>
      <button onClick={goHome}>返回首页</button>
    </NavPage>
  )
}
```

## 与 back 的区别

| 特性 | back | blackBoxBack |
|------|------|--------------|
| 返回层数 | 1 层 | 指定层数 |
| 中间页面动画 | 有 | 无 |
| 中间页面生命周期 | 触发 | 不触发 |
| 视觉效果 | 逐页返回 | 直接跳转 |

## 注意事项

- 中间页面的 `onWillDisappear` 和 `onDidDisappear` 不会被触发
- 只有最终目标页面的 `onWillAppear` 和 `onDidAppear` 会被触发
- 如果 count 大于当前栈深度-1，会返回到首页
