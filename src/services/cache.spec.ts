import { cache, cached } from './cache'

describe('service: cache', () => {
  it('get or set cached value', async () => {
    expect(
      await cached('test', () => {
        return true
      })
    ).toBe(true)
    expect(
      await cached('test-async', async () => {
        return new Promise((resolve) => resolve(true))
      })
    ).toBe(true)
  })

  it('clear cache', async () => {
    expect(await cache.get('test')).toBe(true)
    cache.clear()
    expect(await cache.get('test')).toBe(null)
  })
})
