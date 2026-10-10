import { describe, expect, it } from 'vitest'
import { getPageTitle } from './pageTitles'

describe('getPageTitle', () => {
  it.each([
    ['/', 'Dashboard'],
    ['/issues', 'Issues'],
    ['/issues/', 'Issues'],
    ['/issues/new', 'Report an Issue'],
    ['/issues/abc-123/edit', 'Edit Issue'],
    ['/map', 'Issues Map'],
    ['/analysis', 'Analysis'],
    ['/data', 'Data'],
    ['/nope', 'UrbanFix'],
  ])('%s -> %s', (path, title) => {
    expect(getPageTitle(path)).toBe(title)
  })
})