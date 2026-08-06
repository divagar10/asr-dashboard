import { useFetch } from '../hooks/useFetch'
import { websiteApi } from '../utils/api'
import SourceBadge from '../components/SourceBadge'
import { CardSkeleton } from '../components/Skeleton'
import { Globe, Phone, Mail, MapPin, Shield, FileText, Map, Link2, Image, Menu, Clock, Code2, RefreshCw, CheckCircle, XCircle, ExternalLink } from 'lucide-react'

const B   = '#1A73E8'
const INK = '#202124'
const MUT = '#5F6368'
const CARD = { backgroundColor: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: '12px', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }
const BD   = '1px solid #F1F3F4'

function InfoRow({ icon: Icon, label, value, link }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: BD }}>
      <Icon size={15} color={B} className="mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#9AA0A6' }}>{label}</div>
        {link
          ? <a href={value} target="_blank" rel="noreferrer" className="text-sm font-medium truncate block" style={{ color: B }}>{value}</a>
          : <div className="text-sm font-medium" style={{ color: INK }}>{value}</div>
        }
      </div>
    </div>
  )
}

function StatusPill({ ok, label }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
      style={{
        backgroundColor: ok ? '#E6F4EA' : '#FCE8E6',
        border: `1px solid ${ok ? '#B7DFC4' : '#F5C6C2'}`,
      }}>
      {ok ? <CheckCircle size={14} color="#1E8E3E" /> : <XCircle size={14} color="#D93025" />}
      <span className="text-xs font-semibold" style={{ color: ok ? '#1E8E3E' : '#D93025' }}>{label}</span>
    </div>
  )
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="p-5 rounded-xl bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} color={B} />
        <h3 className="text-sm font-semibold" style={{ color: INK }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function WebsiteOverview() {
  const { data, loading, error, refetch } = useFetch(websiteApi.getOverview)

  if (loading) return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}</div>
    </div>
  )

  if (error || !data?.data) {
    return (
      <div className="p-12 text-center rounded-xl bg-white" style={{ border: '1px solid #DADCE0' }}>
        <Globe size={48} color="#DADCE0" className="mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2" style={{ color: INK }}>No crawl data yet</h3>
        <p className="text-sm mb-6" style={{ color: MUT }}>Run a crawl to fetch live data from cisprotraining.com</p>
        <button onClick={async () => { await websiteApi.triggerCrawl(); setTimeout(refetch, 3000) }} className="btn-primary mx-auto">
          <RefreshCw size={15} /> Start Crawl
        </button>
      </div>
    )
  }

  const w = data.data

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Website Overview</h1>
          <p className="page-sub">Live-crawled data from cisprotraining.com</p>
        </div>
        <div className="flex items-center gap-3">
          <SourceBadge source="LIVE" />
          <button onClick={async () => { await websiteApi.triggerCrawl(); setTimeout(refetch, 5000) }} className="btn-secondary">
            <RefreshCw size={13} /> Re-crawl
          </button>
        </div>
      </div>

      {/* Hero — Google Blue */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: B }}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {w.logo_url
            ? <img src={w.logo_url} alt="Logo" className="w-20 h-20 object-contain rounded-xl bg-white p-2 shadow-lg" />
            : <div className="w-20 h-20 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}><Globe size={32} color="white" /></div>
          }
          <div>
            <h2 className="text-2xl font-bold text-white leading-tight">{w.name || 'CISPRO Training'}</h2>
            <a href={w.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm mt-1"
              style={{ color: 'rgba(255,255,255,0.75)' }}>
              {w.url} <ExternalLink size={11} />
            </a>
            <p className="text-sm mt-1 max-w-xl" style={{ color: 'rgba(255,255,255,0.65)' }}>{w.description}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: FileText, label: 'Pages',          value: w.page_count },
          { icon: Image,    label: 'Images',         value: w.image_count },
          { icon: Link2,    label: 'Internal Links', value: w.internal_links_count },
          { icon: Globe,    label: 'External Links', value: w.external_links_count },
          { icon: Code2,    label: 'Technologies',   value: (w.technologies || []).length },
          { icon: Menu,     label: 'Nav Items',      value: (w.nav_menu || []).length },
        ].map(({ icon: Icon, label, value }, i) => (
          <div key={i} className="p-4 rounded-xl text-center bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
            <Icon size={18} color={B} className="mx-auto mb-2" />
            <div className="text-2xl font-bold" style={{ color: INK }}>{value ?? '—'}</div>
            <div className="text-xs mt-1 font-medium" style={{ color: MUT }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Security */}
      <div className="p-5 rounded-xl bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} color={B} />
          <h3 className="text-sm font-semibold" style={{ color: INK }}>Security & Technical</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <StatusPill ok={w.ssl_status} label="SSL / HTTPS" />
          <StatusPill ok={w.robots_txt} label="Robots.txt" />
          <StatusPill ok={w.sitemap}    label="XML Sitemap" />
        </div>
      </div>

      {/* 3-column detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SectionCard icon={Phone} title="Contact Information">
          {w.phone_numbers?.length > 0
            ? w.phone_numbers.map((p, i) => <InfoRow key={i} icon={Phone} label={`Phone ${i + 1}`} value={p} />)
            : <p className="text-sm" style={{ color: MUT }}>No phone numbers found</p>}
          {w.emails?.map((e, i) => <InfoRow key={i} icon={Mail} label={`Email ${i + 1}`} value={e} />)}
          <InfoRow icon={MapPin} label="Address"        value={w.address} />
          <InfoRow icon={Map}    label="Google Maps"    value={w.google_map_url} link />
          <InfoRow icon={Clock}  label="Business Hours" value={w.business_hours} />
        </SectionCard>

        <SectionCard icon={Link2} title="Social & Technologies">
          {Object.keys(w.social_links || {}).length > 0
            ? Object.entries(w.social_links).map(([p, url]) => (
                <InfoRow key={p} icon={Globe} label={p.charAt(0).toUpperCase() + p.slice(1)} value={url} link />
              ))
            : <p className="text-sm mb-4" style={{ color: MUT }}>No social links detected</p>
          }
          <div className="mt-4">
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9AA0A6' }}>Technologies Detected</div>
            <div className="flex flex-wrap gap-2">
              {(w.technologies || []).length > 0
                ? w.technologies.map(t => (
                    <span key={t} className="px-3 py-1 text-xs font-semibold rounded-full"
                      style={{ backgroundColor: '#E8F0FE', color: B, border: '1px solid #C5D9FB' }}>
                      {t}
                    </span>
                  ))
                : <span className="text-sm" style={{ color: MUT }}>None detected</span>
              }
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Menu} title="Navigation Menu">
          {(w.nav_menu || []).length > 0
            ? w.nav_menu.map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: BD }}>
                  <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: '#E8F0FE', color: B }}>
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: INK }}>{item.label}</div>
                    <div className="text-xs truncate" style={{ color: MUT }}>{item.url}</div>
                  </div>
                </div>
              ))
            : <p className="text-sm" style={{ color: MUT }}>No menu items detected</p>
          }
        </SectionCard>
      </div>

      {w.title && (
        <div className="p-5 rounded-xl bg-white" style={{ border: '1px solid #DADCE0' }}>
          <div className="flex items-center gap-2 mb-2">
            <Globe size={14} color={B} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9AA0A6' }}>Page Title</span>
          </div>
          <p className="text-base font-semibold" style={{ color: INK }}>{w.title}</p>
        </div>
      )}
    </div>
  )
}
