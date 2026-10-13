import {
  CATEGORIES,
  CATEGORY_COLORS,
  PRIORITIES,
  PRIORITY_COLORS,
  STATUSES,
  STATUS_COLORS,
} from './constants'

// The `value` of each mode is also the name of the issue field it reads,
// so issue[mode] gives the issue's category, priority, or status.
export const COLOR_MODES = [
  { value: 'priority', label: 'Priority' },
  { value: 'category', label: 'Category' },
  { value: 'status', label: 'Status' },
]

const PALETTES = {
  category: { values: CATEGORIES, colors: CATEGORY_COLORS },
  priority: { values: PRIORITIES, colors: PRIORITY_COLORS },
  status: { values: STATUSES, colors: STATUS_COLORS },
}

const FALLBACK_COLOR = '#64748b'

// Muted grey used for resolved issues in Priority mode.
export const RESOLVED_COLOR = '#94a3b8'

export function getIssueColor(issue, mode) {
  return PALETTES[mode].colors[issue[mode]] ?? FALLBACK_COLOR
}

// What a map marker looks like. Only ONE attribute is encoded by color at a
// time. In Priority mode, resolved issues get a separate muted style (grey
// with a check mark) so finished work doesn't look urgent.
export function getMarkerStyle(issue, mode) {
  if (mode === 'priority' && issue.status === 'Resolved') {
    return { color: RESOLVED_COLOR, resolved: true }
  }
  return { color: getIssueColor(issue, mode), resolved: false }
}

// One entry per possible value, in a fixed order, so the legend never
// changes shape when filters change.
export function getLegendItems(mode) {
  const { values, colors } = PALETTES[mode]
  return values.map((label) => ({ label, color: colors[label] ?? FALLBACK_COLOR }))
}

// Legend entries with the number of issues using each style. In Priority
// mode a "Resolved" entry is added, matching getMarkerStyle.
export function getLegendWithCounts(issues, mode) {
  const items = getLegendItems(mode).map((item) => ({ ...item, count: 0, resolved: false }))
  const resolvedItem =
    mode === 'priority'
      ? { label: 'Resolved', color: RESOLVED_COLOR, count: 0, resolved: true }
      : null

  for (const issue of issues) {
    if (getMarkerStyle(issue, mode).resolved) {
      resolvedItem.count += 1
    } else {
      const item = items.find((entry) => entry.label === issue[mode])
      if (item) item.count += 1
    }
  }
  return resolvedItem ? [...items, resolvedItem] : items
}

// A marker needs real numbers in range. Damaged LocalStorage data must not
// crash the whole map.
export function hasValidCoordinates(issue) {
  return (
    Number.isFinite(issue.latitude) &&
    Number.isFinite(issue.longitude) &&
    Math.abs(issue.latitude) <= 90 &&
    Math.abs(issue.longitude) <= 180
  )
}

// When markers overlap, higher priority is drawn on top and resolved issues
// underneath. Leaflet adds this offset to its own default stacking order.
const PRIORITY_Z = { Low: 0, Medium: 1, High: 2 }

export function getMarkerZIndex(issue) {
  if (issue.status === 'Resolved') return -1000
  return (PRIORITY_Z[issue.priority] ?? 0) * 1000
}