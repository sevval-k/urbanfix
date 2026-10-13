import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <PageHeader title="Page not found" description="That address doesn't match any page." />
      <EmptyState message="Check the link, or use the navigation above." />
      <Link to="/" className="btn-primary">
        Back to the dashboard
      </Link>
    </section>
  )
}