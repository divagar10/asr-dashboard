import { useFetch } from '../hooks/useFetch'
import { healthApi } from '../utils/api'
import SourceBadge from '../components/SourceBadge'
import CircularProgress from '../components/CircularProgress'
import { CardSkeleton } from '../components/Skeleton'
import { CheckCircle, XCircle, AlertTriangle, Link } from 'lucide-react'

const B   = '#1A73E8'
const INK = '#202124'
const MUT = '#5F6368'

export default function Health() {
  const { data, loading } = useFetch(healthApi.getHealth)

  if (loading) return <div className="space-y-5">{[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Website Health</h1>
          <p className="page-sub">Live + demo checks for cisprotraining.com</p>
        </div>
      </div>

      {data && (
        <>
          {/* Overall score — Google Blue hero */}
          <div className="p-8 rounded-xl text-center" style={{ backgroundColor: B, boxShadow: '0 4px 16px rgba(26,115,232,0.3)' }}>
            <div className="text-xs font-semibold uppercase tracking-widest mb-4 text-white opacity-75">Overall Health Score</div>
            <CircularProgress value={data.overall_score} size={140} strokeWidth={12} color="#FFFFFF" />
            <p className="text-xs mt-4 max-w-md mx-auto text-white opacity-60">{data.source_note}</p>
          </div>

          {/* Checks grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.checks.map((check, i) => {
              const isPass = check.status === true
              const isFail = check.status === false
              return (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white"
                  style={{
                    border: isPass ? '1px solid #B7DFC4' : isFail ? '1px solid #F5C6C2' : '1px solid #DADCE0',
                    boxShadow: '0 1px 2px rgba(60,64,67,0.08)',
                  }}>
                  <div className="flex-shrink-0 mt-0.5">
                    {isPass  && <CheckCircle   size={20} color="#1E8E3E" />}
                    {isFail  && <XCircle       size={20} color="#D93025" />}
                    {!isPass && !isFail && <AlertTriangle size={20} color="#E37400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold" style={{ color: INK }}>{check.label}</span>
                      <SourceBadge source={check.source} />
                    </div>
                    <div className="text-xs" style={{ color: MUT }}>{check.detail}</div>
                    {check.score !== undefined && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold" style={{ color: INK }}>{check.score}/100</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F3F4' }}>
                          <div className="h-full rounded-full transition-all"
                            style={{
                              width: `${check.score}%`,
                              backgroundColor: check.score >= 75 ? '#1E8E3E' : check.score >= 50 ? '#E37400' : '#D93025',
                            }} />
                        </div>
                      </div>
                    )}
                    {check.count !== undefined && (
                      <div className="mt-1 text-sm font-semibold" style={{ color: INK }}>{check.count} found</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Broken links */}
          {data.broken_links?.length > 0 && (
            <div className="p-5 rounded-xl bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: INK }}>
                <Link size={14} color={B} /> Broken Links
              </h3>
              <div className="space-y-2">
                {data.broken_links.map((link, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5"
                    style={{ borderBottom: '1px solid #F1F3F4' }}>
                    <span className="text-xs truncate flex-1" style={{ color: INK }}>{link.url}</span>
                    <span className="text-xs font-semibold ml-3 px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#FCE8E6', color: '#D93025' }}>
                      HTTP {link.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
