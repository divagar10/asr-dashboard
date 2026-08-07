"""Reports endpoint — generates PDF monthly report"""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from io import BytesIO
from datetime import datetime

from mongodb import get_db
from repositories import get_website_info
from demo_data import get_monthly_report_data, get_kpi_summary

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("/monthly")
def get_monthly_report():
    return get_monthly_report_data()


@router.get("/monthly/pdf")
async def download_monthly_pdf():
    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import cm
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
    )

    db = get_db()
    info = await get_website_info(db)
    kpi = get_kpi_summary()
    report = get_monthly_report_data()

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    styles = getSampleStyleSheet()
    dark_blue   = colors.HexColor("#2563EB")
    cyan        = colors.HexColor("#06B6D4")
    light_gray  = colors.HexColor("#E2E8F0")
    medium_gray = colors.HexColor("#94A3B8")

    title_style = ParagraphStyle("Title", parent=styles["Title"], fontSize=24, textColor=dark_blue, spaceAfter=6, fontName="Helvetica-Bold")
    subtitle_style = ParagraphStyle("Subtitle", parent=styles["Normal"], fontSize=12, textColor=medium_gray, spaceAfter=4)
    section_style = ParagraphStyle("Section", parent=styles["Heading2"], fontSize=14, textColor=dark_blue, spaceBefore=16, spaceAfter=8, fontName="Helvetica-Bold")
    body_style = ParagraphStyle("Body", parent=styles["Normal"], fontSize=10, textColor=colors.HexColor("#334155"), spaceAfter=4)
    insight_style = ParagraphStyle("Insight", parent=styles["Normal"], fontSize=10, textColor=colors.HexColor("#1E293B"), leftIndent=12, spaceAfter=4)

    story = []

    # Header
    story.append(Paragraph("ASR Digital", title_style))
    story.append(Paragraph("Client Analytics Dashboard — Monthly Report", subtitle_style))
    story.append(Paragraph("<b>Website:</b> CISPRO Training (cisprotraining.com)", body_style))
    story.append(Paragraph(f"<b>Period:</b> {report['month']}", body_style))
    story.append(Paragraph(f"<b>Generated:</b> {datetime.utcnow().strftime('%d %B %Y, %H:%M UTC')}", body_style))
    story.append(HRFlowable(width="100%", thickness=2, color=dark_blue, spaceAfter=16))

    # KPI Summary
    story.append(Paragraph("Key Performance Indicators", section_style))
    kpi_data = [
        ["Metric", "Value", "Source"],
        ["Monthly Visitors", f"{kpi['monthly_visitors']:,}", "DEMO"],
        ["Unique Users", f"{kpi['unique_users']:,}", "DEMO"],
        ["Page Views", f"{kpi['page_views']:,}", "DEMO"],
        ["Avg Session Duration", kpi["avg_session"], "DEMO"],
        ["Bounce Rate", f"{kpi['bounce_rate']}%", "DEMO"],
        ["Leads Generated", f"{kpi['leads_generated']}", "DEMO"],
        ["Conversion Rate", f"{kpi['conversion_rate']}%", "DEMO"],
        ["Returning Visitors", f"{kpi['returning_visitors']:,}", "DEMO"],
    ]
    _table(story, kpi_data, dark_blue, light_gray, medium_gray)

    # Website Health
    story.append(Paragraph("Website Health", section_style))
    if info:
        health_data = [
            ["Check", "Status", "Source"],
            ["SSL Certificate", "✓ Active" if info.get("ssl_status") else "✗ Missing", "LIVE"],
            ["Robots.txt", "✓ Found" if info.get("robots_txt") else "✗ Missing", "LIVE"],
            ["XML Sitemap", "✓ Found" if info.get("sitemap") else "✗ Missing", "LIVE"],
            ["Mobile Friendly", "Needs Improvement (82/100)", "DEMO"],
            ["Page Speed", "Below Average (58/100)", "DEMO"],
            ["Image Optimization", "Needs Work (61/100)", "DEMO"],
        ]
    else:
        health_data = [["Check", "Status", "Source"], ["No crawl data", "Run crawl first", "-"]]
    _table(story, health_data, cyan, light_gray, medium_gray)

    # Traffic Sources
    story.append(Paragraph("Top Traffic Sources", section_style))
    sources = report["traffic_sources"]
    src_data = [["Source", "Share %", "Source Tag"]]
    for i, label in enumerate(sources["labels"]):
        src_data.append([label, f"{sources['data'][i]}%", "DEMO"])
    _table(story, src_data, colors.HexColor("#8B5CF6"), light_gray, medium_gray)

    # AI Insights
    story.append(Paragraph("AI-Generated Insights Summary", section_style))
    for insight_title in report["ai_insights_summary"]:
        story.append(Paragraph(f"• {insight_title}", insight_style))

    story.append(Spacer(1, 16))
    story.append(HRFlowable(width="100%", thickness=1, color=medium_gray))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "This report was automatically generated by ASR Digital Client Dashboard. "
        "Analytics data marked DEMO is simulated. Website data marked LIVE is crawled from cisprotraining.com.",
        ParagraphStyle("Footer", parent=styles["Normal"], fontSize=8, textColor=medium_gray),
    ))

    doc.build(story)
    buffer.seek(0)

    filename = f"asr-report-{datetime.utcnow().strftime('%Y-%m')}.pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


def _table(story, data, header_color, row_alt_color, grid_color):
    from reportlab.platypus import Table, TableStyle
    from reportlab.lib import colors

    t = Table(data, colWidths=None)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), header_color),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 10),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, row_alt_color]),
        ("GRID", (0, 0), (-1, -1), 0.5, grid_color),
        ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (0, -1), 10),
    ]))
    story.append(t)
