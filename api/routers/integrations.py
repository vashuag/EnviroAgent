from typing import Annotated

from fastapi import APIRouter, Depends

from middleware.auth import get_current_user
from services.db import get_connection, release_connection

router = APIRouter(prefix="/integrations", tags=["integrations"])

# Static catalog — metadata that never lives in the DB
TOOL_CATALOG = [
    {"toolId": "t1",  "name": "Calendar",   "category": "productivity",   "icon": "📅", "description": "Schedules workouts and recovery blocks"},
    {"toolId": "t2",  "name": "Email",       "category": "communication",  "icon": "📧", "description": "Drafts and sends outreach messages"},
    {"toolId": "t3",  "name": "Browser",     "category": "productivity",   "icon": "🌐", "description": "Researches opportunities and content"},
    {"toolId": "t4",  "name": "Spotify",     "category": "health",         "icon": "🎵", "description": "Curates workout playlists"},
    {"toolId": "t5",  "name": "Workspace",   "category": "productivity",   "icon": "📝", "description": "Organises notes and project docs"},
    {"toolId": "t6",  "name": "Zomato",      "category": "commerce",       "icon": "🍱", "description": "Tracks food spend vs. budget"},
    {"toolId": "t7",  "name": "Amazon",      "category": "commerce",       "icon": "📦", "description": "Monitors impulse purchases"},
    {"toolId": "t8",  "name": "WhatsApp",    "category": "social",         "icon": "💬", "description": "Sends commitment check-in nudges"},
    {"toolId": "t9",  "name": "Todo",        "category": "productivity",   "icon": "✅", "description": "Creates and tracks daily micro-tasks"},
    {"toolId": "t10", "name": "Instagram",   "category": "social",         "icon": "📸", "description": "Posts progress updates (optional)"},
    {"toolId": "t11", "name": "Lights",      "category": "home",           "icon": "💡", "description": "Sets focus lighting for deep work"},
]


@router.get("")
def list_integrations(current_user: Annotated[dict, Depends(get_current_user)]):
    # Fetch connected status from DB
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT "toolId", connected
                FROM "ToolConnection"
                WHERE "userId" = %s
                """,
                (current_user["id"],),
            )
            db_status = {row[0]: row[1] for row in cur.fetchall()}
    finally:
        release_connection(conn)

    return [
        {**tool, "connected": db_status.get(tool["toolId"], False)}
        for tool in TOOL_CATALOG
    ]
