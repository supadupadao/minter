/**
 * Call `fn` function `retryCount` times until success
 * @param fn function that will be called `retryCount` times until success (at least 1 time)
 * @param retryCount retries count
 * @returns function result
 */
export async function retry<R>(fn: () => R, retryCount: number = 10): Promise<R> {
  for (let i = 0; i < retryCount - 1; i++) {
    try {
      return await fn();
    } catch {
      continue;
    }
  }
  return fn();
}
