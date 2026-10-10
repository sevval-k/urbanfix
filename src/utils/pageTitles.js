// Maps a URL path to the title shown in the header.
export function getPageTitle(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'

  if (path === '/') return 'Dashboard'
  if (path === '/issues') return 'Issues'
  if (path === '/issues/new') return 'Report an Issue'
  if (/^\/issues\/[^/]+\/edit$/.test(path)) return 'Edit Issue'
  if (path === '/map') return 'Issues Map'
  if (path === '/analysis') return 'Analysis'
  if (path === '/data') return 'Data'
  return 'UrbanFix'
}