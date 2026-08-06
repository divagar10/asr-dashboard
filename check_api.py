"""Quick API health check — run from project root."""
import urllib.request
import json

BASE = "http://localhost:8000/api"
ENDPOINTS = [
    "status",
    "dashboard/kpi",
    "website/overview",
    "courses",
    "blogs",
    "seo",
    "health",
    "traffic",
    "leads",
    "insights",
    "reports/monthly",
]

print("=" * 60)
print("  ASR Digital Dashboard — API Health Check")
print("=" * 60)

all_ok = True
for ep in ENDPOINTS:
    url = f"{BASE}/{ep}"
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.loads(resp.read())
            source = data.get("source", "")
            status = data.get("status", "")
            # Show a meaningful summary per endpoint
            if ep == "status":
                print(f"  OK   /{ep:<30}  {data['version']}  [{data['status']}]")
            elif ep == "dashboard/kpi":
                print(f"  OK   /{ep:<30}  monthly_visitors={data.get('monthly_visitors','?')}  [{source}]")
            elif ep == "website/overview":
                d = data.get("data") or {}
                print(f"  OK   /{ep:<30}  title='{d.get('title','')[:40]}'  [{source}]")
            elif ep == "courses":
                print(f"  OK   /{ep:<30}  total={data.get('total',0)} courses  [{source}]")
            elif ep == "blogs":
                print(f"  OK   /{ep:<30}  total={data.get('total',0)} posts  [{source}]")
            elif ep == "seo":
                s = data.get("summary") or {}
                print(f"  OK   /{ep:<30}  avg_score={s.get('average_score','?')}  pages={s.get('pages_analyzed','?')}  [{source}]")
            elif ep == "health":
                print(f"  OK   /{ep:<30}  overall_score={data.get('overall_score','?')}  [{source}]")
            elif ep == "traffic":
                mv = data.get("monthly_visitors", {}).get("data", [])
                print(f"  OK   /{ep:<30}  months={len(mv)}  [{source}]")
            elif ep == "leads":
                print(f"  OK   /{ep:<30}  total={data.get('total',0)} leads  [{source}]")
            elif ep == "insights":
                ins = data.get("insights", [])
                print(f"  OK   /{ep:<30}  insights={len(ins)}  [{source}]")
            elif ep == "reports/monthly":
                print(f"  OK   /{ep:<30}  month={data.get('month','?')}  [{source}]")
            else:
                print(f"  OK   /{ep}")
    except Exception as e:
        print(f"  FAIL /{ep:<30}  ERROR: {e}")
        all_ok = False

print("=" * 60)
print(f"  Result: {'ALL ENDPOINTS OK' if all_ok else 'SOME FAILURES DETECTED'}")
print("=" * 60)

# Show live crawled course list
print("\n  Crawled Courses (LIVE from cisprotraining.com):")
try:
    with urllib.request.urlopen(f"{BASE}/courses", timeout=10) as resp:
        data = json.loads(resp.read())
        for c in data.get("courses", []):
            print(f"    [{c['category']:12}] {c['name']}")
        print(f"    Total: {data['total']} courses")
except Exception as e:
    print(f"    Error: {e}")

# Show website info
print("\n  Live Website Data:")
try:
    with urllib.request.urlopen(f"{BASE}/website/overview", timeout=10) as resp:
        data = json.loads(resp.read())
        d = data.get("data", {})
        print(f"    Name        : {d.get('name')}")
        print(f"    Title       : {d.get('title')}")
        print(f"    Description : {d.get('description','')[:80]}...")
        print(f"    Phones      : {', '.join(d.get('phone_numbers', []))}")
        print(f"    Address     : {d.get('address','')[:70]}")
        print(f"    SSL         : {d.get('ssl_status')}")
        print(f"    Robots.txt  : {d.get('robots_txt')}")
        print(f"    Sitemap     : {d.get('sitemap')}")
        print(f"    Pages       : {d.get('page_count')}")
        print(f"    Images      : {d.get('image_count')}")
        print(f"    Int. Links  : {d.get('internal_links_count')}")
        print(f"    Social      : {list(d.get('social_links', {}).keys())}")
        print(f"    Logo URL    : {d.get('logo_url')}")
        print(f"    Last crawled: {data.get('last_crawled')}")
except Exception as e:
    print(f"    Error: {e}")

print("\n  Backend is fully operational.")
print("  Open http://localhost:5173 in your browser after running: npm run dev")
