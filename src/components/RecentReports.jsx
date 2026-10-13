import { Link } from 'react-router-dom'
import { formatDate } from '../utils/format'
import { PriorityBadge, StatusBadge } from './Badges'
import EmptyState from './EmptyState'

export default function RecentReports({ issues }) {
  return (
    <div className="card h-full p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">Recent reports</h2>
        <Link to="/issues" className="text-sm font-medium text-brand-700 hover:underline">
          View all
        </Link>
      </div>

      {issues.length === 0 ? (
        <EmptyState message="No reports yet. Report the first issue!" />
      ) : (
        <ul className="divide-y divide-slate-100">
          {issues.map((issue) => (
            <li
              key={issue.id}
              className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-800">
                  {issue.title}
                  {issue.isSample && (
                    <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-xs font-normal text-slate-600">
                      Sample
                    </span>
                  )}
                </p>
                <p className="text-sm text-slate-500">
                  {issue.category} · {formatDate(issue.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <PriorityBadge priority={issue.priority} />
                <StatusBadge status={issue.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}