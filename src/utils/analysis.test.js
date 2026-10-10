import { describe, expect, it } from 'vitest'
import { categoryByPriority, categoryByStatus, formatBreakdown } from './analysis'
import { SAMPLE_ISSUES } from '../data/sampleIssues'
import { makeIssue } from '../test/makeIssue'

const row = (table, label) => table.rows.find((r) => r.label === label)

describe('categoryByStatus', () => {
  const table = categoryByStatus(SAMPLE_ISSUES)

  it('matches the hand-checked sample numbers', () => {
    expect(table.total).toBe(12)
    expect(table.colTotals).toEqual({
      Reported: 4,
      'Under Review': 3,
      'In Progress': 2,
      Resolved: 3,
    })
    expect(row(table, 'Pothole').counts).toEqual({
      Reported: 1,
      'Under Review': 1,
      'In Progress': 0,
      Resolved: 2,
    })
    expect(row(table, 'Pothole').total).toBe(4)
  })

  it('has row totals that add up to the grand total', () => {
    expect(table.rows.reduce((sum, r) => sum + r.total, 0)).toBe(table.total)
  })

  it('skips records with unexpected values', () => {
    const withBad = categoryByStatus([makeIssue(), makeIssue({ id: 'x', category: 'Banana' })])
    expect(withBad.total).toBe(1)
  })
})

describe('categoryByPriority', () => {
  const table = categoryByPriority(SAMPLE_ISSUES)

  it('matches the hand-checked sample numbers', () => {
    expect(table.colTotals).toEqual({ Low: 3, Medium: 5, High: 4 })
    expect(row(table, 'Pothole').counts).toEqual({ Low: 0, Medium: 2, High: 2 })
  })
})

describe('formatBreakdown', () => {
  it('lists non-zero categories with counts, in category order', () => {
    const issues = [
      makeIssue({ id: '1', category: 'Broken Streetlight' }),
      makeIssue({ id: '2', category: 'Pothole' }),
      makeIssue({ id: '3', category: 'Pothole' }),
    ]
    expect(formatBreakdown(issues)).toBe('2 Pothole, 1 Broken Streetlight')
  })

  it('returns an empty string for no issues', () => {
    expect(formatBreakdown([])).toBe('')
  })
})