import { useState, useEffect } from 'react'
import { Bell, User, Menu, RefreshCw, ExternalLink, ChevronDown } from 'lucide-react'
import { websiteApi } from '../utils/api'

const B   = '#1A73E8'
const INK = '#202124'
const MUT = '#5F6368'

export default function TopBar({ onMenuClick }) {
  const [now, setNow]             = useState(new Date())
  const [crawling, setCrawling]   = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleCrawl = async () => {
    setCrawling(true)
    try { await websiteApi.triggerCrawl() } catch {}
    setTimeout(() => setCrawling(false), 3000)
  }

  const formatDate = (d) => d.toLocaleDateString('en-AE', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
  const formatTime = (d) => d.toLocaleTimeString('en-AE', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

  const notifications = [
    { msg: 'Website crawl completed',       time: '2 min ago',  dot: '#1E8E3E' },
    { msg: 'New lead from Full Stack page', time: '15 min ago', dot: B },
    { msg: 'Traffic spike — +22% today',   time: '1 hr ago',   dot: '#E37400' },
  ]

  const iconBtn = (hover) => ({
    onMouseEnter: e => { e.currentTarget.style.backgroundColor = '#F1F3F4' },
    onMouseLeave: e => { e.currentTarget.style.backgroundColor = 'transparent' },
  })

  return (
    <header
      className="relative z-10 h-14 flex items-center px-5 gap-3"
      style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.06)' }}
    >
      {/* Mobile menu */}
      <button onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg transition-colors"
        style={{ color: MUT }} {...iconBtn()}>
        <Menu size={18} />
      </button>

      {/* Website pill */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: '#F8F9FA', border: '1px solid #DADCE0' }}>
          <span className="text-xs font-medium" style={{ color: '#9AA0A6' }}>Website</span>
          <span className="text-sm font-semibold" style={{ color: INK }}>CISPRO Training</span>
          <a href="https://cisprotraining.com" target="_blank" rel="noreferrer"
            className="transition-colors" style={{ color: '#9AA0A6' }}
            onMouseEnter={e => e.currentTarget.style.color = B}
            onMouseLeave={e => e.currentTarget.style.color = '#9AA0A6'}>
            <ExternalLink size={11} />
          </a>
        </div>

        {/* Online pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ backgroundColor: '#E6F4EA', border: '1px solid #B7DFC4' }}>
          <span className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#1E8E3E', animation: 'pulse 2s infinite' }} />
          <span className="text-xs font-semibold" style={{ color: '#1E8E3E' }}>Online</span>
        </div>
      </div>

      {/* Clock */}
      <div className="hidden md:flex flex-col items-end leading-none">
        <span className="text-xs font-mono font-medium" style={{ color: INK }}>
          {formatTime(now)}
        </span>
        <span className="mt-0.5 text-xs" style={{ color: '#9AA0A6', fontSize: '0.62rem' }}>
          {formatDate(now)}
        </span>
      </div>

      {/* Re-crawl */}
      <button onClick={handleCrawl} disabled={crawling}
        title="Re-crawl website"
        className="p-2 rounded-lg transition-colors disabled:opacity-40"
        style={{ color: MUT }} {...iconBtn()}>
        <RefreshCw size={15} className={crawling ? 'animate-spin' : ''} />
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
          className="relative p-2 rounded-lg transition-colors"
          style={{ color: MUT }} {...iconBtn()}>
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: B, border: '2px solid #FFFFFF' }} />
        </button>

        {notifOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-12 w-80 z-50 rounded-xl overflow-hidden"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #DADCE0', boxShadow: '0 8px 24px rgba(60,64,67,0.18)' }}>
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid #F1F3F4' }}>
                <span className="font-semibold text-sm" style={{ color: INK }}>Notifications</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#E8F0FE', color: B }}>
                  {notifications.length} new
                </span>
              </div>
              {notifications.map((n, i) => (
                <div key={i}
                  className="flex gap-3 px-4 py-3 cursor-pointer transition-colors"
                  style={{ borderBottom: i < notifications.length - 1 ? '1px solid #F1F3F4' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8F9FA'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: n.dot }} />
                  <div>
                    <div className="text-xs leading-snug" style={{ color: '#3C4043' }}>{n.msg}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#9AA0A6', fontSize: '0.62rem' }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-colors"
          {...iconBtn()}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: B }}>
            <User size={13} color="#FFFFFF" strokeWidth={2} />
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <div className="text-xs font-semibold" style={{ color: INK }}>Admin</div>
            <div className="text-xs" style={{ color: MUT, fontSize: '0.62rem' }}>ASR Digital</div>
          </div>
          <ChevronDown size={12} color="#9AA0A6" className="hidden sm:block" />
        </button>

        {profileOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
            <div className="absolute right-0 top-12 w-44 z-50 rounded-xl overflow-hidden py-1"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #DADCE0', boxShadow: '0 8px 24px rgba(60,64,67,0.18)' }}>
              {['Profile', 'Settings', 'Sign Out'].map((item) => (
                <button key={item} onClick={() => setProfileOpen(false)}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                  style={{ color: '#3C4043' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8F9FA'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  {item}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  )
}
