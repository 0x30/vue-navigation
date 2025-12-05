/**
 * 等待指定时间
 * @param time 等待时间（毫秒）
 */
export const wait = (time: number) => {
  if (time === 0) return Promise.resolve()
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, time)
  })
}
