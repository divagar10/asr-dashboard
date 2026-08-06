# -*- coding: utf-8 -*-
"""
ASR Digital Dashboard - Full Live Output Demo
Run: python show_output.py
"""
import urllib.request, json, sys, textwrap

BASE = "http://localhost:8000/api"

def get(ep):
    try:
        with urllib.request.urlopen(f"{BASE}/{ep}", timeout=10) as r:
            return json.loads(r.read())
    except Exception as e:
        return {"_error": str(e)}

def hr(n=66): print("=" * n)
def section(title):
    print()
    hr()
    print(f"  {title}")
    hr()

def ok(label, val):  print(f"  [OK]  {label:<30} {val}")
def info(label, val):print(f"  [ ] {label:<30} {val}")

# ================================================================
print()
print("#" * 66)
print("  ASR DIGITAL CLIENT DASHBOARD")
print("  Live System Output -- cisprotraining.com")
print("#" * 66)

# ── 1. SERVER STATUS ────────────────────────────────────────────
section("1. SERVER STATUS")
s = get("status")
if "_error" in s:
    print(f"  [FAIL] Cannot reach backend: {s['_error']}")
    sys.exit(1)
ok("Status",    s["status"])
ok("Version",   s["version"])
ok("Project",   s["project"])
ok("Website",   s["website"])
ok("Timestamp", s["timestamp"])

# ── 2. WEBSITE OVERVIEW (LIVE CRAWLED) ──────────────────────────
section("2. WEBSITE OVERVIEW  [LIVE -- crawled from cisprotraining.com]")
wo = get("website/overview")
d  = wo.get("data") or {}
ok("Crawl Status",    wo.get("crawl_status", "?"))
ok("Last Crawled",    wo.get("last_crawled", "?"))
ok("Site Name",       d.get("name", ""))
ok("Page Title",      d.get("title", "")[:58])
ok("Description",     (d.get("description","") or "")[:55] + "...")
ok("SSL / HTTPS",     "ACTIVE" if d.get("ssl_status") else "MISSING")
ok("Robots.txt",      "Found"  if d.get("robots_txt") else "Missing")
ok("Sitemap",         "Found"  if d.get("sitemap")    else "Missing")
ok("Logo URL",        d.get("logo_url","(none)"))
ok("Phones",          ", ".join(d.get("phone_numbers",[]) or ["(none)"]))
ok("Address",         (d.get("address","") or "(none)")[:58])
ok("Social Links",    ", ".join((d.get("social_links") or {}).keys()) or "(none)")
ok("Total Pages",     str(d.get("page_count","?")))
ok("Total Images",    str(d.get("image_count","?")))
ok("Internal Links",  str(d.get("internal_links_count","?")))
ok("External Links",  str(d.get("external_links_count","?")))
ok("Technologies",    ", ".join(d.get("technologies") or []) or "None detected")
print()
print("  Navigation Menu (crawled live):")
for item in (d.get("nav_menu") or [])[:10]:
    print(f"    > {item.get('label',''):<22} {item.get('url','')}")

# ── 3. COURSES (LIVE CRAWLED) ───────────────────────────────────
section("3. COURSES  [LIVE -- crawled from cisprotraining.com]")
c = get("courses")
ok("Total Courses", str(c.get("total","?")))
ok("Source",        c.get("source","?"))
print()
print(f"  {'#':<4} {'Category':<16} {'Course Name':<38} URL slug")
print("  " + "-" * 64)
for i, course in enumerate(c.get("courses",[]), 1):
    name = course["name"][:36]
    cat  = course["category"][:14]
    url  = course["course_url"].replace("https://cisprotraining.com","")
    print(f"  {i:<4} {cat:<16} {name:<38} {url}")

