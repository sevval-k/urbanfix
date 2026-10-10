import { NavLink } from 'react-router-dom'
import {
  ClipboardList,
  Database,
  Layers,
  LayoutDashboard,
  Map as MapIcon,
  MapPin,
  Plus,
  X,
} from 'lucide-react'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/issues', label: 'Issues', icon: ClipboardList },
  { to: '/map', label: 'Map', icon: MapIcon },
  { to: '/analysis', label: 'Analysis', icon: Layers },
  { to: '/issues/new', label: 'Report Issue', icon: Plus },
  { to: '/data', label: 'Data', icon: Database },
]

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-navy-800 text-white'
      : 'text-slate-300 hover:bg-navy-800/60 hover:text-white'
  }`

// Fixed on large screens; a slide-in drawer on small ones.
// `open` only matters below the lg breakpoint.
export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Dark backdrop behind the drawer on small screens */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="sidebar"
        aria-label="Main navigation"
        // max-lg:invisible removes the closed drawer from the tab order.
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-900 transition-[transform,visibility] duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full max-lg:invisible'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white">
              <MapPin size={20} aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <div className="text-base font-semibold text-white">UrbanFix</div>
              <div className="text-[11px] text-slate-400">Urban issue management</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-1.5 text-slate-300 hover:bg-navy-800 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end className={linkClass} onClick={onClose}>
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-5 py-4 text-[11px] leading-snug text-slate-400">
          Map data &copy; OpenStreetMap contributors
        </div>
      </aside>
    </>
  )
}