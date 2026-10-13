import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Check, ClipboardList, Clock, Search } from 'lucide-react'
import { useIssues } from '../hooks/useIssues'
import { computeStats, getRecentIssues, toChartData } from '../utils/stats'
import { hasValidCoordinates } from '../utils/mapHelpers'
import PageHeader from '../components/PageHeader'
import ReportIssueButton from '../components/ReportIssueButton'
import StatCard from '../components/StatCard'
import ChartCard from '../components/ChartCard'
import CategoryChart from '../components/CategoryChart'
import StatusChart from '../components/StatusChart'
import RecentReports from '../components/RecentReports'
import MapPreview from '../components/MapPreview'

export default function DashboardPage() {
  const { issues } = useIssues()

  // Everything is derived from the issues array, as before.
  const stats = useMemo(() => computeStats(issues), [issues])
  const recent = useMemo(() => getRecentIssues(issues, 5), [issues])
  const sampleCount = useMemo(() => issues.filter((i) => i.isSample).length, [issues])
  const mappable = useMemo(() => issues.filter(hasValidCoordinates), [issues])

  return (
    <section className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of reported urban issues."
        actions={<ReportIssueButton />}
      />

      {sampleCount > 0 && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {sampleCount} of {stats.total} records are demonstration samples, not real reports.{' '}
          <Link to="/data" className="font-medium underline">
            Manage data
          </Link>
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total issues"
          value={stats.total}
          icon={ClipboardList}
          tone="brand"
          footer={
            <span className={stats.highPriority > 0 ? 'font-medium text-red-600' : ''}>
              {stats.highPriority} high priority
            </span>
          }
        />
        <StatCard label="Pending" value={stats.pending} icon={Clock} tone="red" />
        <StatCard label="Investigating" value={stats.investigating} icon={Search} tone="amber" />
        <StatCard label="Resolved" value={stats.resolved} icon={Check} tone="green" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Issues by category">
          <CategoryChart data={toChartData(stats.byCategory)} />
        </ChartCard>
        <ChartCard title="Issues by status">
          <StatusChart data={toChartData(stats.byStatus)} />
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RecentReports issues={recent} />
        </div>
        <div className="xl:col-span-2">
          <MapPreview issues={mappable} />
        </div>
      </div>
    </section>
  )
}