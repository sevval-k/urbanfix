import { describe, expect, it } from 'vitest'
import { issuesToGeoJSON, issueToFeature } from './geojson'
import { makeIssue } from '../test/makeIssue'

describe('issueToFeature', () => {
  it('puts LONGITUDE first, then latitude', () => {
    const feature = issueToFeature(makeIssue({ latitude: 40.9903, longitude: 29.0291 }))
    expect(feature.geometry).toEqual({ type: 'Point', coordinates: [29.0291, 40.9903] })
  })

  it('keeps the attributes as properties', () => {
    const { properties } = issueToFeature(makeIssue({ isSample: true }))
    expect(properties).toMatchObject({
      id: 'test-1',
      title: 'Test pothole',
      category: 'Pothole',
      priority: 'Medium',
      status: 'Reported',
      isSample: true,
    })
  })

  it('exports a missing photo link as null, not an empty string', () => {
    expect(issueToFeature(makeIssue({ imageUrl: '' })).properties.imageUrl).toBeNull()
    expect(
      issueToFeature(makeIssue({ imageUrl: 'https://example.com/a.jpg' })).properties.imageUrl,
    ).toBe('https://example.com/a.jpg')
  })
})

describe('issuesToGeoJSON', () => {
  it('builds a FeatureCollection with one feature per issue', () => {
    const collection = issuesToGeoJSON([makeIssue({ id: 'a' }), makeIssue({ id: 'b' })])
    expect(collection.type).toBe('FeatureCollection')
    expect(collection.features).toHaveLength(2)
  })

  it('handles an empty list', () => {
    expect(issuesToGeoJSON([])).toEqual({ type: 'FeatureCollection', features: [] })
  })

  it('can be turned into JSON text and back without loss', () => {
    const collection = issuesToGeoJSON([makeIssue()])
    expect(JSON.parse(JSON.stringify(collection))).toEqual(collection)
  })
})