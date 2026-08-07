"""
ASR Digital Client Dashboard — FastAPI Backend
Serves crawled website data (LIVE) and demo analytics data (DEMO)
Database: MongoDB Atlas via Motor async driver
"""

import os
import sys
import logging
import threading
from contextlib import asynccontextmanager
from datetime import datetime

from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

# Windows + Python 3.12+ requires SelectorEventLoop for Motor/pymongo SSL
if sys.platform == "win32":
    import asyncio
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler

from mongodb import connect_db, close_db, get_db
from repositories import get_website_info
from crawler import run_crawl
from routers import dashboard, website, courses, blogs, seo, health, traffic, leads, insights, reports

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()


def scheduled_crawl():
    logger.info("Scheduled crawl starting...")
    result = run_crawl()
    logger.info(f"Scheduled crawl result: {result}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting ASR Dashboard backend...")
    await connect_db()

    db = get_db()
    existing = await get_website_info(db)
    if not existing:
        logger.info("No website data found — running initial crawl in background...")
        t = threading.Thread(target=run_crawl, daemon=True)
        t.start()
    else:
        last_crawled = existing.get("last_crawled")
        logger.info(f"Website data exists (last crawled: {last_crawled})")

    scheduler.add_job(
        scheduled_crawl,
        "interval",
        hours=12,
        id="crawl_job",
        replace_existing=True,
        next_run_time=None,
    )
    scheduler.start()
    logger.info("Scheduler started — crawl every 12 hours")

    yield

    scheduler.shutdown(wait=False)
    await close_db()
    logger.info("Shutdown complete")


app = FastAPI(
    title="ASR Digital Client Dashboard API",
    description="Backend API for ASR Digital Client Dashboard — cisprotraining.com",
    version="2.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
_raw = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173",
)
ALLOWED_ORIGINS: list[str] = [o.strip() for o in _raw.split(",") if o.strip()]
ALLOWED_ORIGIN_REGEX = r"https://(.*\.netlify\.app|.*\.up\.railway\.app|.*\.vercel\.app|.*\.web\.app|.*\.firebaseapp\.com)"

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=ALLOWED_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(dashboard.router)
app.include_router(website.router)
app.include_router(courses.router)
app.include_router(blogs.router)
app.include_router(seo.router)
app.include_router(health.router)
app.include_router(traffic.router)
app.include_router(leads.router)
app.include_router(insights.router)
app.include_router(reports.router)


@app.get("/api/status")
def api_status():
    return {
        "status": "online",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "2.0.0",
        "project": "ASR Digital Client Dashboard",
        "website": "cisprotraining.com",
        "database": "MongoDB Atlas",
    }


@app.get("/api/settings")
def get_settings():
    return {
        "company_name": "ASR Digital",
        "client_name": "CISPRO Training",
        "website_url": "https://cisprotraining.com",
        "dashboard_version": "2.0.0",
        "theme": "dark",
        "notifications_enabled": True,
        "crawl_interval_hours": 12,
    }
