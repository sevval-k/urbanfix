import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { formatDate } from '../utils/format'
import { PriorityBadge, StatusBadge } from './Badges'

export default function IssueCard({ issue, onDelete }) {
  return (
    <article className="card flex flex-col justify-between p-4 transition-shadow hover:shadow-md">
      <div className="space-y-2.5">
        {issue.imageUrl && (
          <img
            src={issue.imageUrl}
            alt={`Photo for ${issue.title}`}
            loading="lazy"
            className="h-40 w-full rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}

        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={issue.priority} />
          <StatusBadge status={issue.status} />
          {issue.isSample && (
            <span className="rounded bg-pale px-1.5 py-0.5 text-xs text-muted">Sample</span>
          )}
        </div>

        <h2 className="break-words font-semibold text-navy-900">{issue.title}</h2>
        <p className="break-words text-sm text-muted">{issue.description}</p>

        <p className="text-xs text-muted">
          {issue.category} · {formatDate(issue.createdAt)}
        </p>
        <p className="text-xs tabular-nums text-muted/70">
          {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          to={`/issues/${issue.id}/edit`}
          className="btn-secondary px-3 py-1.5"
          aria-label={`Edit ${issue.title}`}
        >
          <Pencil size={14} aria-hidden="true" />
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete(issue)}
          aria-label={`Delete ${issue.title}`}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          <Trash2 size={14} aria-hidden="true" />
          Delete
        </button>
      </div>
    </article>
  )
}