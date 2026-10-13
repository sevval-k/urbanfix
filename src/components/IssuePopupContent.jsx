import { Link } from 'react-router-dom'
import { formatDate } from '../utils/format'
import { PriorityBadge, StatusBadge } from './Badges'
import AddressLookup from './AddressLookup'

// What appears inside a marker's popup. Written with <div>, not <p>,
// because Leaflet's CSS adds large margins to <p> inside popups.
export default function IssuePopupContent({ issue }) {
  return (
    <div className="space-y-2.5">
      {issue.imageUrl && (
        <img
          src={issue.imageUrl}
          alt={`Photo for ${issue.title}`}
          loading="lazy"
          className="h-28 w-full rounded-lg object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={issue.priority} />
        <StatusBadge status={issue.status} />
        {issue.isSample && (
          <span className="rounded bg-pale px-1.5 py-0.5 text-xs text-muted">Sample</span>
        )}
      </div>

      <h3 className="text-sm font-semibold leading-snug text-navy-900">{issue.title}</h3>
      <div className="text-xs leading-snug text-muted">{issue.description}</div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-line pt-2 text-xs">
        <dt className="text-muted">Category</dt>
        <dd className="font-medium text-navy-900">{issue.category}</dd>
        <dt className="text-muted">Reported</dt>
        <dd className="font-medium text-navy-900">{formatDate(issue.createdAt)}</dd>
        <dt className="text-muted">Location</dt>
        <dd className="font-medium tabular-nums text-navy-900">
          {issue.latitude.toFixed(5)}, {issue.longitude.toFixed(5)}
        </dd>
      </dl>

      <AddressLookup latitude={issue.latitude} longitude={issue.longitude} />

      <Link to={`/issues/${issue.id}/edit`} className="btn-primary urbanfix-popup-link px-3 py-1.5 text-xs">
        Edit issue
      </Link>
    </div>
  )
}