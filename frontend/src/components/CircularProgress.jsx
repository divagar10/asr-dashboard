export default function CircularProgress({ value = 0, size = 120, strokeWidth = 10, color, label = '' }) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ

  const autoColor = (v) => {
    if (v >= 75) return '#1E8E3E'   // green
    if (v >= 50) return '#1A73E8'   // blue
    return '#D93025'                // red
  }
  const strokeColor = color || autoColor(value)

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 absolute inset-0">
          <circle cx={size/2} cy={size/2} r={r}
            fill="none" stroke="#F1F3F4" strokeWidth={strokeWidth} />
          <circle cx={size/2} cy={size/2} r={r}
            fill="none" stroke={strokeColor} strokeWidth={strokeWidth}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold" style={{ color: strokeColor }}>{value}</span>
          {label && <span className="text-xs mt-0.5" style={{ color: '#5F6368' }}>{label}</span>}
        </div>
      </div>
    </div>
  )
}
