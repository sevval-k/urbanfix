export default function EmptyState({ message }) {
  return (
    <div className="flex h-full min-h-32 items-center justify-center rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
      {message}
    </div>
  )
}