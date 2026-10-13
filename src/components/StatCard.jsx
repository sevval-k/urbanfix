// Static strings so Tailwind can detect every class.
const TONES = {
  slate: 'bg-slate-100 text-slate-600',
  brand: 'bg-brand-50 text-brand-700',
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-emerald-50 text-emerald-600',
}

// One number with a label, an optional icon, and an optional footer line.
// (Old callers that pass `accent` still work; that prop is simply ignored.)
export default function StatCard({ label, value, icon: Icon, tone = 'slate', footer }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">{value}</p>
        </div>
        {Icon && (
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${TONES[tone] ?? TONES.slate}`}
          >
            <Icon size={18} aria-hidden="true" />
          </span>
        )}
      </div>
      {footer && <div className="mt-2 text-xs text-slate-500">{footer}</div>}
    </div>
  )
}