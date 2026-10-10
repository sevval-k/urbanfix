import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useIssues } from '../hooks/useIssues'
import {
  computeStats,
  getRecentIssues,
  toChartData,
} from '../utils/stats'
import StatCard from '../components/StatCard'
import ChartCard from '../components/ChartCard'
import CategoryChart from '../components/CategoryChart'
import StatusChart from '../components/StatusChart'
import RecentReports from '../components/RecentReports'

export default function DashboardPage() {
  const { issues } = useIssues()

  const stats = useMemo(() => computeStats(issues), [issues])
  const recent = useMemo(() => getRecentIssues(issues, 5), [issues])
  const sampleCount = useMemo(
    () => issues.filter((issue) => issue.isSample).length,
    [issues],
  )

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h1>

        <Link
          to="/issues/new"
          className="rounded-md bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-700"
        >
          Report an Issue
        </Link>
      </div>

      {sampleCount > 0 && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {sampleCount} of {stats.total} records are demonstration samples, not real reports.{' '}
          <Link to="/data" className="font-medium underline">
            Manage data
          </Link>
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Issues" value={stats.total} />
        <StatCard
          label="Pending"
          value={stats.pending}
          accent="text-red-600"
        />
        <StatCard
          label="Investigating"
          value={stats.investigating}
          accent="text-amber-600"
        />
        <StatCard
          label="Resolved"
          value={stats.resolved}
          accent="text-emerald-600"
        />
        <StatCard
          label="High Priority"
          value={stats.highPriority}
          accent="text-red-700"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Issues by Category">
          <CategoryChart data={toChartData(stats.byCategory)} />
        </ChartCard>

        <ChartCard title="Issues by Status">
          <StatusChart data={toChartData(stats.byStatus)} />
        </ChartCard>
      </div>

      <RecentReports issues={recent} />
    </section>
  )
}