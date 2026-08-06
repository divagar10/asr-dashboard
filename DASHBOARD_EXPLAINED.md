# Dashboard Explained — What Is Real vs Demo

## Overview

The ASR Digital Client Dashboard combines two types of data:

- **LIVE** — data crawled directly and in real-time from `cisprotraining.com`
- **DEMO** — realistic but simulated analytics data (placeholders until real APIs are connected)

Every widget on the dashboard carries a visible badge:

| Badge | Color | Meaning |
|---|---|---|
| 🟢 LIVE | Green | Real data from the website right now |
| 🟡 DEMO | Amber | Simulated data for demonstration purposes |

---

## Page-by-Page Breakdown

---

### Login Page

| Element | Type | Notes |
|---|---|---|
| Login form | DEMO | Hardcoded credentials: `admin@asr.digital` / `demo1234` |
| Demo Login button | DEMO | Bypasses authentication for demo use |

In a real deployment, connect to a proper auth system (JWT, OAuth, etc.).

---

### Dashboard (Main Overview)

| Widget | Type | What it shows |
|---|---|---|
| Total Visitors | DEMO | Simulated yearly total |
| Monthly Visitors | DEMO | Simulated monthly count with seasonal variation |
| Unique Users | DEMO | Calculated as 74% of monthly visitors |
| Page Views | DEMO | Calculated as 3.8 × monthly visitors |
| Avg Session Duration | DEMO | Fixed at 3m 42s |
| Bounce Rate | DEMO | Fixed at 44.2% |
| Leads Generated | DEMO | Calculated as 3.8% of monthly visitors |
| Conversion Rate | DEMO | Fixed at 3.8% |
| Returning Visitors | DEMO | Calculated as 32.5% of monthly visitors |
| Monthly change % | DEMO | Calculated from last two months of generated data |
| Monthly Visitors Chart | DEMO | 12 months of generated data with seasonal patterns |
| Traffic Sources Pie | DEMO | Organic 42%, Direct 22%, Social 15%, etc. |
| Devices Donut | DEMO | Mobile 58%, Desktop 35%, Tablet 7% |
| Lead Growth Area Chart | DEMO | 12 months of growing lead counts |
| Course Popularity Bar | DEMO | Relative lead generation per course |
| Website Performance Radar | DEMO | 6 scores: SEO, Speed, Mobile UX, Content, Security, Accessibility |

---

### Website Overview

| Widget | Type | What it shows |
|---|---|---|
| Site Name | LIVE | Crawled from page content |
| Page Title | LIVE | `<title>` tag from homepage |
| Meta Description | LIVE | `<meta name="description">` |
| Logo Image | LIVE | First `<img>` with "logo" in src/alt |
| Phone Numbers | LIVE | Extracted from page text via regex |
| Email Addresses | LIVE | Extracted from page text via regex |
| Physical Address | LIVE | Found in address/div elements |
| Google Maps Link | LIVE | Extracted from anchor or iframe `src` |
| Social Media Links | LIVE | Facebook, Instagram, WhatsApp, LinkedIn, YouTube, etc. |
| Business Hours | LIVE | Extracted from page text patterns |
| Navigation Menu | LIVE | All links inside `<nav>` or `<header>` |
| Total Pages | LIVE | Counted from sitemap.xml |
| Total Images | LIVE | Count of `<img>` tags on homepage |
| Internal Links | LIVE | Links pointing to cisprotraining.com |
| External Links | LIVE | Links pointing to other domains |
| SSL / HTTPS | LIVE | Confirmed from URL scheme |
| Robots.txt | LIVE | Checked at `/robots.txt` |
| XML Sitemap | LIVE | Checked at `/sitemap.xml` |
| Technologies Detected | LIVE | Scanned from HTML: WordPress, jQuery, Bootstrap, etc. |
| Last Crawled | LIVE | Timestamp of most recent crawl |

> All Website Overview data is 100% real. Nothing is fabricated here.

---

### Traffic Analytics

