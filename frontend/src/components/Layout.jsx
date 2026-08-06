import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F8F9FA' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 md:p-7 page-enter max-w-screen-xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
