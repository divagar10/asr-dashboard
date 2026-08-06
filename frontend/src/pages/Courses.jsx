import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { coursesApi } from '../utils/api'
import SourceBadge from '../components/SourceBadge'
import { CardSkeleton } from '../components/Skeleton'
import { BookOpen,Search,ExternalLink,Filter,Code2,Cloud,Network,Cpu,Monitor,Languages,Users2 } from 'lucide-react'

const B   = '#1A73E8'
const INK = '#202124'
const MUT = '#5F6368'
const CARD = { backgroundColor:'#FFFFFF', border:'1px solid #DADCE0', borderRadius:'12px', boxShadow:'0 1px 2px rgba(60,64,67,0.08)' }
const catIcons = { Programming:Code2, Cloud, Networking:Network, Embedded:Cpu, Office:Monitor, Language:Languages, HR:Users2, Other:BookOpen }

// Fallback images from Unsplash — relevant to each course category
const CATEGORY_IMAGES = {
  Programming: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80',
  Cloud:       'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=80',
  Networking:  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
  Embedded:    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
  Office:      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80',
  Language:    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80',
  HR:          'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80',
  Other:       'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
}

// Per-keyword overrides for specific courses
const KEYWORD_IMAGES = {
  'full stack':   'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400&q=80',
  'python':       'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80',
  'javascript':   'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&q=80',
  'react':        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80',
  'aws':          'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=400&q=80',
  'azure':        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
  'cyber':        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80',
  'security':     'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80',
  'data':         'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
  'excel':        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
  'digital marketing':'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=80',
  'gst':          'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
  'tally':        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
  'ms office':    'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80',
  'artificial intelligence':'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80',
  'ai':           'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80',
  'ccna':         'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
  'devops':       'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&q=80',
}

function getCourseImage(name, category) {
  const lower = name.toLowerCase()
  for (const [keyword, url] of Object.entries(KEYWORD_IMAGES)) {
    if (lower.includes(keyword)) return url
  }
  return CATEGORY_IMAGES[category] || CATEGORY_IMAGES.Other
}

function CourseCard({ course }) {
  const Icon = catIcons[course.category]||BookOpen
  return (
    <div className="overflow-hidden flex flex-col rounded-xl bg-white transition-all duration-200 hover:-translate-y-1"
      style={{ border:'1px solid #DADCE0', boxShadow:'0 1px 2px rgba(60,64,67,0.08)' }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=B;e.currentTarget.style.boxShadow=`0 2px 8px rgba(26,115,232,0.15)`}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='#DADCE0';e.currentTarget.style.boxShadow='0 1px 2px rgba(60,64,67,0.08)'}}>
      {course.image_url
        ? <div className="h-36 overflow-hidden bg-gray-100"><img src={course.image_url} alt={course.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" onError={e=>{e.target.src=getCourseImage(course.name,course.category)}}/></div>
        : <div className="h-36 overflow-hidden"><img src={getCourseImage(course.name, course.category)} alt={course.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" onError={e=>{e.target.style.display='none'}}/></div>
      }
      <div className="p-4 flex flex-col flex-1">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3 self-start"
          style={{ backgroundColor:'#E8F0FE', color:B, border:`1px solid #C5D9FB` }}>
          <Icon size={10}/> {course.category}
        </span>
        <h4 className="text-sm font-semibold leading-snug mb-2 flex-1" style={{color:INK}}>{course.name}</h4>
        {course.description&&<p className="text-xs line-clamp-2 mb-3" style={{color:MUT}}>{course.description}</p>}
        <a href={course.course_url} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold mt-auto" style={{color:B}}>
          View Course <ExternalLink size={11}/>
        </a>
      </div>
    </div>
  )
}

export default function Courses() {
  const [category,setCategory]=useState('All')
  const [search,setSearch]=useState('')
  const [page,setPage]=useState(1)
  const { data,loading }=useFetch(()=>coursesApi.getCourses({category:category!=='All'?category:undefined,search:search||undefined,page}),[category,search,page])
  const cats=data?.categories||['All']

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="page-title">Courses</h1><p className="page-sub">{data?`${data.total} courses found`:'Loading…'}</p></div>
        <SourceBadge source="LIVE"/>
      </div>

      <div className="p-4 rounded-xl bg-white flex flex-col sm:flex-row gap-4" style={{border:'1px solid #DADCE0'}}>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" color="#9AA0A6"/>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Search courses…" className="input pl-9"/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {cats.map(cat=>{
            const Icon=catIcons[cat]||Filter; const active=category===cat
            return (
              <button key={cat} onClick={()=>{setCategory(cat);setPage(1)}}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all"
                style={active?{backgroundColor:B,color:'#FFFFFF',border:`1px solid ${B}`}:{backgroundColor:'#FFFFFF',color:MUT,border:'1px solid #DADCE0'}}>
                <Icon size={11}/> {cat}
                {data?.category_counts?.[cat]&&cat!=='All'&&<span className="opacity-60">({data.category_counts[cat]})</span>}
              </button>
            )
          })}
        </div>
      </div>

      {loading?(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{[...Array(8)].map((_,i)=><CardSkeleton key={i}/>)}</div>
      ):data?.courses?.length>0?(
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.courses.map(c=><CourseCard key={c.id} course={c}/>)}
          </div>
          {data.total>data.page_size&&(
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="btn-secondary disabled:opacity-40">Previous</button>
              <span className="text-sm font-medium" style={{color:MUT}}>Page {page} of {Math.ceil(data.total/data.page_size)}</span>
              <button onClick={()=>setPage(p=>p+1)} disabled={page>=Math.ceil(data.total/data.page_size)} className="btn-secondary disabled:opacity-40">Next</button>
            </div>
          )}
        </>
      ):(
        <div className="p-12 text-center rounded-xl bg-white" style={{border:'1px solid #DADCE0'}}>
          <BookOpen size={48} color="#DADCE0" className="mx-auto mb-3"/>
          <h3 className="text-lg font-semibold mb-2" style={{color:INK}}>{search?'No courses match your search':'No courses found yet'}</h3>
          <p className="text-sm" style={{color:MUT}}>{!search&&'Run a website crawl to populate courses.'}</p>
        </div>
      )}
    </div>
  )
}
