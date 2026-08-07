"""Courses endpoint — returns live crawled course data"""

from fastapi import APIRouter, Query
from typing import Optional

from mongodb import get_db
from repositories import get_courses

router = APIRouter(prefix="/api/courses", tags=["courses"])

CATEGORIES = ["All", "Programming", "Cloud", "Networking", "Embedded", "Office", "Language", "HR", "Other"]


@router.get("")
async def get_courses_endpoint(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    db = get_db()
    result = await get_courses(db, category=category, search=search, page=page, page_size=page_size)

    courses = []
    for c in result["courses"]:
        last_updated = c.get("last_updated")
        if hasattr(last_updated, "isoformat"):
            last_updated = last_updated.isoformat()
        courses.append({
            "id": c.get("id"),
            "name": c.get("name", ""),
            "category": c.get("category", ""),
            "image_url": c.get("image_url", ""),
            "course_url": c.get("course_url", ""),
            "description": c.get("description", ""),
            "last_updated": last_updated,
        })

    return {
        "source": "LIVE",
        "total": result["total"],
        "page": page,
        "page_size": page_size,
        "categories": CATEGORIES,
        "category_counts": result["category_counts"],
        "courses": courses,
    }
