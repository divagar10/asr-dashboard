$base = "http://localhost:8000/api"
$endpoints = @(
    "status",
    "dashboard/kpi",
    "website/overview",
    "courses",
    "seo",
    "health",
    "traffic",
    "leads",
    "insights",
    "reports/monthly"
)
foreach ($ep in $endpoints) {
    try {
        $r = Invoke-RestMethod "$base/$ep" -TimeoutSec 10
        Write-Host "OK   /$ep"
    } catch {
        Write-Host "FAIL /$ep  ->  $($_.Exception.Message)"
    }
}
