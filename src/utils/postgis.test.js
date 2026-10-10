import { describe, expect, it } from 'vitest'
import { issuesToPostgisSQL } from './postgis'
import { makeIssue } from '../test/makeIssue'

const fixedDate = new Date('2026-10-10T00:00:00.000Z')
const sql = (issues) => issuesToPostgisSQL(issues, fixedDate)

describe('issuesToPostgisSQL', () => {
  it('wraps everything in one transaction with a header', () => {
    const text = sql([makeIssue()])
    expect(text.startsWith('-- UrbanFix export')).toBe(true)
    expect(text).toContain('-- Generated: 2026-10-10T00:00:00.000Z')
    expect(text).toContain('-- Records: 1')
    expect(text).toContain('\nBEGIN;\n')
    expect(text.trimEnd().endsWith('COMMIT;')).toBe(true)
  })

  it('creates the PostGIS extension, a geometry column, and a spatial index', () => {
    const text = sql([makeIssue()])
    expect(text).toContain('CREATE EXTENSION IF NOT EXISTS postgis;')
    expect(text).toContain('geom        geometry(Point, 4326) NOT NULL')
    expect(text).toContain('USING GIST (geom)')
  })

  it('builds the CHECK lists from the app constants', () => {
    expect(sql([makeIssue()])).toContain(
      "CHECK (status IN ('Reported', 'Under Review', 'In Progress', 'Resolved'))",
    )
  })

  it('writes the point as (longitude, latitude)', () => {
    expect(sql([makeIssue({ latitude: 41.0082, longitude: 28.9784 })])).toContain(
      'ST_SetSRID(ST_MakePoint(28.9784, 41.0082), 4326)',
    )
  })

  it('doubles single quotes in text', () => {
    const text = sql([makeIssue({ title: "Driver's side pothole" })])
    expect(text).toContain("'Driver''s side pothole'")
  })

  it('cannot be broken out of by a malicious title', () => {
    const text = sql([makeIssue({ title: "x'); DROP TABLE issues; --" })])
    // The whole text stays inside one quoted literal.
    expect(text).toContain("'x''); DROP TABLE issues; --'")
  })

  it('writes NULL for a missing photo link and a quoted link otherwise', () => {
    expect(sql([makeIssue({ imageUrl: '' })])).toContain('NULL, false, ST_SetSRID')
    expect(sql([makeIssue({ imageUrl: 'https://example.com/a.jpg' })])).toContain(
      "'https://example.com/a.jpg'",
    )
  })

  it('writes the sample flag as a boolean', () => {
    expect(sql([makeIssue({ isSample: true })])).toContain('true, ST_SetSRID')
  })

  it('skips records with invalid coordinates', () => {
    const text = sql([makeIssue({ id: 'good' }), makeIssue({ id: 'bad', latitude: NaN })])
    expect(text).toContain("'good'")
    expect(text).not.toContain("'bad'")
    expect(text).toContain('-- Records: 1')
  })

  it('still produces a valid script when there are no records', () => {
    const text = sql([])
    expect(text).not.toContain('INSERT INTO')
    expect(text).toContain('BEGIN;')
    expect(text).toContain('COMMIT;')
  })
})