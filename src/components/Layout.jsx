import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import StorageBanners from './StorageBanners'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Escape closes the mobile drawer.
  useEffect(() => {
    if (!sidebarOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* lg:pl-64 reserves the width of the fixed sidebar */}
      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <StorageBanners />
          <Outlet />
        </main>
      </div>
    </div>
  )
}