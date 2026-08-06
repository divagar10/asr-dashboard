"""
Demo analytics data generator for ASR Dashboard.
Generates realistic fake data for traffic, leads, devices, locations etc.
All demo data is clearly labeled as DEMO.
"""

import random
from datetime import datetime, timedelta


def get_monthly_visitors():
    base = 3200
    months = []
    labels = []
    now = datetime.utcnow()
    for i in range(11, -1, -1):
        dt = now - timedelta(days=30 * i)
        labels.append(dt.strftime("%b %Y"))
        # Seasonal variation
        seasonal = 1.0
        m = dt.month
        if m in [1, 2]:
            seasonal = 0.75
        elif m in [6, 7, 8]:
            seasonal = 1.3
        elif m in [9, 10, 11]:
            seasonal = 1.1
        val = int(base * seasonal * random.uniform(0.9, 1.1))
        base = int(base * random.uniform(1.01, 1.04))  # slight upward trend
        months.append(val)
    return {"labels": labels, "data": months}


def get_daily_visitors_last_30():
    data = []
    labels = []
    now = datetime.utcnow()
    for i in range(29, -1, -1):
        dt = now - timedelta(days=i)
        labels.append(dt.strftime("%d %b"))
        weekday = dt.weekday()
        base = 150 if weekday < 5 else 80
        data.append(int(base * random.uniform(0.7, 1.4)))
    return {"labels": labels, "data": data}


def get_traffic_sources():
    return {
        "labels": ["Organic Search", "Direct", "Social Media", "Referral", "Email", "Paid Ads"],
        "data": [42, 22, 15, 10, 6, 5],
        "colors": ["#2563EB", "#06B6D4", "#8B5CF6", "#F59E0B", "#22C55E", "#EF4444"],
    }


def get_top_countries():
    return [
        {"country": "United Arab Emirates", "code": "AE", "visitors": 1820, "percent": 38},
        {"country": "Saudi Arabia", "code": "SA", "visitors": 960, "percent": 20},
        {"country": "India", "code": "IN", "visitors": 720, "percent": 15},
        {"country": "Pakistan", "code": "PK", "visitors": 480, "percent": 10},
        {"country": "United Kingdom", "code": "GB", "visitors": 288, "percent": 6},
        {"country": "United States", "code": "US", "visitors": 240, "percent": 5},
        {"country": "Canada", "code": "CA", "visitors": 144, "percent": 3},
        {"country": "Australia", "code": "AU", "visitors": 96, "percent": 2},
        {"country": "Other", "code": "XX", "visitors": 48, "percent": 1},
    ]


def get_top_cities():
    return [
        {"city": "Dubai", "visitors": 980},
        {"city": "Abu Dhabi", "visitors": 540},
        {"city": "Sharjah", "visitors": 320},
        {"city": "Riyadh", "visitors": 280},
        {"city": "Mumbai", "visitors": 210},
        {"city": "London", "visitors": 190},
        {"city": "Karachi", "visitors": 175},
        {"city": "Ajman", "visitors": 140},
    ]


def get_devices():
    return {
        "labels": ["Mobile", "Desktop", "Tablet"],
        "data": [58, 35, 7],
        "colors": ["#2563EB", "#06B6D4", "#22C55E"],
    }


def get_operating_systems():
    return {
        "labels": ["Android", "Windows", "iOS", "macOS", "Linux"],
        "data": [45, 30, 15, 7, 3],
    }


def get_browsers():
    return {
        "labels": ["Chrome", "Safari", "Firefox", "Edge", "Samsung Browser", "Other"],
        "data": [62, 18, 7, 6, 4, 3],
    }


