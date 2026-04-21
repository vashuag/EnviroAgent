import logging
import os
from contextlib import contextmanager

import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

_pool: pool.ThreadedConnectionPool | None = None


def init_pool(minconn: int = 1, maxconn: int = 10) -> None:
    global _pool
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        logger.warning("DATABASE_URL is not set — database unavailable")
        return
    try:
        _pool = pool.ThreadedConnectionPool(minconn, maxconn, dsn=database_url)
        logger.info("Database pool initialised")
    except psycopg2.OperationalError as exc:
        logger.warning("Could not connect to database at startup: %s", exc)


def close_pool() -> None:
    global _pool
    if _pool is not None:
        _pool.closeall()
        _pool = None


def get_connection():
    """Return a raw connection from the pool. Caller must call release_connection()."""
    if _pool is None:
        raise RuntimeError("Database pool is not initialised — call init_pool() first")
    return _pool.getconn()


def release_connection(conn) -> None:
    """Return a connection to the pool."""
    if _pool is not None:
        _pool.putconn(conn)


@contextmanager
def _managed_connection():
    """Internal context manager for functions that need auto-commit/rollback."""
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        release_connection(conn)


def test_connection() -> bool:
    """Run SELECT 1 to verify the database is reachable. Returns True/False."""
    try:
        with _managed_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")
        return True
    except Exception as exc:
        logger.debug("test_connection failed: %s", exc)
        return False


def get_table_names() -> list[str]:
    """Return all table names in the public schema."""
    with _managed_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                  AND table_type = 'BASE TABLE'
                ORDER BY table_name
                """
            )
            return [row[0] for row in cur.fetchall()]
