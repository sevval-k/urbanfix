export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
}

const FALLBACK =
  'You can still submit your report by entering the coordinates below.'

const ERRORS_BY_CODE = {
  1: {
    type: 'denied',
    message: `Location permission was denied. To try again, allow location for this site in your browser's site settings (the icon next to the address bar), then press the button again. ${FALLBACK}`,
  },
  2: {
    type: 'unavailable',
    message: `Your position could not be determined. Check that location services are turned on in your device settings and that you have a connection. ${FALLBACK}`,
  },
  3: {
    type: 'timeout',
    message: `Finding your position took too long. Try again, or move closer to a window or outdoors. ${FALLBACK}`,
  },
}

export const UNSUPPORTED_ERROR = {
  type: 'unsupported',
  message: `This browser does not support location detection. ${FALLBACK}`,
}

const UNKNOWN_ERROR = {
  type: 'unknown',
  message: `Something went wrong while detecting your location. ${FALLBACK}`,
}

export function toLocationError(code) {
  return ERRORS_BY_CODE[code] ?? UNKNOWN_ERROR
}

function formatDistance(meters) {
  return meters < 1000
    ? `${Math.round(meters)} m`
    : `${(meters / 1000).toFixed(1)} km`
}

export function describeAccuracy(meters) {
  if (!Number.isFinite(meters)) {
    return {
      level: 'low',
      label: 'Unknown accuracy',
      radiusText: 'no accuracy value was reported',
      detail: 'Check the position on the map before submitting.',
    }
  }

  const radiusText = `within about ${formatDistance(meters)}`

  if (meters <= 25) {
    return {
      level: 'high',
      label: 'High accuracy',
      radiusText,
      detail:
        'Typical of a GPS fix outdoors. The coordinates were filled in below.',
    }
  }

  if (meters <= 100) {
    return {
      level: 'medium',
      label: 'Good accuracy',
      radiusText,
      detail:
        'Typical of Wi-Fi based positioning. The shaded circle on the map shows the uncertainty.',
    }
  }

  if (meters <= 1000) {
    return {
      level: 'low',
      label: 'Low accuracy',
      radiusText,
      detail:
        'The real spot may be a few hundred meters away, so check it before submitting.',
    }
  }

  return {
    level: 'poor',
    label: 'Very low accuracy',
    radiusText,
    detail:
      'The position may only be reliable at city or district level. Correct the coordinates before submitting.',
  }
}

export function zoomForAccuracy(meters) {
  if (!Number.isFinite(meters)) return 14
  if (meters <= 30) return 17
  if (meters <= 150) return 16
  if (meters <= 1000) return 14
  return 12
}