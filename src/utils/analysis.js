import { CATEGORIES, PRIORITIES, STATUSES } from './constants'
import { countBy } from './stats'

// Count issues for every row and column combination.
export function crossTab(issues, rowField, rowValues, colField, colValues) {
  const rows = rowValues.map((label) => ({
    label,
    counts: Object.fromEntries(colValues.map((value) => [value, 0])),
    total: 0,
  }))

  const rowByLabel = new Map(rows.map((row) => [row.label, row]))
  const colTotals = Object.fromEntries(colValues.map((value) => [value, 0]))
  let total = 0

  for (const issue of issues) {
    const row = rowByLabel.get(issue[rowField])
    const col = issue[colField]

    // Skip unexpected values instead of crashing.
    if (!row || !Object.hasOwn(colTotals, col)) continue

    row.counts[col] += 1
    row.total += 1
    colTotals[col] += 1
    total += 1
  }

  return { rows, columns: colValues, colTotals, total }
}

export const categoryByStatus = (issues) =>
  crossTab(issues, 'category', CATEGORIES, 'status', STATUSES)

export const categoryByPriority = (issues) =>
  crossTab(issues, 'category', CATEGORIES, 'priority', PRIORITIES)

// Create a readable summary of issue categories.
export function formatBreakdown(issues, field = 'category', values = CATEGORIES) {
  return Object.entries(countBy(issues, field, values))
    .filter(([, count]) => count > 0)
    .map(([label, count]) => `${count} ${label}`)
    .join(', ')
}