def get_top_landing_pages():
    return [
        {"page": "/", "title": "Home", "sessions": 1240, "bounce_rate": 42},
        {"page": "/courses", "title": "All Courses", "sessions": 860, "bounce_rate": 38},
        {"page": "/courses/python", "title": "Python Course", "sessions": 520, "bounce_rate": 29},
        {"page": "/courses/aws", "title": "AWS Training", "sessions": 390, "bounce_rate": 31},
        {"page": "/blog", "title": "Blog", "sessions": 310, "bounce_rate": 55},
        {"page": "/about", "title": "About Us", "sessions": 220, "bounce_rate": 61},
        {"page": "/contact", "title": "Contact", "sessions": 195, "bounce_rate": 35},
        {"page": "/courses/fullstack", "title": "Full Stack", "sessions": 175, "bounce_rate": 27},
    ]


def get_exit_pages():
    return [
        {"page": "/", "title": "Home", "exits": 520},
        {"page": "/contact", "title": "Contact", "exits": 310},
        {"page": "/courses", "title": "Courses", "exits": 275},
        {"page": "/blog", "title": "Blog", "exits": 190},
        {"page": "/about", "title": "About Us", "exits": 145},
    ]


def get_session_data():
    return {
        "avg_session_duration": "3m 42s",
        "avg_pages_per_session": 3.8,
        "bounce_rate": 44.2,
        "returning_visitor_rate": 32.5,
    }


def get_kpi_summary():
    mv = get_monthly_visitors()
    current_month = mv["data"][-1]
    prev_month = mv["data"][-2]
    change_pct = round(((current_month - prev_month) / prev_month) * 100, 1)

    total = sum(mv["data"])

    return {
        "total_visitors": total,
        "monthly_visitors": current_month,
        "unique_users": int(current_month * 0.74),
        "page_views": int(current_month * 3.8),
        "avg_session": "3m 42s",
        "bounce_rate": 44.2,
        "leads_generated": int(current_month * 0.038),
        "conversion_rate": 3.8,
        "returning_visitors": int(current_month * 0.325),
        "monthly_change_pct": change_pct,
    }


def get_lead_growth():
    months = []
    labels = []
    now = datetime.utcnow()
    base = 85
    for i in range(11, -1, -1):
        dt = now - timedelta(days=30 * i)
        labels.append(dt.strftime("%b %Y"))
        base = int(base * random.uniform(1.02, 1.08))
        months.append(base + random.randint(-10, 10))
    return {"labels": labels, "data": months}


def get_leads():
    courses_interested = [
        "Python Programming", "AWS Cloud", "Full Stack Development",
        "Cisco CCNA", "CompTIA Security+", "Azure Administrator",
        "JavaScript / React", "PHP / Laravel", "MS Excel Advanced",
        "Embedded Systems / Arduino", "Data Science", "DevOps / Docker"
    ]
    statuses = ["New", "Contacted", "Interested", "Enrolled", "Closed"]
    status_colors = {
        "New": "#2563EB",
        "Contacted": "#F59E0B",
        "Interested": "#06B6D4",
        "Enrolled": "#22C55E",
        "Closed": "#EF4444",
    }
    sources = ["Website Form", "WhatsApp", "Phone Call", "Walk-in", "Social Media", "Referral"]
    first_names = ["Ahmed", "Sara", "Mohammed", "Fatima", "Ali", "Layla", "Omar", "Hana",
                   "Raj", "Priya", "David", "Emma", "James", "Aisha", "Carlos", "Zara"]
    last_names = ["Al-Rashid", "Sharma", "Khan", "Johnson", "Al-Farsi", "Patel", "Williams",
                  "Hassan", "Nguyen", "Brown", "Al-Zaabi", "Singh", "Martinez", "Al-Hamad"]

    leads = []
    now = datetime.utcnow()
    random.seed(42)

    for i in range(80):
        days_ago = random.randint(0, 90)
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        course = random.choice(courses_interested)
        status = random.choices(statuses, weights=[30, 25, 20, 15, 10])[0]
        source = random.choice(sources)
        phone_prefix = random.choice(["+971 5", "+966 5", "+92 3", "+91 9"])
        phone = f"{phone_prefix}{random.randint(0,9)}{random.randint(1000000, 9999999)}"
        domain = random.choice(["gmail.com", "hotmail.com", "yahoo.com", "outlook.com"])
        email = f"{name.split()[0].lower()}.{random.randint(10,99)}@{domain}"
        date = (now - timedelta(days=days_ago)).strftime("%Y-%m-%d")

        leads.append({
            "id": i + 1,
            "name": name,
            "course_interested": course,
            "phone": phone,
            "email": email,
            "status": status,
            "status_color": status_colors[status],
            "source": source,
            "date": date,
        })

    leads.sort(key=lambda x: x["date"], reverse=True)
    return leads


