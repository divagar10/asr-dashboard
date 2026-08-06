"""Dashboard KPI and overview endpoints"""

from fastapi import APIRouter
from demo_data import (
    get_kpi_summary, get_monthly_visitors, get_traffic_sources,
    get_devices, get_lead_growth, get_course_popularity,
    get_website_performance_radar, get_sparkline_data, get_daily_visitors_last_30
)

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/kpi")
def dashboard_kpi():
    return {**get_kpi_summary(), "source": "DEMO"}


@router.get("/charts")
def dashboard_charts():
    return {
        "monthly_visitors": get_monthly_visitors(),
        "traffic_sources": get_traffic_sources(),
        "devices": get_devices(),
        "lead_growth": get_lead_growth(),
        "course_popularity": get_course_popularity(),
        "website_performance": get_website_performance_radar(),
        "sparkline": get_sparkline_data(),
        "daily_visitors": get_daily_visitors_last_30(),
        "source": "DEMO",
    }
