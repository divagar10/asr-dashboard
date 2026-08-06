"""Traffic analytics endpoint — all DEMO data"""

from fastapi import APIRouter
from demo_data import (
    get_daily_visitors_last_30, get_monthly_visitors, get_traffic_sources,
    get_top_countries, get_top_cities, get_devices, get_operating_systems,
    get_browsers, get_top_landing_pages, get_exit_pages, get_session_data
)

router = APIRouter(prefix="/api/traffic", tags=["traffic"])


@router.get("")
def get_traffic():
    return {
        "source": "DEMO",
        "note": "Traffic analytics are demonstration data. Connect Google Analytics API for live data.",
        "monthly_visitors": get_monthly_visitors(),
        "daily_visitors": get_daily_visitors_last_30(),
        "traffic_sources": get_traffic_sources(),
        "top_countries": get_top_countries(),
        "top_cities": get_top_cities(),
        "devices": get_devices(),
        "operating_systems": get_operating_systems(),
        "browsers": get_browsers(),
        "top_landing_pages": get_top_landing_pages(),
        "exit_pages": get_exit_pages(),
        "session_data": get_session_data(),
    }
