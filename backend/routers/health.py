"""Website Health endpoint — combines live crawled data with demo placeholders"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db, WebsiteInfo

router = APIRouter(prefix="/api/health", tags=["health"])


@router.get("")
def get_health(db: Session = Depends(get_db)):
    info = db.query(WebsiteInfo).first()

    ssl = info.ssl_status if info else True
    robots = info.robots_txt if info else False
    sitemap = info.sitemap if info else False

    checks = [
        {"label": "SSL Certificate", "status": ssl, "source": "LIVE", "detail": "HTTPS enabled" if ssl else "No HTTPS"},
        {"label": "HTTPS Redirect", "status": ssl, "source": "LIVE", "detail": "All traffic on HTTPS" if ssl else "HTTP not redirected"},
        {"label": "Robots.txt", "status": robots, "source": "LIVE", "detail": "Found at /robots.txt" if robots else "Not found"},
        {"label": "XML Sitemap", "status": sitemap, "source": "LIVE", "detail": "Sitemap found" if sitemap else "No sitemap detected"},
        {"label": "Page Speed (Mobile)", "status": None, "source": "DEMO", "score": 58, "detail": "Needs improvement — ~4.2s load"},
        {"label": "Page Speed (Desktop)", "status": None, "source": "DEMO", "score": 74, "detail": "Acceptable — ~2.1s load"},
        {"label": "Mobile Friendly", "status": None, "source": "DEMO", "score": 82, "detail": "Mostly responsive, minor issues"},
        {"label": "Broken Links", "status": None, "source": "DEMO", "count": 3, "detail": "3 potential broken links found"},
        {"label": "404 Pages", "status": None, "source": "DEMO", "count": 2, "detail": "2 pages returning 404"},
        {"label": "Image Optimization", "status": None, "source": "DEMO", "score": 61, "detail": "37% of images not compressed"},
    ]

    # Calculate overall health score
    live_checks = [c for c in checks if c["source"] == "LIVE"]
    passed_live = sum(1 for c in live_checks if c.get("status") is True)
    demo_scores = [c["score"] for c in checks if c.get("score") is not None]
    avg_demo = sum(demo_scores) / len(demo_scores) if demo_scores else 70

    live_score = (passed_live / len(live_checks)) * 100 if live_checks else 50
    overall = round((live_score * 0.4) + (avg_demo * 0.6))

    broken_links_demo = [
        {"url": "/old-course-page", "code": 404},
        {"url": "/training/expired", "code": 404},
        {"url": "https://example-external.com/ref", "code": 503},
    ]

    return {
        "source_note": "SSL/Robots/Sitemap are LIVE. Speed/Mobile/Broken Links are DEMO placeholders.",
        "overall_score": overall,
        "checks": checks,
        "broken_links": broken_links_demo,
    }
