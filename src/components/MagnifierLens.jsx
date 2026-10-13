import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import L from 'leaflet'
import { useMap } from 'react-leaflet'

const LENS_SIZE = 180
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

// Rendered inside <MapContainer> (so useMap works) and mounted only while
// magnifier mode is on. Mounting creates ONE small extra Leaflet map; unmounting
// destroys it and removes every listener.
//
// How the magnification works: the lens map is centered on the geographic point
// under the pointer, at the main map's zoom + 1. One zoom level doubles the
// scale, so the lens shows the same place at exactly 2x with real map tiles.
//
// `issues` and `getColor` draw small dots in the lens; they are not pins and
// have no popups, so nothing is duplicated.
export default function MagnifierLens({ issues, getColor }) {
  const map = useMap()
  const lensRef = useRef(null)
  const innerRef = useRef(null)
  const lensMapRef = useRef(null)
  const dotsRef = useRef(null)

  // Create the lens map and wire it to the main map.
  useEffect(() => {
    const lens = lensRef.current
    const container = map.getContainer()
    let point = null // last pointer position, in container pixels
    let frame = 0

    const lensMap = L.map(innerRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      zoomAnimation: false,
      fadeAnimation: false,
      markerZoomAnimation: false,
      inertia: false,
      zoomSnap: 0, // allow fractional zoom, so we can mirror the main map exactly
      maxZoom: 20,
      center: map.getCenter(),
      zoom: map.getZoom() + 1,
    })
    L.tileLayer(TILE_URL, { maxZoom: 20, maxNativeZoom: 19 }).addTo(lensMap)
    dotsRef.current = L.layerGroup().addTo(lensMap)
    lensMapRef.current = lensMap
    lensMap.invalidateSize()

    lens.style.visibility = 'hidden'
    container.classList.add('urbanfix-magnifying')

    // Re-center the lens map on whatever is under the pointer right now.
    const sync = () => {
      if (!point) return
      lensMap.setView(map.containerPointToLatLng(point), map.getZoom() + 1, { animate: false })
    }
    // Several events can fire per frame; do the work once per frame.
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        sync()
      })
    }

    const onMove = (e) => {
      // Hide the lens over the popup and map controls so they stay readable.
      if (e.target instanceof Element && e.target.closest('.leaflet-popup, .leaflet-control')) {
        lens.style.visibility = 'hidden'
        return
      }
      point = map.mouseEventToContainerPoint(e)
      lens.style.transform = `translate(${point.x - LENS_SIZE / 2}px, ${point.y - LENS_SIZE / 2}px)`
      lens.style.visibility = 'visible'
      schedule()
    }
    const onLeave = () => {
      point = null
      lens.style.visibility = 'hidden'
    }

    container.addEventListener('mousemove', onMove)
    container.addEventListener('mouseleave', onLeave)
    map.on('move zoom', schedule) // panning or zooming under a stationary pointer

    return () => {
      cancelAnimationFrame(frame)
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
      map.off('move zoom', schedule)
      container.classList.remove('urbanfix-magnifying')
      lensMap.remove()
      lensMapRef.current = null
      dotsRef.current = null
    }
  }, [map])

  // Keep the dots in sync with the filtered issues and the active color mode.
  useEffect(() => {
    const group = dotsRef.current
    if (!group) return
    group.clearLayers()
    for (const issue of issues) {
      L.circleMarker([issue.latitude, issue.longitude], {
        radius: 7,
        color: '#ffffff',
        weight: 2,
        fillColor: getColor(issue),
        fillOpacity: 1,
        interactive: false,
      }).addTo(group)
    }
  }, [issues, getColor])

  // Portal into the map's own container so the lens is positioned in the same
  // pixel space as the pointer. pointer-events-none lets every click and drag
  // reach the real map underneath.
  return createPortal(
    <div
      ref={lensRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-[1200]"
      style={{ width: LENS_SIZE, height: LENS_SIZE, willChange: 'transform' }}
    >
      <div
        className="relative overflow-hidden rounded-full border-[3px] border-brand-600 bg-white shadow-xl ring-4 ring-white/70"
        style={{ width: LENS_SIZE, height: LENS_SIZE, isolation: 'isolate' }}
      >
        <div ref={innerRef} style={{ width: '100%', height: '100%' }} />
        {/* Crosshair dot marks the exact point being magnified */}
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600 ring-2 ring-white" />
      </div>
      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-white shadow">
        2×
      </span>
    </div>,
    map.getContainer(),
  )
}