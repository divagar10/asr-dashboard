"""Website overview endpoint — returns live crawled data"""

import threading
from fastapi import APIRouter

from mongodb import get_db
from repositories import get_website_info, get_latest_crawl_log
from crawler import run_crawl

router = APIRouter(prefix="/api/website", tags=["website"])


@router.get("/overview")
async def website_overview():
    db = get_db()
    info = await get_website_info(db)
    if not info:
        return {"data": None, "source": "LIVE", "crawl_status": "not_crawled"}

    log = await get_latest_crawl_log(db)

    last_crawled = info.get("last_crawled")
    if hasattr(last_crawled, "isoformat"):
        last_crawled = last_crawled.isoformat()

    return {
        "source": "LIVE",
        "crawl_status": log["status"] if log else "unknown",
        "last_crawled": last_crawled,
        "data": {
            "name": info.get("name", ""),
            "url": info.get("url", ""),
            "title": info.get("title", ""),
            "description": info.get("description", ""),
            "logo_url": info.get("logo_url", ""),
            "hero_banner_url": info.get("hero_banner_url", ""),
            "phone_numbers": info.get("phone_numbers") or [],
            "emails": info.get("emails") or [],
            "address": info.get("address", ""),
            "google_map_url": info.get("google_map_url", ""),
            "social_links": info.get("social_links") or {},
            "business_hours": info.get("business_hours", ""),
            "nav_menu": info.get("nav_menu") or [],
            "page_count": info.get("page_count", 0),
            "image_count": info.get("image_count", 0),
            "internal_links_count": info.get("internal_links_count", 0),
            "external_links_count": info.get("external_links_count", 0),
            "ssl_status": info.get("ssl_status", True),
            "robots_txt": info.get("robots_txt", False),
            "sitemap": info.get("sitemap", False),
            "technologies": info.get("technologies") or [],
        },
    }


@router.post("/crawl")
def trigger_crawl():
    """Manually trigger a crawl in the background."""
    thread = threading.Thread(target=run_crawl, daemon=True)
    thread.start()
    return {"status": "started", "message": "Crawl started in background"}


@router.get("/crawl-status")
async def crawl_status():
    db = get_db()
    log = await get_latest_crawl_log(db)
    if not log:
        return {"status": "never_run"}

    started = log.get("started_at")
    completed = log.get("completed_at")

    return {
        "status": log.get("status"),
        "started_at": started.isoformat() if hasattr(started, "isoformat") else started,
        "completed_at": completed.isoformat() if hasattr(completed, "isoformat") else completed,
        "pages_crawled": log.get("pages_crawled", 0),
        "courses_found": log.get("courses_found", 0),
        "blogs_found": log.get("blogs_found", 0),
        "error": log.get("error_message"),
    }
