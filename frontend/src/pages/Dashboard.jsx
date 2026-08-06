import { useFetch } from '../hooks/useFetch'
import { dashboardApi } from '../utils/api'
import SourceBadge from '../components/SourceBadge'
import AnimatedCounter from '../components/AnimatedCounter'
import { CardSkeleton, ChartSkeleton } from '../components/Skeleton'
import { TrendingUp, TrendingDown, Users, Eye, MousePointerClick, Clock, UserCheck, Target, ArrowUpRight, Activity } from 'lucide-react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler, RadialLinearScale } from 'chart.js'
import { Line, Doughnut, Bar, Radar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler, RadialLinearScale)

// ── GA4 colour tokens ──────────────────────────────────
const B    = '#1A73E8'   // Google Blue
const INK  = '#202124'
const MUT  = '#5F6368'
const GRID = 'rgba(60,64,67,0.08)'
const TT   = { backgroundColor: '#202124', titleColor: '#FFFFFF', bodyColor: '#DADCE0', padding: 12, cornerRadius: 8, borderColor: '#DADCE0', borderWidth: 0 }

const baseScales = {
  y: { ticks: { color: MUT, font: { size: 11 } }, grid: { color: GRID }, border: { display: false } },
  x: { ticks: { color: MUT, font: { size: 11 } }, grid: { display: false }, border: { display: false } },
}
const lineOpts     = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: TT }, scales: baseScales }
const barOptsY     = { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false }, tooltip: TT }, scales: baseScales }
const doughnutOpts = {
  responsive: true, maintainAspectRatio: false, cutout: '68%',
  plugins: {
    legend: { position: 'bottom', labels: { color: MUT, padding: 14, font: { size: 11 }, boxWidth: 10, usePointStyle: true } },
    tooltip: TT,
  },
}
const radarOpts = {
  responsive: true, maintainAspectRatio: false,
  scales: { r: { ticks: { color: MUT, backdropColor: 'transparent', font: { size: 10 } }, grid: { color: GRID }, pointLabels: { color: MUT, font: { size: 10 } }, max: 100, angleLines: { color: GRID } } },
  plugins: { legend: { display: false }, tooltip: TT },
}

const PIE_COLORS = [B, '#34A853', '#FBBC04', '#EA4335', '#9AA0A6', '#BDC1C6']
const BAR_COLORS = [B, '#34A853', '#FBBC04', '#EA4335', '#9AA0A6', '#BDC1C6', B, '#34A853']