| Widget | Type | Notes |
|---|---|---|
| Monthly Visitors Chart | DEMO | 12 months of generated data |
| Daily Visitors (30 days) | DEMO | Weekday/weekend patterns simulated |
| Traffic Sources | DEMO | Organic 42%, Direct 22%, Social 15%, Referral 10%, Email 6%, Paid 5% |
| Top Countries | DEMO | UAE 38%, Saudi 20%, India 15%, Pakistan 10%, UK 6%, US 5%... |
| Top Cities | DEMO | Dubai, Abu Dhabi, Sharjah, Riyadh, Mumbai, London... |
| Devices | DEMO | Mobile 58%, Desktop 35%, Tablet 7% |
| Operating Systems | DEMO | Android 45%, Windows 30%, iOS 15%... |
| Browsers | DEMO | Chrome 62%, Safari 18%, Firefox 7%... |
| Top Landing Pages | DEMO | /, /courses, /courses/python, /blog... |
| Exit Pages | DEMO | Simulated |
| Session Duration | DEMO | 3m 42s average |
| Returning Visitors | DEMO | 32.5% |

> To replace with real data: connect Google Analytics 4 API in `backend/routers/traffic.py`

---

### Leads

| Widget | Type | Notes |
|---|---|---|
| Lead table (80 entries) | DEMO | Generated with realistic names, courses, statuses, dates |
| Lead status breakdown | DEMO | New, Contacted, Interested, Enrolled, Closed |
| Monthly lead growth chart | DEMO | 12 months of upward trend |
| Lead funnel | DEMO | 4,800 → 1,920 → 384 → 230 → 82 |
| Leads by source | DEMO | Website Form, WhatsApp, Phone, Walk-in, Social, Referral |

> To replace with real data: connect your CRM (HubSpot, Zoho, etc.) in `backend/routers/leads.py`

---

### Courses

