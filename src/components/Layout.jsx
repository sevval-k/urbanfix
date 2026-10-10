import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import StorageBanners from './StorageBanners'

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <StorageBanners />
        {/* Outlet renders whichever child route matches the current URL */}
        <Outlet />
      </main>
    </div>
  )
}