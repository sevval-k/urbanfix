import { describe, expect, it } from 'vitest'
import {
  EMPTY_FORM,
  formValuesToIssueData,
  getCoordinates,
  issueToFormValues,
  parseCoordinate,
  validateIssue,
} from './validation'
import { makeIssue } from '../test/makeIssue'

const validForm = {
  title: 'Deep pothole',
  description: 'A deep hole in the right lane.',
  category: 'Pothole',
  priority: 'Medium',
  status: 'Reported',
  latitude: '41.0082',
  longitude: '28.9784',
  imageUrl: '',
}

const errorsFor = (changes) => validateIssue({ ...validForm, ...changes })

describe('parseCoordinate', () => {
  it.each([
    ['41.5', 41.5],
    ['41,5', 41.5], // comma decimal separator
    ['  41.5  ', 41.5], // surrounding spaces
    ['-3', -3],
    ['0', 0],
  ])('accepts %j', (input, expected) => {
    expect(parseCoordinate(input)).toBe(expected)
  })

  it.each(['abc', '', '1e3', '41.', '.5', '+5', '41.5.5', '--5'])('rejects %j', (input) => {
    expect(parseCoordinate(input)).toBeNaN()
  })
})

describe('validateIssue', () => {
  it('accepts a valid form', () => {
    expect(validateIssue(validForm)).toEqual({})
  })

  it('reports every missing required field on an empty form, in screen order', () => {
    const errors = validateIssue(EMPTY_FORM)
    expect(Object.keys(errors)).toEqual([
      'title',
      'description',
      'category',
      'latitude',
      'longitude',
    ])
    expect(errors.latitude).toMatch(/Choose the issue location/)
  })

  it('treats a whitespace-only title as empty', () => {
    expect(errorsFor({ title: '   ' }).title).toBe('Title is required.')
  })

  it('enforces title length limits at the boundaries', () => {
    expect(errorsFor({ title: 'ab' }).title).toMatch(/at least 3/)
    expect(errorsFor({ title: 'abc' }).title).toBeUndefined()
    expect(errorsFor({ title: 'a'.repeat(100) }).title).toBeUndefined()
    expect(errorsFor({ title: 'a'.repeat(101) }).title).toMatch(/100 characters/)
  })

  it('enforces description length limits at the boundaries', () => {
    expect(errorsFor({ description: 'too short' }).description).toMatch(/at least 10/)
    expect(errorsFor({ description: '0123456789' }).description).toBeUndefined()
    expect(errorsFor({ description: 'a'.repeat(1001) }).description).toMatch(/1000 characters/)
  })

  it('rejects unknown categories, priorities, and statuses', () => {
    expect(errorsFor({ category: 'Banana' }).category).toBe('Invalid category.')
    expect(errorsFor({ priority: 'Urgent' }).priority).toBeDefined()
    expect(errorsFor({ status: 'Done' }).status).toBeDefined()
  })

  it('validates latitude', () => {
    expect(errorsFor({ latitude: 'abc' }).latitude).toMatch(/valid number/)
    expect(errorsFor({ latitude: '91' }).latitude).toMatch(/between -90 and 90/)
    expect(errorsFor({ latitude: '-91' }).latitude).toMatch(/between -90 and 90/)
    expect(errorsFor({ latitude: '90' }).latitude).toBeUndefined()
    expect(errorsFor({ latitude: '90.0001' }).latitude).toBeDefined()
    expect(errorsFor({ latitude: '41,0082' }).latitude).toBeUndefined()
  })

  it('validates longitude', () => {
    expect(errorsFor({ longitude: '181' }).longitude).toMatch(/between -180 and 180/)
    expect(errorsFor({ longitude: '-180' }).longitude).toBeUndefined()
    expect(errorsFor({ longitude: 'x' }).longitude).toMatch(/valid number/)
  })

  it('treats the photo link as optional but validates it when present', () => {
    expect(errorsFor({ imageUrl: '' }).imageUrl).toBeUndefined()
    expect(errorsFor({ imageUrl: 'https://example.com/a.jpg' }).imageUrl).toBeUndefined()
    expect(errorsFor({ imageUrl: 'not a url' }).imageUrl).toBeDefined()
    expect(errorsFor({ imageUrl: 'ftp://example.com/a.jpg' }).imageUrl).toBeDefined()
    expect(errorsFor({ imageUrl: 'javascript:alert(1)' }).imageUrl).toBeDefined()
  })
})

describe('getCoordinates', () => {
  it('returns numbers for valid text', () => {
    expect(getCoordinates({ latitude: '41,5', longitude: '29.25' })).toEqual({
      latitude: 41.5,
      longitude: 29.25,
    })
  })

  it('returns null for half-typed, invalid, or out-of-range values', () => {
    expect(getCoordinates({ latitude: '41.', longitude: '29' })).toBeNull()
    expect(getCoordinates({ latitude: '', longitude: '29' })).toBeNull()
    expect(getCoordinates({ latitude: '91', longitude: '29' })).toBeNull()
    expect(getCoordinates({ latitude: '41', longitude: '181' })).toBeNull()
  })
})

describe('form <-> issue conversion', () => {
  it('trims text and turns coordinates into numbers', () => {
    const data = formValuesToIssueData({
      ...validForm,
      title: '  Deep pothole  ',
      latitude: '41,0082',
    })
    expect(data.title).toBe('Deep pothole')
    expect(data.latitude).toBe(41.0082)
    expect(data.longitude).toBe(28.9784)
  })

  it('survives a round trip through the form', () => {
    const issue = makeIssue()
    expect(formValuesToIssueData(issueToFormValues(issue))).toEqual({
      title: issue.title,
      description: issue.description,
      category: issue.category,
      priority: issue.priority,
      status: issue.status,
      latitude: issue.latitude,
      longitude: issue.longitude,
      imageUrl: issue.imageUrl,
    })
  })
})