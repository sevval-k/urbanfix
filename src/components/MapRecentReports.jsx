import { formatDate } from '../utils/format'
import { PriorityBadge, StatusBadge } from './Badges'
import EmptyState from './EmptyState'

// Compact list for the map sidebar. It shows only issues that match the
// current filters, and choosing one centers the map on it.
export default function MapRecentReports({ issues, onSelect }) {
  return (
    <div className="card p-4">
      <h2 className="text-sm font-semibold text-navy-900">Recent reports</h2>

      {issues.length === 0 ? (
        <div className="mt-3">
          <EmptyState message="No reports to show." />
        </div>
      ) : (
        <>
          <p className="mb-1 mt-0.5 text-xs text-muted">Select a report to find it on the map.</p>
          <ul className="-mx-2 divide-y divide-line">
            {issues.map((issue) => (
              <li key={issue.id}>
                <button
                  type="button"
                  onClick={() => onSelect(issue)}
                  className="w-full rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-pale focus-visible:outline-2 focus-visible:outline-brand-600"
                >
                  <div className="truncate text-sm font-medium text-navy-900">{issue.title}</div>
                  <div className="truncate text-xs text-muted">
                    {issue.category} · {formatDate(issue.createdAt)}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <PriorityBadge priority={issue.priority} />
                    <StatusBadge status={issue.status} />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}