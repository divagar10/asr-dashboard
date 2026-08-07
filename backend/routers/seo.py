"""SEO analysis endpoint — returns live crawled SEO data"""

from fastapi import APIRouter

from mongodb import get_db
from repositories import get_seo

router = APIRouter(prefix="/api/seo", tags=["seo"])


@router.get("")
async def get_seo_data():
    db = get_db()
    pages = await get_seo(db)

    if not pages:
        return {"source": "LIVE", "pages": [], "summary": None}

    avg_score = round(sum(p.get("seo_score", 0) for p in pages) / len(pages), 1)

    issues = []
    for p in pages:
        if not p.get("meta_description"):
            issues.append({"page": p.get("page_url"), "issue": "Missing meta description", "severity": "High"})
        h1 = p.get("h1_tags") or []
        if len(h1) != 1:
            issues.append({"page": p.get("page_url"), "issue": f"H1 count: {len(h1)} (should be 1)", "severity": "Medium"})
        if p.get("missing_alt_count", 0) > 0:
            issues.append({"page": p.get("page_url"), "issue": f"{p['missing_alt_count']} images missing alt text", "severity": "Medium"})
        if not p.get("og_title"):
            issues.append({"page": p.get("page_url"), "issue": "Missing Open Graph title", "severity": "Low"})

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
                "id": p.get("id"),
                "page_url": p.get("page_url", ""),
                "page_title": p.get("page_title", ""),
                "meta_description": p.get("meta_description", ""),
                "meta_keywords": p.get("meta_keywords", ""),
                "canonical": p.get("canonical", ""),
                "og_title": p.get("og_title", ""),
                "og_description": p.get("og_description", ""),
                "og_image": p.get("og_image", ""),
                "twitter_card": p.get("twitter_card", ""),
                "h1_tags": p.get("h1_tags") or [],
                "h2_tags": p.get("h2_tags") or [],
                "h3_tags": p.get("h3_tags") or [],
                "missing_alt_count": p.get("missing_alt_count", 0),
                "image_count": p.get("image_count", 0),
                "broken_images": p.get("broken_images", 0),
                "internal_links": p.get("internal_links", 0),
                "external_links": p.get("external_links", 0),
                "has_structured_data": p.get("has_structured_data", False),
                "seo_score": p.get("seo_score", 0),
            }
            for p in pages
        ],
    }
