import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useIssues } from '../hooks/useIssues'
import {
  DEFAULT_FILTERS,
  filterIssues,
  sortIssues,
} from '../utils/issueFilters'
import IssueFilters from '../components/IssueFilters'
import IssueCard from '../components/IssueCard'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'

export default function IssuesPage() {
  const { issues, deleteIssue } = useIssues()

  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [issueToDelete, setIssueToDelete] = useState(null)

  const visibleIssues = useMemo(
    () => sortIssues(filterIssues(issues, filters), filters.sortBy),
    [issues, filters],
  )

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleConfirmDelete = () => {
    if (!issueToDelete) return

    deleteIssue(issueToDelete.id)
    setIssueToDelete(null)
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Issues
        </h1>

        <Link
          to="/issues/new"
          className="rounded-md bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-700"
        >
          Report an Issue
        </Link>
      </div>

      <IssueFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => setFilters({ ...DEFAULT_FILTERS })}
      />

      <p className="text-sm text-slate-600" aria-live="polite">
        Showing {visibleIssues.length} of {issues.length} issues
      </p>

      {issues.length === 0 ? (
        <EmptyState message="No issues have been reported yet." />
      ) : visibleIssues.length === 0 ? (
        <EmptyState message="No issues match your search or filters." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onDelete={setIssueToDelete}
            />
          ))}
        </div>
      )}

      {issueToDelete && (
        <ConfirmDialog
          title="Delete this issue?"
          message={`"${issueToDelete.title}" will be permanently removed. This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIssueToDelete(null)}
        />
      )}
    </section>
  )
}