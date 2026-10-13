import { useEffect } from 'react'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CircleMarker, MapContainer, TileLayer, useMap } from 'react-leaflet'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../utils/constants'
import { getMarkerStyle } from '../utils/mapHelpers'
import EmptyState from './EmptyState'

// Fits the view to the issues whenever they change (add, edit, delete).
function FitToIssues({ issues }) {
  const map = useMap()

  useEffect(() => {
    if (issues.length === 0) return
    const bounds = L.latLngBounds(issues.map((i) => [i.latitude, i.longitude]))
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14, animate: false })
  }, [map, issues])

  return null
}

// A small, non-interactive overview built from the real issues.
// `issues` must already have valid coordinates.
export default function MapPreview({ issues }) {
  return (
    <div className="card flex h-full flex-col p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">Map preview</h2>
        <Link
          to="/map"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
        >
          Open map
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      {issues.length === 0 ? (
        <EmptyState message="Reported issues will appear on the map." />
      ) : (
        <>
          {/* Dragging and zooming are off so the preview never captures page
              scrolling on phones. The attribution stays, as OSM requires. */}
          <MapContainer
            center={DEFAULT_MAP_CENTER}
            zoom={DEFAULT_MAP_ZOOM}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            boxZoom={false}
            keyboard={false}
            zoomControl={false}
            className="z-0 h-64 w-full rounded-lg"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitToIssues issues={issues} />
            {issues.map((issue) => (
              <CircleMarker
                key={issue.id}
                center={[issue.latitude, issue.longitude]}
                radius={6}
                pathOptions={{
                  color: '#ffffff',
                  weight: 1.5,
                  fillColor: getMarkerStyle(issue, 'priority').color,
                  fillOpacity: 0.95,
                  interactive: false,
                }}
              />
            ))}
          </MapContainer>
          <p className="mt-2 text-xs text-slate-500">
          Colored by priority; resolved issues are grey. Open the full map for the legend, filters, and details.
          </p>
        </>
      )}
    </div>
  )
}