import { useEffect, useState } from 'react'
import { Link, NavLink, createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  ClipboardList,
  Database,
  LayoutDashboard,
  Map as MapIcon,
  MapPin,
  Menu,
  Search,
  X,
} from 'lucide-react'
import { getPageTitle } from '../utils/pageTitles'
import IstanbulSkyline from './IstanbulSkyline'
import NotificationBell from './NotificationBell'

// Only routes that exist. "Reports" is the issue list, "Statistics" is the
// analysis page. The Report Issue form is reached through the teal buttons.
const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/map', label: 'Map', icon: MapIcon },
  { to: '/issues', label: 'Reports', icon: ClipboardList },
  { to: '/analysis', label: 'Statistics', icon: Activity },
  { to: '/data', label: 'Data', icon: Database },
]

const desktopLink = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-brand-600 ${
    isActive
      ? 'bg-brand-50 text-brand-700 shadow-[inset_0_-2px_0_0_#0d9488]'
      : 'text-muted hover:bg-pale hover:text-navy-900'
  }`

const mobileLink = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-navy-900 hover:bg-pale'
  }`

// Sends the text to the Issues page, which filters by it (?q=...).
function SearchBox({ className = '', onDone }) {
  const [term, setTerm] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const q = term.trim()
    navigate({ pathname: '/issues', search: q ? `?${createSearchParams({ q })}` : '' })
    onDone?.()
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={className}>
      <label className="relative block">
        <span className="sr-only">Search issues by title or description</span>
        <Search
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search issues..."
          className="w-full rounded-lg border border-line bg-white/90 py-2 pl-9 pr-3 text-sm text-navy-900 placeholder:text-muted/70 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
        />
      </label>
    </form>
  )
}

export default function Header() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const title = getPageTitle(pathname)

  // Keeps the browser tab title in sync with the page.
  useEffect(() => {
    document.title = `${title} · UrbanFix`
  }, [title])

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      {/* Decoration lives in its own clipped layer so dropdowns (the bell)
          are never cut off. It ignores the mouse and sits behind everything. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <IstanbulSkyline />
      </div>

      <div className="relative mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-brand-600"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white shadow-sm">
            <MapPin size={20} aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-navy-900">UrbanFix</span>
        </Link>

        <nav aria-label="Main navigation" className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={desktopLink}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <SearchBox className="hidden w-52 md:block xl:w-72" />

          {/* key remounts the bell on navigation, which closes its panel */}
          <NotificationBell key={pathname} />

          <div className="hidden items-center gap-2 border-l border-line pl-3 sm:flex">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-900 text-xs font-semibold text-white">
              UF
            </span>
            <div className="hidden leading-tight xl:block">
              <div className="text-sm font-medium text-navy-900">Local workspace</div>
              <div className="text-xs text-muted">Saved in this browser</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="rounded-lg p-2 text-navy-900 hover:bg-pale lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="relative border-t border-line bg-white px-4 pb-4 pt-3 lg:hidden">
          <SearchBox className="mb-3 md:hidden" onDone={closeMenu} />
          <nav aria-label="Main navigation" className="space-y-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={mobileLink} onClick={closeMenu}>
                <Icon size={18} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}