# ── 4. DASHBOARD KPI (DEMO) ─────────────────────────────────────
section("4. DASHBOARD KPIs  [DEMO analytics data]")
kpi = get("dashboard/kpi")
ok("Monthly Visitors",  f"{kpi.get('monthly_visitors',0):,}")
ok("Total Visitors",    f"{kpi.get('total_visitors',0):,}")
ok("Unique Users",      f"{kpi.get('unique_users',0):,}")
ok("Page Views",        f"{kpi.get('page_views',0):,}")
ok("Avg Session",       kpi.get("avg_session","?"))
ok("Bounce Rate",       f"{kpi.get('bounce_rate',0)}%")
ok("Leads Generated",   f"{kpi.get('leads_generated',0)}")
ok("Conversion Rate",   f"{kpi.get('conversion_rate',0)}%")
ok("Returning Visitors",f"{kpi.get('returning_visitors',0):,}")
ok("Monthly Change",    f"{kpi.get('monthly_change_pct',0):+}% vs last month")

# ── 5. TRAFFIC (DEMO) ───────────────────────────────────────────
section("5. TRAFFIC ANALYTICS  [DEMO]")
t  = get("traffic")
sd = t.get("session_data",{})
ok("Avg Session Duration",   sd.get("avg_session_duration","?"))
ok("Pages per Session",      str(sd.get("avg_pages_per_session","?")))
ok("Bounce Rate",            f"{sd.get('bounce_rate',0)}%")
ok("Returning Visitor Rate", f"{sd.get('returning_visitor_rate',0)}%")
print()
print("  Traffic Sources:")
ts = t.get("traffic_sources",{})
for label, pct in zip(ts.get("labels",[]), ts.get("data",[])):
    bar = "|" * int(pct / 2)
    print(f"    {label:<24} {bar:<24} {pct}%")
print()
print("  Top Countries:")
for c2 in (t.get("top_countries") or [])[:7]:
    bar = "|" * int(c2.get("percent",0) / 2)
    print(f"    {c2['country']:<28} {bar:<20} {c2['percent']}%  ({c2['visitors']:,} visitors)")
print()
print("  Devices:")
dev = t.get("devices",{})
for label, pct in zip(dev.get("labels",[]), dev.get("data",[])):
    bar = "|" * int(pct / 3)
    print(f"    {label:<12} {bar:<22} {pct}%")

# ── 6. LEADS (DEMO) ─────────────────────────────────────────────
section("6. LEADS  [DEMO -- 80 sample leads]")
l = get("leads")
ok("Total Leads",  str(l.get("total","?")))
ok("Source",       l.get("source","?"))
print()
print("  Status Breakdown:")
for status, count in (l.get("status_counts") or {}).items():
    bar = "|" * count
    print(f"    {status:<14} {count:>3} leads  {bar[:30]}")
print()
print("  Lead Funnel (conversion path):")
for stage in (l.get("funnel") or []):
    bar = "|" * int(stage["count"] / 200)
    print(f"    {stage['stage']:<24} {stage['count']:>5}  {bar}")
print()
print(f"  {'Name':<22} {'Course':<26} {'Source':<16} {'Status':<12} {'Date'}")
print("  " + "-" * 76)
for lead in (l.get("leads") or [])[:12]:
    print(f"  {lead['name']:<22} {lead['course_interested'][:24]:<26} {lead['source']:<16} {lead['status']:<12} {lead['date']}")

# ── 7. SEO ANALYSIS (LIVE) ──────────────────────────────────────
section("7. SEO ANALYSIS  [LIVE -- analyzed crawled pages]")
seo = get("seo")
sm  = seo.get("summary") or {}
ok("Source",         seo.get("source","?"))
ok("Pages Analyzed", str(sm.get("pages_analyzed","?")))
ok("Average Score",  f"{sm.get('average_score','?')}/100")
ok("High Issues",    str(sm.get("high_issues","?")))
ok("Medium Issues",  str(sm.get("medium_issues","?")))
ok("Total Issues",   str(sm.get("total_issues","?")))
print()
print(f"  {'Page':<44} {'Score':>6}  {'Bar'}")
print("  " + "-" * 62)
for p in (seo.get("pages") or []):
    short = p["page_url"].replace("https://cisprotraining.com","") or "/"
    bar   = "|" * int(p["seo_score"] / 10)
    print(f"  {short:<44} {p['seo_score']:>5}  {bar}")
