"""
Centralized MongoDB connection using Motor async driver.
Import `db` from this module anywhere you need a collection.
"""

import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

_client: AsyncIOMotorClient | None = None
_db = None


def get_mongo_uri() -> str:
    uri = os.environ.get("MONGODB_URI", "")
    if not uri:
        raise RuntimeError(
            "MONGODB_URI environment variable is not set. "
            "Add it to your .env file or deployment environment."
        )
    return uri


def get_db_name() -> str:
    return os.environ.get("MONGODB_DB", "asr_dashboard")


async def connect_db() -> None:
    global _client, _db
    uri = get_mongo_uri()
    db_name = get_db_name()
    logger.info(f"Connecting to MongoDB (db={db_name})...")
    
    # Railway + Python 3.12+ has TLS handshake issues with Atlas — bypass cert verification
    import ssl
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    _client = AsyncIOMotorClient(
        uri,
        serverSelectionTimeoutMS=10_000,
        tls=True,
        tlsAllowInvalidCertificates=True,
        tlsInsecure=True,
    )
    await _client.admin.command("ping")
    _db = _client[db_name]
    logger.info("MongoDB connected.")


async def close_db() -> None:
    global _client
    if _client:
        _client.close()
        logger.info("MongoDB connection closed.")


def get_db():
    """Return the Motor database instance. Call after connect_db()."""
    if _db is None:
        raise RuntimeError("Database not initialised. Call connect_db() first.")
    return _db
