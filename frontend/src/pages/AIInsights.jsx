import { useFetch } from '../hooks/useFetch'
import { insightsApi } from '../utils/api'
import SourceBadge from '../components/SourceBadge'
import { CardSkeleton } from '../components/Skeleton'
import { Lightbulb,TrendingUp,Target,Smartphone,FileText,Search,Star,Zap,Mail,ArrowRight,AlertTriangle,CheckCircle,Info } from 'lucide-react'

const B   = '#1A73E8'
const INK = '#202124'
const MUT = '#5F6368'
const iconMap = { TrendingUp,Target,Smartphone,FileText,Search,Star,Zap,Mail }

const PRIO = {
  High:   { border:'#F5C6C2', iconBg:'#FCE8E6', iconColor:'#D93025', badge:{bg:'#FCE8E6',text:'#D93025'} },
  Medium: { border:'#FDE9C2', iconBg:'#FEF7E0', iconColor:'#E37400', badge:{bg:'#FEF7E0',text:'#E37400'} },
  Low:    { border:'#B7DFC4', iconBg:'#E6F4EA', iconColor:'#1E8E3E', badge:{bg:'#E6F4EA',text:'#1E8E3E'} },
}

function InsightCard({ insight }) {
  const Icon = iconMap[insight.icon] || Lightbulb
  const p    = PRIO[insight.priority] || PRIO.Low
  return (
    <div className="bg-white p-5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
      style={{ border:`1px solid ${p.border}`, boxShadow:'0 1px 4px rgba(60,64,67,0.1)' }}>
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor:p.iconBg }}>
          <Icon size={20} color={p.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor:p.badge.bg, color:p.badge.text }}>{insight.priority} Priority</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor:'#F1F3F4', color:MUT }}>{insight.category}</span>
            </div>
            <span className="text-xs font-semibold" style={{ color:B }}>↑ {insight.impact} Impact</span>
          </div>
          <h3 className="text-sm font-semibold mb-2 leading-snug" style={{ color:INK }}>{insight.title}</h3>
          <p className="text-xs leading-relaxed mb-3" style={{ color:MUT }}>{insight.description}</p>
          <div className="p-3 rounded-lg mb-3" style={{ backgroundColor:'#E8F0FE', border:'1px solid #C5D9FB' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color:B }}>Recommendation</div>
            <p className="text-xs" style={{ color:'#3C4043' }}>{insight.recommendation}</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-semibold group" style={{ color:B }}>
            {insight.action} <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AIInsights() {
  const { data, loading } = useFetch(insightsApi.getInsights)
  if (loading) return <div className="space-y-4">{[...Array(4)].map((_,i)=><CardSkeleton key={i}/>)}</div>
  const insights = data?.insights||[]
  const high   = insights.filter(i=>i.priority==='High')
  const medium = insights.filter(i=>i.priority==='Medium')
  const low    = insights.filter(i=>i.priority==='Low')
  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title flex items-center gap-3"><Lightbulb size={26} color={B}/>AI Insights</h1>
          <p className="page-sub">AI-generated business insights and action recommendations</p>
        </div>
        <SourceBadge source="DEMO"/>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { count:high.length,   label:'High Priority',   bg:'#FCE8E6', border:'#F5C6C2', color:'#D93025', Icon:AlertTriangle },
          { count:medium.length, label:'Medium Priority', bg:'#E8F0FE', border:'#C5D9FB', color:B,         Icon:Info          },
          { count:low.length,    label:'Opportunities',   bg:'#E6F4EA', border:'#B7DFC4', color:'#1E8E3E', Icon:CheckCircle   },
        ].map(({count,label,bg,border,color,Icon},i)=>(
          <div key={i} className="p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor:bg, border:`1px solid ${border}` }}>
            <Icon size={22} color={color}/>
            <div>
              <div className="text-3xl font-bold" style={{ color:INK, letterSpacing:'-0.03em' }}>{count}</div>
              <div className="text-xs font-medium" style={{ color:MUT }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {high.length>0&&(<div>
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2" style={{color:'#D93025'}}><AlertTriangle size={13}/>High Priority Actions</h2>
        <div className="space-y-4">{high.map(ins=><InsightCard key={ins.id} insight={ins}/>)}</div>
      </div>)}
      {medium.length>0&&(<div>
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2" style={{color:B}}><Info size={13}/>Medium Priority</h2>
        <div className="space-y-4">{medium.map(ins=><InsightCard key={ins.id} insight={ins}/>)}</div>
      </div>)}
      {low.length>0&&(<div>
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2" style={{color:'#1E8E3E'}}><CheckCircle size={13}/>Opportunities</h2>
        <div className="space-y-4">{low.map(ins=><InsightCard key={ins.id} insight={ins}/>)}</div>
      </div>)}
    </div>
  )
}
