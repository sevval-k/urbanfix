const ENDPOINT = 'https://nominatim.openstreetmap.org/reverse'
const MIN_INTERVAL_MS = 1100
const TIMEOUT_MS = 8000

class GeocodeError extends Error {}

const GENERIC_MESSAGE =
  'The address service could not be reached. This is optional, and your coordinates are unaffected.'

const cache = new Map()

let lastStart = 0
let chain = Promise.resolve()

function waitForTurn() {
  const turn = chain.then(async () => {
    const wait = lastStart + MIN_INTERVAL_MS - Date.now()
    if (wait > 0) {
      await new Promise((resolve) => setTimeout(resolve, wait))
    }
    lastStart = Date.now()
  })

  chain = turn
  return turn
}

function formatAddress(data) {
  const a = data.address ?? {}
  const street = a.road ?? a.pedestrian ?? a.footway ?? a.path
  const area = a.neighbourhood ?? a.suburb ?? a.quarter ?? a.city_district
  const city = a.city ?? a.town ?? a.village ?? a.municipality ?? a.county

  const parts = [...new Set([street, area, city].filter(Boolean))]

  return {
    short: parts.length > 0 ? parts.join(', ') : data.display_name,
    full: data.display_name,
  }
}

export async function reverseGeocode(latitude, longitude) {
  const key = `${latitude.toFixed(5)},${longitude.toFixed(5)}`

  if (cache.has(key)) return cache.get(key)

  await waitForTurn()

  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: latitude.toFixed(6),
    lon: longitude.toFixed(6),
    zoom: '18',
    addressdetails: '1',
    'accept-language': 'en',
  })

  let data

  try {
    const response = await fetch(`${ENDPOINT}?${params}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })

    if (response.status === 429) {
      throw new GeocodeError(
        'Too many address lookups. Please wait a moment and try again.',
      )
    }

    if (!response.ok) {
      throw new GeocodeError(GENERIC_MESSAGE)
    }

    data = await response.json()
  } catch (err) {
    throw err instanceof GeocodeError
      ? err
      : new GeocodeError(GENERIC_MESSAGE)
  }

  if (data.error) {
    throw new GeocodeError('No address was found for this spot.')
  }

  const result = formatAddress(data)
  cache.set(key, result)

  return result
}