import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { query } from "@/lib/database"

// GET /api/goals/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const [goalRes, activityRes] = await Promise.all([
    query(
      `SELECT g.*, array_agg(DISTINCT gt."toolId") FILTER (WHERE gt."toolId" IS NOT NULL) AS "toolIds",
         a.id as "agentId", a.name as "agentName", a.avatar as "agentAvatar", a.status as "agentStatus",
         a."actionsToday", a."totalActions", a."lastAction", a."lastActionTime"
       FROM "Goal" g
       LEFT JOIN "GoalTool" gt ON gt."goalId" = g.id
       LEFT JOIN "Agent" a ON a."goalId" = g.id
       WHERE g.id = $1 AND g."userId" = $2
       GROUP BY g.id, a.id`,
      [id, session.user.id]
    ),
    query(
      `SELECT * FROM "ActivityLog" WHERE "goalId" = $1 AND "userId" = $2 ORDER BY "createdAt" DESC LIMIT 20`,
      [id, session.user.id]
    ),
  ])

  if (!goalRes.rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({ goal: goalRes.rows[0], activity: activityRes.rows })
}

// PATCH /api/goals/[id] — update progress, status, etc.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await req.json()

  const allowed = ["title", "description", "progress", "status", "color", "lastActivity"]
  const updates: string[] = []
  const values: unknown[] = []
  let i = 1

  for (const key of allowed) {
    if (key in body) {
      updates.push(`"${key}" = $${i}`)
      values.push(body[key])
      i++
    }
  }

  if (updates.length === 0) return NextResponse.json({ error: "Nothing to update" }, { status: 400 })

  updates.push(`"updatedAt" = NOW()`)
  values.push(id, session.user.id)

  const result = await query(
    `UPDATE "Goal" SET ${updates.join(", ")} WHERE id = $${i} AND "userId" = $${i + 1} RETURNING *`,
    values
  )

  if (!result.rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ goal: result.rows[0] })
}

// DELETE /api/goals/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  await query(`DELETE FROM "Goal" WHERE id = $1 AND "userId" = $2`, [id, session.user.id])
  return NextResponse.json({ success: true })
}
