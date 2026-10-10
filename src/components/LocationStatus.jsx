import { describeAccuracy } from '../utils/geolocation'

const LEVEL_STYLES = {
  high: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  medium: 'border-amber-200 bg-amber-50 text-amber-800',
  low: 'border-orange-200 bg-orange-50 text-orange-800',
  poor: 'border-red-200 bg-red-50 text-red-800',
}

const box = 'rounded-md border px-3 py-2 text-xs'

export default function LocationStatus({ status, position, error }) {
  let content = null

  if (status === 'locating') {
    content = (
      <p className={`${box} border-slate-200 bg-white text-slate-600`}>
        Locating you... If your browser asks for permission, choose Allow.
      </p>
    )
  } else if (status === 'error' && error) {
    content = (
      <p role="alert" className={`${box} border-red-200 bg-red-50 text-red-700`}>
        {error.message}
      </p>
    )
  } else if (status === 'success' && position) {
    const accuracy = describeAccuracy(position.accuracy)

    content = (
      <div className={`${box} ${LEVEL_STYLES[accuracy.level]}`}>
        <p className="font-medium">
          {accuracy.label}: {accuracy.radiusText}
        </p>
        <p className="mt-0.5">{accuracy.detail}</p>
      </div>
    )
  }

  return <div aria-live="polite">{content}</div>
}