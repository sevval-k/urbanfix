const PRIORITY_STYLES = {
  Low: 'bg-brand-50 text-brand-700',
  Medium: 'bg-amber-100 text-amber-800',
  High: 'bg-red-100 text-red-700',
}

const STATUS_STYLES = {
  Reported: 'bg-red-100 text-red-700',
  'Under Review': 'bg-amber-100 text-amber-800',
  'In Progress': 'bg-blue-100 text-blue-700',
  Resolved: 'bg-emerald-100 text-emerald-700',
}

const base = 'inline-block rounded-full px-2 py-0.5 text-xs font-medium'

export function PriorityBadge({ priority }) {
  return (
    <span className={`${base} ${PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.Low}`}>
      {priority}
    </span>
  )
}

export function StatusBadge({ status }) {
  return (
    <span className={`${base} ${STATUS_STYLES[status] ?? STATUS_STYLES.Reported}`}>
      {status}
    </span>
  )
}