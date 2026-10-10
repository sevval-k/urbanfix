import { CATEGORIES, PRIORITIES, STATUSES } from './constants'

export function countBy(issues, field, allValues) {
  const counts = Object.fromEntries(
    allValues.map((value) => [value, 0]),
  )

  for (const issue of issues) {
    if (Object.hasOwn(counts, issue[field])) {
      counts[issue[field]] += 1
    }
  }

  return counts
}

export function computeStats(issues) {
  const byStatus = countBy(issues, 'status', STATUSES)
  const byCategory = countBy(issues, 'category', CATEGORIES)
  const byPriority = countBy(issues, 'priority', PRIORITIES)

  return {
    total: issues.length,
    pending: byStatus['Reported'],
    investigating: byStatus['Under Review'] + byStatus['In Progress'],
    resolved: byStatus['Resolved'],
    highPriority: byPriority['High'],
    byStatus,
    byCategory,
    byPriority,
  }
}

export function toChartData(counts) {
  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }))
}

export function getRecentIssues(issues, limit = 5) {
  return [...issues]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
}