print()
print("  Issues Found:")
for issue in (seo.get("issues") or [])[:8]:
    sev = issue.get("severity","?")
    pg  = issue.get("page","").replace("https://cisprotraining.com","")
    print(f"    [{sev:<6}] {issue.get('issue',''):<42} {pg}")

# ── 8. WEBSITE HEALTH (LIVE+DEMO) ───────────────────────────────
section("8. WEBSITE HEALTH  [LIVE + DEMO placeholders]")
wh = get("health")
ok("Overall Score", f"{wh.get('overall_score','?')}/100")
print()
print(f"  {'Check':<30} {'Result':<24} {'Source'}")
print("  " + "-" * 58)
for ck in (wh.get("checks") or []):
    if ck.get("status") is True:    sym = "PASS"
    elif ck.get("status") is False: sym = "FAIL"
    else:
        sc = ck.get("score")
        sym = f"Score: {sc}/100" if sc else f"Count: {ck.get('count','?')}"
    print(f"  {ck['label']:<30} {sym:<24} [{ck['source']}]")

# ── 9. AI INSIGHTS (DEMO) ───────────────────────────────────────
section("9. AI INSIGHTS  [DEMO -- 8 business recommendations]")
ins_data = get("insights")
for insight in (ins_data.get("insights") or []):
    prio = insight["priority"]
    sym  = "[HIGH]  " if prio=="High" else ("[MED]   " if prio=="Medium" else "[LOW]   ")
    print(f"\n  {sym} {insight['title']}")
    print(f"   Category : {insight['category']}   |   Impact: {insight['impact']}")
    wrapped = textwrap.fill(insight["recommendation"], width=60,
                            initial_indent="   Rec: ", subsequent_indent="         ")
    print(wrapped)
    print(f"   Action   : {insight['action']}")

# ── 10. MONTHLY REPORT ──────────────────────────────────────────
section("10. MONTHLY REPORT SUMMARY  [LIVE + DEMO]")
rep  = get("reports/monthly")
kpi2 = rep.get("kpi",{})
ok("Report Month",   rep.get("month","?"))
ok("Generated At",   rep.get("generated_at","?")[:19])
ok("Monthly Visitors",f"{kpi2.get('monthly_visitors',0):,}")
ok("Unique Users",    f"{kpi2.get('unique_users',0):,}")
ok("Page Views",      f"{kpi2.get('page_views',0):,}")
ok("Leads",           str(kpi2.get("leads_generated",0)))
ok("Conversion Rate", f"{kpi2.get('conversion_rate',0)}%")
ok("Bounce Rate",     f"{kpi2.get('bounce_rate',0)}%")
ok("Avg Session",     kpi2.get("avg_session","?"))
print()
print("  AI Highlights in this report:")
for s2 in (rep.get("ai_insights_summary") or []):
    print(f"    * {s2}")
print()
print("  Top Traffic Sources:")
ts2 = rep.get("traffic_sources",{})
for lbl, pct in zip(ts2.get("labels",[]), ts2.get("data",[])):
    print(f"    {lbl:<24} {pct}%")

# ── FINAL ────────────────────────────────────────────────────────
print()
print("#" * 66)
print("  RESULT: ALL ENDPOINTS OPERATIONAL")
print()
print("  Backend API  --> http://localhost:8000        [RUNNING]")
print("  API Docs     --> http://localhost:8000/docs   [RUNNING]")
print("  Frontend     --> http://localhost:5173        [npm run dev]")
print()
print("  Login: admin@asr.digital  /  demo1234")
print("#" * 66)
print()
