import { Link } from 'react-router-dom'
import { formatDate } from '../utils/format'
import { PriorityBadge, StatusBadge } from './Badges'
import AddressLookup from './AddressLookup'

export default function IssuePopupContent({ issue }) {
  return (
    <div className="space-y-2">
      {issue.imageUrl && (
        <img
          src={issue.imageUrl}
          alt={`Photo for ${issue.title}`}
          loading="lazy"
          className="h-28 w-full rounded object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={issue.priority} />
        <StatusBadge status={issue.status} />

        {issue.isSample && (
          <span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600">
            Sample
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold leading-snug text-slate-800">
        {issue.title}
      </h3>

      <div className="text-xs text-slate-600">{issue.description}</div>

      <div className="text-xs text-slate-500">
        {issue.category} · {formatDate(issue.createdAt)}
      </div>

      <div className="text-xs text-slate-400">
        {issue.latitude.toFixed(5)}, {issue.longitude.toFixed(5)}
      </div>

      <AddressLookup
        latitude={issue.latitude}
        longitude={issue.longitude}
      />

      <Link
        to={`/issues/${issue.id}/edit`}
        className="urbanfix-popup-link inline-block rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium hover:bg-emerald-700"
      >
        Edit issue
      </Link>
    </div>
  )
}