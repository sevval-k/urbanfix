import { describe, expect, it } from 'vitest'
import {
  buildGrid,
  CELL_SIZES,
  colorForCount,
  DENSITY_COLORS,
  getCountClasses,
  METERS_PER_DEGREE,
} from './density'

const at = (latitude, longitude, id = `${latitude},${longitude}`) => ({ id, latitude, longitude })

const istanbul = [
  at(41.0082, 28.9784, 'p1'),
  at(41.0082, 28.9784, 'p1-twin'), // identical position
  at(41.03, 29.01),
  at(40.9, 29.2),
  at(41.17, 29.05),
]

const sizes = CELL_SIZES.map((size) => size.value)

describe('buildGrid', () => {
  it('returns nothing for no issues', () => {
    expect(buildGrid([], 500)).toEqual({ cells: [], maxCount: 0 })
  })

  it.each(sizes)('never loses or double-counts a report at %i m', (size) => {
    const { cells, maxCount } = buildGrid(istanbul, size)
    expect(cells.reduce((sum, cell) => sum + cell.count, 0)).toBe(istanbul.length)
    expect(cells[0].count).toBe(maxCount) // sorted busiest first
  })

  it.each(sizes)('puts every report inside the bounds of its own cell at %i m', (size) => {
    for (const cell of buildGrid(istanbul, size).cells) {
      for (const issue of cell.issues) {
        expect(issue.latitude).toBeGreaterThanOrEqual(cell.bounds.south)
        expect(issue.latitude).toBeLessThanOrEqual(cell.bounds.north)
        expect(issue.longitude).toBeGreaterThanOrEqual(cell.bounds.west)
        expect(issue.longitude).toBeLessThanOrEqual(cell.bounds.east)
      }
    }
  })

  it('keeps identical positions in one cell', () => {
    const { cells } = buildGrid(istanbul, 250)
    expect(cells).toHaveLength(4)
    expect(cells[0].count).toBe(2)
  })

  it('makes cells that are square in meters, not in degrees', () => {
    const { bounds } = buildGrid(istanbul, 1000).cells[0]
    const heightMeters = (bounds.north - bounds.south) * METERS_PER_DEGREE
    const cosLat = Math.cos((41 * Math.PI) / 180) // reference latitude: 41
    const widthMeters = (bounds.east - bounds.west) * METERS_PER_DEGREE * cosLat
    expect(heightMeters).toBeCloseTo(1000, 4)
    expect(widthMeters).toBeCloseTo(1000, 4)
  })

  it('works in the southern and western hemispheres', () => {
    const capeTown = [at(-33.9, 18.4), at(-33.95, 18.45), at(-33.9, 18.4, 'twin')]
    const { cells } = buildGrid(capeTown, 1000)
    expect(cells.reduce((sum, cell) => sum + cell.count, 0)).toBe(3)
    for (const cell of cells) {
      for (const issue of cell.issues) {
        expect(issue.latitude).toBeGreaterThanOrEqual(cell.bounds.south)
        expect(issue.latitude).toBeLessThanOrEqual(cell.bounds.north)
        expect(issue.longitude).toBeGreaterThanOrEqual(cell.bounds.west)
        expect(issue.longitude).toBeLessThanOrEqual(cell.bounds.east)
      }
    }
  })

  it('keeps an existing report in the same cell when a nearby report is added', () => {
    const keyOf = (grid, id) =>
      grid.cells.find((cell) => cell.issues.some((issue) => issue.id === id)).key
    const alone = buildGrid([at(41.0082, 28.9784, 'p1')], 1000)
    const withMore = buildGrid([at(41.0082, 28.9784, 'p1'), at(41.03, 29.01, 'p2')], 1000)
    expect(keyOf(withMore, 'p1')).toBe(keyOf(alone, 'p1'))
  })
})

describe('getCountClasses', () => {
  it('returns no classes when there is nothing to classify', () => {
    expect(getCountClasses(0)).toEqual([])
  })

  it('gives each count its own class when there are 5 or fewer', () => {
    expect(getCountClasses(1).map((c) => c.label)).toEqual(['1'])
    expect(getCountClasses(5).map((c) => c.label)).toEqual(['1', '2', '3', '4', '5'])
  })

  it('uses equal-width integer classes beyond that', () => {
    expect(getCountClasses(6).map((c) => c.label)).toEqual(['1 to 2', '3 to 4', '5 to 6'])
    expect(getCountClasses(20).map((c) => c.label)).toEqual([
      '1 to 4', '5 to 8', '9 to 12', '13 to 16', '17 to 20',
    ])
  })

  it('covers every count from 1 to the maximum exactly once', () => {
    for (let max = 1; max <= 40; max += 1) {
      const covered = getCountClasses(max).flatMap((c) =>
        Array.from({ length: c.max - c.min + 1 }, (_, i) => c.min + i),
      )
      expect(covered).toEqual(Array.from({ length: max }, (_, i) => i + 1))
    }
  })

  it('spans the whole palette when there are 5 classes', () => {
    const colors = getCountClasses(5).map((c) => c.color)
    expect(colors).toEqual(DENSITY_COLORS)
  })
})

describe('colorForCount', () => {
  const classes = getCountClasses(6)

  it('returns the color of the class containing the count', () => {
    expect(colorForCount(1, classes)).toBe(classes[0].color)
    expect(colorForCount(4, classes)).toBe(classes[1].color)
    expect(colorForCount(6, classes)).toBe(classes[2].color)
  })

  it('falls back to the lightest color for a count outside every class', () => {
    expect(colorForCount(99, classes)).toBe(DENSITY_COLORS[0])
  })
})