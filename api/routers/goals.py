import uuid
from datetime import date, timezone, datetime
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from middleware.auth import get_current_user
from services.db import get_connection, release_connection

router = APIRouter(prefix="/goals", tags=["goals"])


# ── Pydantic input models ─────────────────────────────────────────────────────

class CreateGoalBody(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = "general"
    emoji: Optional[str] = "🌱"
    endDate: str
    totalDays: int
    toolIds: list[str] = []


class CheckinBody(BaseModel):
    did_action: bool
    notes: Optional[str] = None


# ── Helpers ───────────────────────────────────────────────────────────────────

def _row_to_dict(cursor, row) -> dict:
    return dict(zip([d[0] for d in cursor.description], row))


def _rows_to_list(cursor, rows) -> list[dict]:
    cols = [d[0] for d in cursor.description]
    return [dict(zip(cols, row)) for row in rows]


def _assert_goal_owned(cur, goal_id: str, user_id: str) -> dict:
    """Fetch a goal row, raising 404 if not found or not owned by user."""
    cur.execute(
        """
        SELECT * FROM "Goal"
        WHERE id = %s AND "userId" = %s AND status != 'deleted'
        """,
        (goal_id, user_id),
    )
    row = cur.fetchone()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    return _row_to_dict(cur, row)


# ── POST /goals ───────────────────────────────────────────────────────────────

@router.post("", status_code=201)
def create_goal(
    body: CreateGoalBody,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            goal_id = str(uuid.uuid4())
            agent_id = str(uuid.uuid4())
            now = datetime.now(timezone.utc)
            agent_name = "".join(body.title.split()[:2]) + "Bot"

            # Insert goal
            cur.execute(
                """
                INSERT INTO "Goal"
                    (id, "userId", title, description, emoji, category,
                     "startDate", "endDate", "totalDays", progress, status, color,
                     "lastActivity", "createdAt", "updatedAt")
                VALUES
                    (%s, %s, %s, %s, %s, %s,
                     %s, %s::timestamptz, %s, 0, 'active', '#3ecfc6',
                     'Goal created', %s, %s)
                RETURNING *
                """,
                (
                    goal_id, current_user["id"], body.title, body.description,
                    body.emoji, body.category,
                    now, body.endDate, body.totalDays,
                    now, now,
                ),
            )
            goal = dict(zip([d[0] for d in cur.description], cur.fetchone()))

            # Insert tool connections
            for tool_id in body.toolIds:
                cur.execute(
                    """
                    INSERT INTO "GoalTool" ("goalId", "toolId")
                    VALUES (%s, %s)
                    ON CONFLICT DO NOTHING
                    """,
                    (goal_id, tool_id),
                )

            # Spawn agent
            cur.execute(
                """
                INSERT INTO "Agent"
                    (id, "goalId", "userId", name, avatar, personality, status,
                     "actionsToday", "totalActions", "createdAt", "updatedAt")
                VALUES
                    (%s, %s, %s, %s, %s, %s, 'idle', 0, 0, %s, %s)
                RETURNING *
                """,
                (
                    agent_id, goal_id, current_user["id"],
                    agent_name, body.emoji or "🤖",
                    "Dedicated agent — focused and proactive",
                    now, now,
                ),
            )
            agent = dict(zip([d[0] for d in cur.description], cur.fetchone()))

            # Log activity
            cur.execute(
                """
                INSERT INTO "ActivityLog"
                    (id, "userId", "agentId", "goalId", "agentName", "goalTitle",
                     action, type, details, "createdAt")
                VALUES
                    (%s, %s, %s, %s, %s, %s,
                     'Commitment created', 'system',
                     'New commitment added to EnviroAgent', %s)
                """,
                (
                    str(uuid.uuid4()), current_user["id"], agent_id, goal_id,
                    agent_name, body.title, now,
                ),
            )

        conn.commit()
        goal["agent"] = agent
        goal["activity"] = []
        return goal
    except Exception as exc:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        release_connection(conn)


# ── GET /goals ────────────────────────────────────────────────────────────────

@router.get("")
def list_goals(current_user: Annotated[dict, Depends(get_current_user)]):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    g.*,
                    a.id          AS agent_id,
                    a.name        AS agent_name,
                    a.avatar      AS agent_avatar,
                    a.status      AS agent_status,
                    a."actionsToday"  AS agent_actions_today,
                    a."totalActions"  AS agent_total_actions,
                    a."lastAction"    AS agent_last_action,
                    a."lastActionTime" AS agent_last_action_time
                FROM "Goal" g
                LEFT JOIN "Agent" a ON a."goalId" = g.id
                WHERE g."userId" = %s
                  AND g.status != 'deleted'
                ORDER BY g."createdAt" DESC
                """,
                (current_user["id"],),
            )
            rows = cur.fetchall()
            cols = [d[0] for d in cur.description]

        goals = []
        for row in rows:
            flat = dict(zip(cols, row))
            goal = {k: v for k, v in flat.items() if not k.startswith("agent_")}
            goal["agent"] = None
            if flat.get("agent_id"):
                goal["agent"] = {
                    "id": flat["agent_id"],
                    "name": flat["agent_name"],
                    "avatar": flat["agent_avatar"],
                    "status": flat["agent_status"],
                    "actionsToday": flat["agent_actions_today"],
                    "totalActions": flat["agent_total_actions"],
                    "lastAction": flat["agent_last_action"],
                    "lastActionTime": flat["agent_last_action_time"],
                }
            goals.append(goal)

        return goals
    finally:
        release_connection(conn)


# ── GET /goals/{goal_id} ──────────────────────────────────────────────────────

@router.get("/{goal_id}")
def get_goal(goal_id: str, current_user: Annotated[dict, Depends(get_current_user)]):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            goal = _assert_goal_owned(cur, goal_id, current_user["id"])

            cur.execute(
                'SELECT * FROM "Agent" WHERE "goalId" = %s',
                (goal_id,),
            )
            agent_row = cur.fetchone()
            goal["agent"] = _row_to_dict(cur, agent_row) if agent_row else None

            cur.execute(
                """
                SELECT * FROM "ActivityLog"
                WHERE "goalId" = %s
                ORDER BY "createdAt" DESC
                LIMIT 20
                """,
                (goal_id,),
            )
            goal["activity"] = _rows_to_list(cur, cur.fetchall())

        return goal
    finally:
        release_connection(conn)


# ── POST /goals/{goal_id}/checkin ─────────────────────────────────────────────

@router.post("/{goal_id}/checkin")
def checkin(
    goal_id: str,
    body: CheckinBody,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            goal = _assert_goal_owned(cur, goal_id, current_user["id"])

            today = date.today()

            # Guard: already checked in today
            cur.execute(
                """
                SELECT id FROM "Checkin"
                WHERE "goalId" = %s AND "checkinDate" = %s
                """,
                (goal_id, today),
            )
            if cur.fetchone() is not None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="already_checked_in_today",
                )

            # Compute new health score
            current_health: int = goal["healthScore"]
            delta = 5 if body.did_action else -10
            new_health = max(0, min(100, current_health + delta))

            # Compute new streak
            last_checkin = goal["lastCheckinAt"]
            if last_checkin is not None:
                # Normalise to date for comparison
                last_date = last_checkin.date() if hasattr(last_checkin, "date") else last_checkin
                yesterday = date.fromordinal(today.toordinal() - 1)
                if body.did_action and last_date == yesterday:
                    new_streak = goal["streakCount"] + 1
                elif body.did_action:
                    new_streak = 1
                else:
                    new_streak = 0
            else:
                new_streak = 1 if body.did_action else 0

            now = datetime.now(timezone.utc)

            # Insert checkin row
            cur.execute(
                """
                INSERT INTO "Checkin" (id, "goalId", "userId", "checkinDate", "didAction", notes, "createdAt")
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (str(uuid.uuid4()), goal_id, current_user["id"], today, body.did_action, body.notes, now),
            )

            # Update goal
            cur.execute(
                """
                UPDATE "Goal"
                SET "healthScore"   = %s,
                    "streakCount"   = %s,
                    "lastCheckinAt" = %s,
                    "updatedAt"     = %s
                WHERE id = %s
                """,
                (new_health, new_streak, now, now, goal_id),
            )

            # Log activity
            cur.execute(
                """
                INSERT INTO "ActivityLog" (id, "userId", "goalId", "goalTitle", action, type, details, "createdAt")
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    str(uuid.uuid4()),
                    current_user["id"],
                    goal_id,
                    goal["title"],
                    "Check-in",
                    "user",
                    body.notes or ("Completed action" if body.did_action else "Missed action"),
                    now,
                ),
            )

        conn.commit()

        message = (
            f"Great job! +5 health. Streak: {new_streak} day{'s' if new_streak != 1 else ''}."
            if body.did_action
            else f"Missed today. -10 health. Keep going tomorrow."
        )

        return {"health_score": new_health, "streak": new_streak, "message": message}
    finally:
        release_connection(conn)


# ── GET /goals/{goal_id}/activity ─────────────────────────────────────────────

@router.get("/{goal_id}/activity")
def goal_activity(goal_id: str, current_user: Annotated[dict, Depends(get_current_user)]):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            _assert_goal_owned(cur, goal_id, current_user["id"])

            cur.execute(
                """
                SELECT * FROM "ActivityLog"
                WHERE "goalId" = %s
                ORDER BY "createdAt" DESC
                LIMIT 50
                """,
                (goal_id,),
            )
            return _rows_to_list(cur, cur.fetchall())
    finally:
        release_connection(conn)
