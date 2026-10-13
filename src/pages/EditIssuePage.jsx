import { Link, useNavigate, useParams } from 'react-router-dom'
import { useIssues } from '../hooks/useIssues'
import { issueToFormValues } from '../utils/validation'
import PageHeader from '../components/PageHeader'
import IssueForm from '../components/IssueForm'
import EmptyState from '../components/EmptyState'

export default function EditIssuePage() {
  // useParams reads the :id segment from the URL /issues/:id/edit
  const { id } = useParams()
  const { issues, updateIssue } = useIssues()
  const navigate = useNavigate()

  const issue = issues.find((item) => item.id === id)

  // The issue may not exist: deleted or a mistyped URL. Handle it, don't crash.
  if (!issue) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <PageHeader title="Issue not found" />
        <EmptyState message="This issue doesn't exist or was removed." />
        <Link to="/issues" className="text-sm font-medium text-brand-700 hover:underline">
          Back to all issues
        </Link>
      </section>
    )
  }

  const handleSubmit = (data) => {
    updateIssue(issue.id, data)
    navigate('/issues')
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <PageHeader title="Edit Issue" description="Update the details, status, or location." />
      {issue.isSample && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          This is a demonstration sample record.
        </p>
      )}
      {/* key={issue.id} resets the form's internal state if the id changes */}
      <IssueForm
        key={issue.id}
        initialValues={issueToFormValues(issue)}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
        showStatus
      />
    </section>
  )
}