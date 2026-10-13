import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import StorageBanners from './StorageBanners'

export default function Layout() {
  return (
    <div className="min-h-screen bg-white text-navy-900">
      {/* Invisible until focused: lets keyboard users skip the header. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <StorageBanners />
        {/* Pages load on demand (Step 3), so show something while one arrives. */}
        <Suspense fallback={<p className="py-10 text-center text-sm text-muted">Loading...</p>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}