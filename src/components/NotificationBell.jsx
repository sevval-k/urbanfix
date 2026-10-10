import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useIssues } from '../hooks/useIssues'
import { formatDate } from '../utils/format'

// "Notifications" here means real data: High-priority issues that are not
// resolved yet. There is no fake message feed.
export default function NotificationBell() {
  const { issues } = useIssues()
  const [open, setOpen] = useState(false)

  const urgent = useMemo(
    () =>
      issues
        .filter((i) => i.priority === 'High' && i.status !== 'Resolved')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [issues],
  )

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={`Notifications: ${urgent.length} unresolved high-priority ${
          urgent.length === 1 ? 'issue' : 'issues'
        }`}
        className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
      >
        <Bell size={20} aria-hidden="true" />
        {urgent.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
            {urgent.length > 9 ? '9+' : urgent.length}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Invisible layer: clicking anywhere else closes the panel. */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default"
          />
          <div className="card absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden">
            <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-800">
              High priority, not resolved
            </div>

            {urgent.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-slate-500">
                Nothing urgent right now.
              </div>
            ) : (
              <ul className="max-h-72 divide-y divide-slate-100 overflow-y-auto">
                {urgent.slice(0, 5).map((issue) => (
                  <li key={issue.id}>
                    <Link
                      to={`/issues/${issue.id}/edit`}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 hover:bg-slate-50"
                    >
                      <div className="truncate text-sm font-medium text-slate-800">
                        {issue.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {issue.category} · {formatDate(issue.createdAt)}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <Link
              to="/issues"
              onClick={() => setOpen(false)}
              className="block border-t border-slate-100 px-4 py-2.5 text-center text-sm font-medium text-brand-700 hover:bg-slate-50"
            >
              View all issues
            </Link>
          </div>
        </>
      )}
    </div>
  )
}