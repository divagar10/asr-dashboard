import { useFetch } from '../hooks/useFetch'
import { trafficApi } from '../utils/api'
import SourceBadge from '../components/SourceBadge'
import { ChartSkeleton, CardSkeleton } from '../components/Skeleton'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { Globe2, Map } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler)

const B    = '#1A73E8'
const MUT  = '#5F6368'
const CARD = { backgroundColor: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: '12px', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }
const TT   = { backgroundColor: '#202124', titleColor: '#FFFFFF', bodyColor: '#DADCE0', padding: 12, cornerRadius: 8 }
const SC   = { y: { ticks: { color: MUT, font: { size: 10 } }, grid: { color: 'rgba(60,64,67,0.08)' }, border: { display: false } }, x: { ticks: { color: MUT, font: { size: 10 } }, grid: { display: false }, border: { display: false } } }
const lineOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: TT }, scales: SC }
const doughnutOpts = { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { color: MUT, padding: 12, font: { size: 11 }, boxWidth: 10, usePointStyle: true } }, tooltip: TT } }
const PIE_COLORS = [B, '#34A853', '#FBBC04', '#EA4335', '#9AA0A6', '#BDC1C6']

function ChartCard({ title, source, height = 'h-52', children }) {
  return (
    <div className="p-5 rounded-xl" style={CARD}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title" style={{ marginBottom: 0, textTransform: 'none', color: '#202124' }}>{title}</h3>
        <SourceBadge source={source} />
      </div>
      <div className={height}>{children}</div>
    </div>
  )
}

export default function Traffic() {
  const { data, loading } = useFetch(trafficApi.getTraffic)

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{[...Array(4)].map((_, i) => <ChartSkeleton key={i} height="240px" />)}</div>
    </div>
  )
  if (!data) return null

  const s = data.session_data

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div><h1 className="page-title">Traffic Analytics</h1><p className="page-sub">Demonstration data — connect Google Analytics for live metrics</p></div>
        <SourceBadge source="DEMO" />
      </div>

      {/* Session stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Avg Session',    value: s.avg_session_duration },
          { label: 'Pages/Session',  value: s.avg_pages_per_session },
          { label: 'Bounce Rate',    value: `${s.bounce_rate}%` },
          { label: 'Returning',      value: `${s.returning_visitor_rate}%` },
        ].map((st, i) => (
          <div key={i} className="p-4 rounded-xl text-center bg-white"
            style={{ border: '1px solid #DADCE0', borderLeft: `3px solid ${B}`, boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
            <div className="text-2xl font-bold" style={{ color: '#202124', letterSpacing: '-0.02em' }}>{st.value}</div>
            <div className="text-xs font-medium mt-1" style={{ color: MUT }}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl lg:col-span-2 bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: '#202124' }}>Monthly Visitors</h3>
            <SourceBadge source="DEMO" />
          </div>
          <div className="h-60">
            <Line options={lineOpts} data={{ labels: data.monthly_visitors.labels, datasets: [{ data: data.monthly_visitors.data, borderColor: B, backgroundColor: 'rgba(26,115,232,0.06)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: B }] }} />
          </div>
        </div>
        <ChartCard title="Traffic Sources" source="DEMO" height="h-60">
          <Doughnut options={doughnutOpts} data={{ labels: data.traffic_sources.labels, datasets: [{ data: data.traffic_sources.data, backgroundColor: PIE_COLORS, borderWidth: 2, borderColor: '#FFFFFF' }] }} />
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl lg:col-span-2 bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: '#202124' }}>Daily Visitors (30 days)</h3>
            <SourceBadge source="DEMO" />
          </div>
          <div className="h-56">
            <Bar options={lineOpts} data={{ labels: data.daily_visitors.labels, datasets: [{ data: data.daily_visitors.data, backgroundColor: 'rgba(26,115,232,0.7)', borderRadius: 4 }] }} />
          </div>
        </div>
        <ChartCard title="Devices" source="DEMO" height="h-56">
          <Doughnut options={doughnutOpts} data={{ labels: data.devices.labels, datasets: [{ data: data.devices.data, backgroundColor: [B, '#34A853', '#FBBC04'], borderWidth: 2, borderColor: '#FFFFFF' }] }} />
        </ChartCard>
      </div>

      {/* Countries + Landing pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="p-5 rounded-xl bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color: '#202124' }}>
              <Globe2 size={14} color={B} /> Top Countries
            </h3>
            <SourceBadge source="DEMO" />
          </div>
          <div className="space-y-3">
            {data.top_countries.slice(0, 7).map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs w-4 font-medium" style={{ color: '#9AA0A6' }}>{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: '#202124' }}>{c.country}</span>
                    <span className="text-xs font-semibold" style={{ color: B }}>{c.percent}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F3F4' }}>
                    <div className="h-full rounded-full" style={{ width: `${c.percent}%`, backgroundColor: B }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color: '#202124' }}>
              <Map size={14} color={B} /> Top Landing Pages
            </h3>
            <SourceBadge source="DEMO" />
          </div>
          <div className="space-y-1">
            {data.top_landing_pages.map((p, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid #F1F3F4' }}>
                <span className="text-xs font-medium w-4" style={{ color: '#9AA0A6' }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: '#202124' }}>{p.title}</div>
                  <div className="text-xs truncate" style={{ color: MUT }}>{p.page}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold" style={{ color: '#202124' }}>{p.sessions.toLocaleString()}</div>
                  <div className="text-xs" style={{ color: MUT }}>{p.bounce_rate}% bounce</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cities */}
      <div className="p-5 rounded-xl bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
        <h3 className="font-semibold text-sm mb-4" style={{ color: '#202124' }}>Top Cities</h3>
        <div className="flex flex-wrap gap-3">
          {data.top_cities.map((c, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ backgroundColor: i === 0 ? B : '#F8F9FA', border: `1px solid ${i === 0 ? B : '#DADCE0'}` }}>
              <span className="text-xs font-semibold" style={{ color: i === 0 ? '#FFFFFF' : '#202124' }}>{c.city}</span>
              <span className="text-xs" style={{ color: i === 0 ? 'rgba(255,255,255,0.7)' : MUT }}>{c.visitors.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
