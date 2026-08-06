import axios from 'axios'

/**
 * API base URL resolution:
 *  - Local dev:   uses Vite proxy  → /api  → http://localhost:8000
 *  - Production:  VITE_API_URL set to Render backend URL in Netlify env vars
 *                 e.g. https://asr-dashboard-api.onrender.com
 */
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  r => r,
  err => {
    console.error('API error:', err.message)
    return Promise.reject(err)
  }
)

export const dashboardApi = {
  getKpi:    () => api.get('/dashboard/kpi').then(r => r.data),
  getCharts: () => api.get('/dashboard/charts').then(r => r.data),
}

export const websiteApi = {
  getOverview:    () => api.get('/website/overview').then(r => r.data),
  triggerCrawl:   () => api.post('/website/crawl').then(r => r.data),
  getCrawlStatus: () => api.get('/website/crawl-status').then(r => r.data),
}

export const coursesApi = {
  getCourses: (params) => api.get('/courses', { params }).then(r => r.data),
}

export const blogsApi = {
  getBlogs: (params) => api.get('/blogs', { params }).then(r => r.data),
}

export const seoApi = {
  getSeo: () => api.get('/seo').then(r => r.data),
}

export const healthApi = {
  getHealth: () => api.get('/health').then(r => r.data),
}

export const trafficApi = {
  getTraffic: () => api.get('/traffic').then(r => r.data),
}

export const leadsApi = {
  getLeads: (params) => api.get('/leads', { params }).then(r => r.data),
}

export const insightsApi = {
  getInsights: () => api.get('/insights').then(r => r.data),
}

export const reportsApi = {
  getMonthly:   () => api.get('/reports/monthly').then(r => r.data),
  downloadPdf:  () => api.get('/reports/monthly/pdf', { responseType: 'blob' }).then(r => r.data),
}

export const statusApi = {
  getStatus: () => api.get('/status').then(r => r.data),
}
