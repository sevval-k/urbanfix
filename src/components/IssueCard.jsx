import { Link } from 'react-router-dom'
import { formatDate } from '../utils/format'
import { PriorityBadge, StatusBadge } from './Badges'

export default function IssueCard({ issue, onDelete }) {
  return (
    <article className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-2">
        {issue.imageUrl && (
          <img
            src={issue.imageUrl}
            alt={`Photo for ${issue.title}`}
            loading="lazy"
            className="h-40 w-full rounded-md object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}

        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={issue.priority} />
          <StatusBadge status={issue.status} />

          {issue.isSample && (
            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600">
              Sample
            </span>
          )}
        </div>

        <h2 className="font-semibold text-slate-800">
          {issue.title}
        </h2>

        <p className="text-sm text-slate-600">
          {issue.description}
        </p>

        <p className="text-xs text-slate-500">
          {issue.category} · {formatDate(issue.createdAt)}
        </p>

        <p className="text-xs text-slate-400">
          {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          to={`/issues/${issue.id}/edit`}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Edit
        </Link>

        <button
          type="button"
          onClick={() => onDelete(issue)}
          className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </article>
  )
}