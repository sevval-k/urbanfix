import { CATEGORIES, PRIORITIES, STATUSES } from './constants'

export const EMPTY_FORM = {
  title: '',
  description: '',
  category: '',
  priority: 'Medium',
  status: 'Reported',
  latitude: '',
  longitude: '',
  imageUrl: '',
}

const ALLOWED_URL_PROTOCOLS = ['http:', 'https:']
const MISSING_LOCATION = 'Choose the issue location on the map or use your current location.'

export function parseCoordinate(raw) {
  const text = String(raw).trim().replace(',', '.')
  return /^-?\d+(\.\d+)?$/.test(text) ? Number(text) : NaN
}

export function getCoordinates(values) {
  const latitude = parseCoordinate(values.latitude)
  const longitude = parseCoordinate(values.longitude)

  const valid =
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180

  return valid ? { latitude, longitude } : null
}

export function validateIssue(values) {
  const errors = {}

  const title = values.title.trim()

  if (!title) {
    errors.title = 'Title is required.'
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters.'
  } else if (title.length > 100) {
    errors.title = 'Title must be 100 characters or fewer.'
  }

  const description = values.description.trim()

  if (!description) {
    errors.description = 'Description is required.'
  } else if (description.length < 10) {
    errors.description = 'Please describe the problem in at least 10 characters.'
  } else if (description.length > 1000) {
    errors.description = 'Description must be 1000 characters or fewer.'
  }

  if (!values.category) {
    errors.category = 'Please choose a category.'
  } else if (!CATEGORIES.includes(values.category)) {
    errors.category = 'Invalid category.'
  }

  if (!PRIORITIES.includes(values.priority)) {
    errors.priority = 'Please choose a priority.'
  }

  if (!STATUSES.includes(values.status)) {
    errors.status = 'Please choose a status.'
  }

const latitude = parseCoordinate(values.latitude)

  if (!values.latitude.trim()) {
    errors.latitude = MISSING_LOCATION
  } else if (Number.isNaN(latitude)) {
    errors.latitude = 'Enter a valid number, for example 41.0082.'
  } else if (latitude < -90 || latitude > 90) {
    errors.latitude = 'Latitude must be between -90 and 90.'
  }

  const longitude = parseCoordinate(values.longitude)

  if (!values.longitude.trim()) {
    errors.longitude = MISSING_LOCATION
  } else if (Number.isNaN(longitude)) {
    errors.longitude = 'Enter a valid number, for example 28.9784.'
  } else if (longitude < -180 || longitude > 180) {
    errors.longitude = 'Longitude must be between -180 and 180.'
  }

  const imageUrl = values.imageUrl.trim()

  if (imageUrl) {
    try {
      const parsed = new URL(imageUrl)

      if (!ALLOWED_URL_PROTOCOLS.includes(parsed.protocol)) {
        errors.imageUrl = 'The link must start with http:// or https://'
      }
    } catch {
      errors.imageUrl =
        'Enter a valid link, for example https://example.com/photo.jpg'
    }
  }

  return errors
}

export function issueToFormValues(issue) {
  return {
    title: issue.title,
    description: issue.description,
    category: issue.category,
    priority: issue.priority,
    status: issue.status,
    latitude: String(issue.latitude),
    longitude: String(issue.longitude),
    imageUrl: issue.imageUrl ?? '',
  }
}

export function formValuesToIssueData(values) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category,
    priority: values.priority,
    status: values.status,
    latitude: parseCoordinate(values.latitude),
    longitude: parseCoordinate(values.longitude),
    imageUrl: values.imageUrl.trim(),
  }
}