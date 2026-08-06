"""Blogs endpoint — returns live crawled blog posts"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db, BlogPost

router = APIRouter(prefix="/api/blogs", tags=["blogs"])


@router.get("")
def get_blogs(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50),
):
    query = db.query(BlogPost).order_by(BlogPost.id.desc())

    if search:
        query = query.filter(BlogPost.title.ilike(f"%{search}%"))

    total = query.count()
    posts = query.offset((page - 1) * page_size).limit(page_size).all()

    recent = db.query(BlogPost).order_by(BlogPost.id.desc()).limit(5).all()

    return {
        "source": "LIVE",
        "total": total,
        "page": page,
        "page_size": page_size,
        "most_recent": (
            {
                "id": recent[0].id,
                "title": recent[0].title,
                "thumbnail_url": recent[0].thumbnail_url,
                "published_date": recent[0].published_date,
                "category": recent[0].category,
                "author": recent[0].author,
                "short_description": recent[0].short_description,
                "post_url": recent[0].post_url,
            }
            if recent else None
        ),
        "recent_posts": [
            {
                "id": p.id,
                "title": p.title,
                "published_date": p.published_date,
                "category": p.category,
            }
            for p in recent
        ],
        "posts": [
            {
                "id": p.id,
                "title": p.title,
                "thumbnail_url": p.thumbnail_url,
                "published_date": p.published_date,
                "category": p.category,
                "author": p.author,
                "short_description": p.short_description,
                "post_url": p.post_url,
            }
            for p in posts
        ],
    }
