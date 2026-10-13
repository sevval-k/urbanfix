import { LocateFixed, Maximize, Minus, Plus, Search } from 'lucide-react'

function ToolButton({ label, onClick, disabled = false, pressed, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      className={`grid h-10 w-10 place-items-center rounded-lg border shadow-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50 ${
        pressed
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-line bg-white text-navy-900 hover:bg-pale'
      }`}
    >
      {children}
    </button>
  )
}

// Sits ABOVE the map as a sibling, not inside the Leaflet container. That way
// Leaflet never intercepts its clicks, and React's handlers work normally.
export default function MapToolbar({
  map,
  magnifier,
  canMagnify,
  onToggleMagnifier,
  onLocate,
  locating,
  onFit,
  fitDisabled,
}) {
  const magnifierLabel = !canMagnify
    ? 'Magnifier needs a mouse. On touch screens, use pinch zoom or the + and - buttons.'
    : magnifier
      ? 'Turn off magnifier (Esc)'
      : 'Magnifier (2× lens)'

  return (
    <div
      role="toolbar"
      aria-label="Map tools"
      aria-orientation="vertical"
      className="absolute right-3 top-3 z-[1000] flex flex-col gap-2"
    >
      <ToolButton
        label={magnifierLabel}
        pressed={magnifier && canMagnify}
        disabled={!canMagnify}
        onClick={onToggleMagnifier}
      >
        <Search size={18} aria-hidden="true" />
      </ToolButton>
      <ToolButton label="Zoom in" onClick={() => map?.zoomIn()} disabled={!map}>
        <Plus size={18} aria-hidden="true" />
      </ToolButton>
      <ToolButton label="Zoom out" onClick={() => map?.zoomOut()} disabled={!map}>
        <Minus size={18} aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label={locating ? 'Locating you...' : 'Go to my current location'}
        onClick={onLocate}
        disabled={!map || locating}
      >
        <LocateFixed size={18} aria-hidden="true" />
      </ToolButton>
      <ToolButton label="Show all reports" onClick={onFit} disabled={fitDisabled}>
        <Maximize size={18} aria-hidden="true" />
      </ToolButton>
    </div>
  )
}