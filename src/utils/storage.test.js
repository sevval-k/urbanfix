import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { STORAGE_KEY } from './constants'
import { loadIssues, sanitizeIssue, saveIssues } from './storage'
import { SAMPLE_ISSUES } from '../data/sampleIssues'
import { makeIssue } from '../test/makeIssue'

const BACKUP_KEY = `${STORAGE_KEY}.corrupt-backup`
const envelope = (issues) => JSON.stringify({ version: 1, issues })

// Tests run in Node, which has no localStorage. This replaces
// window.localStorage with a small in-memory version and returns its data
// so tests can look inside.
function installFakeStorage(initial = {}) {
  const data = new Map(Object.entries(initial))
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key) => (data.has(key) ? data.get(key) : null),
      setItem: (key, value) => {
        data.set(key, String(value))
      },
    },
  })
  return data
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('loadIssues', () => {
  let data

  beforeEach(() => {
    data = installFakeStorage()
  })

  it('loads the samples on a first visit, without a notice', () => {
    const result = loadIssues()
    expect(result.issues).toEqual(SAMPLE_ISSUES)
    expect(result.notice).toBeNull()
  })

  it('returns what was saved', () => {
    saveIssues([makeIssue()])
    const result = loadIssues()
    expect(result.issues).toEqual([makeIssue()])
    expect(result.notice).toBeNull()
  })

  it('keeps an intentionally empty list empty (it does not reload the samples)', () => {
    saveIssues([])
    const result = loadIssues()
    expect(result.issues).toEqual([])
    expect(result.notice).toBeNull()
  })

  it('recovers from text that is not JSON, and keeps a backup', () => {
    data.set(STORAGE_KEY, '{broken')
    const result = loadIssues()
    expect(result.issues).toEqual(SAMPLE_ISSUES)
    expect(result.notice.message).toMatch(/could not be read/)
    expect(data.get(BACKUP_KEY)).toBe('{broken')
  })

  it('recovers from valid JSON in the wrong shape', () => {
    data.set(STORAGE_KEY, '[]')
    expect(loadIssues().notice).not.toBeNull()
  })

  it('recovers from an unknown format version', () => {
    data.set(STORAGE_KEY, JSON.stringify({ version: 2, issues: [] }))
    expect(loadIssues().notice).not.toBeNull()
  })

  it('skips damaged and duplicate records and says how many', () => {
    const raw = envelope([
      makeIssue({ id: 'ok-1' }),
      makeIssue({ id: 'bad-1', latitude: 'abc' }),
      makeIssue({ id: 'bad-2', category: 'Banana' }),
      makeIssue({ id: 'ok-1', title: 'Duplicate id' }),
    ])
    data.set(STORAGE_KEY, raw)

    const result = loadIssues()
    expect(result.issues.map((i) => i.id)).toEqual(['ok-1'])
    expect(result.issues[0].title).toBe('Test pothole') // the first one wins
    expect(result.notice.message).toMatch(/3 saved records were damaged/)
    expect(data.get(BACKUP_KEY)).toBe(raw)
  })

  it('does not crash when the browser blocks reading storage', () => {
    vi.stubGlobal('window', {
      localStorage: {
        getItem() {
          throw new Error('blocked')
        },
      },
    })
    expect(loadIssues().issues).toEqual(SAMPLE_ISSUES)
  })
})

describe('sanitizeIssue', () => {
  it('accepts a valid issue unchanged', () => {
    expect(sanitizeIssue(makeIssue())).toEqual(makeIssue())
  })

  it.each([
    ['null', null],
    ['a string', 'text'],
    ['an array', []],
    ['a missing title', makeIssue({ title: '' })],
    ['a missing id', makeIssue({ id: undefined })],
    ['a null date (new Date(null) would be 1970)', makeIssue({ createdAt: null })],
    ['an unparseable date', makeIssue({ createdAt: 'yesterday' })],
    ['a text latitude', makeIssue({ latitude: '41.0' })],
    ['a latitude out of range', makeIssue({ latitude: 91 })],
    ['a NaN longitude', makeIssue({ longitude: NaN })],
    ['an unknown status', makeIssue({ status: 'Done' })],
  ])('rejects %s', (_label, value) => {
    expect(sanitizeIssue(value)).toBeNull()
  })

  it('keeps the record but drops an unsafe photo link', () => {
    const clean = sanitizeIssue(makeIssue({ imageUrl: 'javascript:alert(1)' }))
    expect(clean.imageUrl).toBe('')
  })

  it('drops unexpected extra fields', () => {
    const clean = sanitizeIssue({ ...makeIssue(), secret: 'x' })
    expect(clean).not.toHaveProperty('secret')
  })

  it('only accepts isSample when it is exactly true', () => {
    expect(sanitizeIssue(makeIssue({ isSample: 'yes' })).isSample).toBe(false)
    expect(sanitizeIssue(makeIssue({ isSample: true })).isSample).toBe(true)
  })
})

describe('saveIssues', () => {
  it('reports success', () => {
    installFakeStorage()
    expect(saveIssues([makeIssue()])).toEqual({ ok: true })
  })

  it('reports a full-storage error clearly', () => {
    vi.stubGlobal('window', {
      localStorage: {
        setItem() {
          throw new DOMException('full', 'QuotaExceededError')
        },
      },
    })
    const result = saveIssues([makeIssue()])
    expect(result.ok).toBe(false)
    expect(result.message).toMatch(/storage for this site is full/)
  })

  it('reports blocked storage clearly', () => {
    vi.stubGlobal('window', {
      localStorage: {
        setItem() {
          throw new Error('blocked')
        },
      },
    })
    const result = saveIssues([makeIssue()])
    expect(result.ok).toBe(false)
    expect(result.message).toMatch(/can't be saved/)
  })
})