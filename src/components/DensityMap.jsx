import { useEffect } from 'react'
import L from 'leaflet'
import {
  CircleMarker,
  MapContainer,
  Pane,
  Popup,
  Rectangle,
  TileLayer,
  useMap,
} from 'react-leaflet'

import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
} from '../utils/constants'

import { colorForCount } from '../utils/density'
import { formatBreakdown } from '../utils/analysis'

// Haritayı tüm raporları gösterecek şekilde ayarlar.
function FitToIssues({ issues, fitSignal }) {
  const map = useMap()

  useEffect(() => {
    if (issues.length === 0) return

    const bounds = L.latLngBounds(
      issues.map((issue) => [issue.latitude, issue.longitude]),
    )

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 16,
    })
  }, [map, issues, fitSignal])

  return null
}

// Seçilen hücreye yakınlaştırır.
function FocusCell({ focus }) {
  const map = useMap()

  useEffect(() => {
    if (!focus) return

    map.fitBounds(
      [
        [focus.south, focus.west],
        [focus.north, focus.east],
      ],
      {
        padding: [40, 40],
        maxZoom: 16,
      },
    )
  }, [map, focus])

  return null
}

// Ana yoğunluk haritası.
export default function DensityMap({
  issues,
  cells,
  classes,
  showPoints,
  focus,
  fitSignal,
}) {
  return (
    <MapContainer
      center={DEFAULT_MAP_CENTER}
      zoom={DEFAULT_MAP_ZOOM}
      className="z-0 h-[60vh] min-h-80 w-full rounded-lg border border-slate-200"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitToIssues
        issues={issues}
        fitSignal={fitSignal}
      />

      <FocusCell focus={focus} />

      {/* Kare hücreleri rapor noktalarının altında tutar. */}
      <Pane
        name="density-cells"
        style={{ zIndex: 410 }}
      >
        {cells.map((cell) => (
          <Rectangle
            key={cell.key}
            bounds={[
              [cell.bounds.south, cell.bounds.west],
              [cell.bounds.north, cell.bounds.east],
            ]}
            pathOptions={{
              color: '#7f1d1d',
              weight: 1,
              opacity: 0.6,
              fillColor: colorForCount(cell.count, classes),
              fillOpacity: 0.6,
            }}
          >
            <Popup>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-800">
                  {cell.count}{' '}
                  {cell.count === 1 ? 'report' : 'reports'} in this cell
                </div>

                <div className="text-xs text-slate-600">
                  {formatBreakdown(cell.issues)}
                </div>
              </div>
            </Popup>
          </Rectangle>
        ))}
      </Pane>

      {/* İsteğe bağlı rapor noktaları. */}
      {showPoints && (
        <Pane
          name="density-points"
          style={{ zIndex: 420 }}
        >
          {issues.map((issue) => (
            <CircleMarker
              key={issue.id}
              center={[
                issue.latitude,
                issue.longitude,
              ]}
              radius={3}
              pathOptions={{
                color: '#ffffff',
                weight: 1,
                fillColor: '#1e293b',
                fillOpacity: 1,
                interactive: false,
              }}
            />
          ))}
        </Pane>
      )}
    </MapContainer>
  )
}