def get_lead_funnel():
    return [
        {"stage": "Website Visitors", "count": 4800, "color": "#2563EB"},
        {"stage": "Page Engaged", "count": 1920, "color": "#06B6D4"},
        {"stage": "Form Submitted", "count": 384, "color": "#8B5CF6"},
        {"stage": "Contacted", "count": 230, "color": "#F59E0B"},
        {"stage": "Enrolled", "count": 82, "color": "#22C55E"},
    ]


def get_lead_by_source():
    return {
        "labels": ["Website Form", "WhatsApp", "Phone Call", "Walk-in", "Social Media", "Referral"],
        "data": [35, 22, 18, 10, 10, 5],
    }


def get_course_popularity():
    return {
        "labels": [
            "Python", "AWS Cloud", "Full Stack", "CCNA",
            "Security+", "Azure", "React/JS", "DevOps"
        ],
        "data": [88, 74, 68, 61, 55, 49, 45, 38],
        "colors": [
            "#2563EB", "#06B6D4", "#22C55E", "#F59E0B",
            "#8B5CF6", "#EF4444", "#EC4899", "#14B8A6"
        ],
    }


def get_website_performance_radar():
    return {
        "labels": [
            "SEO Score", "Page Speed", "Mobile UX",
            "Content Quality", "Security", "Accessibility"
        ],
        "data": [72, 58, 65, 80, 90, 55],
    }


def get_sparkline_data():
    now = datetime.utcnow()
    data = []
    labels = []
    base = 120
    for i in range(13, -1, -1):
        dt = now - timedelta(days=i)
        labels.append(dt.strftime("%d %b"))
        base = base + random.randint(-15, 25)
        data.append(max(50, base))
    return {"labels": labels, "data": data}


