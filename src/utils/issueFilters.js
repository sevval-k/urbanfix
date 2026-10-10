export const DEFAULT_FILTERS = {
  search: '',
  category: '',
  status: '',
  priority: '',
  sortBy: 'newest',
}

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'priority-high', label: 'Highest priority first' },
  { value: 'priority-low', label: 'Lowest priority first' },
]

const PRIORITY_RANK = {
  Low: 1,
  Medium: 2,
  High: 3,
}
// Lowercase, strip accents, and treat Turkish dotless ı as i, so that
// "istanbul" finds "İstanbul" and "sisli" finds "Şişli". Both the search
// term and the issue text go through this same function.
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD') // splits "ş" into "s" + a combining mark
    .replace(/[\u0300-\u036f]/g, '') // removes the combining marks
    .replace(/ı/g, 'i')
}


// An empty string means "All", so that filter is skipped.
export function filterIssues(issues, { search, category, status, priority }) {
  const term = normalizeText(search.trim())

  return issues.filter((issue) => {
    if (category && issue.category !== category) return false
    if (status && issue.status !== status) return false
    if (priority && issue.priority !== priority) return false

    if (term) {
      const text = normalizeText(`${issue.title} ${issue.description}`)
      if (!text.includes(term)) return false
    }
    return true
  })
}

function byDateDesc(a, b) {
  return new Date(b.createdAt) - new Date(a.createdAt)
}

export function sortIssues(issues, sortBy) {
  const copy = [...issues]

  switch (sortBy) {
    case 'oldest':
      return copy.sort((a, b) => byDateDesc(b, a))

    case 'priority-high':
      return copy.sort(
        (a, b) =>
          PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority] ||
          byDateDesc(a, b),
      )

    case 'priority-low':
      return copy.sort(
        (a, b) =>
          PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
          byDateDesc(a, b),
      )

    case 'newest':
    default:
      return copy.sort(byDateDesc)
  }
}