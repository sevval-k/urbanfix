import {
  CATEGORIES,
  CATEGORY_COLORS,
  PRIORITIES,
  PRIORITY_COLORS,
  STATUSES,
  STATUS_COLORS,
} from './constants'

export const COLOR_MODES = [
  { value: 'category', label: 'Category' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
]

const PALETTES = {
  category: { values: CATEGORIES, colors: CATEGORY_COLORS },
  priority: { values: PRIORITIES, colors: PRIORITY_COLORS },
  status: { values: STATUSES, colors: STATUS_COLORS },
}

const FALLBACK_COLOR = '#64748b'

export function getIssueColor(issue, mode) {
  return PALETTES[mode].colors[issue[mode]] ?? FALLBACK_COLOR
}

export function getLegendItems(mode) {
  const { values, colors } = PALETTES[mode]
  return values.map((label) => ({
    label,
    color: colors[label] ?? FALLBACK_COLOR,
  }))
}

export function hasValidCoordinates(issue) {
  return (
    Number.isFinite(issue.latitude) &&
    Number.isFinite(issue.longitude) &&
    Math.abs(issue.latitude) <= 90 &&
    Math.abs(issue.longitude) <= 180
  )
}

const PRIORITY_Z = { Low: 0, Medium: 1, High: 2 }

export function getMarkerZIndex(issue) {
  return (PRIORITY_Z[issue.priority] ?? 0) * 1000
}