def get_ai_insights():
    return [
        {
            "id": 1,
            "priority": "High",
            "priority_color": "#EF4444",
            "icon": "TrendingUp",
            "title": "Traffic up 18% — Python content driving growth",
            "description": (
                "Your Python Programming blog posts and course page drove a combined "
                "18% increase in organic traffic last month. Search visibility for "
                "'Python training Dubai' improved significantly."
            ),
            "recommendation": "Publish 2 more Python-related articles this month to capitalize on momentum.",
            "impact": "High",
            "impact_color": "#22C55E",
            "action": "Create Content",
            "category": "Traffic",
        },
        {
            "id": 2,
            "priority": "High",
            "priority_color": "#EF4444",
            "icon": "Target",
            "title": "Full Stack course generating highest leads",
            "description": (
                "Full Stack Development is the top lead-generating course with a "
                "4.2% conversion rate. Users spending 5+ minutes on this page "
                "convert at 2× the average rate."
            ),
            "recommendation": "Run Google Ads targeting 'Full Stack course Dubai/UAE'. Budget: AED 500/month.",
            "impact": "Very High",
            "impact_color": "#22C55E",
            "action": "Launch Campaign",
            "category": "Leads",
        },
        {
            "id": 3,
            "priority": "Medium",
            "priority_color": "#F59E0B",
            "icon": "Smartphone",
            "title": "Mobile bounce rate is 18% higher than desktop",
            "description": (
                "58% of your visitors use mobile devices, but the mobile bounce rate "
                "is 54% vs 36% on desktop. This suggests mobile page loading or "
                "navigation issues."
            ),
            "recommendation": "Optimize mobile page speed and simplify the mobile navigation menu.",
            "impact": "Medium",
            "impact_color": "#F59E0B",
            "action": "Fix Mobile UX",
            "category": "Website Health",
        },
        {
            "id": 4,
            "priority": "High",
            "priority_color": "#EF4444",
            "icon": "FileText",
            "title": "Latest blog post has high engagement potential",
            "description": (
                "Blog posts about AI/ML and Cloud certifications receive 3× more "
                "shares than other categories. Your audience is highly interested "
                "in tech career advancement content."
            ),
            "recommendation": "Create a weekly content series: 'Tech Career in UAE 2025'. Target 1 post/week.",
            "impact": "High",
            "impact_color": "#22C55E",
            "action": "Plan Content Calendar",
            "category": "Content",
        },
        {
            "id": 5,
            "priority": "Medium",
            "priority_color": "#F59E0B",
            "icon": "Search",
            "title": "7 pages missing meta descriptions",
            "description": (
                "SEO analysis found 7 pages without meta descriptions, including the "
                "AWS and Azure course pages. These pages are missing key ranking "
                "opportunities for certification keywords."
            ),
            "recommendation": "Add optimized meta descriptions to all course pages within 1 week.",
            "impact": "Medium",
            "impact_color": "#F59E0B",
            "action": "Fix SEO Issues",
            "category": "SEO",
        },
        {
            "id": 6,
            "priority": "Low",
            "priority_color": "#22C55E",
            "icon": "Star",
            "title": "Add Google Reviews / testimonials section",
            "description": (
                "Competitor training centers with visible reviews convert 31% better. "
                "Your website currently lacks a prominent testimonials section on the "
                "homepage and course pages."
            ),
            "recommendation": "Embed Google Reviews widget and add 5–10 student testimonials with photos.",
            "impact": "Medium",
            "impact_color": "#F59E0B",
            "action": "Add Social Proof",
            "category": "Conversion",
        },
        {
            "id": 7,
            "priority": "Medium",
            "priority_color": "#F59E0B",
            "icon": "Zap",
            "title": "Page load speed below industry average",
            "description": (
                "Estimated page load time of 4.2s is above the 2.5s industry standard "
                "for educational websites. Heavy images and unminified scripts are the "
                "primary contributors."
            ),
            "recommendation": "Compress images to WebP format and enable browser caching. Expected improvement: 40%.",
            "impact": "High",
            "impact_color": "#22C55E",
            "action": "Optimize Performance",
            "category": "Performance",
        },
        {
            "id": 8,
            "priority": "Low",
            "priority_color": "#22C55E",
            "icon": "Mail",
            "title": "Email marketing opportunity identified",
            "description": (
                "With 80+ leads per month and no visible email newsletter, you are "
                "missing a significant re-engagement channel. Email marketing has an "
                "average ROI of AED 130 for every AED 1 spent."
            ),
            "recommendation": "Set up a monthly newsletter with course updates, tips, and special offers.",
            "impact": "Medium",
            "impact_color": "#F59E0B",
            "action": "Start Email Campaign",
            "category": "Marketing",
        },
    ]


def get_monthly_report_data():
    kpi = get_kpi_summary()
    mv = get_monthly_visitors()
    leads = get_leads()
    this_month_leads = [l for l in leads if l["date"] >= (datetime.utcnow() - timedelta(days=30)).strftime("%Y-%m-%d")]

    return {
        "month": datetime.utcnow().strftime("%B %Y"),
        "generated_at": datetime.utcnow().isoformat(),
        "kpi": kpi,
        "monthly_visitors_chart": mv,
        "lead_growth": get_lead_growth(),
        "traffic_sources": get_traffic_sources(),
        "devices": get_devices(),
        "top_countries": get_top_countries()[:5],
        "top_landing_pages": get_top_landing_pages()[:5],
        "course_popularity": get_course_popularity(),
        "leads_this_month": len(this_month_leads),
        "website_performance": get_website_performance_radar(),
        "ai_insights_summary": [
            i["title"] for i in get_ai_insights() if i["priority"] == "High"
        ],
    }
