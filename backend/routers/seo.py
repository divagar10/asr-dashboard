"""SEO analysis endpoint — returns live crawled SEO data"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db, SEOData

router = APIRouter(prefix="/api/seo", tags=["seo"])


@router.get("")
def get_seo_data(db: Session = Depends(get_db)):
    pages = db.query(SEOData).all()

    if not pages:
        return {"source": "LIVE", "pages": [], "summary": None}

    avg_score = round(sum(p.seo_score for p in pages) / len(pages), 1)
    issues = []
    for p in pages:
        if not p.meta_description:
            issues.append({"page": p.page_url, "issue": "Missing meta description", "severity": "High"})
        if len(p.h1_tags or []) != 1:
            issues.append({"page": p.page_url, "issue": f"H1 count: {len(p.h1_tags or [])} (should be 1)", "severity": "Medium"})
        if p.missing_alt_count > 0:
            issues.append({"page": p.page_url, "issue": f"{p.missing_alt_count} images missing alt text", "severity": "Medium"})
        if not p.og_title:
            issues.append({"page": p.page_url, "issue": "Missing Open Graph title", "severity": "Low"})

    return {
        "source": "LIVE",
        "summary": {
            "average_score": avg_score,
            "pages_analyzed": len(pages),
            "total_issues": len(issues),
            "high_issues": len([i for i in issues if i["severity"] == "High"]),
            "medium_issues": len([i for i in issues if i["severity"] == "Medium"]),
            "low_issues": len([i for i in issues if i["severity"] == "Low"]),
        },
        "issues": issues[:20],
        "pages": [
            {
                "id": p.id,
                "page_url": p.page_url,
                "page_title": p.page_title,
                "meta_description": p.meta_description,
                "meta_keywords": p.meta_keywords,
                "canonical": p.canonical,
                "og_title": p.og_title,
                "og_description": p.og_description,
                "og_image": p.og_image,
                "twitter_card": p.twitter_card,
                "h1_tags": p.h1_tags or [],
                "h2_tags": p.h2_tags or [],
                "h3_tags": p.h3_tags or [],
                "missing_alt_count": p.missing_alt_count,
                "image_count": p.image_count,
                "broken_images": p.broken_images,
                "internal_links": p.internal_links,
                "external_links": p.external_links,
                "has_structured_data": p.has_structured_data,
                "seo_score": p.seo_score,
            }
            for p in pages
        ],
    }
