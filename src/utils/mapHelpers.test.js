import { describe, expect, it } from 'vitest'
import { CATEGORY_COLORS, PRIORITY_COLORS, STATUS_COLORS } from './constants'
import {
  getIssueColor,
  getLegendItems,
  getLegendWithCounts,
  getMarkerStyle,
  getMarkerZIndex,
  hasValidCoordinates,
  RESOLVED_COLOR,
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
    expect(getIssueColor(makeIssue({ priority: 'High' }), 'priority')).toBe('#ef4444')
  })

  it('falls back to grey for an unknown value', () => {
    expect(getIssueColor(makeIssue({ category: 'Banana' }), 'category')).toBe('#64748b')
  })
})

describe('getMarkerStyle', () => {
  it('uses the priority color for open issues', () => {
    expect(getMarkerStyle(makeIssue({ priority: 'High' }), 'priority')).toEqual({
      color: PRIORITY_COLORS.High,
      resolved: false,
    })
  })

  it('gives resolved issues the muted style in Priority mode', () => {
    expect(getMarkerStyle(makeIssue({ status: 'Resolved' }), 'priority')).toEqual({
      color: RESOLVED_COLOR,
      resolved: true,
    })
  })

  it('keeps normal colors for resolved issues in the other modes', () => {
    const issue = makeIssue({ status: 'Resolved', category: 'Pothole' })
    expect(getMarkerStyle(issue, 'category')).toEqual({
      color: CATEGORY_COLORS.Pothole,
      resolved: false,
    })
    expect(getMarkerStyle(issue, 'status')).toEqual({
      color: STATUS_COLORS.Resolved,
      resolved: false,
    })
  })
})

describe('getLegendItems', () => {
  it('lists every possible value for each mode', () => {
    expect(getLegendItems('category')).toHaveLength(5)
    expect(getLegendItems('priority')).toHaveLength(3)
    expect(getLegendItems('status')).toHaveLength(4)
  })
})

describe('getLegendWithCounts', () => {
  const issues = [
    makeIssue({ id: '1', priority: 'High', status: 'Reported' }),
    makeIssue({ id: '2', priority: 'High', status: 'Resolved' }),
    makeIssue({ id: '3', priority: 'Low', status: 'In Progress' }),
  ]

  it('counts open issues by priority and resolved ones separately', () => {
    const counts = Object.fromEntries(
      getLegendWithCounts(issues, 'priority').map((item) => [item.label, item.count]),
    )
    expect(counts).toEqual({ Low: 1, Medium: 0, High: 1, Resolved: 1 })
  })

  it('has no separate Resolved entry in Status mode', () => {
    const items = getLegendWithCounts(issues, 'status')
    expect(items).toHaveLength(4)
    expect(items.find((item) => item.label === 'Resolved').count).toBe(1)
  })

  it('always counts every issue exactly once', () => {
    const total = getLegendWithCounts(issues, 'priority').reduce((sum, item) => sum + item.count, 0)
    expect(total).toBe(issues.length)
  })
})

describe('getMarkerZIndex', () => {
  const z = (changes) => getMarkerZIndex(makeIssue(changes))

  it('draws higher priority on top', () => {
    expect(z({ priority: 'High' })).toBeGreaterThan(z({ priority: 'Medium' }))
    expect(z({ priority: 'Medium' })).toBeGreaterThan(z({ priority: 'Low' }))
  })

  it('draws resolved issues underneath open ones', () => {
    expect(z({ status: 'Resolved', priority: 'High' })).toBeLessThan(z({ priority: 'Low' }))
  })
})