import { useMemo, useState } from 'react'
import { useIssues } from '../hooks/useIssues'
import { SAMPLE_ISSUES } from '../data/sampleIssues'
import { issuesToGeoJSON } from '../utils/geojson'
import { issuesToPostgisSQL } from '../utils/postgis'
import { downloadTextFile } from '../utils/download'
import StatCard from '../components/StatCard'
import ConfirmDialog from '../components/ConfirmDialog'

const buttonClass =
  'rounded-md border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50'

function Section({ title, children }) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      {children}
    </div>
  )
}

export default function DataPage() {
  const { issues, removeSamples, restoreSamples, clearAll } = useIssues()
  const [includeSamples, setIncludeSamples] = useState(true)
  const [pending, setPending] = useState(null) // 'samples' | 'all' | null

  // Everything below is derived from the issues array.
  const sampleCount = useMemo(() => issues.filter((i) => i.isSample).length, [issues])
  const myCount = issues.length - sampleCount
  const exportCount = includeSamples ? issues.length : myCount

  const hasMissingSamples = useMemo(() => {
    const ids = new Set(issues.map((i) => i.id))
    return SAMPLE_ISSUES.some((sample) => !ids.has(sample.id))
  }, [issues])

  // Rough size of what is stored (characters, close to bytes for this data).
  const sizeKB = useMemo(() => (JSON.stringify(issues).length / 1024).toFixed(1), [issues])

  const exportList = () => (includeSamples ? issues : issues.filter((i) => !i.isSample))
  // 'en-CA' formats dates as YYYY-MM-DD, which sorts well in file names.
  const today = () => new Date().toLocaleDateString('en-CA')

  const handleExport = () => {
    downloadTextFile(
      `urbanfix-issues-${today()}.geojson`,
      JSON.stringify(issuesToGeoJSON(exportList()), null, 2),
      'application/geo+json',
    )
  }

  const handleSqlExport = () => {
    downloadTextFile(
      `urbanfix-postgis-${today()}.sql`,
      issuesToPostgisSQL(exportList()),
      'application/sql',
    )
  }

  const dialogs = {
    samples: {
      title: 'Remove all sample records?',
      message: `${sampleCount} demonstration ${sampleCount === 1 ? 'record' : 'records'} will be removed. Your own reports are not affected, and you can restore the samples later.`,
      confirmLabel: 'Remove samples',
      action: removeSamples,
    },
    all: {
      title: 'Delete ALL records?',
      message: `All ${issues.length} records, including your own reports, will be permanently deleted from this browser. Export them first if you want a copy.`,
      confirmLabel: 'Delete everything',
      action: clearAll,
    },
  }

  const handleConfirm = () => {
    dialogs[pending].action()
    setPending(null)
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Data</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total records" value={issues.length} />
        <StatCard label="Your reports" value={myCount} accent="text-emerald-600" />
        <StatCard label="Sample records" value={sampleCount} accent="text-amber-600" />
        <StatCard label="Stored size" value={`${sizeKB} KB`} />
      </div>

      <Section title="Export as GeoJSON">
        <p className="text-sm text-slate-600">
          Download the issues as a GeoJSON file of points (WGS 84 / EPSG:4326). It opens in GIS
          software such as QGIS (Layer, Add Layer, Add Vector Layer). Each record&apos;s
          category, priority, status, date, and <code>isSample</code> flag become attributes.
        </p>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={includeSamples}
            onChange={(e) => setIncludeSamples(e.target.checked)}
          />
          Include sample records
        </label>
        <button
          type="button"
          onClick={handleExport}
          disabled={exportCount === 0}
          className={`${buttonClass} border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700`}
        >
          Export {exportCount} {exportCount === 1 ? 'record' : 'records'} (.geojson)
        </button>
        {exportCount === 0 && (
          <p className="text-xs text-slate-500">There is nothing to export with these settings.</p>
        )}
      </Section>

      <Section title="Export for PostgreSQL / PostGIS">
        <p className="text-sm text-slate-600">
          Download a <code>.sql</code> script that creates an <code>issues</code> table with a
          PostGIS point column (<code>geometry(Point, 4326)</code>) and inserts the records. This
          prepares a future backend. The app itself still stores data in LocalStorage. It follows
          the &quot;Include sample records&quot; setting above.
        </p>
        <button
          type="button"
          onClick={handleSqlExport}
          disabled={exportCount === 0}
          className={`${buttonClass} border-slate-300 text-slate-700 hover:bg-slate-100`}
        >
          Export {exportCount} {exportCount === 1 ? 'record' : 'records'} (.sql)
        </button>
      </Section>

      <Section title="Sample data">
        <p className="text-sm text-slate-600">
          Sample records are demonstration data, tagged &quot;Sample&quot; everywhere they appear.
          Remove them before using the app for real reports, or restore them for a demo.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setPending('samples')}
            disabled={sampleCount === 0}
            className={`${buttonClass} border-slate-300 text-slate-700 hover:bg-slate-100`}
          >
            Remove sample records
          </button>
          <button
            type="button"
            onClick={restoreSamples}
            disabled={!hasMissingSamples}
            className={`${buttonClass} border-slate-300 text-slate-700 hover:bg-slate-100`}
          >
            Restore sample records
          </button>
        </div>
      </Section>

      <Section title="Delete everything">
        <p className="text-sm text-slate-600">
          Permanently removes every record from this browser, including your own reports.
        </p>
        <button
          type="button"
          onClick={() => setPending('all')}
          disabled={issues.length === 0}
          className={`${buttonClass} border-red-200 text-red-700 hover:bg-red-50`}
        >
          Delete all records
        </button>
      </Section>

      <Section title="About storage: limitations">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>
            Data lives <strong>only in this browser on this device</strong>. It is not sent to a
            server and is not shared with other users.
          </li>
          <li>
            Another browser, another device, a private window, and the deployed website (a
            different address from <code>localhost</code>) each have their own, separate data.
          </li>
          <li>
            Clearing site data or browsing history deletes it. Some browsers may also delete
            data for sites you haven&apos;t visited for a while. It is not a backup, so export
            anything important.
          </li>
          <li>
            Capacity is limited to roughly 5 MB per site, and the exact limit depends on the
            browser. If it fills up, saving fails and a warning is shown.
          </li>
          <li>
            Anyone who can use this browser profile can read the data, so never store sensitive
            personal information.
          </li>
          <li>
            Two open tabs don&apos;t sync. If both change data, the last one to save wins and
            overwrites the other.
          </li>
          <li>
            Photos are stored as links only, not as files, and links to other websites can stop
            working.
          </li>
        </ul>
      </Section>

      {pending && (
        <ConfirmDialog
          title={dialogs[pending].title}
          message={dialogs[pending].message}
          confirmLabel={dialogs[pending].confirmLabel}
          onConfirm={handleConfirm}
          onCancel={() => setPending(null)}
        />
      )}
    </section>
  )
}