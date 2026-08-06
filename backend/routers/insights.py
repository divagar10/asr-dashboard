"""AI Insights endpoint"""

from fastapi import APIRouter
from demo_data import get_ai_insights

router = APIRouter(prefix="/api/insights", tags=["insights"])


@router.get("")
def get_insights():
    return {
        "source": "DEMO",
        "note": "AI insights are generated based on demo analytics data and live crawled website metrics.",
        "insights": get_ai_insights(),
    }
