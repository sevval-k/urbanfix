import { useMemo, useState } from 'react'
import { useIssues } from '../hooks/useIssues'
import { DEFAULT_FILTERS, filterIssues } from '../utils/issueFilters'
import { hasValidCoordinates } from '../utils/mapHelpers'
import {
  categoryByPriority,
  categoryByStatus,
  formatBreakdown,
} from '../utils/analysis'
import {
  buildGrid,
  CELL_SIZES,
  getCountClasses,
} from '../utils/density'

import IssueFilters from '../components/IssueFilters'
import CrossTabTable from '../components/CrossTabTable'
import DensityMap from '../components/DensityMap'
import DensityLegend from '../components/DensityLegend'
import EmptyState from '../components/EmptyState'

export default function AnalysisPage() {
  const { issues } = useIssues()

  // Filtreler yalnızca yoğunluk haritasını etkiler.
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [openOnly, setOpenOnly] = useState(false)
  const [cellSize, setCellSize] = useState(1000)
  const [showPoints, setShowPoints] = useState(true)
  const [focus, setFocus] = useState(null)
  const [fitSignal, setFitSignal] = useState(0)

  // Tablolar bütün raporları kullanır.
  const statusTable = useMemo(
    () => categoryByStatus(issues),
    [issues],
  )

  const priorityTable = useMemo(
    () => categoryByPriority(issues),
    [issues],
  )

  // Filtrelenmiş raporları hazırla.
  const matching = useMemo(
    () =>
      filterIssues(issues, filters).filter(
        (issue) => !openOnly || issue.status !== 'Resolved',
      ),
    [issues, filters, openOnly],
  )

  // Geçerli koordinatı olmayan raporları haritadan çıkar.
  const selected = useMemo(
    () => matching.filter(hasValidCoordinates),
    [matching],
  )

  const skipped = matching.length - selected.length

  // Yoğunluk hücrelerini hesapla.
  const { cells, maxCount } = useMemo(
    () => buildGrid(selected, cellSize),
    [selected, cellSize],
  )

  const classes = useMemo(
    () => getCountClasses(maxCount),
    [maxCount],
  )

  // En az iki rapor içeren ilk beş hücreyi bul.
  const busiest = useMemo(
    () => cells.filter((cell) => cell.count >= 2).slice(0, 5),
    [cells],
  )

  const cellLabel =
    CELL_SIZES.find((size) => size.value === cellSize).label

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">
        Analysis
      </h1>

      {/* Sayısal analiz tabloları */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">
          Counts
        </h2>

        <p className="text-sm text-slate-600">
          Exact counts from all {issues.length} records,
          grouped by category, status, and priority.
        </p>

        <div className="grid gap-4 xl:grid-cols-2">
          <CrossTabTable
            title="Category by status"
            rowHeader="Category"
            data={statusTable}
            showResolvedShare
          />

          <CrossTabTable
            title="Category by priority"
            rowHeader="Category"
            data={priorityTable}
          />
        </div>
      </div>

      {/* Yoğunluk haritası */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Where reports concentrate
        </h2>

        <p className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          <strong>How to read this map.</strong> The area is divided
          into a grid of square cells, and each cell is colored by
          how many reports fall inside it. This is a{' '}
          <strong>
            simple density visualization, not a statistical hotspot analysis
          </strong>
          : it does not test whether a concentration is larger than
          chance. Results also depend on cell size and where people
          report problems.
        </p>

        <IssueFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={() => {
            setFilters(DEFAULT_FILTERS)
            setOpenOnly(false)
          }}
          showSort={false}
        />

        {/* Harita kontrolleri */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-600">
              Cell size
            </span>

            <div
              role="group"
              aria-label="Grid cell size"
              className="inline-flex overflow-hidden rounded-md border border-slate-300"
            >
              {CELL_SIZES.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  aria-pressed={cellSize === size.value}
                  onClick={() => setCellSize(size.value)}
                  className={`px-3 py-1.5 text-sm font-medium ${
                    cellSize === size.value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={openOnly}
                onChange={(event) => setOpenOnly(event.target.checked)}
              />
              Exclude resolved
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={showPoints}
                onChange={(event) => setShowPoints(event.target.checked)}
              />
              Show report points
            </label>

            <button
              type="button"
              onClick={() => setFitSignal((n) => n + 1)}
              disabled={selected.length === 0}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              Fit all points
            </button>
          </div>
        </div>

        {/* Sonuç özeti */}
        <p className="text-sm text-slate-600" aria-live="polite">
          {selected.length === 0
            ? 'No reports to analyze with these settings.'
            : `${selected.length} of ${issues.length} reports in ${cells.length} ${
                cells.length === 1 ? 'cell' : 'cells'
              } of ${cellLabel}. The busiest cell holds ${maxCount}.`}
        </p>

        {selected.length === 0 ? (
          <EmptyState
            message={
              issues.length === 0
                ? 'No issues have been reported yet, so there is nothing to analyze.'
                : 'No issues match your search or filters.'
            }
          />
        ) : (
          <DensityMap
            issues={selected}
            cells={cells}
            classes={classes}
            showPoints={showPoints}
            focus={focus}
            fitSignal={fitSignal}
          />
        )}

        <DensityLegend
          classes={classes}
          cellLabel={cellLabel}
        />

        {/* En yoğun hücreler */}
        {selected.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-base font-semibold text-slate-800">
              Busiest cells
            </h3>

            {busiest.length === 0 ? (
              <p className="text-sm text-slate-600">
                No cell holds more than one report at {cellLabel}.
                Try a larger cell size.
              </p>
            ) : (
              <ol className="divide-y divide-slate-100">
                {busiest.map((cell) => (
                  <li
                    key={cell.key}
                    className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-800">
                        {cell.count} reports
                      </p>

                      <p className="text-sm text-slate-600">
                        {formatBreakdown(cell.issues)}
                      </p>

                      <p className="text-xs text-slate-400">
                        Cell center:{' '}
                        {cell.center.latitude.toFixed(4)},{' '}
                        {cell.center.longitude.toFixed(4)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFocus({ ...cell.bounds })}
                      className="shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Show on map
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {/* Koordinatı geçersiz raporlar hakkında uyarı */}
        {skipped > 0 && (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {skipped} matching{' '}
            {skipped === 1 ? 'issue has' : 'issues have'} invalid
            coordinates and are left out of the density map.
          </p>
        )}
      </div>
    </section>
  )
}