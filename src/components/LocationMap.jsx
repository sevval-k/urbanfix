import { useEffect } from 'react'
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../utils/constants'
import { getPinIcon } from '../utils/mapIcons'

const SELECTED_COLOR = '#059669'

function ClickToSelect({ onSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng.wrap()
      onSelect(lat, lng)
    },
  })
  return null
}

function FlyToTarget({ target }) {
  const map = useMap()

  useEffect(() => {
    if (target) {
      map.flyTo(
        [target.latitude, target.longitude],
        target.zoom
      )
    }
  }, [map, target])

  return null
}

export default function LocationMap({
  userPosition,
  selected,
  onSelect,
  flyTarget,
}) {
  const initialCenter = selected
    ? [selected.latitude, selected.longitude]
    : DEFAULT_MAP_CENTER

  const initialZoom = selected ? 16 : DEFAULT_MAP_ZOOM

  return (
    <MapContainer
      center={initialCenter}
      zoom={initialZoom}
      scrollWheelZoom={false}
      className="z-0 h-72 w-full rounded-md sm:h-96"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickToSelect onSelect={onSelect} />
      <FlyToTarget target={flyTarget} />

      {userPosition &&
        Number.isFinite(userPosition.accuracy) && (
          <Circle
            center={[
              userPosition.latitude,
              userPosition.longitude,
            ]}
            radius={userPosition.accuracy}
            pathOptions={{
              color: '#2563eb',
              weight: 1,
              fillOpacity: 0.12,
              interactive: false,
            }}
          />
        )}

      {userPosition && (
        <CircleMarker
          center={[
            userPosition.latitude,
            userPosition.longitude,
          ]}
          radius={7}
          pathOptions={{
            color: '#ffffff',
            weight: 2,
            fillColor: '#2563eb',
            fillOpacity: 1,
            interactive: false,
          }}
        />
      )}

      {selected && (
        <Marker
          position={[
            selected.latitude,
            selected.longitude,
          ]}
          icon={getPinIcon(SELECTED_COLOR)}
          draggable
          title="Issue location (drag to move)"
          eventHandlers={{
            dragend(e) {
              const { lat, lng } =
                e.target.getLatLng().wrap()

              onSelect(lat, lng)
            },
          }}
        />
      )}
    </MapContainer>
  )
}