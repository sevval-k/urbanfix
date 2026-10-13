// Card with a title; the chart goes inside as children. The fixed height is
// essential: Recharts' ResponsiveContainer fills its parent.
export default function ChartCard({ title, children }) {
  return (
    <div className="card p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-800">{title}</h2>
      <div className="h-72 w-full">{children}</div>
    </div>
  )
}