| Widget | Type | Notes |
|---|---|---|
| Course cards | LIVE | Crawled from each `/courses/*` page |
| Course names | LIVE | Extracted from `<title>` of each course page |
| Course URLs | LIVE | Real links to cisprotraining.com/courses/* |
| Course categories | LIVE | Auto-categorised based on course name keywords |
| Course descriptions | LIVE | From `<meta name="description">` of each course page |
| Course images | LIVE | From `<img>` tags on each course page |
| Search / Filter | LIVE | Filters the live crawled course data |

> Courses currently found: Advanced Excel, AI, Cyber Security, Data Analytics, Data Engineering, Digital Marketing, Full Stack, GST, MS Office, Tally Prime

---

### Blogs

| Widget | Type | Notes |
|---|---|---|
| Blog post cards | LIVE | Crawled from `/blog`, `/blogs`, `/news`, `/posts` |
| Thumbnails | LIVE | Extracted from `<img>` in each post element |
| Published dates | LIVE | From `<time>` or date-class elements |
| Categories | LIVE | From category/tag elements |
| Authors | LIVE | From author-class elements |
| Read More links | LIVE | Actual URLs on cisprotraining.com |

> Note: cisprotraining.com currently does not have a standard `/blog` path, so the blog module shows empty until a blog section is found on the site. The crawler checks `/blog`, `/blogs`, `/news`, `/articles`, `/posts`, `/resources`, `/insights`.

---

### SEO Analysis

| Widget | Type | Notes |
|---|---|---|
| Page Title | LIVE | `<title>` tag per page |
| Meta Description | LIVE | `<meta name="description">` |
| Meta Keywords | LIVE | `<meta name="keywords">` |
| Canonical Tag | LIVE | `<link rel="canonical">` |
| Open Graph Tags | LIVE | og:title, og:description, og:image |
| Twitter Card | LIVE | twitter:card meta tag |
| H1 / H2 / H3 tags | LIVE | All heading tags per page |
| Missing Alt Text | LIVE | Count of `<img>` without alt attribute |
| Image count | LIVE | Total images per page |
| Internal Links | LIVE | Count of links to same domain |
| External Links | LIVE | Count of links to other domains |
| Structured Data | LIVE | Presence of JSON-LD or itemscope |
| SEO Score | LIVE | Calculated from all above factors (0–100) |
| Issues list | LIVE | Auto-generated from failed checks |

> Pages currently analyzed: homepage, /contact, and 8 course pages. Average SEO score: 78.2/100

---

### Website Health

| Check | Type | Notes |
|---|---|---|
| SSL Certificate | LIVE | Confirmed HTTPS is active |
| HTTPS Redirect | LIVE | Confirmed all traffic on HTTPS |
| Robots.txt | LIVE | Found at `/robots.txt` |
| XML Sitemap | LIVE | Found at `/sitemap.xml` |
| Page Speed (Mobile) | DEMO | Placeholder — score: 58/100 |
| Page Speed (Desktop) | DEMO | Placeholder — score: 74/100 |
| Mobile Friendly | DEMO | Placeholder — score: 82/100 |
| Broken Links | DEMO | Placeholder — 3 found |
| 404 Pages | DEMO | Placeholder — 2 found |
| Image Optimization | DEMO | Placeholder — score: 61/100 |
| Overall Health Score | LIVE+DEMO | Weighted average of live and demo checks — 81/100 |

> To replace DEMO checks with real data: integrate Google PageSpeed Insights API or Lighthouse CLI.

---

### AI Insights

| Widget | Type | Notes |
|---|---|---|
| All 8 insight cards | DEMO | Pre-written business recommendations |
| Priority levels | DEMO | High / Medium / Low |
| Impact ratings | DEMO | Based on typical digital marketing benchmarks |
| Action buttons | DEMO | Labels only — no real action triggered |

**Current insights:**

| Priority | Title |
|---|---|
| HIGH | Traffic up 18% — Python content driving growth |
| HIGH | Full Stack course generating highest leads |
| HIGH | Latest blog post has high engagement potential |
| MEDIUM | Mobile bounce rate 18% higher than desktop |
| MEDIUM | 7 pages missing meta descriptions |
| MEDIUM | Page load speed below industry average |
| LOW | Add Google Reviews / testimonials section |
| LOW | Email marketing opportunity identified |

> To make these dynamic: connect to real GA4 data and use an LLM API (OpenAI, etc.) to generate insights automatically.

---

### Reports

| Widget | Type | Notes |
|---|---|---|
| Monthly report page | LIVE+DEMO | Combines live website checks with demo analytics |
| Visitor summary | DEMO | |
| Lead summary | DEMO | |
| Traffic sources table | DEMO | |
| Course popularity | DEMO | |
| Top countries | DEMO | |
| AI Highlights | DEMO | Top 3 high-priority insights |
| PDF Download | LIVE+DEMO | Generated in real-time using ReportLab |

> The PDF is generated live on every download request. It includes all the same data shown on the report page.

---

### Settings

| Widget | Type | Notes |
|---|---|---|
| Company Name | UI Only | Stored in browser state, not persisted |
| Client Name | UI Only | Stored in browser state, not persisted |
| Website URL | UI Only | Stored in browser state, not persisted |
| Dark Mode toggle | UI Only | Visual only — dark mode is always on |
| Notification toggles | UI Only | Not wired to any real notification system |
| Crawl interval | UI Only | Displayed only — actual interval set in `main.py` |
| Manual crawl button | LIVE | Triggers a real crawl via `POST /api/website/crawl` |

---

## Summary Table

| Module | LIVE | DEMO |
|---|---|---|
| Website Overview | All data | Nothing |
| Courses | All data | Nothing |
| Blogs | All data | Nothing |
| SEO Analysis | All data | Nothing |
| Health — SSL/Robots/Sitemap | Checks | Speed/Mobile/Links |
| Dashboard KPIs | Nothing | All metrics |
| Traffic Analytics | Nothing | All data |
| Leads | Nothing | All 80 leads |
| AI Insights | Nothing | All 8 insights |
| Reports | Health checks, PDF generation | All analytics numbers |
| Settings — Crawl trigger | Manual crawl | All other settings |

---

## What Needs Real APIs to Go Fully Live

| Feature | API Needed |
|---|---|
| Visitor counts, sessions, bounce rate | Google Analytics 4 |
| Traffic sources, countries, devices | Google Analytics 4 |
| Keyword rankings, impressions | Google Search Console |
| Page speed scores | Google PageSpeed Insights API |
| Real leads | CRM API (HubSpot / Zoho / custom form webhook) |
| Smart AI insights | OpenAI API or similar LLM |
| Real-time social metrics | Facebook Graph API, LinkedIn API |

All the API connection points are clearly marked with `source: "DEMO"` in the backend routers. Replacing them requires updating the corresponding file in `backend/routers/`.

---

## Data Refresh Schedule

| Data Type | Refresh Frequency |
|---|---|
| Website crawl (courses, SEO, health) | Every 12 hours (automatic) |
| Demo analytics | Generated fresh on every API call |
| Manual crawl | On demand via top bar refresh button |
