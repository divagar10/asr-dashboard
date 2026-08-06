import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { blogsApi } from '../utils/api'
import SourceBadge from '../components/SourceBadge'
import { CardSkeleton } from '../components/Skeleton'
import { FileText,Search,ExternalLink,User,Calendar,Tag,Star } from 'lucide-react'

const B   = '#1A73E8'
const INK = '#202124'
const MUT = '#5F6368'

function BlogCard({ post }) {
  return (
    <div className="overflow-hidden flex flex-col rounded-xl bg-white transition-all duration-200 hover:-translate-y-1"
      style={{ border:'1px solid #DADCE0', boxShadow:'0 1px 2px rgba(60,64,67,0.08)' }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=B;e.currentTarget.style.boxShadow=`0 2px 8px rgba(26,115,232,0.15)`}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='#DADCE0';e.currentTarget.style.boxShadow='0 1px 2px rgba(60,64,67,0.08)'}}>
      {post.thumbnail_url
        ?<div className="h-40 overflow-hidden bg-gray-100"><img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" onError={e=>{e.target.style.display='none'}}/></div>
        :<div className="h-40 flex items-center justify-center" style={{backgroundColor:'#F8F9FA'}}><FileText size={36} color="#DADCE0"/></div>
      }
      <div className="p-4 flex flex-col flex-1">
        {post.category&&(
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 self-start"
            style={{backgroundColor:'#E8F0FE',color:B,border:'1px solid #C5D9FB'}}>
            <Tag size={9}/> {post.category}
          </span>
        )}
        <h4 className="text-sm font-semibold leading-snug mb-2 flex-1" style={{color:INK}}>{post.title}</h4>
        {post.short_description&&<p className="text-xs line-clamp-2 mb-3" style={{color:MUT}}>{post.short_description}</p>}
        <div className="flex items-center gap-3 text-xs mb-3" style={{color:'#9AA0A6'}}>
          {post.author&&post.author!=='CISPRO Team'&&<span className="flex items-center gap-1"><User size={10}/>{post.author}</span>}
          {post.published_date&&<span className="flex items-center gap-1"><Calendar size={10}/>{post.published_date}</span>}
        </div>
        <a href={post.post_url} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold mt-auto" style={{color:B}}>
          Read More <ExternalLink size={11}/>
        </a>
      </div>
    </div>
  )
}

export default function Blogs() {
  const [search,setSearch]=useState('')
  const [page,setPage]=useState(1)
  const { data,loading }=useFetch(()=>blogsApi.getBlogs({search:search||undefined,page}),[search,page])
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="page-title">Blog Posts</h1><p className="page-sub">{data?`${data.total} posts`:'Loading…'}</p></div>
        <SourceBadge source="LIVE"/>
      </div>

      {data&&(
        <div className="grid grid-cols-3 gap-4">
          {[{label:'Total Blogs',value:data.total},{label:'Recent Posts',value:data.recent_posts?.length||0},{label:'Categories',value:[...new Set((data.posts||[]).map(p=>p.category).filter(Boolean))].length}].map((s,i)=>(
            <div key={i} className="p-4 rounded-xl bg-white text-center" style={{border:'1px solid #DADCE0',boxShadow:'0 1px 2px rgba(60,64,67,0.08)'}}>
              <div className="text-3xl font-bold" style={{color:INK,letterSpacing:'-0.02em'}}>{s.value}</div>
              <div className="text-xs font-medium mt-1" style={{color:MUT}}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {data?.most_recent&&(
        <div className="p-5 rounded-xl" style={{backgroundColor:B}}>
          <div className="flex items-center gap-2 mb-3">
            <Star size={15} color="#FFFFFF" fill="#FFFFFF"/>
            <span className="text-sm font-semibold uppercase tracking-widest text-white">Most Recent Post</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {data.most_recent.thumbnail_url&&<img src={data.most_recent.thumbnail_url} alt={data.most_recent.title} className="w-full sm:w-44 h-28 object-cover rounded-xl" style={{backgroundColor:'rgba(255,255,255,0.15)'}} onError={e=>{e.target.style.display='none'}}/>}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-base leading-snug mb-1 text-white">{data.most_recent.title}</h4>
              <p className="text-sm mb-3 line-clamp-2" style={{color:'rgba(255,255,255,0.75)'}}>{data.most_recent.short_description}</p>
              <a href={data.most_recent.post_url} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                Read Full Post <ExternalLink size={12}/>
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" color="#9AA0A6"/>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Search blog posts…" className="input pl-9"/>
      </div>

      {loading?(
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{[...Array(6)].map((_,i)=><CardSkeleton key={i}/>)}</div>
      ):data?.posts?.length>0?(
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{data.posts.map(post=><BlogCard key={post.id} post={post}/>)}</div>
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
          <FileText size={48} color="#DADCE0" className="mx-auto mb-3"/>
          <h3 className="text-lg font-semibold mb-2" style={{color:INK}}>{search?'No posts match your search':'No blog posts found yet'}</h3>
          <p className="text-sm" style={{color:MUT}}>Run a website crawl to populate blog posts.</p>
        </div>
      )}
    </div>
  )
}
