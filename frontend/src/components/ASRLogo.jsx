/**
 * ASRLogo — renders /asr-logo.svg
 *
 * The SVG is drawn in white (for dark backgrounds).
 * On light/white backgrounds pass theme="dark" to invert it to black.
 *
 * widths: xs=90  sm=120  md=160  lg=210  xl=270
 */
export default function ASRLogo({ size = 'md', theme = 'light' }) {
  const widths = { xs: 90, sm: 120, md: 160, lg: 210, xl: 270 }
  const w = widths[size] || 160

  // On white/light backgrounds, invert the white SVG to black
  const filterStyle = theme === 'dark'
    ? { filter: 'invert(1)' }   // white → black
    : {}                         // keep white (for dark panel)

  return (
    <img
      src="/asr-logo.svg"
      alt="ASR — American Software Resources"
      width={w}
      style={{ display: 'block', ...filterStyle }}
    />
  )
}
