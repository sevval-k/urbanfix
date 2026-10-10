import { Link, useNavigate, useParams } from 'react-router-dom'
import { useIssues } from '../hooks/useIssues'
import { issueToFormValues } from '../utils/validation'
import IssueForm from '../components/IssueForm'
import EmptyState from '../components/EmptyState'

export default function EditIssuePage() {
  const { id } = useParams()
  const { issues, updateIssue } = useIssues()
  const navigate = useNavigate()

  const issue = issues.find((item) => item.id === id)

  if (!issue) {
    return (
      <section className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Issue not found
        </h1>

        <EmptyState message="This issue doesn't exist or was removed." />

        <Link
          to="/issues"
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
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
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">
        Edit Issue
      </h1>

      {issue.isSample && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          This is a demonstration sample record.
        </p>
      )}

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