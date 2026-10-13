// Shared input styling. Error state turns the border red.
// Both class strings are written out in full so Tailwind can detect them.
export function inputClass(hasError) {
  const base =
    'w-full rounded-lg border bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-muted/60 focus:outline-none focus:ring-1'
  return hasError
    ? `${base} border-red-500 focus:border-red-500 focus:ring-red-500`
    : `${base} border-line focus:border-brand-600 focus:ring-brand-600`
}