export default function SourceBadge({ source }) {
  if (source === 'LIVE') {
    return (
      <span className="badge-live">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
        LIVE
      </span>
    )
  }
  return (
    <span className="badge-demo">
      <span className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ backgroundColor: '#1A73E8' }} />
      DEMO
    </span>
  )
}
