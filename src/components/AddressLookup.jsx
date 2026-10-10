import { useReverseGeocode } from '../hooks/useReverseGeocode'

export default function AddressLookup({ latitude, longitude }) {
  const { status, address, error, lookup } = useReverseGeocode()
  const loading = status === 'loading'

  return (
    <div className="space-y-1" aria-live="polite">
      {status === 'success' && address && (
        <div className="text-xs text-slate-700">
          <span className="font-medium">Approximate address: </span>
          <span title={address.full}>{address.short}</span>
        </div>
      )}

      {status === 'error' && (
        <div role="alert" className="text-xs text-red-600">
          {error}
        </div>
      )}

      {status !== 'success' && (
        <button
          type="button"
          onClick={() => lookup(latitude, longitude)}
          disabled={loading}
          className="text-xs font-medium text-emerald-700 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? 'Looking up...'
            : status === 'error'
              ? 'Try again'
              : 'Show address'}
        </button>
      )}

      <div className="text-[11px] leading-snug text-slate-400">
        Optional. Pressing the button sends these coordinates to OpenStreetMap
        (Nominatim). Address data © OpenStreetMap contributors.
      </div>
    </div>
  )
}