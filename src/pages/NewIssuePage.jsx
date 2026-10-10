import { useNavigate } from 'react-router-dom'
import { useIssues } from '../hooks/useIssues'
import { EMPTY_FORM } from '../utils/validation'
import IssueForm from '../components/IssueForm'

export default function NewIssuePage() {
  const { addIssue } = useIssues()
  const navigate = useNavigate()

  const handleSubmit = (data) => {
    addIssue(data)
    navigate('/issues')
  }

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">
        Report an Issue
      </h1>

      <IssueForm
        initialValues={EMPTY_FORM}
        onSubmit={handleSubmit}
        submitLabel="Submit report"
      />
    </section>
  )
}