import { useEffect, useRef, useState } from 'react'

export default function AnimatedCounter({ target, duration = 1200, prefix = '', suffix = '', decimals = 0 }) {
  const [value, setValue] = useState(0)
  const raf = useRef(null)
  const startTime = useRef(null)

  useEffect(() => {
    if (target === undefined || target === null) return
    const numTarget = parseFloat(target) || 0
    startTime.current = null

    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(parseFloat((numTarget * eased).toFixed(decimals)))
      if (progress < 1) raf.current = requestAnimationFrame(animate)
    }

    raf.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration, decimals])

  const formatted = decimals > 0
    ? value.toFixed(decimals)
    : value >= 1000000
      ? `${(value / 1000000).toFixed(1)}M`
      : value >= 1000
        ? `${(value / 1000).toFixed(1)}K`
        : Math.round(value).toLocaleString()

  return <span className="animate-count">{prefix}{formatted}{suffix}</span>
}
