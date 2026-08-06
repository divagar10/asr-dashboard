import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { leadsApi } from '../utils/api'
import SourceBadge from '../components/SourceBadge'
import { ChartSkeleton, TableSkeleton } from '../components/Skeleton'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { Search } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const B    = '#1A73E8'
const MUT  = '#5F6368'
const CARD = { backgroundColor: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: '12px', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }
const TT   = { backgroundColor: '#202124', titleColor: '#FFFFFF', bodyColor: '#DADCE0', padding: 12, cornerRadius: 8 }
const SC   = { y: { ticks: { color: MUT, font: { size: 10 } }, grid: { color: 'rgba(60,64,67,0.08)' }, border: { display: false } }, x: { ticks: { color: MUT, font: { size: 10 } }, grid: { display: false }, border: { display: false } } }
const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: TT }, scales: SC }

const STATUS_STYLE = {
  New:        { bg: '#E8F0FE', text: '#1558B0' },
  Contacted:  { bg: '#F8F9FA', text: '#3C4043' },
  Interested: { bg: '#FEF7E0', text: '#E37400' },
  Enrolled:   { bg: '#E6F4EA', text: '#1E8E3E' },
  Closed:     { bg: '#FCE8E6', text: '#D93025' },
}

export default function Leads() {
  const [page, setPage]     = useState(1)
  const [status, setStatus] = useState('All')
  const [search, setSearch] = useState('')
  const { data, loading } = useFetch(
    () => leadsApi.getLeads({ page, page_size: 15, status: status !== 'All' ? status : undefined, search: search || undefined }),
    [page, status, search]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div><h1 className="page-title">Leads</h1><p className="page-sub">Demonstration data — connect your CRM for live leads</p></div>
        <SourceBadge source="DEMO" />
      </div>

      {/* Status filters */}
      {data?.status_counts && (
        <div className="flex flex-wrap gap-2">
          {['All', 'New', 'Contacted', 'Interested', 'Enrolled', 'Closed'].map(s => {
            const active = status === s
            return (
              <button key={s} onClick={() => { setStatus(s); setPage(1) }}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={active
                  ? { backgroundColor: B, color: '#FFFFFF', border: `1px solid ${B}` }
                  : { backgroundColor: '#FFFFFF', color: MUT, border: '1px solid #DADCE0' }
                }>
                {s} {s !== 'All' && data.status_counts[s] ? `(${data.status_counts[s]})` : ''}
              </button>
            )
          })}
        </div>
      )}

      {/* Charts */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="p-5 rounded-xl bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: '#202124' }}>Lead Growth</h3>
              <SourceBadge source="DEMO" />
            </div>
            <div className="h-52">
              <Line options={chartOpts} data={{ labels: data.lead_growth.labels, datasets: [{ data: data.lead_growth.data, borderColor: B, backgroundColor: 'rgba(26,115,232,0.06)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: B }] }} />
            </div>
          </div>
          <div className="p-5 rounded-xl bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: '#202124' }}>Leads by Source</h3>
              <SourceBadge source="DEMO" />
            </div>
            <div className="h-52">
              <Bar options={chartOpts} data={{ labels: data.lead_by_source.labels, datasets: [{ data: data.lead_by_source.data, backgroundColor: [B,'#34A853','#FBBC04','#EA4335','#9AA0A6','#BDC1C6'], borderRadius: 4 }] }} />
            </div>
          </div>
        </div>
      )}

      {/* Funnel */}
      {data?.funnel && (
        <div className="p-5 rounded-xl bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-sm" style={{ color: '#202124' }}>Lead Funnel</h3>
            <SourceBadge source="DEMO" />
          </div>
          <div className="space-y-3 max-w-2xl">
            {data.funnel.map((stage, i) => {
              const pct = (stage.count / data.funnel[0].count) * 100
              const bg = i === 0 ? B : i === 1 ? '#34A853' : '#E8F0FE'
              const textColor = i <= 1 ? '#FFFFFF' : '#1558B0'
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: '#202124' }}>{stage.stage}</span>
                    <span className="text-xs font-semibold" style={{ color: B }}>{stage.count.toLocaleString()}</span>
                  </div>
                  <div className="h-9 rounded-lg overflow-hidden" style={{ backgroundColor: '#F1F3F4' }}>
                    <div className="h-full rounded-lg flex items-center px-3 transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: bg }}>
                      {pct > 20 && <span className="text-xs font-semibold" style={{ color: textColor }}>{Math.round(pct)}%</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
        <div className="p-4 flex flex-col sm:flex-row gap-3" style={{ borderBottom: '1px solid #F1F3F4' }}>
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" color="#9AA0A6" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search leads…" className="input pl-9" />
          </div>
          {data && <div className="text-xs font-medium self-center" style={{ color: MUT }}>{data.total} leads</div>}
        </div>

        {loading ? <div className="p-5"><TableSkeleton /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>{['Name','Course','Phone','Email','Source','Status','Date'].map(h => <th key={h} className="table-th">{h}</th>)}</tr></thead>
              <tbody>
                {(data?.leads || []).map((lead) => {
                  const st = STATUS_STYLE[lead.status] || { bg: '#F8F9FA', text: '#3C4043' }
                  return (
                    <tr key={lead.id} className="table-row-hover">
                      <td className="table-td font-semibold whitespace-nowrap" style={{ color: '#202124' }}>{lead.name}</td>
                      <td className="table-td whitespace-nowrap" style={{ color: '#3C4043' }}>{lead.course_interested}</td>
                      <td className="table-td whitespace-nowrap font-mono text-xs" style={{ color: MUT }}>{lead.phone}</td>
                      <td className="table-td whitespace-nowrap text-xs" style={{ color: MUT }}>{lead.email}</td>
                      <td className="table-td whitespace-nowrap text-xs" style={{ color: MUT }}>{lead.source}</td>
                      <td className="table-td whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: st.bg, color: st.text }}>{lead.status}</span>
                      </td>
                      <td className="table-td whitespace-nowrap text-xs" style={{ color: MUT }}>{lead.date}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {data && data.total > 15 && (
          <div className="p-4 flex items-center justify-center gap-3" style={{ borderTop: '1px solid #F1F3F4' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary disabled:opacity-40">Previous</button>
            <span className="text-sm font-medium" style={{ color: MUT }}>Page {page} of {Math.ceil(data.total / 15)}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(data.total / 15)} className="btn-secondary disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </div>
  )
}
