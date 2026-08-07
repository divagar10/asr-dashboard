"""
Web Crawler for cisprotraining.com
Extracts: website info, courses, blogs, SEO data, images, links, contact info
Uses Motor (async MongoDB) via asyncio.run() so it can be called from a
sync background thread (APScheduler / threading.Thread).
"""

import asyncio
import re
import logging
from datetime import datetime
from typing import Optional
from urllib.parse import urljoin, urlparse

import httpx
from bs4 import BeautifulSoup

from repositories import (
    upsert_website_info,
    replace_courses,
    replace_blogs,
    replace_seo,
    create_crawl_log,
    update_crawl_log,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = "https://cisprotraining.com"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

COURSE_CATEGORIES = {
    "python": "Programming",
    "java": "Programming",
    "javascript": "Programming",
    "web": "Programming",
    "full stack": "Programming",
    "fullstack": "Programming",
    "django": "Programming",
    "react": "Programming",
    "node": "Programming",
    "php": "Programming",
    "c++": "Programming",
    "c#": "Programming",
    "aws": "Cloud",
    "azure": "Cloud",
    "cloud": "Cloud",
    "devops": "Cloud",
    "docker": "Cloud",
    "kubernetes": "Cloud",
    "gcp": "Cloud",
    "cisco": "Networking",
    "ccna": "Networking",
    "ccnp": "Networking",
    "network": "Networking",
    "linux": "Networking",
    "security": "Networking",
    "arduino": "Embedded",
    "embedded": "Embedded",
    "iot": "Embedded",
    "raspberry": "Embedded",
    "plc": "Embedded",
    "excel": "Office",
    "word": "Office",
    "powerpoint": "Office",
    "office": "Office",
    "autocad": "Office",
    "english": "Language",
    "arabic": "Language",
    "french": "Language",
    "language": "Language",
    "hr": "HR",
    "human resource": "HR",
    "management": "HR",
    "accounting": "HR",
    "business": "HR",
}


def categorize_course(name: str) -> str:
    name_lower = name.lower()
    for keyword, category in COURSE_CATEGORIES.items():
        if keyword in name_lower:
            return category
    return "Other"


def compute_seo_score(data: dict) -> float:
    score = 0

    if data.get("page_title") and 10 < len(data["page_title"]) < 70:
        score += 15
    elif data.get("page_title"):
        score += 8

    if data.get("meta_description") and 50 < len(data["meta_description"]) < 160:
        score += 15
    elif data.get("meta_description"):
        score += 8

    if data.get("canonical"):
        score += 5

    if data.get("og_title"):
        score += 5
    if data.get("og_description"):
        score += 5
    if data.get("og_image"):
        score += 5
    if data.get("twitter_card"):
        score += 5

    h1 = data.get("h1_tags", [])
    if len(h1) == 1:
        score += 10
    elif len(h1) > 0:
        score += 5

    if data.get("h2_tags"):
        score += 5
    if data.get("h3_tags"):
        score += 5

    img_count = data.get("image_count", 0)
    missing_alt = data.get("missing_alt_count", 0)
    if img_count > 0:
        alt_ratio = 1 - (missing_alt / img_count)
        score += int(10 * alt_ratio)

    if data.get("has_structured_data"):
        score += 5
    if data.get("internal_links", 0) > 3:
        score += 5

    return round(min(score, 100), 1)


class CISProCrawler:
    def __init__(self):
        self.client = httpx.Client(headers=HEADERS, timeout=30, follow_redirects=True)
        self.visited_urls: set = set()
        self.internal_links: set = set()
        self.external_links: set = set()

    def fetch(self, url: str) -> Optional[BeautifulSoup]:
        try:
            resp = self.client.get(url)
            if resp.status_code == 200:
                return BeautifulSoup(resp.text, "html.parser")
        except Exception as e:
            logger.warning(f"Failed to fetch {url}: {e}")
        return None

    def extract_links(self, soup: BeautifulSoup, base: str) -> tuple:
        internal, external = set(), set()
        for a in soup.find_all("a", href=True):
            href = a["href"].strip()
            full = urljoin(base, href)
            parsed = urlparse(full)
            if parsed.scheme not in ("http", "https"):
                continue
            if parsed.netloc.replace("www.", "") == urlparse(base).netloc.replace("www.", ""):
                if full not in self.visited_urls:
                    internal.add(full)
            else:
                external.add(full)
        return internal, external

    def extract_contact_info(self, soup: BeautifulSoup) -> dict:
        text = soup.get_text(" ", strip=True)

        phones = re.findall(
            r"(?:\+?\d[\d\s\-\(\)]{8,}|\d{4}[\s\-]\d{3,4}[\s\-]\d{3,4})", text
        )
        phones = list(set([p.strip() for p in phones if len(p.strip()) >= 8]))[:5]

        emails = re.findall(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}", text)
        emails = list(set(emails))[:5]

        address = ""
        for tag in soup.find_all(["address", "p", "div", "span"]):
            t = tag.get_text(" ", strip=True)
            if any(w in t.lower() for w in ["street", "road", "avenue", "floor", "building", "dubai", "abu dhabi", "sharjah", "uae"]):
                if 10 < len(t) < 200:
                    address = t
                    break

        map_url = ""
        for a in soup.find_all("a", href=True):
            if "maps.google" in a["href"] or "goo.gl/maps" in a["href"]:
                map_url = a["href"]
                break
        for iframe in soup.find_all("iframe", src=True):
            if "maps.google" in iframe["src"] or "google.com/maps" in iframe["src"]:
                map_url = iframe["src"]
                break

        return {"phones": phones, "emails": emails, "address": address, "map_url": map_url}

    def extract_social_links(self, soup: BeautifulSoup) -> dict:
        socials = {}
        platforms = {
            "facebook": "facebook.com",
            "twitter": "twitter.com",
            "instagram": "instagram.com",
            "linkedin": "linkedin.com",
            "youtube": "youtube.com",
            "tiktok": "tiktok.com",
            "whatsapp": "wa.me",
        }
        for a in soup.find_all("a", href=True):
            href = a["href"]
            for name, domain in platforms.items():
                if domain in href and name not in socials:
                    socials[name] = href
        return socials

    def extract_nav_menu(self, soup: BeautifulSoup) -> list:
        nav = soup.find("nav") or soup.find(attrs={"role": "navigation"})
        items = []
        if nav:
            for a in nav.find_all("a", href=True):
                label = a.get_text(strip=True)
                if label and len(label) < 50:
                    items.append({"label": label, "url": a["href"]})
        if not items:
            header = soup.find("header")
            if header:
                for a in header.find_all("a", href=True):
                    label = a.get_text(strip=True)
                    if label and len(label) < 50:
                        items.append({"label": label, "url": a["href"]})
        seen, deduped = [], []
        for item in items:
            if item["label"] not in seen:
                seen.append(item["label"])
                deduped.append(item)
        return deduped[:20]

    def detect_technologies(self, soup: BeautifulSoup, html: str) -> list:
        techs = []
        html_lower = html.lower()
        checks = {
            "WordPress": ["wp-content", "wp-includes", "wordpress"],
            "React": ["react.js", "react.min.js", "__react"],
            "Vue.js": ["vue.js", "vue.min.js"],
            "Angular": ["angular.js", "ng-version"],
            "jQuery": ["jquery.js", "jquery.min.js"],
            "Bootstrap": ["bootstrap.css", "bootstrap.min.css"],
            "Tailwind CSS": ["tailwindcss", "tailwind.css"],
            "Google Analytics": ["google-analytics.com", "gtag("],
            "Facebook Pixel": ["connect.facebook.net"],
            "Cloudflare": ["cloudflare"],
            "Nginx": ["nginx"],
            "Apache": ["apache"],
            "PHP": [".php", "php"],
            "Font Awesome": ["font-awesome", "fontawesome"],
        }
        for tech, signals in checks.items():
            if any(s in html_lower for s in signals):
                techs.append(tech)
        return techs

    def extract_business_hours(self, soup: BeautifulSoup) -> str:
        text = soup.get_text(" ", strip=True)
        patterns = [
            r"((?:mon|tue|wed|thu|fri|sat|sun)[a-z\s\-–]+"
            r"(?:\d{1,2}(?::\d{2})?(?:am|pm)?(?:\s*[-–]\s*)"
            r"\d{1,2}(?::\d{2})?(?:am|pm)?))",
        ]
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                return " | ".join(matches[:5])
        if "24/7" in text or "24 hours" in text.lower():
            return "24/7"
        return "Mon–Fri: 9:00 AM – 6:00 PM"

    def extract_logo(self, soup: BeautifulSoup, base: str) -> str:
        for img in soup.find_all("img"):
            src = img.get("src", "")
            alt = img.get("alt", "").lower()
            classes = " ".join(img.get("class", [])).lower()
            if any(w in alt + src.lower() + classes for w in ["logo", "brand", "site-logo"]):
                return urljoin(base, src)
        header = soup.find("header")
        if header:
            img = header.find("img")
            if img and img.get("src"):
                return urljoin(base, img["src"])
        return ""

    def extract_hero_banner(self, soup: BeautifulSoup, base: str) -> str:
        for selector in [".hero img", ".banner img", ".slider img", "#hero img", "#banner img", ".hero-section img", ".jumbotron img"]:
            el = soup.select_one(selector)
            if el and el.get("src"):
                return urljoin(base, el["src"])
        for div in soup.find_all("div"):
            style = div.get("style", "")
            if "background-image" in style:
                match = re.search(r"url\(['\"]?(.*?)['\"]?\)", style)
                if match:
                    return urljoin(base, match.group(1))
        for img in soup.find_all("img")[:5]:
            src = img.get("src", "")
            w = img.get("width", "0")
            if src and (str(w).isdigit() and int(w) > 300):
                return urljoin(base, src)
        return ""

    @staticmethod
    def clean_name(raw: str) -> str:
        noise = ["view course", "learn more", "enroll now", "register", "apply now",
                 "click here", "read more", "view details", "get started"]
        cleaned = raw
        for n in noise:
            cleaned = re.sub(n, "", cleaned, flags=re.IGNORECASE)
        cleaned = " ".join(cleaned.split())
        if len(cleaned) > 80:
            cleaned = cleaned[:80].rsplit(" ", 1)[0]
        return cleaned.strip()

    def crawl_website_info(self) -> dict:
        logger.info(f"Crawling website info from {BASE_URL}")
        soup = self.fetch(BASE_URL)
        if not soup:
            return {}

        html = str(soup)
        title_tag = soup.find("title")
        title = title_tag.get_text(strip=True) if title_tag else ""

        desc_tag = soup.find("meta", attrs={"name": "description"})
        description = desc_tag.get("content", "") if desc_tag else ""

        contact = self.extract_contact_info(soup)
        socials = self.extract_social_links(soup)
        nav = self.extract_nav_menu(soup)
        techs = self.detect_technologies(soup, html)
        hours = self.extract_business_hours(soup)
        logo = self.extract_logo(soup, BASE_URL)
        hero = self.extract_hero_banner(soup, BASE_URL)

        internal, external = self.extract_links(soup, BASE_URL)
        self.internal_links = internal
        self.external_links = external
        images = soup.find_all("img")

        return {
            "name": "CISPRO Training",
            "url": BASE_URL,
            "title": title,
            "description": description,
            "logo_url": logo,
            "hero_banner_url": hero,
            "phone_numbers": contact["phones"],
            "emails": contact["emails"],
            "address": contact["address"],
            "google_map_url": contact["map_url"],
            "social_links": socials,
            "business_hours": hours,
            "nav_menu": nav,
            "image_count": len(images),
            "internal_links_count": len(internal),
            "external_links_count": len(external),
            "ssl_status": BASE_URL.startswith("https"),
            "technologies": techs,
        }

    def check_robots_sitemap(self) -> dict:
        robots, sitemap, sitemap_url = False, False, ""
        try:
            r = self.client.get(f"{BASE_URL}/robots.txt")
            if r.status_code == 200 and "user-agent" in r.text.lower():
                robots = True
                sm_match = re.search(r"Sitemap:\s*(\S+)", r.text, re.IGNORECASE)
                if sm_match:
                    sitemap_url = sm_match.group(1)
        except Exception:
            pass

        for sm_path in [sitemap_url, f"{BASE_URL}/sitemap.xml", f"{BASE_URL}/sitemap_index.xml"]:
            if not sm_path:
                continue
            try:
                r = self.client.get(sm_path)
                if r.status_code == 200 and "<url" in r.text.lower():
                    sitemap = True
                    break
            except Exception:
                pass

        return {"robots": robots, "sitemap": sitemap}

    def count_pages(self) -> int:
        try:
            r = self.client.get(f"{BASE_URL}/sitemap.xml")
            if r.status_code == 200:
                count = r.text.count("<url>")
                if count > 0:
                    return count
        except Exception:
            pass
        return max(len(self.internal_links), 1)

    def crawl_courses(self) -> list:
        logger.info("Crawling courses...")
        courses = []
        course_links = set()
        soup_main = self.fetch(BASE_URL)

        if soup_main:
            for a in soup_main.find_all("a", href=True):
                href = a["href"].strip()
                full = urljoin(BASE_URL, href)
                if re.search(r"/courses?/[^/]+", href):
                    course_links.add(full)

        try:
            r = self.client.get(f"{BASE_URL}/sitemap.xml")
            if r.status_code == 200:
                for m in re.findall(r"<loc>(.*?)</loc>", r.text):
                    if "/courses" in m and m != f"{BASE_URL}/courses":
                        course_links.add(m)
        except Exception:
            pass

        listing_page = self.fetch(f"{BASE_URL}/courses")
        if listing_page:
            for a in listing_page.find_all("a", href=True):
                href = a["href"].strip()
                full = urljoin(BASE_URL, href)
                if re.search(r"/courses?/[^/]+", href):
                    course_links.add(full)

        for curl in sorted(course_links)[:30]:
            soup = self.fetch(curl)
            if not soup:
                continue

            t = soup.find("title")
            raw_name = t.get_text(strip=True) if t else ""
            raw_name = re.sub(r"\s*[\|\-–]\s*(cispro|training|institute).*$", "", raw_name, flags=re.IGNORECASE)
            name = self.clean_name(raw_name)

            if not name or len(name) < 3:
                h1 = soup.find("h1")
                if h1:
                    name = self.clean_name(h1.get_text(strip=True))

            if not name or len(name) < 3:
                slug = curl.rstrip("/").split("/")[-1]
                name = slug.replace("-", " ").title()

            img_el = soup.find("img", src=True)
            img_url = urljoin(BASE_URL, img_el["src"]) if img_el else ""

            desc_el = soup.find("meta", attrs={"name": "description"})
            desc = desc_el.get("content", "")[:300] if desc_el else ""
            if not desc:
                p = soup.find("p")
                desc = p.get_text(strip=True)[:300] if p else ""

            courses.append({
                "name": name,
                "category": categorize_course(name + " " + curl),
                "image_url": img_url,
                "course_url": curl,
                "description": desc,
                "last_updated": datetime.utcnow(),
            })

        if not courses and soup_main:
            course_cards = (
                soup_main.select("[class*='course']") or
                soup_main.select("article") or
                soup_main.select(".card")
            )
            for card in course_cards[:30]:
                heading = card.find(["h1", "h2", "h3", "h4"])
                if not heading:
                    continue
                name = self.clean_name(heading.get_text(strip=True))
                if not name or len(name) < 3:
                    continue
                link_el = card.find("a", href=True)
                curl = urljoin(BASE_URL, link_el["href"]) if link_el else BASE_URL
                img_el = card.find("img")
                img_url = urljoin(BASE_URL, img_el.get("src", "")) if img_el else ""
                desc_el = card.find("p")
                desc = desc_el.get_text(strip=True)[:300] if desc_el else ""
                courses.append({
                    "name": name,
                    "category": categorize_course(name),
                    "image_url": img_url,
                    "course_url": curl,
                    "description": desc,
                    "last_updated": datetime.utcnow(),
                })

        seen, deduped = [], []
        for c in courses:
            if c["name"] not in seen:
                seen.append(c["name"])
                deduped.append(c)

        logger.info(f"Found {len(deduped)} courses")
        return deduped[:60]

    def crawl_blogs(self) -> list:
        logger.info("Crawling blogs...")
        blogs = []
        blog_paths = ["/blog", "/blogs", "/news", "/articles", "/posts", "/resources", "/insights"]

        for path in blog_paths:
            url = f"{BASE_URL}{path}"
            soup = self.fetch(url)
            if not soup:
                continue

            posts = (
                soup.select("article") or
                soup.select(".post, .blog-post, .entry") or
                soup.select("[class*='post'], [class*='blog']") or
                soup.select(".item")
            )

            for post in posts[:30]:
                title_el = (
                    post.find(["h2", "h3", "h1", "h4"]) or
                    post.find(class_=re.compile(r"title|heading", re.I))
                )
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                if not title or len(title) < 5:
                    continue

                link_el = post.find("a", href=True)
                post_url = urljoin(BASE_URL, link_el["href"]) if link_el else url

                img_el = post.find("img")
                thumb = ""
                if img_el:
                    thumb = urljoin(BASE_URL, img_el.get("src") or img_el.get("data-src") or "")

                date_el = post.find("time") or post.find(class_=re.compile(r"date|time|published", re.I))
                pub_date = ""
                if date_el:
                    pub_date = date_el.get("datetime") or date_el.get_text(strip=True)

                cat_el = post.find(class_=re.compile(r"cat|category|tag", re.I))
                category = cat_el.get_text(strip=True) if cat_el else "General"

                author_el = post.find(class_=re.compile(r"author|by-author", re.I))
                author = author_el.get_text(strip=True) if author_el else "CISPRO Team"
                author = re.sub(r"^(by|author:?)\s*", "", author, flags=re.IGNORECASE).strip()

                desc_el = post.find("p") or post.find(class_=re.compile(r"excerpt|desc|summary", re.I))
                desc = desc_el.get_text(strip=True)[:250] if desc_el else ""

                blogs.append({
                    "title": title,
                    "thumbnail_url": thumb,
                    "published_date": pub_date,
                    "category": category[:50],
                    "author": author[:100],
                    "short_description": desc,
                    "post_url": post_url,
                })

            if blogs:
                break

        seen, deduped = [], []
        for b in blogs:
            if b["title"] not in seen:
                seen.append(b["title"])
                deduped.append(b)

        logger.info(f"Found {len(deduped)} blog posts")
        return deduped[:30]

    def crawl_seo(self, pages: list) -> list:
        logger.info("Crawling SEO data...")
        results = []
        for url in pages[:10]:
            soup = self.fetch(url)
            if not soup:
                continue

            title_tag = soup.find("title")
            page_title = title_tag.get_text(strip=True) if title_tag else ""

            desc_tag = soup.find("meta", attrs={"name": "description"})
            meta_desc = desc_tag.get("content", "") if desc_tag else ""

            kw_tag = soup.find("meta", attrs={"name": "keywords"})
            meta_kw = kw_tag.get("content", "") if kw_tag else ""

            canonical_tag = soup.find("link", attrs={"rel": "canonical"})
            canonical = canonical_tag.get("href", "") if canonical_tag else ""

            og_title = (soup.find("meta", property="og:title") or {}).get("content", "")
            og_desc = (soup.find("meta", property="og:description") or {}).get("content", "")
            og_img = (soup.find("meta", property="og:image") or {}).get("content", "")
            tw_card = (soup.find("meta", attrs={"name": "twitter:card"}) or {}).get("content", "")

            h1s = [h.get_text(strip=True) for h in soup.find_all("h1")]
            h2s = [h.get_text(strip=True) for h in soup.find_all("h2")]
            h3s = [h.get_text(strip=True) for h in soup.find_all("h3")]

            imgs = soup.find_all("img")
            missing_alt = sum(1 for img in imgs if not img.get("alt"))
            int_links, ext_links = self.extract_links(soup, url)

            has_structured = bool(
                soup.find("script", type="application/ld+json") or
                soup.find(attrs={"itemscope": True})
            )

            data = {
                "page_url": url,
                "page_title": page_title,
                "meta_description": meta_desc,
                "meta_keywords": meta_kw,
                "canonical": canonical,
                "og_title": og_title,
                "og_description": og_desc,
                "og_image": og_img,
                "twitter_card": tw_card,
                "h1_tags": h1s[:5],
                "h2_tags": h2s[:10],
                "h3_tags": h3s[:10],
                "missing_alt_count": missing_alt,
                "image_count": len(imgs),
                "broken_images": 0,
                "internal_links": len(int_links),
                "external_links": len(ext_links),
                "has_structured_data": has_structured,
            }
            data["seo_score"] = compute_seo_score(data)
            results.append(data)

        return results

    async def run_async_with_db(self, db) -> dict:
        """Full crawl that writes directly to MongoDB via Motor."""
        log_id = await create_crawl_log(db)

        try:
            logger.info("=== Starting full crawl ===")

            info = self.crawl_website_info()
            rs = self.check_robots_sitemap()
            info["robots_txt"] = rs["robots"]
            info["sitemap"] = rs["sitemap"]
            info["page_count"] = self.count_pages()
            await upsert_website_info(db, info)

            courses = self.crawl_courses()
            await replace_courses(db, courses)

            blogs = self.crawl_blogs()
            await replace_blogs(db, blogs)

            pages = [BASE_URL] + list(self.internal_links)[:9]
            seo_data = self.crawl_seo(pages)
            await replace_seo(db, seo_data)

            await update_crawl_log(db, log_id, {
                "status": "completed",
                "completed_at": datetime.utcnow(),
                "pages_crawled": len(pages),
                "courses_found": len(courses),
                "blogs_found": len(blogs),
            })

            logger.info("=== Crawl completed ===")
            return {
                "status": "completed",
                "pages_crawled": len(pages),
                "courses_found": len(courses),
                "blogs_found": len(blogs),
            }

        except Exception as e:
            logger.error(f"Crawl failed: {e}")
            await update_crawl_log(db, log_id, {
                "status": "failed",
                "error_message": str(e),
                "completed_at": datetime.utcnow(),
            })
            return {"status": "failed", "error": str(e)}

        finally:
            self.client.close()


def run_crawl() -> dict:
    """
    Sync entry point for APScheduler / threading.Thread.
    Creates a brand-new Motor client bound to its own fresh event loop
    so it never conflicts with the FastAPI event loop.
    """
    async def _run():
        # Always create a fresh connection for this thread's event loop
        from motor.motor_asyncio import AsyncIOMotorClient
        import os
        from dotenv import load_dotenv
        load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
        uri = os.environ.get("MONGODB_URI", "")
        db_name = os.environ.get("MONGODB_DB", "asr_dashboard")
        if "tlsInsecure" not in uri:
            sep = "&" if "?" in uri else "?"
            uri = f"{uri}{sep}tlsInsecure=true"
        
        client = AsyncIOMotorClient(
            uri,
            serverSelectionTimeoutMS=10_000,
            tls=True,
            tlsAllowInvalidCertificates=True,
        )
        db = client[db_name]
        try:
            crawler = CISProCrawler()
            return await crawler.run_async_with_db(db)
        finally:
            client.close()

    return asyncio.run(_run())


if __name__ == "__main__":
    import os
    from dotenv import load_dotenv
    load_dotenv()
    result = run_crawl()
    print(result)
