import { useNavigate } from 'react-router-dom'
import { useIssues } from '../hooks/useIssues'
import { EMPTY_FORM } from '../utils/validation'
import PageHeader from '../components/PageHeader'
import IssueForm from '../components/IssueForm'

export default function NewIssuePage() {
  const { addIssue } = useIssues()
  const navigate = useNavigate()

  const handleSubmit = (data) => {
    addIssue(data)
    navigate('/issues')
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <PageHeader
        title="Report an Issue"
        description="Describe the problem and mark where it is on the map."
      />
      <IssueForm
        initialValues={EMPTY_FORM}
        onSubmit={handleSubmit}
        submitLabel="Submit report"
      />
    </section>
  )
}