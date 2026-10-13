import { useCallback, useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import {
  AttributionControl,
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'
import { useFinePointer } from '../hooks/useFinePointer'
import { useGeolocation } from '../hooks/useGeolocation'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../utils/constants'
import { describeAccuracy, zoomForAccuracy } from '../utils/geolocation'
import { getMarkerStyle, getMarkerZIndex } from '../utils/mapHelpers'
import { moveMap, prefersReducedMotion } from '../utils/motion'
import { getPinIcon } from '../utils/mapIcons'
import IssuePopupContent from './IssuePopupContent'
import MagnifierLens from './MagnifierLens'
import MapToolbar from './MapToolbar'

const LOCATE_ERRORS = {
  denied: "Location permission was denied. Allow it in your browser's site settings to use this button.",
  unavailable: 'Your position could not be determined. Check that location services are on.',
  timeout: 'Finding your position took too long. Try again.',
  unsupported: 'This browser does not support location detection.',
  unknown: 'Something went wrong while detecting your location.',
}

// Fits the view to the issues when the set changes (filters), or when
// `fitSignal` changes (the "show all" button). Switching color mode passes the
// same issues array, so the view doesn't jump.
function FitToIssues({ issues, fitSignal }) {
  const map = useMap()

  useEffect(() => {
    if (issues.length === 0) return
    const bounds = L.latLngBounds(issues.map((i) => [i.latitude, i.longitude]))
    map.fitBounds(bounds, {
      paddingTopLeft: [40, 40],
      paddingBottomRight: [72, 72], // room for the toolbar and Report button
      maxZoom: 16,
      animate: !prefersReducedMotion(),
    })
  }, [map, issues, fitSignal])

  return null
}

// Centers on one issue and opens its popup (used by the sidebar list).
// `focus` is a new object per click, so choosing the same report twice works.
function FocusIssue({ focus, issues, markerRefs }) {
  const map = useMap()

  useEffect(() => {
    if (!focus) return undefined
    const issue = issues.find((i) => i.id === focus.id)
    const marker = markerRefs.current.get(focus.id)
    if (!issue || !marker) return undefined

    const target = L.latLng(issue.latitude, issue.longitude)
    const zoom = Math.max(map.getZoom(), 15)
    const open = () => marker.openPopup()

    // moveend doesn't fire when the view is already there.
    if (map.getZoom() === zoom && map.getCenter().distanceTo(target) < 1) {
      open()
      return undefined
    }
    map.once('moveend', open)
    moveMap(map, target, zoom)
    return () => map.off('moveend', open)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus])

  return null
}

// issues:             filtered, all with valid coordinates
// colorBy:            'priority' | 'category' | 'status'
// fitSignal / onFit:  number that triggers a re-fit, and the callback for the button
// focus:              { id, at } or null
// magnifier:          is magnifier mode on?
// emptyMessage:       text shown over the map when there is nothing to show
export default function IssuesMap({
  issues,
  colorBy,
  fitSignal,
  onFit,
  focus,
  magnifier,
  onToggleMagnifier,
  emptyMessage,
}) {
  // The Leaflet map instance, shared with the toolbar. Using the ref callback
  // with state means the toolbar re-renders once the map exists.
  const [map, setMap] = useState(null)
  const markerRefs = useRef(new Map())
  const canMagnify = useFinePointer()
  const { status, position, error, locate } = useGeolocation()
  const [noteHidden, setNoteHidden] = useState(false)

  const lensColor = useCallback((issue) => getMarkerStyle(issue, colorBy).color, [colorBy])

  const handleLocate = async () => {
    setNoteHidden(false)
    const result = await locate()
    if (result && map) {
      moveMap(map, [result.latitude, result.longitude], zoomForAccuracy(result.accuracy))
    }
  }

  let note = null
  if (status === 'locating') note = 'Locating you...'
  else if (status === 'error' && error) note = LOCATE_ERRORS[error.type] ?? LOCATE_ERRORS.unknown
  else if (status === 'success' && position) {
    note = `Your position was found, ${describeAccuracy(position.accuracy).radiusText}.`
  }

  const magnifierOn = magnifier && canMagnify

  return (
    // isolate keeps Leaflet's internal z-index values (up to ~1000) inside this box.
    <div className="relative isolate h-full w-full overflow-hidden rounded-xl border border-line bg-pale shadow-sm">
      <MapContainer
        ref={setMap}
        center={DEFAULT_MAP_CENTER}
        zoom={DEFAULT_MAP_ZOOM}
        maxZoom={18}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Moved to the bottom-left so the Report button has the bottom-right. */}
        <AttributionControl position="bottomleft" prefix={false} />

        <FitToIssues issues={issues} fitSignal={fitSignal} />
        <FocusIssue focus={focus} issues={issues} markerRefs={markerRefs} />

        {issues.map((issue) => {
          const style = getMarkerStyle(issue, colorBy)
          return (
            <Marker
              key={issue.id}
              ref={(marker) => {
                if (marker) markerRefs.current.set(issue.id, marker)
                else markerRefs.current.delete(issue.id)
              }}
              position={[issue.latitude, issue.longitude]}
              icon={getPinIcon(style.color, style.resolved)}
              zIndexOffset={getMarkerZIndex(issue)}
              title={issue.title}
            >
              <Popup
                minWidth={260}
                maxWidth={260}
                autoPanPaddingTopLeft={[20, 20]}
                autoPanPaddingBottomRight={[72, 72]}
              >
                <IssuePopupContent issue={issue} />
              </Popup>
            </Marker>
          )
        })}

        {/* The user's detected position. interactive:false so it never blocks clicks. */}
        {position && Number.isFinite(position.accuracy) && (
          <Circle
            center={[position.latitude, position.longitude]}
            radius={position.accuracy}
            pathOptions={{ color: '#2563eb', weight: 1, fillOpacity: 0.12, interactive: false }}
          />
        )}
        {position && (
          <CircleMarker
            center={[position.latitude, position.longitude]}
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

        {magnifierOn && <MagnifierLens issues={issues} getColor={lensColor} />}
      </MapContainer>

      <MapToolbar
        map={map}
        magnifier={magnifier}
        canMagnify={canMagnify}
        onToggleMagnifier={onToggleMagnifier}
        onLocate={handleLocate}
        locating={status === 'locating'}
        onFit={onFit}
        fitDisabled={issues.length === 0}
      />

      {/* Notes: location result, magnifier hint, empty state */}
      <div className="pointer-events-none absolute left-3 top-3 z-[1000] flex max-w-[calc(100%-5.5rem)] flex-col gap-2 sm:max-w-sm">
        {note && !noteHidden && (
          <div
            role="status"
            className="pointer-events-auto flex items-start gap-2 rounded-lg border border-line bg-white/95 px-3 py-2 text-xs text-navy-900 shadow-md"
          >
            <span className="flex-1">{note}</span>
            {status !== 'locating' && (
              <button
                type="button"
                onClick={() => setNoteHidden(true)}
                aria-label="Dismiss message"
                className="rounded p-0.5 text-muted hover:bg-pale"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
        {magnifierOn && (
          <div className="rounded-lg bg-navy-900/90 px-3 py-2 text-xs text-white shadow-md">
            Magnifier on: move the pointer over the map. Press Esc or click the lens button to exit.
          </div>
        )}
        {emptyMessage && (
          <div className="rounded-lg border border-line bg-white/95 px-3 py-2 text-xs text-navy-900 shadow-md">
            {emptyMessage}
          </div>
        )}
      </div>

      <Link
        to="/issues/new"
        className="btn-primary absolute bottom-6 right-3 z-[1000] px-5 py-2.5 shadow-lg"
      >
        <Plus size={18} aria-hidden="true" />
        Report an issue
      </Link>
    </div>
  )
}