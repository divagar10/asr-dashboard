import urllib.request, json, ssl

BASE = "https://asr-dashboard-production.up.railway.app"

ctx = ssl.create_default_context()

def get(path):
    try:
        r = urllib.request.urlopen(BASE + path, timeout=15, context=ctx)
        d = json.loads(r.read())
        return 200, d
    except urllib.error.HTTPError as e:
        return e.code, {}
    except Exception as e:
        return 0, str(e)

tests = [
    ("/api/status",               lambda d: f"version={d.get('version')} db={d.get('database')}"),
    ("/api/settings",             lambda d: f"company={d.get('company_name')}"),
    ("/api/dashboard/kpi",        lambda d: f"monthly_visitors={d.get('monthly_visitors')} source={d.get('source')}"),
    ("/api/website/overview",     lambda d: f"crawl={d.get('crawl_status')} url={d.get('data',{}).get('url','')}"),
    ("/api/website/crawl-status", lambda d: f"status={d.get('status')} pages={d.get('pages_crawled')} blogs={d.get('blogs_found')}"),
    ("/api/courses",              lambda d: f"total={d.get('total')}"),
    ("/api/blogs",                lambda d: f"total={d.get('total')}"),
    ("/api/seo",                  lambda d: f"pages={d.get('summary',{}).get('pages_analyzed')} avg={d.get('summary',{}).get('average_score')}"),
    ("/api/health",               lambda d: f"overall_score={d.get('overall_score')}"),
    ("/api/traffic",              lambda d: f"source={d.get('source')}"),
    ("/api/leads",                lambda d: f"total={d.get('total')}"),
    ("/api/insights",             lambda d: f"insights={len(d.get('insights',[]))}"),
    ("/api/reports/monthly",      lambda d: f"month={d.get('month')}"),
]

print(f"\nTesting: {BASE}\n")
print(f"{'ENDPOINT':<35} {'STATUS':<8} DETAIL")
print("-" * 85)

fails = 0
for path, summary in tests:
    code, data = get(path)
    if code == 200:
        print(f"OK    {path:<35} {summary(data)}")
    else:
        fails += 1
        print(f"FAIL  {path:<35} HTTP {code}  {str(data)[:50]}")

print()
if fails == 0:
    print(f"All {len(tests)}/{len(tests)} endpoints PASSING on Railway")
else:
    print(f"{len(tests)-fails}/{len(tests)} passing  |  {fails} FAILED")
