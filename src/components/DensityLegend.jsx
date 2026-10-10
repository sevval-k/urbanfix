export default function DensityLegend({ classes, cellLabel }) {
  if (classes.length === 0) return null

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Reports per {cellLabel} cell
      </h3>

      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {classes.map((c) => (
          <li
            key={c.label}
            className="flex items-center gap-1.5 text-sm text-slate-700"
          >
            <span
              aria-hidden="true"
              className="inline-block h-3 w-5 rounded-sm ring-1 ring-slate-300"
              style={{ backgroundColor: c.color }}
            />

            {c.label}
          </li>
        ))}
      </ul>
    </div>
  )
}