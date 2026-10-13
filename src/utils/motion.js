// Respect the "reduce motion" setting for programmatic map movement.
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

// Moves a Leaflet map to a place, animated unless the user asked for less motion.
export function moveMap(map, latlng, zoom) {
  map.setView(latlng, zoom, { animate: !prefersReducedMotion() })
}