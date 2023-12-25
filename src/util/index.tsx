import {
  onDidAppear,
  onDidDisappear,
  onWillAppear,
  onWillDisappear,
} from '@0x30/vue-navigation'

const useHooks = (title: string) => {
  onWillAppear(() => {
    console.log(title, '即将展示')
  })

  onWillDisappear(() => {
    console.log(title, '即将消失')
  })

  onDidAppear(() => {
    console.log(title, '展示')
  })

  onDidDisappear(() => {
    console.log(title, '消失')
  })
}

const wait = (timeout: number = 1000) =>
  new Promise<void>((res) => {
    window.setTimeout(res, timeout)
  })

export { useHooks, wait }
