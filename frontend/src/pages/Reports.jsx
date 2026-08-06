import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { reportsApi } from '../utils/api'
import SourceBadge from '../components/SourceBadge'
import { CardSkeleton } from '../components/Skeleton'
import { Download, TrendingUp, Users, Activity, BookOpen, Brain } from 'lucide-react'
import { CheckCircle } from 'lucide-react'

const B   = '#1A73E8'
const INK = '#202124'
const MUT = '#5F6368'
const CARD = { backgroundColor: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: '12px', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }
const BD   = '1px solid #F1F3F4'

const ICON_COLORS = {
  blue: B, green: '#1E8E3E', cyan: '#00ACC1',
  amber: '#E37400', purple: '#7C3AED', pink: '#DB2777',
}

function ReportSection({ icon: Icon, title, color = 'blue', children }) {
  return (
    <div className="p-5 rounded-xl bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
      <div className="flex items-center gap-2 mb-5">
        <Icon size={18} color={ICON_COLORS[color] || B} />
        <h3 className="text-sm font-semibold" style={{ color: INK }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Metric({ label, value, source }) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: BD }}>
      <span className="text-sm" style={{ color: MUT }}>{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold" style={{ color: INK }}>{value}</span>
        <SourceBadge source={source} />
      </div>
    </div>
  )
}

export default function Reports() {
  const { data, loading } = useFetch(reportsApi.getMonthly)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const blob = await reportsApi.downloadPdf()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href = url
      a.download = `asr-report-${new Date().toISOString().slice(0, 7)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) { console.error(e) }
    setDownloading(false)
  }

  if (loading) return <div className="space-y-4">{[...Array(5)].map((_, i) => <CardSkeleton key={i} />)}</div>
  const kpi = data?.kpi

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div><h1 className="page-title">Monthly Report</h1><p className="page-sub">{data?.month}</p></div>
        <button onClick={handleDownload} disabled={downloading} className="btn-primary flex-shrink-0">
          {downloading
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Download size={15} />}
          {downloading ? 'Generating PDF…' : 'Download PDF'}
        </button>
      </div>

      {/* Summary hero — Google Blue */}
      {kpi && (
        <div className="p-6 rounded-xl" style={{ backgroundColor: B, boxShadow: '0 4px 16px rgba(26,115,232,0.3)' }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-4 text-white opacity-75">
            {data?.month} · Summary
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Visitors',   value: kpi.monthly_visitors?.toLocaleString() },
              { label: 'Page Views', value: kpi.page_views?.toLocaleString() },
              { label: 'Leads',      value: kpi.leads_generated },
              { label: 'Conversion', value: `${kpi.conversion_rate}%` },
            ].map((s, i) => (
              <div key={i} className="text-center p-3 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <div className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>{s.value}</div>
                <div className="text-xs text-white opacity-70 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {kpi && (
        <ReportSection icon={TrendingUp} title="Visitor Summary">
          <Metric label="Monthly Visitors"   value={kpi.monthly_visitors?.toLocaleString()} source="DEMO" />
          <Metric label="Unique Users"       value={kpi.unique_users?.toLocaleString()}      source="DEMO" />
          <Metric label="Page Views"         value={kpi.page_views?.toLocaleString()}        source="DEMO" />
          <Metric label="Avg Session"        value={kpi.avg_session}                         source="DEMO" />
          <Metric label="Bounce Rate"        value={`${kpi.bounce_rate}%`}                   source="DEMO" />
          <Metric label="Returning Visitors" value={kpi.returning_visitors?.toLocaleString()} source="DEMO" />
        </ReportSection>
      )}

      {kpi && (
        <ReportSection icon={Users} title="Leads" color="green">
          <Metric label="Leads This Month" value={data.leads_this_month} source="DEMO" />
          <Metric label="Conversion Rate"  value={`${kpi.conversion_rate}%`} source="DEMO" />
        </ReportSection>
      )}

      {data?.traffic_sources && (
        <ReportSection icon={Activity} title="Traffic Sources" color="cyan">
          {data.traffic_sources.labels.map((src, i) => {
            const colors = [B,'#1E8E3E','#F9AB00','#EA4335','#9AA0A6','#BDC1C6']
            return (
              <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: BD }}>
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i] || B }} />
                <span className="text-sm flex-1" style={{ color: INK }}>{src}</span>
                <span className="text-sm font-semibold" style={{ color: INK }}>{data.traffic_sources.data[i]}%</span>
                <SourceBadge source="DEMO" />
              </div>
            )
          })}
        </ReportSection>
      )}

      {data?.course_popularity && (
        <ReportSection icon={BookOpen} title="Course Popularity" color="amber">
          {data.course_popularity.labels.map((label, i) => (
            <Metric key={i} label={label} value={`${data.course_popularity.data[i]} leads`} source="DEMO" />
          ))}
        </ReportSection>
      )}

      {data?.ai_insights_summary?.length > 0 && (
        <ReportSection icon={Brain} title="AI Insights Summary" color="purple">
          <div className="space-y-2">
            {data.ai_insights_summary.map((insight, i) => (
              <div key={i} className="flex items-start gap-2 py-2">
                <CheckCircle size={13} color="#1E8E3E" className="flex-shrink-0 mt-0.5" />
                <p className="text-sm" style={{ color: INK }}>{insight}</p>
              </div>
            ))}
          </div>
        </ReportSection>
      )}

      {data?.top_countries && (
        <ReportSection icon={Activity} title="Top Countries" color="blue">
          {data.top_countries.map((c, i) => (
            <Metric key={i} label={c.country} value={`${c.visitors.toLocaleString()} (${c.percent}%)`} source="DEMO" />
          ))}
        </ReportSection>
      )}
    </div>
  )
}
