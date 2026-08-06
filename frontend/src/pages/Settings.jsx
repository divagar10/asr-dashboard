import { useState } from 'react'
import { Globe, Building, Bell, Save, RefreshCw, CheckCircle } from 'lucide-react'
import { websiteApi } from '../utils/api'

const B   = '#1A73E8'
const INK = '#202124'
const MUT = '#5F6368'
const CARD = { backgroundColor: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: '12px', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }
const BD   = '1px solid #F1F3F4'

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="p-5 rounded-xl bg-white" style={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
      <div className="flex items-center gap-2 mb-5">
        <Icon size={16} color={B} />
        <h3 className="text-sm font-semibold" style={{ color: INK }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="flex items-start justify-between py-4 gap-4" style={{ borderBottom: BD }}>
      <div className="min-w-0">
        <div className="text-sm font-medium" style={{ color: INK }}>{label}</div>
        {desc && <div className="text-xs mt-0.5" style={{ color: MUT }}>{desc}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      className="relative w-12 h-6 rounded-full transition-all duration-200 focus:outline-none"
      style={{ backgroundColor: value ? B : '#DADCE0' }}>
      <span className="absolute top-1 w-4 h-4 rounded-full shadow transition-transform duration-200"
        style={{ backgroundColor: '#FFFFFF', transform: value ? 'translateX(28px)' : 'translateX(4px)' }} />
    </button>
  )
}

export default function Settings() {
  const [company,    setCompany]    = useState('ASR Digital')
  const [client,     setClient]     = useState('CISPRO Training')
  const [website,    setWebsite]    = useState('https://cisprotraining.com')
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifCrawl, setNotifCrawl] = useState(true)
  const [notifLeads, setNotifLeads] = useState(true)
  const [crawlHours, setCrawlHours] = useState(12)
  const [saved,      setSaved]      = useState(false)
  const [crawling,   setCrawling]   = useState(false)

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  const handleCrawl = async () => {
    setCrawling(true)
    try { await websiteApi.triggerCrawl() } catch {}
    setTimeout(() => setCrawling(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="page-title">Settings</h1><p className="page-sub">Configure your dashboard preferences</p></div>

      <SectionCard icon={Building} title="Company Information">
        <SettingRow label="Company Name" desc="Your agency name">
          <input value={company} onChange={e => setCompany(e.target.value)} className="input w-52" />
        </SettingRow>
        <SettingRow label="Client Name" desc="Client business name">
          <input value={client} onChange={e => setClient(e.target.value)} className="input w-52" />
        </SettingRow>
        <SettingRow label="Website URL" desc="The website to monitor">
          <input value={website} onChange={e => setWebsite(e.target.value)} className="input w-52" />
        </SettingRow>
      </SectionCard>

      <SectionCard icon={Bell} title="Notifications">
        <SettingRow label="Email Notifications" desc="Receive monthly reports via email">
          <Toggle value={notifEmail} onChange={setNotifEmail} />
        </SettingRow>
        <SettingRow label="Crawl Alerts" desc="Notify when website crawl completes">
          <Toggle value={notifCrawl} onChange={setNotifCrawl} />
        </SettingRow>
        <SettingRow label="New Lead Alerts" desc="Alert when new leads are detected">
          <Toggle value={notifLeads} onChange={setNotifLeads} />
        </SettingRow>
      </SectionCard>

      <SectionCard icon={Globe} title="Crawler Settings">
        <SettingRow label="Crawl Interval" desc="How often to automatically crawl the website">
          <select value={crawlHours} onChange={e => setCrawlHours(Number(e.target.value))}
            className="input w-44">
            <option value={6}>Every 6 hours</option>
            <option value={12}>Every 12 hours</option>
            <option value={24}>Every 24 hours</option>
          </select>
        </SettingRow>
        <SettingRow label="Manual Crawl" desc="Trigger an immediate website crawl">
          <button onClick={handleCrawl} disabled={crawling} className="btn-secondary disabled:opacity-50">
            <RefreshCw size={13} className={crawling ? 'animate-spin' : ''} />
            {crawling ? 'Running…' : 'Run Now'}
          </button>
        </SettingRow>
      </SectionCard>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary">
          {saved
            ? <><CheckCircle size={15} /> Saved!</>
            : <><Save size={15} /> Save Settings</>}
        </button>
      </div>
    </div>
  )
}
