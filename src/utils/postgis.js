import { CATEGORIES, PRIORITIES, STATUSES } from './constants'
import { hasValidCoordinates } from './mapHelpers'

// Safely format a value as a PostgreSQL text literal.
const quote = (value) =>
  `'${String(value).replaceAll('\0', '').replaceAll("'", "''")}'`

const quoteList = (values) => values.map(quote).join(', ')

// Create the database schema using the app's own constants.
export const POSTGIS_SCHEMA = `CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS issues (
  id          text PRIMARY KEY,
  title       text NOT NULL,
  description text NOT NULL,
  category    text NOT NULL CHECK (category IN (${quoteList(CATEGORIES)})),
  priority    text NOT NULL CHECK (priority IN (${quoteList(PRIORITIES)})),
  status      text NOT NULL CHECK (status IN (${quoteList(STATUSES)})),
  created_at  timestamptz NOT NULL,
  image_url   text,
  is_sample   boolean NOT NULL DEFAULT false,
  geom        geometry(Point, 4326) NOT NULL
);

CREATE INDEX IF NOT EXISTS issues_geom_gix ON issues USING GIST (geom);`

function toRow(issue) {
  const values = [
    quote(issue.id),
    quote(issue.title),
    quote(issue.description),
    quote(issue.category),
    quote(issue.priority),
    quote(issue.status),
    `${quote(issue.createdAt)}::timestamptz`,
    issue.imageUrl ? quote(issue.imageUrl) : 'NULL',
    issue.isSample ? 'true' : 'false',
    // PostGIS expects longitude first, then latitude.
    `ST_SetSRID(ST_MakePoint(${issue.longitude}, ${issue.latitude}), 4326)`,
  ]

  return `  (${values.join(', ')})`
}

// Generate a complete SQL export. Invalid coordinates are skipped.
export function issuesToPostgisSQL(issues, generatedAt = new Date()) {
  const usable = issues.filter(hasValidCoordinates)

  const parts = [
    '-- UrbanFix export for PostgreSQL + PostGIS',
    `-- Generated: ${generatedAt.toISOString()}`,
    `-- Records: ${usable.length}`,
    '-- Coordinates use WGS 84 (SRID 4326).',
    '',
    'BEGIN;',
    '',
    POSTGIS_SCHEMA,
    '',
  ]

  if (usable.length > 0) {
    parts.push(
      'INSERT INTO issues (id, title, description, category, priority, status, created_at, image_url, is_sample, geom)',
      'VALUES',
      usable.map(toRow).join(',\n'),
      'ON CONFLICT (id) DO NOTHING;',
      '',
    )
  }

  parts.push('COMMIT;', '')
  return parts.join('\n')
}