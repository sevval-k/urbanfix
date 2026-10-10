import { CATEGORIES, PRIORITIES, STATUSES, STORAGE_KEY } from './constants'
import { SAMPLE_ISSUES } from '../data/sampleIssues'

const FORMAT_VERSION = 1
const BACKUP_KEY = `${STORAGE_KEY}.corrupt-backup`

const isText = (value) => typeof value === 'string' && value.trim() !== ''
// Number.isFinite does not convert strings, so "41.0" is rejected on purpose.
const inRange = (value, limit) => Number.isFinite(value) && Math.abs(value) <= limit

function isHttpUrl(text) {
  try {
    return ['http:', 'https:'].includes(new URL(text).protocol)
  } catch {
    return false
  }
}

// Returns a clean issue, or null if the record can't be trusted.
// Only known fields are copied, so unexpected extra data is discarded.
export function sanitizeIssue(raw) {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return null

  const {
    id, title, description, category, priority, status,
    latitude, longitude, createdAt, imageUrl, isSample,
  } = raw

  if (!isText(id) || !isText(title) || !isText(description)) return null
  if (!CATEGORIES.includes(category)) return null
  if (!PRIORITIES.includes(priority)) return null
  if (!STATUSES.includes(status)) return null
  if (!inRange(latitude, 90) || !inRange(longitude, 180)) return null
  // typeof check first: new Date(null) is a valid date (1970), a trap.
  if (typeof createdAt !== 'string' || Number.isNaN(new Date(createdAt).getTime())) return null

  return {
    id,
    title,
    description,
    category,
    priority,
    status,
    latitude,
    longitude,
    createdAt,
    // Optional fields get safe defaults instead of rejecting the record.
    imageUrl: typeof imageUrl === 'string' && isHttpUrl(imageUrl) ? imageUrl : '',
    isSample: isSample === true,
  }
}

// Best effort: if even the backup can't be written, we carry on.
function backupRaw(raw) {
  try {
    window.localStorage.setItem(BACKUP_KEY, raw)
  } catch {
    // ignore
  }
}

const BACKUP_HINT = `A copy of the original data was kept in your browser under the key "${BACKUP_KEY}".`

function unreadable(raw) {
  backupRaw(raw)
  return {
    issues: SAMPLE_ISSUES,
    notice: {
      message: `Your saved data could not be read, so the demonstration samples were loaded instead. ${BACKUP_HINT}`,
    },
  }
}

// Always returns { issues, notice }. It never throws.
export function loadIssues() {
  let raw
  try {
    // Even reading can throw when the browser blocks storage entirely.
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    // The app still works for this visit. saveIssues reports the problem.
    return { issues: SAMPLE_ISSUES, notice: null }
  }

  // Nothing stored: first visit, so start with the demonstration samples.
  if (raw === null) return { issues: SAMPLE_ISSUES, notice: null }

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    return unreadable(raw)
  }

  if (!parsed || parsed.version !== FORMAT_VERSION || !Array.isArray(parsed.issues)) {
    return unreadable(raw)
  }

  const seen = new Set()
  const issues = []
  for (const item of parsed.issues) {
    const clean = sanitizeIssue(item)
    // Two records with one id would break React keys and edit/delete.
    if (clean && !seen.has(clean.id)) {
      seen.add(clean.id)
      issues.push(clean)
    }
  }

  const skipped = parsed.issues.length - issues.length
  if (skipped > 0) {
    backupRaw(raw)
    return {
      issues,
      notice: {
        message: `${skipped} saved ${skipped === 1 ? 'record was' : 'records were'} damaged and skipped. ${BACKUP_HINT}`,
      },
    }
  }

  return { issues, notice: null }
}

// The outcome of the latest save lives here, outside React. The provider
// reads it with useSyncExternalStore, so no setState is needed in an effect.
let lastSaveError = null
const saveErrorListeners = new Set()

function setSaveError(message) {
  if (message === lastSaveError) return
  lastSaveError = message
  saveErrorListeners.forEach((listener) => listener())
}

export function subscribeSaveError(listener) {
  saveErrorListeners.add(listener)
  return () => saveErrorListeners.delete(listener)
}

export function getSaveError() {
  return lastSaveError
}


// Returns { ok: true } or { ok: false, message }. It never throws.
// Returns { ok: true } or { ok: false, message }. It never throws.
export function saveIssues(issues) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: FORMAT_VERSION, issues }),
    )
    setSaveError(null)
    return { ok: true }
  } catch (err) {
    const full =
      err?.name === 'QuotaExceededError' || err?.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    const message = full
      ? "Your browser's storage for this site is full, so your latest changes are NOT being saved. Delete some records or export your data."
      : "Changes can't be saved in this browser (storage may be blocked, for example in private browsing). Your data will be lost when you reload or close this page."
    setSaveError(message)
    return { ok: false, message }
  }
}