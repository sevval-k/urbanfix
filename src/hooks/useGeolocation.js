import { useCallback, useEffect, useRef, useState } from 'react'
import {
  UNSUPPORTED_ERROR,
  GEOLOCATION_OPTIONS,
  toLocationError,
} from '../utils/geolocation'

export function useGeolocation() {
  const [status, setStatus] = useState('idle')
  const [position, setPosition] = useState(null)
  const [error, setError] = useState(null)

  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
    }
  }, [])

  const locate = useCallback(
    () =>
      new Promise((resolve) => {
        if (!('geolocation' in navigator)) {
          setError(UNSUPPORTED_ERROR)
          setStatus('error')
          resolve(null)
          return
        }

        setStatus('locating')
        setError(null)

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const result = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              timestamp: pos.timestamp,
            }

            if (mounted.current) {
              setPosition(result)
              setStatus('success')
            }

            resolve(result)
          },
          (err) => {
            if (mounted.current) {
              setError(toLocationError(err.code))
              setStatus('error')
            }

            resolve(null)
          },
          GEOLOCATION_OPTIONS,
        )
      }),
    [],
  )

  return { status, position, error, locate }
}