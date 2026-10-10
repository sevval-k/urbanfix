// Converts issues to GeoJSON (RFC 7946). Pure functions, no browser calls.
// Coordinates are WGS 84 (EPSG:4326), the standard GeoJSON system.

export function issueToFeature(issue) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      // GeoJSON order is [longitude, latitude], the OPPOSITE of Leaflet's
      // [latitude, longitude]. Do not swap them.
      coordinates: [issue.longitude, issue.latitude],
    },
    // Everything except the position goes into properties, so GIS software
    // shows it as attribute columns. isSample lets users separate demo
    // data from real reports after export.
    properties: {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      category: issue.category,
      priority: issue.priority,
      status: issue.status,
      createdAt: issue.createdAt,
      imageUrl: issue.imageUrl || null,
      isSample: issue.isSample,
    },
  }
}

export function issuesToGeoJSON(issues) {
  return {
    type: 'FeatureCollection',
    features: issues.map(issueToFeature),
  }
}