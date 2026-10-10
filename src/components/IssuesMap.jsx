import { useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../utils/constants'
import { getPinIcon } from '../utils/mapIcons'
import { getIssueColor, getMarkerZIndex } from '../utils/mapHelpers'
import IssuePopupContent from './IssuePopupContent'

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

export default function IssuesMap({ issues, colorBy, fitSignal }) {
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

      <FitToIssues issues={issues} fitSignal={fitSignal} />

      {issues.map((issue) => (
        <Marker
          key={issue.id}
          position={[issue.latitude, issue.longitude]}
          icon={getPinIcon(getIssueColor(issue, colorBy))}
          zIndexOffset={getMarkerZIndex(issue)}
          title={issue.title}
        >
          <Popup minWidth={240} maxWidth={240}>
            <IssuePopupContent issue={issue} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}