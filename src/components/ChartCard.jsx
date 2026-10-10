export default function ChartCard({ title, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-semibold text-slate-800">
        {title}
      </h2>
      <div className="h-72 w-full">{children}</div>
    </div>
  )
}
