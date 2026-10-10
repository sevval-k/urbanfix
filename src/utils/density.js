// Grid density: count reports per square cell. Pure JavaScript, no imports.
//
// Approximation used: an equirectangular projection around a reference
// latitude, treating the Earth as a sphere (R = 6,371,008.8 m). Good for one
// city, not for continents or areas near the poles.

// Meters in one degree of latitude on a spherical Earth.
export const METERS_PER_DEGREE = 111195

export const CELL_SIZES = [
  { value: 250, label: '250 m' },
  { value: 500, label: '500 m' },
  { value: 1000, label: '1 km' },
  { value: 2000, label: '2 km' },
  { value: 5000, label: '5 km' },
]

// Light to dark (ColorBrewer "OrRd" sequential palette).
export const DENSITY_COLORS = ['#fee8c8', '#fdbb84', '#fc8d59', '#e34a33', '#b30000']

export function buildGrid(issues, cellSizeMeters) {
  if (issues.length === 0) return { cells: [], maxCount: 0 }

  // Rounded to a whole degree so the grid stays stable as data is added.
  const meanLat = issues.reduce((sum, issue) => sum + issue.latitude, 0) / issues.length
  const refLat = Math.round(meanLat)

  // The floor value stops the width from exploding near the poles.
  const cosLat = Math.max(Math.cos((refLat * Math.PI) / 180), 0.05)

  const cellLat = cellSizeMeters / METERS_PER_DEGREE
  const cellLon = cellSizeMeters / (METERS_PER_DEGREE * cosLat)

  // Group issues by cell.
  const groups = new Map()

  for (const issue of issues) {
    const row = Math.floor(issue.latitude / cellLat)
    const col = Math.floor(issue.longitude / cellLon)
    const key = `${col}:${row}`

    const group = groups.get(key)

    if (group) {
      group.issues.push(issue)
    } else {
      groups.set(key, { key, row, col, issues: [issue] })
    }
  }

  const cells = [...groups.values()].map(({ key, row, col, issues: members }) => {
    const south = row * cellLat
    const west = col * cellLon

    return {
      key,
      count: members.length,
      issues: members,
      bounds: {
        south,
        west,
        north: south + cellLat,
        east: west + cellLon,
      },
      center: {
        latitude: south + cellLat / 2,
        longitude: west + cellLon / 2,
      },
    }
  })

  // Busiest cells first.
  cells.sort((a, b) => b.count - a.count || a.key.localeCompare(b.key))

  return { cells, maxCount: cells[0].count }
  
}

export function getCountClasses(maxCount) {
  if (maxCount < 1) return []

  const wanted = Math.min(maxCount, DENSITY_COLORS.length)
  const width = Math.ceil(maxCount / wanted)

  const classes = []

  for (let i = 0; i < wanted; i += 1) {
    const min = i * width + 1

    if (min > maxCount) break

    classes.push({
      min,
      max: Math.min((i + 1) * width, maxCount),
    })
  }

  const last = classes.length - 1

  return classes.map((c, i) => ({
    ...c,
    label: c.min === c.max ? `${c.min}` : `${c.min} to ${c.max}`,
    color: DENSITY_COLORS[
      last === 0
        ? 3
        : Math.round((i * (DENSITY_COLORS.length - 1)) / last)
    ],
  }))
}
export function colorForCount(count, classes) {
  return (
    classes.find((c) => count >= c.min && count <= c.max)?.color ??
    DENSITY_COLORS[0]
  )
}