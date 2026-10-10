import { describe, expect, it } from 'vitest'
import { computeStats, countBy, getRecentIssues, toChartData } from './stats'
import { STATUSES } from './constants'
import { SAMPLE_ISSUES } from '../data/sampleIssues'
import { makeIssue } from '../test/makeIssue'

describe('countBy', () => {
  it('starts every value at zero', () => {
    expect(countBy([], 'status', STATUSES)).toEqual({
      Reported: 0,
      'Under Review': 0,
      'In Progress': 0,
      Resolved: 0,
    })
  })

  it('ignores unexpected values instead of crashing', () => {
    const counts = countBy([makeIssue({ status: 'Banana' })], 'status', STATUSES)
    expect(Object.values(counts).every((n) => n === 0)).toBe(true)
  })
})

describe('computeStats', () => {
  it('matches the numbers shown on the dashboard for the sample data', () => {
    const stats = computeStats(SAMPLE_ISSUES)
    expect(stats.total).toBe(12)
    expect(stats.pending).toBe(4)
    expect(stats.investigating).toBe(5) // Under Review 3 + In Progress 2
    expect(stats.resolved).toBe(3)
    expect(stats.highPriority).toBe(4)
  })

  it('always splits the total into pending + investigating + resolved', () => {
    const stats = computeStats(SAMPLE_ISSUES)
    expect(stats.pending + stats.investigating + stats.resolved).toBe(stats.total)
  })

  it('handles an empty list', () => {
    const stats = computeStats([])
    expect(stats.total).toBe(0)
    expect(stats.pending).toBe(0)
    expect(stats.highPriority).toBe(0)
  })
})

describe('toChartData', () => {
  it('converts counts to the array shape Recharts expects', () => {
    expect(toChartData({ Pothole: 2, Other: 0 })).toEqual([
      { name: 'Pothole', value: 2 },
      { name: 'Other', value: 0 },
    ])
  })
})

describe('getRecentIssues', () => {
  const issues = [
    makeIssue({ id: 'old', createdAt: '2026-01-01T00:00:00.000Z' }),
    makeIssue({ id: 'new', createdAt: '2026-03-01T00:00:00.000Z' }),
    makeIssue({ id: 'mid', createdAt: '2026-02-01T00:00:00.000Z' }),
  ]

  it('returns the newest issues first, up to the limit', () => {
    expect(getRecentIssues(issues, 2).map((i) => i.id)).toEqual(['new', 'mid'])
  })

  it('does not change the original array', () => {
    getRecentIssues(issues, 3)
    expect(issues.map((i) => i.id)).toEqual(['old', 'new', 'mid'])
  })
})