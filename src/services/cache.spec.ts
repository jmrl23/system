import { cache } from './cache'

describe('service: cache', () => {
  it('cache a value', async () => {
    await cache.put('test', true)
    expect(await cache.get('test')).toBe(true)
  })

  it('clear cache', async () => {
    expect(await cache.get('test')).toBe(true)
    cache.clear()
    expect(await cache.get('test')).toBe(null)
  })
})
