"""Leads endpoint — all DEMO data"""

from fastapi import APIRouter, Query
from typing import Optional
from demo_data import get_leads, get_lead_funnel, get_lead_growth, get_lead_by_source

router = APIRouter(prefix="/api/leads", tags=["leads"])


@router.get("")
def get_all_leads(
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=1, le=100),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    leads = get_leads()

    if status and status != "All":
        leads = [l for l in leads if l["status"] == status]

    if search:
        s = search.lower()
        leads = [l for l in leads if s in l["name"].lower() or s in l["course_interested"].lower() or s in l["email"].lower()]

    total = len(leads)
    paginated = leads[(page - 1) * page_size: page * page_size]

    status_counts = {}
    for l in get_leads():
        status_counts[l["status"]] = status_counts.get(l["status"], 0) + 1

    return {
        "source": "DEMO",
        "total": total,
        "page": page,
        "page_size": page_size,
        "status_counts": status_counts,
        "funnel": get_lead_funnel(),
        "lead_growth": get_lead_growth(),
        "lead_by_source": get_lead_by_source(),
        "leads": paginated,
    }
