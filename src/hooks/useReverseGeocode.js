import { useCallback, useEffect, useRef, useState } from 'react'
import { reverseGeocode } from '../utils/reverseGeocode'

export function useReverseGeocode() {
  const [status, setStatus] = useState('idle')
  const [address, setAddress] = useState(null)
  const [error, setError] = useState('')

  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
    }
  }, [])

  const lookup = useCallback(async (latitude, longitude) => {
    setStatus('loading')
    setError('')

    try {
      const result = await reverseGeocode(latitude, longitude)

      if (!mounted.current) return

      setAddress(result)
      setStatus('success')
    } catch (err) {
      if (!mounted.current) return

      setError(err.message)
      setStatus('error')
    }
  }, [])

  return { status, address, error, lookup }
}