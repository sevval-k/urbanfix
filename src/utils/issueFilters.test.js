import { describe, expect, it } from 'vitest'
import { DEFAULT_FILTERS, filterIssues, sortIssues } from './issueFilters'
import { makeIssue } from '../test/makeIssue'

const issues = [
  makeIssue({
    id: 'a', title: 'Big pothole', description: 'Deep hole in lane',
    category: 'Pothole', priority: 'High', status: 'Reported',
    createdAt: '2026-10-01T10:00:00.000Z',
  }),
  makeIssue({
    id: 'b', title: 'Broken lamp', description: 'Lamp is dark at night',
    category: 'Broken Streetlight', priority: 'Low', status: 'Resolved',
    createdAt: '2026-10-03T10:00:00.000Z',
  }),
  makeIssue({
    id: 'c', title: 'Cracked paving', description: 'Pothole-like crack near stop',
    category: 'Damaged Sidewalk', priority: 'High', status: 'In Progress',
    createdAt: '2026-10-02T10:00:00.000Z',
  }),
  makeIssue({
    id: 'd', title: 'Oil spill', description: 'Smell near stream',
    category: 'Environmental Pollution', priority: 'Medium', status: 'Reported',
    createdAt: '2026-09-30T10:00:00.000Z',
  }),
]

const ids = (list) => list.map((issue) => issue.id)
const filter = (changes) => ids(filterIssues(issues, { ...DEFAULT_FILTERS, ...changes }))

describe('filterIssues', () => {
  it('returns everything with the default filters', () => {
    expect(filter({})).toEqual(['a', 'b', 'c', 'd'])
  })

  it('filters by category, status, and priority', () => {
    expect(filter({ category: 'Pothole' })).toEqual(['a'])
    expect(filter({ status: 'Reported' })).toEqual(['a', 'd'])
    expect(filter({ priority: 'High' })).toEqual(['a', 'c'])
  })

  it('combines filters with AND', () => {
    expect(filter({ priority: 'High', status: 'Reported' })).toEqual(['a'])
    expect(filter({ priority: 'Low', status: 'Reported' })).toEqual([])
  })

  it('searches title and description, ignoring case and surrounding spaces', () => {
    expect(filter({ search: 'pothole' })).toEqual(['a', 'c']) // title and description
    expect(filter({ search: '  POTHOLE ' })).toEqual(['a', 'c'])
    expect(filter({ search: 'stream' })).toEqual(['d']) // description only
  })

  it('does not search the category field', () => {
    expect(filter({ search: 'environmental' })).toEqual([])
  })

  it('combines search with filters', () => {
    expect(filter({ search: 'pothole', status: 'In Progress' })).toEqual(['c'])
  })

  it('ignores Turkish letter variants in search', () => {
    const turkish = [
      makeIssue({ id: 't1', title: 'İstanbul Şişli yolu', description: 'Büyük çukur var' }),
      makeIssue({ id: 't2', title: 'Isparta caddesi', description: 'Işık yanmıyor' }),
    ]
    const find = (search) =>
      ids(filterIssues(turkish, { ...DEFAULT_FILTERS, search }))

    expect(find('istanbul')).toEqual(['t1'])
    expect(find('SISLI')).toEqual(['t1'])
    expect(find('cukur')).toEqual(['t1'])
    expect(find('ısparta')).toEqual(['t2']) // dotless ı typed by the user
    expect(find('isik')).toEqual(['t2'])
  })

  it('does not change the original array', () => {
    const before = ids(issues)
    filterIssues(issues, { ...DEFAULT_FILTERS, status: 'Resolved' })
    expect(ids(issues)).toEqual(before)
  })
})

describe('sortIssues', () => {
  it('sorts by date', () => {
    expect(ids(sortIssues(issues, 'newest'))).toEqual(['b', 'c', 'a', 'd'])
    expect(ids(sortIssues(issues, 'oldest'))).toEqual(['d', 'a', 'c', 'b'])
  })

  it('sorts by priority, newest first within the same priority', () => {
    expect(ids(sortIssues(issues, 'priority-high'))).toEqual(['c', 'a', 'd', 'b'])
    expect(ids(sortIssues(issues, 'priority-low'))).toEqual(['b', 'd', 'c', 'a'])
  })

  it('falls back to newest first for an unknown sort value', () => {
    expect(ids(sortIssues(issues, 'nonsense'))).toEqual(['b', 'c', 'a', 'd'])
  })

  it('does not change the original array', () => {
    const before = ids(issues)
    sortIssues(issues, 'oldest')
    expect(ids(issues)).toEqual(before)
  })
})