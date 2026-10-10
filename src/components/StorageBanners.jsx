import { useIssues } from '../hooks/useIssues'

// Shows storage problems above every page. The load-time notice can be
// dismissed. The save error stays for as long as saving keeps failing,
// because users must not believe their work is safe when it isn't.
export default function StorageBanners() {
  const { notice, dismissNotice, storageError } = useIssues()
  if (!notice && !storageError) return null

  return (
    <div className="mb-4 space-y-2">
      {storageError && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {storageError}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
        >
          <span>{notice.message}</span>
          <button
            type="button"
            onClick={dismissNotice}
            className="shrink-0 font-medium underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}