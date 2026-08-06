"""Reports endpoint — generates PDF monthly report"""

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from io import BytesIO
from datetime import datetime

from database import get_db, WebsiteInfo
from demo_data import get_monthly_report_data, get_kpi_summary

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("/monthly")
def get_monthly_report(db: Session = Depends(get_db)):
    return get_monthly_report_data()


@router.get("/monthly/pdf")
def download_monthly_pdf(db: Session = Depends(get_db)):
    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import cm
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
    )

    info = db.query(WebsiteInfo).first()
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

    dark_blue = colors.HexColor("#2563EB")
    cyan = colors.HexColor("#06B6D4")
    green = colors.HexColor("#22C55E")
    bg_dark = colors.HexColor("#0F172A")
    light_gray = colors.HexColor("#E2E8F0")
    medium_gray = colors.HexColor("#94A3B8")

    title_style = ParagraphStyle(
        "Title",
        parent=styles["Title"],
        fontSize=24,
        textColor=dark_blue,
        spaceAfter=6,
        fontName="Helvetica-Bold",
    )
    subtitle_style = ParagraphStyle(
        "Subtitle",
        parent=styles["Normal"],
        fontSize=12,
        textColor=medium_gray,
        spaceAfter=4,
    )
    section_style = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        fontSize=14,
        textColor=dark_blue,
        spaceBefore=16,
        spaceAfter=8,
        fontName="Helvetica-Bold",
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontSize=10,
        textColor=colors.HexColor("#334155"),
        spaceAfter=4,
    )
    insight_style = ParagraphStyle(
        "Insight",
        parent=styles["Normal"],
        fontSize=10,
        textColor=colors.HexColor("#1E293B"),
        leftIndent=12,
        spaceAfter=4,
    )

    story = []

    # Header
    story.append(Paragraph("ASR Digital", title_style))
    story.append(Paragraph("Client Analytics Dashboard — Monthly Report", subtitle_style))
    story.append(Paragraph(f"<b>Website:</b> CISPRO Training (cisprotraining.com)", body_style))
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
        ["Avg Session Duration", kpi['avg_session'], "DEMO"],
        ["Bounce Rate", f"{kpi['bounce_rate']}%", "DEMO"],
        ["Leads Generated", f"{kpi['leads_generated']}", "DEMO"],
        ["Conversion Rate", f"{kpi['conversion_rate']}%", "DEMO"],
        ["Returning Visitors", f"{kpi['returning_visitors']:,}", "DEMO"],
    ]
    kpi_table = Table(kpi_data, colWidths=[8 * cm, 6 * cm, 3 * cm])
    kpi_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), dark_blue),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 10),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, light_gray]),
        ("GRID", (0, 0), (-1, -1), 0.5, medium_gray),
        ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (0, -1), 10),
    ]))
    story.append(kpi_table)

    # Website Health
    story.append(Paragraph("Website Health", section_style))
    if info:
        health_data = [
            ["Check", "Status", "Source"],
            ["SSL Certificate", "✓ Active" if info.ssl_status else "✗ Missing", "LIVE"],
            ["Robots.txt", "✓ Found" if info.robots_txt else "✗ Missing", "LIVE"],
            ["XML Sitemap", "✓ Found" if info.sitemap else "✗ Missing", "LIVE"],
            ["Mobile Friendly", "Needs Improvement (82/100)", "DEMO"],
            ["Page Speed", "Below Average (58/100)", "DEMO"],
            ["Image Optimization", "Needs Work (61/100)", "DEMO"],
        ]
    else:
        health_data = [["Check", "Status", "Source"], ["No crawl data", "Run crawl first", "-"]]

    health_table = Table(health_data, colWidths=[8 * cm, 6 * cm, 3 * cm])
    health_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), cyan),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 10),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, light_gray]),
        ("GRID", (0, 0), (-1, -1), 0.5, medium_gray),
        ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (0, -1), 10),
    ]))
    story.append(health_table)

    # Traffic Sources
    story.append(Paragraph("Top Traffic Sources", section_style))
    sources = report["traffic_sources"]
    src_data = [["Source", "Share %", "Source Tag"]]
    for i, label in enumerate(sources["labels"]):
        src_data.append([label, f"{sources['data'][i]}%", "DEMO"])
    src_table = Table(src_data, colWidths=[8 * cm, 6 * cm, 3 * cm])
    src_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#8B5CF6")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 10),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, light_gray]),
        ("GRID", (0, 0), (-1, -1), 0.5, medium_gray),
        ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (0, -1), 10),
    ]))
    story.append(src_table)

    # AI Insights
    story.append(Paragraph("AI-Generated Insights Summary", section_style))
    for insight_title in report["ai_insights_summary"]:
        story.append(Paragraph(f"• {insight_title}", insight_style))

    story.append(Spacer(1, 16))
    story.append(HRFlowable(width="100%", thickness=1, color=medium_gray))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "This report was automatically generated by ASR Digital Client Dashboard. "
        "Analytics data marked DEMO is simulated for demonstration purposes. "
        "Website data marked LIVE is crawled directly from cisprotraining.com.",
        ParagraphStyle("Footer", parent=styles["Normal"], fontSize=8, textColor=medium_gray)
    ))

    doc.build(story)
    buffer.seek(0)

    filename = f"asr-report-{datetime.utcnow().strftime('%Y-%m')}.pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
