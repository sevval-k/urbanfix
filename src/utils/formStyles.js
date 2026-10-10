export function inputClass(hasError) {
  const base =
    'w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1'

  return hasError
    ? `${base} border-red-500 focus:border-red-500 focus:ring-red-500`
    : `${base} border-slate-300 focus:border-emerald-500 focus:ring-emerald-500`
}