# ASR Digital — Client Analytics Dashboard

A premium AI-powered analytics dashboard built for digital marketing agencies. Demonstrates real-time website intelligence using live web crawling combined with realistic demo analytics data.

**Demo website:** [cisprotraining.com](https://cisprotraining.com)

---

## Features

| Module | Data Source | Description |
|---|---|---|
| Dashboard | DEMO | KPI cards, 6 chart types, animated counters |
| Website Overview | LIVE | Crawled title, description, logo, contact info, nav, tech stack |
| Traffic Analytics | DEMO | Visitors, devices, countries, landing pages, session data |
| Leads | DEMO | 80 leads with funnel, growth chart, status tracking |
| Courses | LIVE | Crawled and categorised courses with search/filter |
| Blogs | LIVE | Crawled blog posts with thumbnails and metadata |
| SEO Analysis | LIVE | Per-page SEO scores, heading structure, OG tags, issues |
| Website Health | LIVE + DEMO | SSL/robots/sitemap live; speed/mobile as placeholders |
| AI Insights | DEMO | 8 prioritised recommendations with actions |
| Reports | LIVE + DEMO | Monthly summary + downloadable PDF |
| Settings | — | Company info, notifications, theme, crawl interval |

Every widget carries a **LIVE** (green) or **DEMO** (amber) badge so clients always know the data source.

---

## Tech Stack

**Backend**
- Python 3.10+
- FastAPI + Uvicorn
- SQLAlchemy + SQLite
- BeautifulSoup4 + httpx (crawler)
- APScheduler (auto-crawl every 12 hours)
- ReportLab (PDF generation)

**Frontend**
- React 18 + Vite
- Tailwind CSS v3 (dark theme, glassmorphism)
- Chart.js + react-chartjs-2
- Lucide React (icons)
- React Router v6
- Axios

---

## Prerequisites

- **Python 3.10+** — [python.org](https://www.python.org/downloads/)
- **Node.js 18+** — [nodejs.org](https://nodejs.org/)
- **pip** (comes with Python)

---

## Installation & Setup

### 1 — Clone / open the project

```
cd asr-dashboard
```

### 2 — Backend setup

```bash
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3 — Start the backend

```bash
# From inside asr-dashboard/backend/
uvicorn main:app --reload --port 8000
```

On first startup the server will:
1. Create `asr_dashboard.db` (SQLite)
2. Automatically trigger a background crawl of cisprotraining.com
3. Schedule subsequent crawls every 12 hours

The API will be available at **http://localhost:8000**
Interactive docs at **http://localhost:8000/docs**

### 4 — Frontend setup

Open a **second terminal**:

```bash
cd asr-dashboard/frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The dashboard will be available at **http://localhost:5173**

---

## Login

| Field | Value |
|---|---|
| Email | `admin@asr.digital` |
| Password | `demo1234` |

Or click **Demo Login** on the login page.

---

## Project Structure

```
asr-dashboard/
├── backend/
│   ├── main.py              # FastAPI app + scheduler
│   ├── database.py          # SQLAlchemy models (SQLite)
│   ├── crawler.py           # Web crawler for cisprotraining.com
│   ├── demo_data.py         # Realistic demo analytics generator
│   ├── requirements.txt
│   └── routers/
│       ├── dashboard.py     # /api/dashboard/*
│       ├── website.py       # /api/website/*
│       ├── courses.py       # /api/courses
│       ├── blogs.py         # /api/blogs
│       ├── seo.py           # /api/seo
│       ├── health.py        # /api/health
│       ├── traffic.py       # /api/traffic
│       ├── leads.py         # /api/leads
│       ├── insights.py      # /api/insights
│       └── reports.py       # /api/reports/*
└── frontend/
    ├── index.html
    ├── vite.config.js       # Proxy /api → localhost:8000
    ├── tailwind.config.js
    └── src/
        ├── App.jsx          # Router
        ├── main.jsx
        ├── index.css        # Tailwind + custom styles
        ├── components/
        │   ├── Layout.jsx
        │   ├── Sidebar.jsx
        │   ├── TopBar.jsx
        │   ├── SourceBadge.jsx
        │   ├── Skeleton.jsx
        │   ├── AnimatedCounter.jsx
        │   └── CircularProgress.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Dashboard.jsx
        │   ├── WebsiteOverview.jsx
        │   ├── Traffic.jsx
        │   ├── Leads.jsx
        │   ├── Courses.jsx
        │   ├── Blogs.jsx
        │   ├── SEO.jsx
        │   ├── Health.jsx
        │   ├── AIInsights.jsx
        │   ├── Reports.jsx
        │   └── Settings.jsx
        ├── hooks/
        │   └── useFetch.js
        └── utils/
            └── api.js
```

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/status` | GET | Server health check |
| `/api/dashboard/kpi` | GET | KPI summary (DEMO) |
| `/api/dashboard/charts` | GET | All chart datasets (DEMO) |
| `/api/website/overview` | GET | Crawled website data (LIVE) |
| `/api/website/crawl` | POST | Trigger immediate crawl |
| `/api/website/crawl-status` | GET | Last crawl log |
| `/api/courses` | GET | Courses with search/filter/pagination |
| `/api/blogs` | GET | Blog posts with search/pagination |
| `/api/seo` | GET | SEO analysis per page |
| `/api/health` | GET | Website health checks |
| `/api/traffic` | GET | Full traffic analytics (DEMO) |
| `/api/leads` | GET | Leads with filter/pagination (DEMO) |
| `/api/insights` | GET | AI insights (DEMO) |
| `/api/reports/monthly` | GET | Monthly report JSON |
| `/api/reports/monthly/pdf` | GET | Download PDF report |

---

## Production Build

```bash
# Build the frontend
cd frontend
npm run build
# Output goes to frontend/dist/

# Serve static files from FastAPI (add to main.py):
# app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")

# Run production server
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
```

---

## Connecting Real Analytics

To replace DEMO data with live data, integrate:

| Service | Replace in |
|---|---|
| **Google Analytics 4** | `routers/traffic.py`, `routers/dashboard.py` |
| **Google Search Console** | `routers/seo.py` |
| **Meta / Google Ads** | `routers/leads.py` |
| **CRM (HubSpot / Zoho)** | `routers/leads.py` |

Each router already returns `"source": "DEMO"` — change it to `"LIVE"` once real data is connected.

---

## Customising for Other Clients

1. Change `BASE_URL` in `backend/crawler.py`
2. Update company name in `backend/main.py` → `/api/settings`
3. Update `CISPRO Training` references in `frontend/src/components/Sidebar.jsx` and `TopBar.jsx`
4. Adjust `COURSE_CATEGORIES` in `crawler.py` if the client is not a training company

---

## Notes

- The crawler runs with a 30-second timeout per page and respects standard HTTP headers
- No login/password is stored — the demo uses localStorage only
- All crawled data is stored in `backend/asr_dashboard.db` (SQLite, auto-created)
- The PDF report uses ReportLab and streams directly — no temp files written to disk
- CORS is configured for `localhost:3000`, `localhost:5173`, and `127.0.0.1:5173`

---

Built by **ASR Digital** — premium client dashboards for digital agencies.
