import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react'
import ASRLogo from '../components/ASRLogo'

const B = '#1A73E8'
const features = [
  'Live website crawler — real data from cisprotraining.com',
  'Demo analytics — traffic, leads, conversions',
  'AI-powered business insights & recommendations',
  'One-click PDF monthly reports',
]

export default function Login() {
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 700))
    if (email === 'admin@asr.digital' && password === 'demo1234') {
      localStorage.setItem('asr_auth', 'true'); navigate('/dashboard')
    } else { setError('Invalid credentials. Use demo login below.') }
    setLoading(false)
  }
  const demoLogin = () => { localStorage.setItem('asr_auth', 'true'); navigate('/dashboard') }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F8F9FA' }}>

      {/* ── Left — dark navy GA4-style brand panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[48%] p-12 relative overflow-hidden"
        style={{ backgroundColor: '#202124' }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
          style={{ backgroundColor: 'rgba(26,115,232,0.2)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"
          style={{ backgroundColor: 'rgba(26,115,232,0.1)' }} />

        {/* Logo */}
        <div className="relative">
          <ASRLogo size="sm" theme="light" />
        </div>

        {/* Hero text */}
        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(26,115,232,0.15)', border: '1px solid rgba(26,115,232,0.35)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: B }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#8AB4F8' }}>
              Premium Analytics
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight" style={{ letterSpacing: '-0.03em' }}>
            Client<br />Analytics<br />
            <span style={{ color: '#8AB4F8' }}>Dashboard</span>
          </h1>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#9AA0A6' }}>
            A professional SaaS analytics platform for digital agencies. Real website data. AI insights.
          </p>
          <ul className="space-y-3">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle size={15} color={B} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm" style={{ color: '#9AA0A6' }}>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Client badge */}
        <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-0.5"
              style={{ color: '#9AA0A6', fontSize: '0.6rem' }}>Demo Client</div>
            <div className="text-sm font-semibold text-white">CISPRO Training</div>
            <div className="text-xs" style={{ color: '#9AA0A6' }}>cisprotraining.com</div>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(52,168,83,0.15)', border: '1px solid rgba(52,168,83,0.3)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#34A853', animation: 'pulse 2s infinite' }} />
            <span className="text-xs font-semibold" style={{ color: '#34A853' }}>Live</span>
          </div>
        </div>
      </div>

      {/* ── Right — login form ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <ASRLogo size="xs" theme="dark" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#202124', letterSpacing: '-0.02em' }}>
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: '#5F6368' }}>Sign in to your analytics dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5F6368' }}>
                Email
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" color="#9AA0A6" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@asr.digital" className="input pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5F6368' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" color="#9AA0A6" />
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#9AA0A6' }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded" style={{ accentColor: B }} />
                <span className="text-xs font-medium" style={{ color: '#5F6368' }}>Remember me</span>
              </label>
              <button type="button" className="text-xs font-semibold" style={{ color: B }}>
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg text-sm"
                style={{ backgroundColor: '#FCE8E6', border: '1px solid #F5C6C2', color: '#D93025' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-1">
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Sign In</span><ArrowRight size={15} /></>}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: '#DADCE0' }} />
            <span className="text-xs font-medium" style={{ color: '#9AA0A6' }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#DADCE0' }} />
          </div>

          {/* Demo login */}
          <button onClick={demoLogin}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95"
            style={{ backgroundColor: '#202124', color: '#FFFFFF' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3C4043'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#202124'}>
            Demo Login — Enter Dashboard
          </button>

          <p className="text-center text-xs mt-5" style={{ color: '#9AA0A6' }}>
            Demo: <span style={{ color: '#5F6368' }}>admin@asr.digital</span>
            {' / '}
            <span style={{ color: '#5F6368' }}>demo1234</span>
          </p>
        </div>
      </div>
    </div>
  )
}
