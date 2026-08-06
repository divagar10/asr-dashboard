"""Database configuration and models for ASR Dashboard"""

from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime, Boolean, JSON
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

DATABASE_URL = "sqlite:///./asr_dashboard.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class WebsiteInfo(Base):
    __tablename__ = "website_info"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="")
    url = Column(String, default="")
    title = Column(String, default="")
    description = Column(String, default="")
    logo_url = Column(String, default="")
    hero_banner_url = Column(String, default="")
    phone_numbers = Column(JSON, default=list)
    emails = Column(JSON, default=list)
    address = Column(String, default="")
    google_map_url = Column(String, default="")
    social_links = Column(JSON, default=dict)
    business_hours = Column(String, default="")
    nav_menu = Column(JSON, default=list)
    page_count = Column(Integer, default=0)
    image_count = Column(Integer, default=0)
    internal_links_count = Column(Integer, default=0)
    external_links_count = Column(Integer, default=0)
    ssl_status = Column(Boolean, default=True)
    robots_txt = Column(Boolean, default=False)
    sitemap = Column(Boolean, default=False)
    technologies = Column(JSON, default=list)
    last_crawled = Column(DateTime, default=datetime.utcnow)


class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="")
    category = Column(String, default="")
    image_url = Column(String, default="")
    course_url = Column(String, default="")
    description = Column(Text, default="")
    last_updated = Column(DateTime, default=datetime.utcnow)
    crawled_at = Column(DateTime, default=datetime.utcnow)


class BlogPost(Base):
    __tablename__ = "blog_posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, default="")
    thumbnail_url = Column(String, default="")
    published_date = Column(String, default="")
    category = Column(String, default="")
    author = Column(String, default="Unknown")
    short_description = Column(Text, default="")
    post_url = Column(String, default="")
    crawled_at = Column(DateTime, default=datetime.utcnow)


class SEOData(Base):
    __tablename__ = "seo_data"
    id = Column(Integer, primary_key=True, index=True)
    page_url = Column(String, default="")
    page_title = Column(String, default="")
    meta_description = Column(String, default="")
    meta_keywords = Column(String, default="")
    canonical = Column(String, default="")
    og_title = Column(String, default="")
    og_description = Column(String, default="")
    og_image = Column(String, default="")
    twitter_card = Column(String, default="")
    h1_tags = Column(JSON, default=list)
    h2_tags = Column(JSON, default=list)
    h3_tags = Column(JSON, default=list)
    missing_alt_count = Column(Integer, default=0)
    image_count = Column(Integer, default=0)
    broken_images = Column(Integer, default=0)
    internal_links = Column(Integer, default=0)
    external_links = Column(Integer, default=0)
    has_structured_data = Column(Boolean, default=False)
    seo_score = Column(Float, default=0.0)
    crawled_at = Column(DateTime, default=datetime.utcnow)


class CrawlLog(Base):
    __tablename__ = "crawl_logs"
    id = Column(Integer, primary_key=True, index=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String, default="running")
    pages_crawled = Column(Integer, default=0)
    courses_found = Column(Integer, default=0)
    blogs_found = Column(Integer, default=0)
    error_message = Column(String, nullable=True)


def create_tables():
    Base.metadata.create_all(bind=engine)
