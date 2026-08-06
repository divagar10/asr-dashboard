export function Skeleton({ className = '', style = {} }) {
  return <div className={`skeleton ${className}`} style={style} />
}

export function CardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <Skeleton className="h-3.5 w-1/3" />
      <Skeleton className="h-7 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton({ height = '260px' }) {
  return <Skeleton className="w-full rounded-xl" style={{ height }} />
}
