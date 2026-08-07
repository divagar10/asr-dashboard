"""
Repository / data-access layer for all MongoDB collections.
All public methods are async and accept a Motor database instance.

Collections:
  website_info   — single document, upserted on every crawl
  courses        — one doc per course, replaced on every crawl
  blog_posts     — one doc per post, replaced on every crawl
  seo_data       — one doc per page, replaced on every crawl
  crawl_logs     — append-only log
"""

from datetime import datetime
from typing import Any
from bson import ObjectId


# ── helpers ──────────────────────────────────────────────────────────────────

def _str_id(doc: dict) -> dict:
    """Convert ObjectId _id to string 'id' field."""
    if doc and "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    return doc


# ── website_info ─────────────────────────────────────────────────────────────

async def upsert_website_info(db, data: dict) -> None:
    data["last_crawled"] = datetime.utcnow()
    await db.website_info.replace_one({}, data, upsert=True)


async def get_website_info(db) -> dict | None:
    doc = await db.website_info.find_one({})
    return _str_id(doc) if doc else None


# ── courses ───────────────────────────────────────────────────────────────────

async def replace_courses(db, courses: list[dict]) -> None:
    now = datetime.utcnow()
    await db.courses.delete_many({})
    if courses:
        for c in courses:
            c.setdefault("crawled_at", now)
            if isinstance(c.get("last_updated"), datetime):
                pass  # keep as-is
        await db.courses.insert_many(courses)


async def get_courses(
    db,
    category: str | None = None,
    search: str | None = None,
    page: int = 1,
    page_size: int = 20,
) -> dict:
    filt: dict[str, Any] = {}
    if category and category != "All":
        filt["category"] = category
    if search:
        filt["name"] = {"$regex": search, "$options": "i"}

    total = await db.courses.count_documents(filt)
    cursor = db.courses.find(filt).skip((page - 1) * page_size).limit(page_size)
    docs = [_str_id(d) async for d in cursor]

    # category counts
    pipeline = [{"$group": {"_id": "$category", "count": {"$sum": 1}}}]
    cat_counts = {}
    async for row in db.courses.aggregate(pipeline):
        cat_counts[row["_id"] or "Other"] = row["count"]

    return {"total": total, "category_counts": cat_counts, "courses": docs}


# ── blog_posts ────────────────────────────────────────────────────────────────

async def replace_blogs(db, blogs: list[dict]) -> None:
    now = datetime.utcnow()
    await db.blog_posts.delete_many({})
    if blogs:
        for b in blogs:
            b.setdefault("crawled_at", now)
        await db.blog_posts.insert_many(blogs)


async def get_blogs(
    db,
    search: str | None = None,
    page: int = 1,
    page_size: int = 12,
) -> dict:
    filt: dict[str, Any] = {}
    if search:
        filt["title"] = {"$regex": search, "$options": "i"}

    total = await db.blog_posts.count_documents(filt)
    cursor = db.blog_posts.find(filt).sort("_id", -1).skip((page - 1) * page_size).limit(page_size)
    docs = [_str_id(d) async for d in cursor]

    recent_cursor = db.blog_posts.find({}).sort("_id", -1).limit(5)
    recent = [_str_id(d) async for d in recent_cursor]

    return {"total": total, "posts": docs, "recent": recent}


# ── seo_data ──────────────────────────────────────────────────────────────────

async def replace_seo(db, pages: list[dict]) -> None:
    now = datetime.utcnow()
    await db.seo_data.delete_many({})
    if pages:
        for p in pages:
            p.setdefault("crawled_at", now)
        await db.seo_data.insert_many(pages)


async def get_seo(db) -> list[dict]:
    cursor = db.seo_data.find({})
    return [_str_id(d) async for d in cursor]


# ── crawl_logs ────────────────────────────────────────────────────────────────

async def create_crawl_log(db) -> str:
    """Insert a new 'running' log and return its string id."""
    result = await db.crawl_logs.insert_one(
        {
            "started_at": datetime.utcnow(),
            "completed_at": None,
            "status": "running",
            "pages_crawled": 0,
            "courses_found": 0,
            "blogs_found": 0,
            "error_message": None,
        }
    )
    return str(result.inserted_id)


async def update_crawl_log(db, log_id: str, update: dict) -> None:
    await db.crawl_logs.update_one(
        {"_id": ObjectId(log_id)},
        {"$set": update},
    )


async def get_latest_crawl_log(db) -> dict | None:
    cursor = db.crawl_logs.find({}).sort("_id", -1).limit(1)
    async for doc in cursor:
        return _str_id(doc)
    return None
