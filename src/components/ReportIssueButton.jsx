import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

// The primary action of the app, defined once.
export default function ReportIssueButton() {
  return (
    <Link to="/issues/new" className="btn-primary">
      <Plus size={16} aria-hidden="true" />
      Report an issue
    </Link>
  )
}