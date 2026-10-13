import L from 'leaflet'

// Leaflet's default marker images break when bundled with Vite, so pins are
// built from HTML and CSS. The pin is a square with three rounded corners,
// rotated 45 degrees so the sharp corner points down. Inline styles are used
// because Leaflet creates this HTML at runtime, outside what Tailwind scans.

const SIZE = 24

const DOT =
  '<span style="position:absolute;top:50%;left:50%;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:#fff;"></span>'

// Counter-rotated 45 degrees so the check mark stands upright.
const CHECK =
  '<svg viewBox="0 0 24 24" aria-hidden="true" style="position:absolute;top:50%;left:50%;width:14px;height:14px;margin:-7px 0 0 -7px;transform:rotate(45deg);"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

// Each color/style combination is built once and reused.
const cache = new Map()

export function getPinIcon(color, resolved = false) {
  const key = `${color}|${resolved}`
  if (!cache.has(key)) {
    cache.set(
      key,
      L.divIcon({
        // Custom class name: the default 'leaflet-div-icon' adds a white box.
        className: 'urbanfix-pin',
        html: `<span style="position:relative;display:block;width:${SIZE}px;height:${SIZE}px;border-radius:50% 50% 50% 0;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(18,43,73,.45);transform:rotate(-45deg);${
          resolved ? 'opacity:.9;' : ''
        }">${resolved ? CHECK : DOT}</span>`,
        iconSize: [SIZE, SIZE],
        // The pin's tip, measured from the icon's top-left corner.
        iconAnchor: [SIZE / 2, SIZE + 5],
        popupAnchor: [0, -(SIZE + 5)],
      }),
    )
  }
  return cache.get(key)
}