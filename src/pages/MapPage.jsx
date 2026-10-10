import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useIssues } from '../hooks/useIssues'
import { DEFAULT_FILTERS, filterIssues } from '../utils/issueFilters'
import {
  COLOR_MODES,
  getLegendItems,
  hasValidCoordinates,
} from '../utils/mapHelpers'
import IssueFilters from '../components/IssueFilters'
import IssuesMap from '../components/IssuesMap'
import MapLegend from '../components/MapLegend'
import EmptyState from '../components/EmptyState'

export default function MapPage() {
  const { issues } = useIssues()

  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [colorBy, setColorBy] = useState('category')
  const [fitSignal, setFitSignal] = useState(0)

  const matching = useMemo(
    () => filterIssues(issues, filters),
    [issues, filters],
  )

  const mappable = useMemo(
    () => matching.filter(hasValidCoordinates),
    [matching],
  )

  const unmappableCount = matching.length - mappable.length

  const legendItems = useMemo(
    () =>
      getLegendItems(colorBy).map((item) => ({
        ...item,
        count: mappable.filter(
          (issue) => issue[colorBy] === item.label,
        ).length,
      })),
    [colorBy, mappable],
  )

  const colorLabel = COLOR_MODES.find(
    (mode) => mode.value === colorBy,
  ).label

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Issues Map
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
        onReset={() => setFilters(DEFAULT_FILTERS)}
        showSort={false}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-600">
            Color markers by
          </span>

          <div
            role="group"
            aria-label="Color markers by"
            className="inline-flex overflow-hidden rounded-md border border-slate-300"
          >
            {COLOR_MODES.map((mode) => (
              <button
                key={mode.value}
                type="button"
                aria-pressed={colorBy === mode.value}
                onClick={() => setColorBy(mode.value)}
                className={`px-3 py-1.5 text-sm font-medium ${
                  colorBy === mode.value
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFitSignal((n) => n + 1)}
          disabled={mappable.length === 0}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Fit all markers
        </button>
      </div>

      <p className="text-sm text-slate-600" aria-live="polite">
        Showing {mappable.length} of {issues.length} issues on the map.
        Click a marker for details.
      </p>

      {mappable.length === 0 ? (
        <EmptyState
          message={
            issues.length === 0
              ? 'No issues have been reported yet, so there is nothing to show on the map.'
              : 'No issues match your search or filters.'
          }
        />
      ) : (
        <IssuesMap
          issues={mappable}
          colorBy={colorBy}
          fitSignal={fitSignal}
        />
      )}

      <MapLegend
        title={`Marker color: ${colorLabel}`}
        items={legendItems}
      />

      {unmappableCount > 0 && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {unmappableCount}{' '}
          {unmappableCount === 1
            ? 'matching issue has'
            : 'matching issues have'}{' '}
          invalid coordinates and cannot be shown on the map.
        </p>
      )}
    </section>
  )
}