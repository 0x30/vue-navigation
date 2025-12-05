# useQuietPage

将当前页面标记为"安静页面"，不会触发下层页面的生命周期钩子。

## 签名

```tsx
function useQuietPage(): void
```

## 示例

### 基础用法

::: code-group

```tsx [Vue]
import { defineComponent } from 'vue'
import { useQuietPage, SidePage, back } from '@0x30/navigation-vue'

export default defineComponent({
  setup() {
    useQuietPage()
    
    return () => (
      <SidePage position="center" onClickBack={back}>
        <div>弹窗内容</div>
      </SidePage>
    )
  }
})
```

```tsx [React]
import { useQuietPage, SidePage, back } from '@0x30/navigation-react'

function MyModal() {
  useQuietPage()
  
  return (
    <SidePage position="center" onClickBack={back}>
      <div>弹窗内容</div>
    </SidePage>
  )
}
```

:::

## 效果对比

### 不使用 useQuietPage

```
push(Modal):
  A: onWillDisappear ← 会触发
  A: onDidDisappear  ← 会触发
  
back():
  A: onWillAppear    ← 会触发
  A: onDidAppear     ← 会触发
```

### 使用 useQuietPage

```
push(Modal):
  (A 的生命周期不触发)
  
back():
  (A 的生命周期不触发)
```

## 适用场景

- Toast 轻提示
- Loading 加载指示器
- 模态弹窗
- ActionSheet
- Picker 选择器
- 任何临时覆盖层

## 为什么需要 useQuietPage

考虑这个场景：

```tsx
function ListPage() {
  const [data, setData] = useState([])
  
  // 页面显示时加载数据
  onDidAppear(() => {
    fetchData().then(setData)
  })
  
  const showFilter = () => {
    push(<FilterModal />)  // 打开筛选弹窗
  }

  return <NavPage>...</NavPage>
}
```

如果 FilterModal 不使用 useQuietPage：
- 打开弹窗时会触发 ListPage 的 onDidDisappear
- 关闭弹窗时会触发 ListPage 的 onDidAppear
- 导致数据重新加载，这不是我们想要的

使用 useQuietPage 后：
- 打开/关闭弹窗不会触发 ListPage 的任何生命周期
- 数据不会重新加载
- 符合预期行为

## 注意事项

- 必须在组件的 setup/函数体内顶层调用
- 不能在条件语句中调用
- 应该与 SidePage 配合使用
