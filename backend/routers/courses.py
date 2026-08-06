"""Courses endpoint — returns live crawled course data"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db, Course

router = APIRouter(prefix="/api/courses", tags=["courses"])

CATEGORIES = ["All", "Programming", "Cloud", "Networking", "Embedded", "Office", "Language", "HR", "Other"]


@router.get("")
def get_courses(
    db: Session = Depends(get_db),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    query = db.query(Course)

    if category and category != "All":
        query = query.filter(Course.category == category)

    if search:
        query = query.filter(Course.name.ilike(f"%{search}%"))

    total = query.count()
    courses = query.offset((page - 1) * page_size).limit(page_size).all()

    # Count by category
    all_courses = db.query(Course).all()
    category_counts = {}
    for c in all_courses:
        cat = c.category or "Other"
        category_counts[cat] = category_counts.get(cat, 0) + 1

    return {
        "source": "LIVE",
        "total": total,
        "page": page,
        "page_size": page_size,
        "categories": CATEGORIES,
        "category_counts": category_counts,
        "courses": [
            {
                "id": c.id,
                "name": c.name,
                "category": c.category,
                "image_url": c.image_url,
                "course_url": c.course_url,
                "description": c.description,
                "last_updated": c.last_updated.isoformat() if c.last_updated else None,
            }
            for c in courses
        ],
    }
