"""Blogs endpoint — returns live crawled blog posts"""

from fastapi import APIRouter, Query
from typing import Optional

from mongodb import get_db
from repositories import get_blogs

router = APIRouter(prefix="/api/blogs", tags=["blogs"])


@router.get("")
async def get_blogs_endpoint(
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50),
):
    db = get_db()
    result = await get_blogs(db, search=search, page=page, page_size=page_size)

    def _fmt(p: dict) -> dict:
        return {
            "id": p.get("id"),
            "title": p.get("title", ""),
            "thumbnail_url": p.get("thumbnail_url", ""),
            "published_date": p.get("published_date", ""),
            "category": p.get("category", ""),
            "author": p.get("author", ""),
            "short_description": p.get("short_description", ""),
            "post_url": p.get("post_url", ""),
        }

    recent = result["recent"]
    most_recent = _fmt(recent[0]) if recent else None

    return {
        "source": "LIVE",
        "total": result["total"],
        "page": page,
        "page_size": page_size,
        "most_recent": most_recent,
        "recent_posts": [
            {"id": p.get("id"), "title": p.get("title", ""), "published_date": p.get("published_date", ""), "category": p.get("category", "")}
            for p in recent
        ],
        "posts": [_fmt(p) for p in result["posts"]],
    }
