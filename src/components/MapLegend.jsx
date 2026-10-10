export default function MapLegend({ title, items }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h2>

      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-1.5 text-sm text-slate-700"
          >
            <span
              aria-hidden="true"
              className="inline-block h-3 w-3 rounded-full ring-1 ring-slate-300"
              style={{ backgroundColor: item.color }}
            />

            {item.label}

            <span className="text-slate-400">({item.count})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}