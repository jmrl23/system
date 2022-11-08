import { Cache } from 'memory-cache'

export const cache = new Cache<string, unknown>()

/**
 * It returns a cached value if it exists, otherwise it returns the result of the refresh function and
 * caches it
 * @param {string} key - The key to store the data under.
 * @param refresh - This is the function that will be called if the key is not found in the cache.
 * @param {number} [ttl] - Time to live in milliseconds.
 * @param [timeoutCallback] - A callback function that will be called when the cache expires.
 * @returns The value of the key in the cache.
 */
export async function cached(
  key: string,
  refresh: () => Promise<unknown> | unknown,
  ttl?: number,
  timeoutCallback?: (key: string, value: unknown) => void
) {
  try {
    const cachedData = await cache.get(key)
    if (cachedData) return cachedData
    const value = await refresh()
    await cache.put(key, value, ttl, timeoutCallback)
    return value
  } catch (error) {
    if (error instanceof Error) throw error
  }
}
