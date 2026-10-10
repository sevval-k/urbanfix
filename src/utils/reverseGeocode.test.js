import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// reverseGeocode keeps a cache and a request queue at module level. Loading
// a fresh copy for every test keeps the tests independent of each other.
let reverseGeocode

function respondWith(body, { ok = true, status = 200 } = {}) {
  fetch.mockResolvedValueOnce({ ok, status, json: async () => body })
}

beforeEach(async () => {
  vi.resetModules()
  vi.stubGlobal('fetch', vi.fn())
  ;({ reverseGeocode } = await import('./reverseGeocode.js'))
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('reverseGeocode', () => {
  it('builds a short address from street, area, and city', async () => {
    respondWith({
      display_name: 'Full display name',
      address: { road: 'Main St', suburb: 'Kadikoy', city: 'Istanbul' },
    })
    const result = await reverseGeocode(41.0082, 28.9784)
    expect(result).toEqual({ short: 'Main St, Kadikoy, Istanbul', full: 'Full display name' })
  })

  it('removes duplicate parts, such as a suburb named like the city', async () => {
    respondWith({
      display_name: 'Full',
      address: { road: 'Main St', suburb: 'Besiktas', city: 'Besiktas' },
    })
    expect((await reverseGeocode(41.04, 29.0)).short).toBe('Main St, Besiktas')
  })

  it('falls back to the full name when there are no address parts', async () => {
    respondWith({ display_name: 'Somewhere, Turkey', address: {} })
    expect((await reverseGeocode(41.05, 29.0)).short).toBe('Somewhere, Turkey')
  })

  it('sends the coordinates in the request', async () => {
    respondWith({ display_name: 'X', address: { road: 'R' } })
    await reverseGeocode(41.0082, 28.9784)
    const url = fetch.mock.calls[0][0]
    expect(url).toContain('lat=41.008200')
    expect(url).toContain('lon=28.978400')
  })

  it('answers a repeat lookup of the same spot from the cache', async () => {
    respondWith({ display_name: 'X', address: { road: 'R' } })
    await reverseGeocode(41.0082, 28.9784)
    await reverseGeocode(41.0082, 28.9784)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('explains when nothing was found', async () => {
    respondWith({ error: 'Unable to geocode' })
    await expect(reverseGeocode(0, 0)).rejects.toThrow(/No address was found/)
  })

  it('explains a rate-limit response', async () => {
    respondWith({}, { ok: false, status: 429 })
    await expect(reverseGeocode(41.1, 29.1)).rejects.toThrow(/Too many/)
  })

  it('explains a network failure without exposing technical details', async () => {
    fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await expect(reverseGeocode(41.2, 29.2)).rejects.toThrow(/could not be reached/)
  })

  it('does not cache failures', async () => {
    fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await expect(reverseGeocode(41.3, 29.3)).rejects.toThrow()
    respondWith({ display_name: 'X', address: { road: 'R' } })
    await expect(reverseGeocode(41.3, 29.3)).resolves.toBeDefined()
  })

  it('starts requests at least 1.1 seconds apart', async () => {
    vi.useFakeTimers()
    respondWith({ display_name: 'A', address: { road: 'A' } })
    respondWith({ display_name: 'B', address: { road: 'B' } })

    const first = reverseGeocode(41.0, 29.0)
    const second = reverseGeocode(41.5, 29.5)

    await vi.advanceTimersByTimeAsync(500)
    expect(fetch).toHaveBeenCalledTimes(1) // the second one is still waiting
    await vi.advanceTimersByTimeAsync(700)
    expect(fetch).toHaveBeenCalledTimes(2)

    await Promise.all([first, second])
  })
})