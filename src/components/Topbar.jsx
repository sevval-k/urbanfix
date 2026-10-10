import { useEffect, useState } from 'react'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Search } from 'lucide-react'
import { getPageTitle } from '../utils/pageTitles'
import NotificationBell from './NotificationBell'

// Header search: sends the text to the Issues page, which filters by it.
function SearchBox({ className = '' }) {
  const [term, setTerm] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const q = term.trim()
    navigate({ pathname: '/issues', search: q ? `?${createSearchParams({ q })}` : '' })
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={className}>
      <label className="relative block">
        <span className="sr-only">Search issues by title or description</span>
        <Search
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search issues..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </label>
    </form>
  )
}

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const title = getPageTitle(pathname)

  // Keeps the browser tab title in sync with the page.
  useEffect(() => {
    document.title = `${title} · UrbanFix`
  }, [title])

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          aria-controls="sidebar"
          className="-ml-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* A div, not an h1: each page still owns its single h1 (Part B). */}
        <div className="truncate text-lg font-semibold text-slate-900">{title}</div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <SearchBox className="hidden w-64 sm:block lg:w-72" />

          {/* key remounts the bell on navigation, which closes its panel */}
          <NotificationBell key={pathname} />

          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-800 text-xs font-semibold text-white">
              UF
            </span>
            <div className="hidden leading-tight md:block">
              <div className="text-sm font-medium text-slate-800">Local workspace</div>
              <div className="text-xs text-slate-500">Saved in this browser</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-3 sm:hidden">
        <SearchBox />
      </div>
    </header>
  )
}