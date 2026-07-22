export function fakeApi<T>(
  result: T,
  opts?: { delayMs?: number; failRate?: number },
): Promise<T> {
  const delayMs = opts?.delayMs ?? 300
  const failRate = opts?.failRate ?? 0.1

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new Error('fakeApi: simulated failure'))
        return
      }
      resolve(result)
    }, delayMs)
  })
}
