# Migrating UrbanFix to PostgreSQL / PostGIS

UrbanFix currently stores data in the browser's LocalStorage.
The Data page can export a SQL script that creates a spatial
database table and imports records.

## Field mapping

| App field | PostgreSQL column | Notes |
|---|---|---|
| `id` | `text PRIMARY KEY` | Stable report identifier |
| `title` | `text NOT NULL` | Report title |
| `description` | `text NOT NULL` | Report description |
| `category` | `text NOT NULL` | Validated using CHECK |
| `priority` | `text NOT NULL` | Validated using CHECK |
| `status` | `text NOT NULL` | Validated using CHECK |
| `createdAt` | `timestamptz` | Date and time with timezone |
| `imageUrl` | `text` | Optional image URL |
| `isSample` | `boolean` | Indicates sample data |
| `latitude`, `longitude` | `geometry(Point, 4326)` | Geographic point |

## Coordinate order

The exported geometry uses:

`ST_MakePoint(longitude, latitude)`

Longitude must come first because PostGIS uses X, Y coordinate order.

SRID 4326 identifies the WGS 84 coordinate reference system,
commonly used by GPS coordinates and web maps.

## Try it locally

After installing PostgreSQL and enabling PostGIS, create a database:

```bash
createdb urbanfix
```

Import your downloaded SQL file:

```bash
psql -d urbanfix -f urbanfix-postgis-YYYY-MM-DD.sql
```

Replace the example filename with the actual downloaded filename.

Count the imported reports:

```sql
SELECT count(*) FROM issues;
```

Show a few report locations:

```sql
SELECT title, ST_AsText(geom)
FROM issues
LIMIT 3;
```

## Spatial index

The export creates a GiST index on the geometry column.
This helps PostgreSQL perform spatial searches efficiently.

## Grid density in SQL

For an area such as Istanbul, a projected coordinate system
can be used to group reports into approximately 1 km grid cells.

```sql
SELECT
  floor(ST_X(p) / 1000)::int AS cell_x,
  floor(ST_Y(p) / 1000)::int AS cell_y,
  count(*) AS issue_count
FROM (
  SELECT ST_Transform(geom, 32635) AS p
  FROM issues
) AS t
GROUP BY 1, 2
ORDER BY issue_count DESC;
```

The SQL grid may differ slightly from the browser grid because
the coordinate projection and grid origin are different.

## What a real backend still needs

- An API, such as Node.js/Express or Python/FastAPI
- User authentication and permissions
- Server-side data validation
- Photo storage
- Database migration management

The current app exports SQL but does not connect directly
to a PostgreSQL database.