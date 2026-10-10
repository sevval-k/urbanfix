import L from 'leaflet'

const SIZE = 24

const cache = new Map()

export function getPinIcon(color) {
  if (!cache.has(color)) {
    cache.set(
      color,
      L.divIcon({
        className: 'urbanfix-pin',
        html: `<span style="position:relative;display:block;width:${SIZE}px;height:${SIZE}px;border-radius:50% 50% 50% 0;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.5);transform:rotate(-45deg);"><span style="position:absolute;top:50%;left:50%;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:#fff;"></span></span>`,
        iconSize: [SIZE, SIZE],
        iconAnchor: [SIZE / 2, SIZE + 5],
        popupAnchor: [0, -(SIZE + 5)],
      }),
    )
  }
  return cache.get(color)
}