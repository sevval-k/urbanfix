import { useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { useIssues } from '../hooks/useIssues'
import { DEFAULT_FILTERS, filterIssues } from '../utils/issueFilters'
import { COLOR_MODES, getLegendWithCounts, hasValidCoordinates } from '../utils/mapHelpers'
import { getRecentIssues } from '../utils/stats'
import PageHeader from '../components/PageHeader'
import IssueFilters from '../components/IssueFilters'
import IssuesMap from '../components/IssuesMap'
import MapLegend from '../components/MapLegend'
import MapRecentReports from '../components/MapRecentReports'

export default function MapPage() {
  const { issues } = useIssues()
  // The map has its own filters, separate from the Reports page.
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [colorBy, setColorBy] = useState('priority')
  const [fitSignal, setFitSignal] = useState(0)
  const [focus, setFocus] = useState(null)
  const [magnifier, setMagnifier] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false) // small screens only

  // Everything below is derived from issues + filters + colorBy.
  const matching = useMemo(() => filterIssues(issues, filters), [issues, filters])
  const mappable = useMemo(() => matching.filter(hasValidCoordinates), [matching])
  const unmappableCount = matching.length - mappable.length
  const legendItems = useMemo(() => getLegendWithCounts(mappable, colorBy), [mappable, colorBy])
  const recent = useMemo(() => getRecentIssues(mappable, 6), [mappable])

  const activeCount = [filters.search.trim(), filters.category, filters.status, filters.priority].filter(
    Boolean,
  ).length

  // Escape leaves magnifier mode.
  useEffect(() => {
    if (!magnifier) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setMagnifier(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [magnifier])

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }
  const handleReset = () => setFilters(DEFAULT_FILTERS)

  const emptyMessage =
    issues.length === 0
      ? 'No issues have been reported yet.'
      : mappable.length === 0
        ? 'No issues match your search or filters.'
        : null

  const filterProps = { filters, onChange: handleFilterChange, onReset: handleReset, showSort: false }

  return (
    <section className="space-y-4">
      <PageHeader
        title="Issues Map"
        description="Select a marker for details. Filter, recolor, or use the magnifier to explore."
      />

      {/* Small screens: filters sit behind a button so they don't fill the screen. */}
      <div className="space-y-3 lg:hidden">
        <button
          type="button"
          onClick={() => setFiltersOpen((prev) => !prev)}
          aria-expanded={filtersOpen}
          className="btn-secondary w-full justify-between"
        >
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal size={16} aria-hidden="true" />
            Filters
          </span>
          {activeCount > 0 && (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
              {activeCount} active
            </span>
          )}
        </button>
        {filtersOpen && <IssueFilters {...filterProps} stacked />}
      </div>

      <p className="text-sm text-muted" aria-live="polite">
        Showing {mappable.length} of {issues.length} issues on the map.
      </p>

      <div className="grid gap-4 lg:h-[calc(100vh-14rem)] lg:min-h-[540px] lg:grid-cols-4 lg:grid-rows-1">
        <div className="h-[65vh] min-h-[380px] lg:col-span-3 lg:h-full">
          <IssuesMap
            issues={mappable}
            colorBy={colorBy}
            fitSignal={fitSignal}
            onFit={() => setFitSignal((n) => n + 1)}
            focus={focus}
            magnifier={magnifier}
            onToggleMagnifier={() => setMagnifier((on) => !on)}
            emptyMessage={emptyMessage}
          />
        </div>

        <aside
          aria-label="Filters, legend, and recent reports"
          className="space-y-4 lg:col-span-1 lg:h-full lg:overflow-y-auto lg:pr-1"
        >
          <div className="hidden lg:block">
            <IssueFilters {...filterProps} stacked />
          </div>

          <div className="card space-y-3 p-4">
            <h2 className="text-sm font-semibold text-navy-900">Marker colors</h2>
            <div
              role="group"
              aria-label="Color markers by"
              className="grid grid-cols-3 overflow-hidden rounded-lg border border-line"
            >
              {COLOR_MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  aria-pressed={colorBy === mode.value}
                  onClick={() => setColorBy(mode.value)}
                  className={`px-2 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600 ${
                    colorBy === mode.value
                      ? 'bg-brand-600 text-white'
                      : 'bg-white text-navy-900 hover:bg-pale'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <MapLegend items={legendItems} />
            {colorBy === 'priority' && (
              <p className="text-xs text-muted">
                Resolved issues are grey with a check mark, whatever their priority.
              </p>
            )}
          </div>

          <MapRecentReports
            issues={recent}
            onSelect={(issue) => setFocus({ id: issue.id, at: Date.now() })}
          />
        </aside>
      </div>

      {unmappableCount > 0 && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {unmappableCount} matching {unmappableCount === 1 ? 'issue has' : 'issues have'} invalid
          coordinates and can&apos;t be shown on the map.
        </p>
      )}
    </section>
  )
}