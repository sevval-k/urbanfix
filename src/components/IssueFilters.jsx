import { CATEGORIES, PRIORITIES, STATUSES } from '../utils/constants'
import { SORT_OPTIONS } from '../utils/issueFilters'

const fieldClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'

function SelectField({ label, value, onChange, options, allLabel }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
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

const toOptions = (list) =>
  list.map((item) => ({ value: item, label: item }))

export default function IssueFilters({
  filters,
  onChange,
  onReset,
  showSort = true,
}) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-600">
          Search title or description
        </span>

        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
          placeholder="e.g. pothole"
          className={fieldClass}
        />
      </label>

      <div
        className={`grid gap-3 sm:grid-cols-2 ${
          showSort ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
        }`}
      >
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
          />
        )}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="text-sm font-medium text-emerald-700 hover:underline"
      >
        Reset filters
      </button>
    </div>
  )
}