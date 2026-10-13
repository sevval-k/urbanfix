import { useSyncExternalStore } from 'react'

// True on devices with a mouse-like pointer that can hover. The magnifier
// follows the pointer, so it needs this; touch screens fall back to zoom controls.
const QUERY = '(hover: hover) and (pointer: fine)'

function subscribe(callback) {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

export function useFinePointer() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}