import { useState } from 'react'
import { useGeolocation } from '../hooks/useGeolocation'
import { zoomForAccuracy } from '../utils/geolocation'
import { getCoordinates } from '../utils/validation'
import FormField from './FormField'
import LocationMap from './LocationMap'
import LocationStatus from './LocationStatus'

function sameSpot(a, b) {
  return (
    a.latitude.toFixed(6) === b.latitude.toFixed(6) &&
    a.longitude.toFixed(6) === b.longitude.toFixed(6)
  )
}

function describeSource(selected, position, manualPin) {
  if (position && sameSpot(selected, position)) {
    return 'your detected position'
  }

  if (manualPin && sameSpot(selected, manualPin)) {
    return 'the pin you placed on the map'
  }

  return 'the saved or typed coordinates'
}

export default function LocationFields({
  values,
  fieldProps,
  getError,
  onLocationChange,
}) {
  const { status, position, error, locate } = useGeolocation()

  const [manualPin, setManualPin] = useState(null)
  const [flyTarget, setFlyTarget] = useState(null)
  const [manualOpen, setManualOpen] = useState(false)

  const selected = getCoordinates(values)

  const handleMapSelect = (latitude, longitude) => {
    setManualPin({ latitude, longitude })
    onLocationChange(latitude, longitude)
  }

  const handleUseMyLocation = async () => {
    const result = await locate()

    if (result) {
      onLocationChange(result.latitude, result.longitude)

      setFlyTarget({
        latitude: result.latitude,
        longitude: result.longitude,
        zoom: zoomForAccuracy(result.accuracy),
      })
    }
  }

  const handleReturnToPin = () => {
    onLocationChange(manualPin.latitude, manualPin.longitude)

    setFlyTarget({
      ...manualPin,
      zoom: 16,
    })
  }

  const showReturnButton =
    manualPin && !(selected && sameSpot(selected, manualPin))

  const latError = getError('latitude')
  const lngError = getError('longitude')

  const missing =
    !values.latitude.trim() || !values.longitude.trim()

  const pickerError = missing
    ? latError || lngError
    : undefined

  const forcedOpen =
    !missing && Boolean(latError || lngError)

  const showInputs = manualOpen || forcedOpen

  return (
    <fieldset
      id="location-section"
      tabIndex={-1}
      className={`space-y-3 rounded-md border p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
        pickerError
          ? 'border-red-400'
          : 'border-slate-200'
      }`}
    >
      <legend className="px-1 text-sm font-medium text-slate-700">
        Location <span className="text-red-600">*</span>
      </legend>

      <p className="text-sm text-slate-600">
        Click or tap the map to place the pin, drag the pin
        to fine-tune it, or use your current location.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={status === 'locating'}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'locating'
            ? 'Locating...'
            : 'Use My Current Location'}
        </button>

        {showReturnButton && (
          <button
            type="button"
            onClick={handleReturnToPin}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Go back to my map pin
          </button>
        )}
      </div>

      <LocationStatus
        status={status}
        position={position}
        error={error}
      />

      <LocationMap
        userPosition={position}
        selected={selected}
        onSelect={handleMapSelect}
        flyTarget={flyTarget}
      />

      <p className="text-xs text-slate-500">
        Green pin: the issue location. Blue dot: your detected
        position (shaded circle = uncertainty). Your position
        is only used to fill in the location and stays in your
        browser.
      </p>

      <p className="text-sm text-slate-700" aria-live="polite">
        {selected ? (
          <>
            Selected location:{' '}
            <strong>
              {selected.latitude.toFixed(6)},{' '}
              {selected.longitude.toFixed(6)}
            </strong>{' '}
            <span className="text-slate-500">
              ({describeSource(selected, position, manualPin)})
            </span>
          </>
        ) : (
          'No location selected yet.'
        )}
      </p>

      {pickerError && (
        <p role="alert" className="text-xs text-red-600">
          {pickerError}
        </p>
      )}

      {!forcedOpen && (
        <button
          type="button"
          onClick={() => setManualOpen((prev) => !prev)}
          aria-expanded={manualOpen}
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          {manualOpen
            ? 'Hide coordinate fields'
            : 'Enter coordinates manually (optional)'}
        </button>
      )}

      {showInputs && (
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            id="latitude"
            label="Latitude"
            error={latError}
          >
            <input
              type="text"
              inputMode="decimal"
              placeholder="41.0082"
              {...fieldProps('latitude')}
            />
          </FormField>

          <FormField
            id="longitude"
            label="Longitude"
            error={lngError}
          >
            <input
              type="text"
              inputMode="decimal"
              placeholder="28.9784"
              {...fieldProps('longitude')}
            />
          </FormField>
        </div>
      )}
    </fieldset>
  )
}