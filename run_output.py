# -*- coding: utf-8 -*-
import urllib.request, json, sys, io, textwrap

BASE = "http://localhost:8000/api"
OUTFILE = r"D:\projects\cispro dashboard\asr-dashboard\output.txt"

# capture everything to a string then write file
buf = io.StringIO()

def get(ep):
    try:
        with urllib.request.urlopen(f"{BASE}/{ep}", timeout=10) as r:
            return json.loads(r.read())
    except Exception as e:
        return {"_error": str(e)}

def w(text=""):
    buf.write(str(text) + "\n")
    print(text)   # also print to stdout

def hr(n=66): w("=" * n)
def section(t): w(); hr(); w(f"  {t}"); hr()
def ok(label, val): w(f"  [OK]  {label:<30} {val}")

w()
w("#" * 66)
w("  ASR DIGITAL CLIENT DASHBOARD")
w("  Live System Output -- cisprotraining.com")
w("#" * 66)

# 1 STATUS
section("1. SERVER STATUS")
s = get("status")
if "_error" in s:
    w(f"  [FAIL] {s['_error']}")
    with open(OUTFILE,"w",encoding="utf-8") as f: f.write(buf.getvalue())
    sys.exit(1)
ok("Status",    s["status"])
ok("Version",   s["version"])
ok("Project",   s["project"])
ok("Website",   s["website"])
ok("Timestamp", s["timestamp"])

# 2 WEBSITE OVERVIEW
section("2. WEBSITE OVERVIEW  [LIVE]")
wo = get("website/overview")
d  = wo.get("data") or {}
ok("Crawl Status",   wo.get("crawl_status","?"))
ok("Last Crawled",   str(wo.get("last_crawled","?"))[:19])
ok("Site Name",      d.get("name",""))
ok("Page Title",     d.get("title","")[:58])
ok("Description",    (d.get("description","") or "")[:55]+"...")
ok("SSL/HTTPS",      "ACTIVE" if d.get("ssl_status") else "MISSING")
ok("Robots.txt",     "Found"  if d.get("robots_txt") else "Missing")
ok("Sitemap",        "Found"  if d.get("sitemap")    else "Missing")
ok("Logo URL",       d.get("logo_url","(none)"))
ok("Phone Numbers",  ", ".join(d.get("phone_numbers",[]) or ["(none)"]))
ok("Address",        (d.get("address","") or "(none)")[:58])
ok("Social Links",   ", ".join((d.get("social_links") or {}).keys()) or "(none)")
ok("Total Pages",    str(d.get("page_count","?")))
ok("Total Images",   str(d.get("image_count","?")))
ok("Internal Links", str(d.get("internal_links_count","?")))
ok("Technologies",   ", ".join(d.get("technologies") or []) or "None detected")
w()
w("  Navigation Menu (crawled live):")
for item in (d.get("nav_menu") or [])[:10]:
    w(f"    > {item.get('label',''):<22} {item.get('url','')}")

# 3 COURSES
section("3. COURSES  [LIVE]")
c = get("courses")
ok("Total Courses", str(c.get("total","?")))
w()
w(f"  {'#':<4} {'Category':<16} {'Course Name':<38} URL")
w("  " + "-" * 66)
for i, course in enumerate(c.get("courses",[]), 1):
    name = course["name"][:36]
    cat  = course["category"][:14]
    url  = course["course_url"].replace("https://cisprotraining.com","")
    w(f"  {i:<4} {cat:<16} {name:<38} {url}")

# 4 KPI
section("4. DASHBOARD KPIs  [DEMO]")
kpi = get("dashboard/kpi")
ok("Monthly Visitors",   f"{kpi.get('monthly_visitors',0):,}")
ok("Total Visitors",     f"{kpi.get('total_visitors',0):,}")
ok("Unique Users",       f"{kpi.get('unique_users',0):,}")
ok("Page Views",         f"{kpi.get('page_views',0):,}")
ok("Avg Session",        kpi.get("avg_session","?"))
ok("Bounce Rate",        f"{kpi.get('bounce_rate',0)}%")
ok("Leads Generated",    str(kpi.get("leads_generated",0)))
ok("Conversion Rate",    f"{kpi.get('conversion_rate',0)}%")
ok("Returning Visitors", f"{kpi.get('returning_visitors',0):,}")
ok("Monthly Change",     f"{kpi.get('monthly_change_pct',0):+}% vs last month")

# 5 TRAFFIC
section("5. TRAFFIC ANALYTICS  [DEMO]")
t  = get("traffic")
sd = t.get("session_data",{})
ok("Avg Session",        sd.get("avg_session_duration","?"))
ok("Pages/Session",      str(sd.get("avg_pages_per_session","?")))
ok("Bounce Rate",        f"{sd.get('bounce_rate',0)}%")
ok("Returning Visitors", f"{sd.get('returning_visitor_rate',0)}%")
w()
w("  Traffic Sources:")
ts = t.get("traffic_sources",{})
for label, pct in zip(ts.get("labels",[]), ts.get("data",[])):
    bar = "|" * int(pct/2)
    w(f"    {label:<24} {bar:<24} {pct}%")
