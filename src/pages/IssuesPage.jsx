import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useIssues } from '../hooks/useIssues'
import { DEFAULT_FILTERS, filterIssues, sortIssues } from '../utils/issueFilters'
import PageHeader from '../components/PageHeader'
import ReportIssueButton from '../components/ReportIssueButton'
import IssueFilters from '../components/IssueFilters'
import IssueCard from '../components/IssueCard'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'

export default function IssuesPage() {
  const { issues, deleteIssue } = useIssues()
  const [searchParams, setSearchParams] = useSearchParams()
  // Search text lives in the URL (?q=...); the other filters in state.
  const [otherFilters, setOtherFilters] = useState(DEFAULT_FILTERS)
  const [issueToDelete, setIssueToDelete] = useState(null)

  const filters = { ...otherFilters, search: searchParams.get('q') ?? '' }

  // The visible list is DERIVED from issues + filters, not stored in state.
  const visibleIssues = useMemo(
    () => sortIssues(filterIssues(issues, filters), filters.sortBy),
    // filters is rebuilt each render, so depend on its parts
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [issues, otherFilters, searchParams],
  )

  const handleFilterChange = (field, value) => {
    if (field === 'search') {
      setSearchParams(value ? { q: value } : {}, { replace: true })
    } else {
      setOtherFilters((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleReset = () => {
    setOtherFilters(DEFAULT_FILTERS)
    setSearchParams({}, { replace: true })
  }

  const handleConfirmDelete = () => {
    deleteIssue(issueToDelete.id)
    setIssueToDelete(null)
  }

  return (
    <section className="space-y-4">
      <PageHeader
        title="Issues"
        description="Search, filter, edit, and delete reported issues."
        actions={<ReportIssueButton />}
      />

      <IssueFilters filters={filters} onChange={handleFilterChange} onReset={handleReset} />

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
            <IssueCard key={issue.id} issue={issue} onDelete={setIssueToDelete} />
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