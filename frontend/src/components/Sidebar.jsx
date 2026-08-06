import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Globe, BarChart3, Users, BookOpen, FileText,
  Search, Activity, Lightbulb, FileBarChart2, Settings, ChevronRight
} from 'lucide-react'
import ASRLogo from './ASRLogo'

const B   = '#1A73E8'   // Google Blue
const INK = '#202124'   // Near-black
const MUT = '#5F6368'   // Muted gray

const NAV_SECTIONS = [
  {
    heading: 'Main',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/overview',  icon: Globe,           label: 'Website Overview' },
      { to: '/traffic',   icon: BarChart3,       label: 'Traffic Analytics' },
    ],
  },
  {
    heading: 'Content',
    items: [
      { to: '/leads',   icon: Users,    label: 'Leads' },
      { to: '/courses', icon: BookOpen, label: 'Courses' },
      { to: '/blogs',   icon: FileText, label: 'Blogs' },
      { to: '/seo',     icon: Search,   label: 'SEO' },
    ],
  },
  {
    heading: 'Insights',
    items: [
      { to: '/health',   icon: Activity,      label: 'Website Health' },
      { to: '/insights', icon: Lightbulb,     label: 'AI Insights' },
      { to: '/reports',  icon: FileBarChart2, label: 'Reports' },
    ],
  },
  {
    heading: 'System',
    items: [
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ backgroundColor: 'rgba(32,33,36,0.4)', backdropFilter: 'blur(2px)' }}
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 z-30 flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ backgroundColor: '#FFFFFF', borderRight: '1px solid #DADCE0' }}
      >
        {/* ── Logo ──────────────────────────────── */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #F1F3F4' }}>
          <ASRLogo size="xs" theme="dark" />
          <div className="text-xs font-medium mt-1 pl-0.5" style={{ color: '#9AA0A6' }}>
            Client Dashboard
          </div>
        </div>

        {/* ── Client pill ───────────────────────── */}
        <div className="px-4 pt-4">
          <div className="px-3 py-2.5 rounded-xl"
            style={{ backgroundColor: '#E8F0FE', border: '1px solid #C5D9FB' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-0.5"
              style={{ color: '#1558B0', fontSize: '0.6rem' }}>
              Active Client
            </div>
            <div className="text-sm font-semibold" style={{ color: INK }}>
              CISPRO Training
            </div>
            <div className="text-xs" style={{ color: MUT }}>
              cisprotraining.com
            </div>
          </div>
        </div>

        {/* ── Navigation ────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {NAV_SECTIONS.map(({ heading, items }) => (
            <div key={heading}>
              <div className="px-3 mb-1 text-xs font-semibold uppercase tracking-widest"
                style={{ color: '#9AA0A6', fontSize: '0.6rem' }}>
                {heading}
              </div>

              <div className="space-y-0.5">
                {items.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 transition-all duration-150 group
                       ${isActive ? 'nav-active' : 'rounded-xl'}`
                    }
                    style={({ isActive }) => ({
                      color: isActive ? B : MUT,
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={17}
                          className="flex-shrink-0"
                          style={{ color: isActive ? B : '#9AA0A6' }}
                        />
                        <span
                          className="flex-1 text-sm leading-none"
                          style={{
                            color: isActive ? B : '#3C4043',
                            fontWeight: isActive ? 600 : 500,
                          }}
                        >
                          {label}
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Footer ────────────────────────────── */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid #F1F3F4' }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#1E8E3E' }} />
            <span className="text-xs" style={{ color: '#5F6368' }}>All systems operational</span>
          </div>
          <div className="text-xs mt-1" style={{ color: '#9AA0A6', fontSize: '0.6rem' }}>
            ASR Dashboard v1.0
          </div>
        </div>
      </aside>
    </>
  )
}
