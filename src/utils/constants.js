export const CATEGORIES = [
  'Pothole',
  'Damaged Sidewalk',
  'Broken Streetlight',
  'Environmental Pollution',
  'Other',
]

export const PRIORITIES = ['Low', 'Medium', 'High']

export const STATUSES = [
  'Reported',
  'Under Review',
  'In Progress',
  'Resolved',
]

export const CATEGORY_COLORS = {
  Pothole: '#dc2626',
  'Damaged Sidewalk': '#f59e0b',
  'Broken Streetlight': '#eab308',
  'Environmental Pollution': '#16a34a',
  Other: '#64748b',
}

export const STATUS_COLORS = {
  Reported: '#ef4444',
  'Under Review': '#f59e0b',
  'In Progress': '#3b82f6',
  Resolved: '#10b981',
}

export const PRIORITY_COLORS = {
  Low: '#0d9488',
  Medium: '#f59e0b',
  High: '#ef4444',
}

export const DEFAULT_MAP_CENTER = [41.0082, 28.9784]
export const DEFAULT_MAP_ZOOM = 12

export const STORAGE_KEY = 'urbanfix.issues.v1'