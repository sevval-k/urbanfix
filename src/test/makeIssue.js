// Builds a valid issue for tests. Pass overrides for the fields that matter
// to the test, so each test shows only what it depends on.
export function makeIssue(overrides = {}) {
  return {
    id: 'test-1',
    title: 'Test pothole',
    description: 'A test description for the issue.',
    category: 'Pothole',
    priority: 'Medium',
    status: 'Reported',
    latitude: 41.0082,
    longitude: 28.9784,
    createdAt: '2026-10-01T10:00:00.000Z',
    imageUrl: '',
    isSample: false,
    ...overrides,
  }
}