import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { seoApi } from '../utils/api'
import SourceBadge from '../components/SourceBadge'
import { CardSkeleton } from '../components/Skeleton'
import CircularProgress from '../components/CircularProgress'
import { Search, CheckCircle, XCircle, AlertTriangle, Globe, Image, Hash, Code, Facebook } from 'lucide-react'

const B   = '#1A73E8'
const INK = '#202124'
const MUT = '#5F6368'
const CARD = { backgroundColor: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: '12px', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }
const BD   = '1px solid #F1F3F4'

function Check({ ok, text }) {
  return (
    <div className="flex items-center gap-2 py-1">
      {ok
        ? <CheckCircle size={13} color="#1E8E3E" className="flex-shrink-0" />
        : <XCircle     size={13} color="#D93025" className="flex-shrink-0" />}
      <span className="text-xs" style={{ color: ok ? '#3C4043' : '#80868B' }}>{text}</span>
    </div>
  )
}

function PageCard({ page, expanded, onToggle }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
      <button onClick={onToggle}
        className="w-full p-4 flex items-center gap-4 text-left transition-colors"
        style={{ borderBottom: expanded ? BD : 'none' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8F9FA'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
        <CircularProgress value={page.seo_score} size={60} strokeWidth={6} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate" style={{ color: INK }}>{page.page_title || 'Untitled Page'}</div>
          <div className="text-xs truncate mt-0.5" style={{ color: MUT }}>{page.page_url}</div>
          <div className="flex gap-3 mt-1">
            <span className="text-xs" style={{ color: '#9AA0A6' }}>{page.image_count} images</span>
            <span className="text-xs" style={{ color: '#9AA0A6' }}>·</span>
            <span className="text-xs" style={{ color: '#9AA0A6' }}>{page.internal_links} links</span>
            <span className="text-xs font-medium"
              style={{ color: page.missing_alt_count > 0 ? '#E37400' : '#1E8E3E' }}>
              {page.missing_alt_count} missing alt
            </span>
          </div>
        </div>
        <span className="text-xs" style={{ color: '#9AA0A6' }}>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ backgroundColor: '#F8F9FA' }}>
          {[
            { icon: Globe,    title: 'Page Title', checks: [
              { ok: !!page.page_title, text: page.page_title ? `"${page.page_title.slice(0,50)}${page.page_title.length>50?'…':''}"` : 'Missing' },
              { ok: page.page_title?.length>=10&&page.page_title?.length<=70, text: page.page_title?`Length: ${page.page_title.length} chars`:'N/A' },
            ]},
            { icon: Hash, title: 'Meta Description', checks: [
              { ok: !!page.meta_description, text: page.meta_description ? `"${page.meta_description.slice(0,55)}…"` : 'Missing' },
              { ok: !!page.canonical, text: page.canonical ? 'Canonical set' : 'No canonical' },
            ]},
            { icon: Facebook, title: 'Open Graph', checks: [
              { ok: !!page.og_title,       text: page.og_title       ? 'OG Title ✓'       : 'OG Title missing' },
              { ok: !!page.og_description, text: page.og_description ? 'OG Description ✓' : 'OG Description missing' },
              { ok: !!page.og_image,       text: page.og_image       ? 'OG Image ✓'       : 'OG Image missing' },
            ]},
            { icon: Hash, title: 'Headings', checks: [
              { ok: page.h1_tags?.length===1, text: `H1: ${page.h1_tags?.length||0} ${page.h1_tags?.length===1?'(good)':page.h1_tags?.length>1?'(too many)':'(missing)'}` },
              { ok: (page.h2_tags?.length||0)>0, text: `H2: ${page.h2_tags?.length||0} headings` },
            ]},
            { icon: Image, title: 'Images & Links', checks: [
              { ok: page.missing_alt_count===0, text: `${page.missing_alt_count} missing alt text` },
              { ok: (page.internal_links||0)>3, text: `${page.internal_links} internal links` },
            ]},
            { icon: Code, title: 'Advanced', checks: [
              { ok: !!page.twitter_card, text: page.twitter_card ? `Twitter Card: ${page.twitter_card}` : 'No Twitter Card' },
              { ok: page.has_structured_data, text: page.has_structured_data ? 'Structured Data ✓' : 'No structured data' },
            ]},
          ].map(({ icon: Icon, title, checks }) => (
            <div key={title} className="space-y-0.5 bg-white p-3 rounded-lg" style={{ border: '1px solid #DADCE0' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <Icon size={12} color={B} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUT }}>{title}</span>
              </div>
              {checks.map((c, i) => <Check key={i} {...c} />)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SEO() {
  const { data, loading } = useFetch(seoApi.getSeo)
  const [expanded, setExpanded] = useState(null)

  if (loading) return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
      <div className="space-y-3">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div><h1 className="page-title">SEO Analysis</h1><p className="page-sub">Live on-page SEO analysis for crawled pages</p></div>
        <SourceBadge source="LIVE" />
      </div>

      {data?.summary && (
        <>
          {/* Summary stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Avg SEO Score', value: `${data.summary.average_score}/100`, accent: true },
              { label: 'Pages Analyzed', value: data.summary.pages_analyzed },
              { label: 'High Issues',    value: data.summary.high_issues },
              { label: 'Total Issues',   value: data.summary.total_issues },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl text-center"
                style={s.accent
                  ? { backgroundColor: B, boxShadow: '0 2px 8px rgba(26,115,232,0.3)', borderRadius: '12px' }
                  : CARD}>
                <div className="text-3xl font-bold" style={{ color: s.accent ? '#FFFFFF' : INK, letterSpacing: '-0.02em' }}>{s.value}</div>
                <div className="text-xs font-medium mt-1" style={{ color: s.accent ? 'rgba(255,255,255,0.75)' : MUT }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Score circles */}
          {data.pages?.length > 0 && (
            <div className="p-5 rounded-xl bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
              <h3 className="text-sm font-semibold mb-5" style={{ color: INK }}>Page SEO Scores</h3>
              <div className="flex flex-wrap gap-6">
                {data.pages.map((page, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <CircularProgress value={page.seo_score} size={80} strokeWidth={8} />
                    <div className="text-xs text-center max-w-[80px] truncate" style={{ color: MUT }}
                      title={page.page_url}>{page.page_url.replace('https://cisprotraining.com','') || '/'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issues */}
          {data.issues?.length > 0 && (
            <div className="p-5 rounded-xl bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: INK }}>
                <AlertTriangle size={15} color="#E37400" /> Issues Found
              </h3>
              <div className="space-y-2">
                {data.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-3 py-2.5" style={{ borderBottom: BD }}>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                      style={{
                        backgroundColor: issue.severity==='High' ? '#FCE8E6' : issue.severity==='Medium' ? '#FEF7E0' : '#E8F0FE',
                        color: issue.severity==='High' ? '#D93025' : issue.severity==='Medium' ? '#E37400' : B,
                      }}>
                      {issue.severity}
                    </span>
                    <div>
                      <div className="text-xs font-medium" style={{ color: INK }}>{issue.issue}</div>
                      <div className="text-xs mt-0.5 truncate" style={{ color: MUT }}>{issue.page}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Per-page analysis */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: INK }}>
              <Globe size={14} color={B} /> Page-by-Page Analysis
            </h3>
            {(data.pages || []).map((page, i) => (
              <PageCard key={i} page={page} expanded={expanded===i} onToggle={() => setExpanded(expanded===i ? null : i)} />
            ))}
          </div>
        </>
      )}

      {!data?.pages?.length && !loading && (
        <div className="p-12 text-center rounded-xl bg-white" style={{ border: '1px solid #DADCE0' }}>
          <Search size={48} color="#DADCE0" className="mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2" style={{ color: INK }}>No SEO data yet</h3>
          <p className="text-sm" style={{ color: MUT }}>Run a website crawl to generate SEO analysis.</p>
        </div>
      )}
    </div>
  )
}
