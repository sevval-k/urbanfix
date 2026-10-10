import { describe, expect, it } from 'vitest'
import { CATEGORY_COLORS } from './constants'
import {
  getIssueColor,
  getLegendItems,
  getMarkerZIndex,
  hasValidCoordinates,
} from './mapHelpers'
import { makeIssue } from '../test/makeIssue'

describe('hasValidCoordinates', () => {
  it('accepts normal coordinates, including the extremes', () => {
    expect(hasValidCoordinates(makeIssue())).toBe(true)
    expect(hasValidCoordinates(makeIssue({ latitude: -90, longitude: 180 }))).toBe(true)
  })

  it.each([
    ['NaN', { latitude: NaN }],
    ['text', { latitude: '41.0' }],
    ['null', { longitude: null }],
    ['undefined', { longitude: undefined }],
    ['latitude above 90', { latitude: 91 }],
    ['longitude below -180', { longitude: -181 }],
  ])('rejects %s', (_label, changes) => {
    expect(hasValidCoordinates(makeIssue(changes))).toBe(false)
  })
})

describe('getIssueColor', () => {
  it('uses the palette of the chosen mode', () => {
    expect(getIssueColor(makeIssue({ category: 'Pothole' }), 'category')).toBe(
      CATEGORY_COLORS.Pothole,
    )
    expect(getIssueColor(makeIssue({ priority: 'High' }), 'priority')).toBe('#dc2626')
  })

  it('falls back to grey for an unknown value', () => {
    expect(getIssueColor(makeIssue({ category: 'Banana' }), 'category')).toBe('#64748b')
  })
})

describe('getLegendItems', () => {
  it('lists every possible value for each mode', () => {
    expect(getLegendItems('category')).toHaveLength(5)
    expect(getLegendItems('priority')).toHaveLength(3)
    expect(getLegendItems('status')).toHaveLength(4)
  })
})

describe('getMarkerZIndex', () => {
  it('draws higher priority on top', () => {
    const z = (priority) => getMarkerZIndex(makeIssue({ priority }))
    expect(z('High')).toBeGreaterThan(z('Medium'))
    expect(z('Medium')).toBeGreaterThan(z('Low'))
  })
})