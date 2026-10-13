import { Check } from 'lucide-react'

// Marker styles and how many visible issues use each. Color is never the only
// carrier of meaning: every row has a text label and a count, and resolved
// issues also carry a check mark.
export default function MapLegend({ items }) {
  return (
    <ul className="grid gap-1.5">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-sm text-navy-900">
          {/* Inline style: the color is only known at runtime. */}
          <span
            aria-hidden="true"
            className="grid h-4 w-4 place-items-center rounded-full ring-1 ring-black/10"
            style={{ backgroundColor: item.color }}
          >
            {item.resolved && <Check size={10} strokeWidth={3.5} className="text-white" />}
          </span>
          {item.label}
          <span className="ml-auto text-xs tabular-nums text-muted">{item.count}</span>
        </li>
      ))}
    </ul>
  )
}