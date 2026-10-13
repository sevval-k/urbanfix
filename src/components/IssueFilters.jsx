import { CATEGORIES, PRIORITIES, STATUSES } from '../utils/constants'
import { SORT_OPTIONS } from '../utils/issueFilters'

// A filter that is set gets a teal border and tint, so it is obvious at a glance.
const fieldClass = (active) =>
  `w-full rounded-lg border px-3 py-2 text-sm text-navy-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 ${
    active ? 'border-brand-600 bg-brand-50' : 'border-line bg-white'
  }`

function SelectField({ label, value, onChange, options, allLabel, highlight = true }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass(highlight && value !== '')}
      >
        {allLabel && <option value="">{allLabel}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}

const toOptions = (list) => list.map((item) => ({ value: item, label: item }))

// Fully controlled: the parent owns the values, this only displays them.
// showSort: the Issues page sorts a list; the map has no order to sort.
// stacked:  one column, for the map sidebar.
export default function IssueFilters({
  filters,
  onChange,
  onReset,
  showSort = true,
  stacked = false,
}) {
  const activeCount = [filters.search.trim(), filters.category, filters.status, filters.priority].filter(
    Boolean,
  ).length

  const gridClass = stacked
    ? 'grid gap-3'
    : `grid gap-3 sm:grid-cols-2 ${showSort ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`

  return (
    <div className="card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-navy-900">Filters</h2>
        {activeCount > 0 && (
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
            {activeCount} active
          </span>
        )}
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted">
          Search title or description
        </span>
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
          placeholder="e.g. pothole"
          className={fieldClass(filters.search.trim() !== '')}
        />
      </label>

      <div className={gridClass}>
        <SelectField
          label="Category"
          value={filters.category}
          onChange={(v) => onChange('category', v)}
          options={toOptions(CATEGORIES)}
          allLabel="All categories"
        />
        <SelectField
          label="Status"
          value={filters.status}
          onChange={(v) => onChange('status', v)}
          options={toOptions(STATUSES)}
          allLabel="All statuses"
        />
        <SelectField
          label="Priority"
          value={filters.priority}
          onChange={(v) => onChange('priority', v)}
          options={toOptions(PRIORITIES)}
          allLabel="All priorities"
        />
        {showSort && (
          <SelectField
            label="Sort by"
            value={filters.sortBy}
            onChange={(v) => onChange('sortBy', v)}
            options={SORT_OPTIONS}
            highlight={false}
          />
        )}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="text-sm font-medium text-brand-700 hover:underline"
      >
        Reset filters
      </button>
    </div>
  )
}