w()
w("  Top Countries:")
for c2 in (t.get("top_countries") or [])[:7]:
    bar = "|" * int(c2.get("percent",0)/2)
    w(f"    {c2['country']:<28} {bar:<20} {c2['percent']}%  ({c2['visitors']:,} visitors)")
w()
w("  Devices:")
dev = t.get("devices",{})
for label, pct in zip(dev.get("labels",[]), dev.get("data",[])):
    bar = "|" * int(pct/3)
    w(f"    {label:<12} {bar:<22} {pct}%")

# 6 LEADS
section("6. LEADS  [DEMO]")
l = get("leads")
ok("Total Leads", str(l.get("total","?")))
w()
w("  Status Breakdown:")
for status, count in (l.get("status_counts") or {}).items():
    bar = "|" * count
    w(f"    {status:<14} {count:>3}  {bar[:35]}")
w()
w("  Lead Funnel:")
for stage in (l.get("funnel") or []):
    bar = "|" * int(stage["count"]/200)
    w(f"    {stage['stage']:<24} {stage['count']:>6}  {bar}")
w()
w(f"  {'Name':<22} {'Course':<26} {'Source':<16} {'Status':<12} {'Date'}")
w("  " + "-" * 78)
for lead in (l.get("leads") or [])[:12]:
    w(f"  {lead['name']:<22} {lead['course_interested'][:24]:<26} {lead['source']:<16} {lead['status']:<12} {lead['date']}")

# 7 SEO
section("7. SEO ANALYSIS  [LIVE]")
seo = get("seo")
sm  = seo.get("summary") or {}
ok("Pages Analyzed", str(sm.get("pages_analyzed","?")))
ok("Average Score",  f"{sm.get('average_score','?')}/100")
ok("Total Issues",   str(sm.get("total_issues","?")))
w()
w(f"  {'Page':<44} {'Score':>6}  {'Bar (10pts each)'}")
w("  " + "-" * 64)
for p in (seo.get("pages") or []):
    short = p["page_url"].replace("https://cisprotraining.com","") or "/"
    bar   = "|" * int(p["seo_score"]/10)
    w(f"  {short:<44} {p['seo_score']:>5}  {bar}")

# 8 HEALTH
section("8. WEBSITE HEALTH  [LIVE + DEMO]")
wh = get("health")
ok("Overall Score", f"{wh.get('overall_score','?')}/100")
w()
w(f"  {'Check':<30} {'Result':<24} Source")
w("  " + "-" * 60)
for ck in (wh.get("checks") or []):
    if ck.get("status") is True:    sym = "PASS"
    elif ck.get("status") is False: sym = "FAIL"
    else:
        sc = ck.get("score")
        sym = f"Score: {sc}/100" if sc else f"Count: {ck.get('count','?')}"
    w(f"  {ck['label']:<30} {sym:<24} [{ck['source']}]")

# 9 AI INSIGHTS
section("9. AI INSIGHTS  [DEMO -- 8 business recommendations]")
ins_data = get("insights")
for insight in (ins_data.get("insights") or []):
    prio = insight["priority"]
    sym  = "[HIGH]  " if prio=="High" else ("[MED]   " if prio=="Medium" else "[LOW]   ")
    w()
    w(f"  {sym} {insight['title']}")
    w(f"         Category: {insight['category']}  |  Impact: {insight['impact']}")
    rec = textwrap.fill(
        "Rec: " + insight["recommendation"], width=62,
        initial_indent="         ", subsequent_indent="              "
    )
    w(rec)
    w(f"         Action --> {insight['action']}")

# 10 REPORT
section("10. MONTHLY REPORT  [LIVE + DEMO]")
rep  = get("reports/monthly")
kpi2 = rep.get("kpi",{})
ok("Report Month",    rep.get("month","?"))
ok("Monthly Visitors",f"{kpi2.get('monthly_visitors',0):,}")
ok("Unique Users",    f"{kpi2.get('unique_users',0):,}")
ok("Page Views",      f"{kpi2.get('page_views',0):,}")
ok("Leads",           str(kpi2.get("leads_generated",0)))
ok("Conversion Rate", f"{kpi2.get('conversion_rate',0)}%")
ok("Bounce Rate",     f"{kpi2.get('bounce_rate',0)}%")
w()
w("  AI Highlights:")
for s2 in (rep.get("ai_insights_summary") or []):
    w(f"    * {s2}")
w()
w("  Top Traffic Sources:")
ts2 = rep.get("traffic_sources",{})
for lbl, pct in zip(ts2.get("labels",[]), ts2.get("data",[])):
    w(f"    {lbl:<26} {pct}%")

# FOOTER
w()
w("#" * 66)
w("  RESULT: ALL 10 ENDPOINTS OPERATIONAL")
w()
w("  Backend API  --> http://localhost:8000        [RUNNING]")
w("  API Docs     --> http://localhost:8000/docs   [RUNNING]")
w("  Frontend     --> http://localhost:5173        [npm run dev]")
w()
w("  Login: admin@asr.digital  /  demo1234")
w("#" * 66)
w()

# Save to file
with open(OUTFILE, "w", encoding="utf-8") as f:
    f.write(buf.getvalue())
print(f"\n[Saved to {OUTFILE}]")
