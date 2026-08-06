import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import WebsiteOverview from './pages/WebsiteOverview'
import Traffic from './pages/Traffic'
import Leads from './pages/Leads'
import Courses from './pages/Courses'
import Blogs from './pages/Blogs'
import SEO from './pages/SEO'
import Health from './pages/Health'
import AIInsights from './pages/AIInsights'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function ProtectedRoute({ children }) {
  const auth = localStorage.getItem('asr_auth')
  if (!auth) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard"  element={<Dashboard />} />
        <Route path="overview"   element={<WebsiteOverview />} />
        <Route path="traffic"    element={<Traffic />} />
        <Route path="leads"      element={<Leads />} />
        <Route path="courses"    element={<Courses />} />
        <Route path="blogs"      element={<Blogs />} />
        <Route path="seo"        element={<SEO />} />
        <Route path="health"     element={<Health />} />
        <Route path="insights"   element={<AIInsights />} />
        <Route path="reports"    element={<Reports />} />
        <Route path="settings"   element={<Settings />} />
      </Route>
    </Routes>
  )
}
