"""Website overview endpoint — returns live crawled data"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db, WebsiteInfo, CrawlLog
from crawler import run_crawl
import threading

router = APIRouter(prefix="/api/website", tags=["website"])


@router.get("/overview")
def website_overview(db: Session = Depends(get_db)):
    info = db.query(WebsiteInfo).first()
    if not info:
        return {"data": None, "source": "LIVE", "crawl_status": "not_crawled"}

    last_log = db.query(CrawlLog).order_by(CrawlLog.id.desc()).first()

    return {
        "source": "LIVE",
        "crawl_status": last_log.status if last_log else "unknown",
        "last_crawled": info.last_crawled.isoformat() if info.last_crawled else None,
        "data": {
            "name": info.name,
            "url": info.url,
            "title": info.title,
            "description": info.description,
            "logo_url": info.logo_url,
            "hero_banner_url": info.hero_banner_url,
            "phone_numbers": info.phone_numbers or [],
            "emails": info.emails or [],
            "address": info.address,
            "google_map_url": info.google_map_url,
            "social_links": info.social_links or {},
            "business_hours": info.business_hours,
            "nav_menu": info.nav_menu or [],
            "page_count": info.page_count,
            "image_count": info.image_count,
            "internal_links_count": info.internal_links_count,
            "external_links_count": info.external_links_count,
            "ssl_status": info.ssl_status,
            "robots_txt": info.robots_txt,
            "sitemap": info.sitemap,
            "technologies": info.technologies or [],
        }
    }


@router.post("/crawl")
def trigger_crawl():
    """Manually trigger a crawl in the background."""
    thread = threading.Thread(target=run_crawl, daemon=True)
    thread.start()
    return {"status": "started", "message": "Crawl started in background"}


@router.get("/crawl-status")
def crawl_status(db: Session = Depends(get_db)):
    log = db.query(CrawlLog).order_by(CrawlLog.id.desc()).first()
    if not log:
        return {"status": "never_run"}
    return {
        "status": log.status,
        "started_at": log.started_at.isoformat() if log.started_at else None,
        "completed_at": log.completed_at.isoformat() if log.completed_at else None,
        "pages_crawled": log.pages_crawled,
        "courses_found": log.courses_found,
        "blogs_found": log.blogs_found,
        "error": log.error_message,
    }
