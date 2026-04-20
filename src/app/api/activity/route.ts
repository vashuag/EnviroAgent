import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { query } from "@/lib/database"

// GET /api/activity?goalId=&type=&limit=
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const goalId = searchParams.get("goalId")
  const type   = searchParams.get("type")
  const limit  = parseInt(searchParams.get("limit") ?? "50")

  const conditions = [`"userId" = $1`]
  const values: unknown[] = [session.user.id]
  let i = 2

  if (goalId) { conditions.push(`"goalId" = $${i++}`); values.push(goalId) }
  if (type)   { conditions.push(`type = $${i++}`);     values.push(type)   }

  values.push(Math.min(limit, 100))
  const result = await query(
    `SELECT * FROM "ActivityLog" WHERE ${conditions.join(" AND ")} ORDER BY "createdAt" DESC LIMIT $${i}`,
    values
  )

  return NextResponse.json({ activity: result.rows })
}

// POST /api/activity — log a new agent action
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agentId, goalId, agentName, goalTitle, action, type, details } = await req.json()

  const result = await query(
    `INSERT INTO "ActivityLog" (id, "userId", "agentId", "goalId", "agentName", "goalTitle", action, type, details, "createdAt")
     VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, NOW())
     RETURNING *`,
    [session.user.id, agentId ?? null, goalId ?? null, agentName ?? null, goalTitle ?? null, action, type, details ?? null]
  )

  // Also update the agent's last action
  if (agentId) {
    await query(
      `UPDATE "Agent" SET "lastAction" = $1, "lastActionTime" = NOW(), "actionsToday" = "actionsToday" + 1, "totalActions" = "totalActions" + 1, "updatedAt" = NOW() WHERE id = $2 AND "userId" = $3`,
      [action, agentId, session.user.id]
    )
  }

  return NextResponse.json({ activity: result.rows[0] }, { status: 201 })
}