// ── KPI card ──────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, change, changeLabel, source, accent = false }) {
  const isPositive = change >= 0
  return (
    <div className="bg-white rounded-xl p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        border: accent ? `1px solid ${B}` : '1px solid #DADCE0',
        boxShadow: accent ? `0 1px 6px rgba(26,115,232,0.18)` : '0 1px 2px rgba(60,64,67,0.08)',
      }}>
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: accent ? '#E8F0FE' : '#F8F9FA' }}>
          <Icon size={18} color={accent ? B : MUT} strokeWidth={2} />
        </div>
        <SourceBadge source={source} />
      </div>
      <div>
        <div className="stat-label mb-1">{label}</div>
        <div className="stat-value">
          {typeof value === 'string'
            ? <span className="animate-count">{value}</span>
            : <AnimatedCounter target={value} decimals={value % 1 !== 0 ? 1 : 0} />}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1.5">
            {isPositive
              ? <TrendingUp  size={12} color="#1E8E3E" />
              : <TrendingDown size={12} color="#D93025" />}
            <span className="text-xs font-semibold" style={{ color: isPositive ? '#1E8E3E' : '#D93025' }}>
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-xs" style={{ color: MUT }}>{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Chart wrapper ─────────────────────────────────────
function ChartCard({ title, source, children, span2 }) {
  return (
    <div className={`card p-5 ${span2 ? 'lg:col-span-2' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title" style={{ marginBottom: 0 }}>{title}</h3>
        <SourceBadge source={source} />
      </div>
      {children}
    </div>
  )
}

const quickLinks = [
  { label: 'Traffic Report', link: '/traffic' },
  { label: 'Manage Leads',   link: '/leads'   },
  { label: 'SEO Analysis',   link: '/seo'     },
  { label: 'AI Insights',    link: '/insights' },
]
const ACCENTS = [true, false, false, false, false, false, true, false]

export default function Dashboard() {
  const { data: kpi,    loading: lk } = useFetch(dashboardApi.getKpi)
  const { data: charts, loading: lc } = useFetch(dashboardApi.getCharts)

  if (lk || lc) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{[...Array(4)].map((_, i) => <ChartSkeleton key={i} height="260px" />)}</div>
    </div>
  )
  if (!kpi || !charts) return null

  const kpiCards = [
    { icon: Users,             label: 'Monthly Visitors',  value: kpi.monthly_visitors, change: kpi.monthly_change_pct, changeLabel: 'vs last month' },
    { icon: Eye,               label: 'Total Visitors',    value: kpi.total_visitors },
    { icon: UserCheck,         label: 'Unique Users',      value: kpi.unique_users },
    { icon: MousePointerClick, label: 'Page Views',        value: kpi.page_views },
    { icon: Clock,             label: 'Avg Session',       value: kpi.avg_session },
    { icon: Target,            label: 'Bounce Rate',       value: `${kpi.bounce_rate}%` },
    { icon: Users,             label: 'Leads Generated',   value: kpi.leads_generated },
    { icon: TrendingUp,        label: 'Conversion Rate',   value: `${kpi.conversion_rate}%` },
  ]

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">CISPRO Training · analytics overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ backgroundColor: '#E8F0FE', border: '1px solid #C5D9FB', color: B }}>
          <Activity size={13} /> Live data · Auto-refreshed
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => <KpiCard key={i} {...card} source="DEMO" accent={ACCENTS[i]} />)}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard title="Monthly Visitors" source="DEMO" span2>
          <div className="h-60">
            <Line options={lineOpts} data={{ labels: charts.monthly_visitors.labels, datasets: [{ label: 'Visitors', data: charts.monthly_visitors.data, borderColor: B, backgroundColor: 'rgba(26,115,232,0.06)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: B, pointHoverRadius: 5 }] }} />
          </div>
        </ChartCard>
        <ChartCard title="Traffic Sources" source="DEMO">
          <div className="h-60">
            <Doughnut options={doughnutOpts} data={{ labels: charts.traffic_sources.labels, datasets: [{ data: charts.traffic_sources.data, backgroundColor: PIE_COLORS, borderWidth: 2, borderColor: '#FFFFFF', hoverOffset: 4 }] }} />
          </div>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard title="Lead Growth" source="DEMO" span2>
          <div className="h-56">
            <Line options={lineOpts} data={{ labels: charts.lead_growth.labels, datasets: [{ label: 'Leads', data: charts.lead_growth.data, borderColor: '#34A853', backgroundColor: 'rgba(52,168,83,0.06)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#34A853' }] }} />
          </div>
        </ChartCard>
        <ChartCard title="Devices" source="DEMO">
          <div className="h-56">
            <Doughnut options={doughnutOpts} data={{ labels: charts.devices.labels, datasets: [{ data: charts.devices.data, backgroundColor: [B, '#34A853', '#FBBC04'], borderWidth: 2, borderColor: '#FFFFFF', hoverOffset: 4 }] }} />
          </div>
        </ChartCard>
      </div>

      {/* Charts row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Course Popularity" source="DEMO">
          <div className="h-60">
            <Bar options={barOptsY} data={{ labels: charts.course_popularity.labels, datasets: [{ label: 'Leads', data: charts.course_popularity.data, backgroundColor: BAR_COLORS, borderRadius: 4 }] }} />
          </div>
        </ChartCard>
        <ChartCard title="Website Performance" source="DEMO">
          <div className="h-60">
            <Radar options={radarOpts} data={{ labels: charts.website_performance.labels, datasets: [{ label: 'Score', data: charts.website_performance.data, backgroundColor: 'rgba(26,115,232,0.1)', borderColor: B, pointBackgroundColor: B, pointRadius: 4, borderWidth: 2 }] }} />
          </div>
        </ChartCard>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickLinks.map((item, i) => (
          <a key={i} href={item.link}
            className="card-hover flex items-center justify-between px-4 py-3.5 group">
            <span className="text-sm font-medium" style={{ color: INK }}>{item.label}</span>
            <ArrowUpRight size={14} color={MUT}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        ))}
      </div>
    </div>
  )
}
