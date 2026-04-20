import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { query } from "@/lib/database"

// GET /api/goals — list all goals for the authenticated user
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const result = await query(
      `SELECT g.*,
         array_agg(DISTINCT gt."toolId") FILTER (WHERE gt."toolId" IS NOT NULL) AS "toolIds",
         a.id as "agentId", a.name as "agentName", a.avatar as "agentAvatar", a.status as "agentStatus",
         a."actionsToday", a."totalActions", a."lastAction", a."lastActionTime"
       FROM "Goal" g
       LEFT JOIN "GoalTool" gt ON gt."goalId" = g.id
       LEFT JOIN "Agent" a ON a."goalId" = g.id
       WHERE g."userId" = $1
       GROUP BY g.id, a.id
       ORDER BY g."createdAt" DESC`,
      [session.user.id]
    )
    return NextResponse.json({ goals: result.rows })
  } catch (error) {
    console.error("Goal list failed:", error)
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 })
  }
}

// POST /api/goals — create a new goal + spawn agent
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { title, description, emoji, category, endDate, totalDays, toolIds = [] } = body as {
    title: string
    description?: string | null
    emoji?: string
    category?: string
    endDate: string
    totalDays: number
    toolIds?: string[]
  }

  if (!title || !endDate || !totalDays) {
    return NextResponse.json({ error: "title, endDate, and totalDays are required" }, { status: 400 })
  }

  try {
    // Insert goal — columns match exactly what the DB has
    const goalResult = await query(
      `INSERT INTO "Goal"
         (id, "userId", title, description, emoji, category,
          "startDate", "endDate", "totalDays", progress, status, color,
          "lastActivity", "createdAt", "updatedAt")
       VALUES
         (gen_random_uuid()::text, $1, $2, $3, $4, $5,
          NOW(), $6::timestamptz, $7, 0, 'active', '#3ecfc6',
          'Goal created', NOW(), NOW())
       RETURNING *`,
      [
        session.user.id,
        title,
        description ?? null,
        emoji ?? "🌱",
        category ?? "general",
        endDate,
        totalDays,
      ]
    )
    const goal = goalResult.rows[0]

    // Insert tool connections
    if (Array.isArray(toolIds) && toolIds.length > 0) {
      const values = toolIds.map((_: string, i: number) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(", ")
      const params = toolIds.flatMap((tid: string) => [goal.id, tid])
      await query(
        `INSERT INTO "GoalTool" ("goalId", "toolId") VALUES ${values} ON CONFLICT DO NOTHING`,
        params
      )
    }

    // Spawn dedicated agent
    const agentName = title.split(" ").slice(0, 2).join("") + "Bot"
    const agentResult = await query(
      `INSERT INTO "Agent"
         (id, "goalId", "userId", name, avatar, personality, status,
          "actionsToday", "totalActions", "createdAt", "updatedAt")
       VALUES
         (gen_random_uuid()::text, $1, $2, $3, $4, $5, 'idle', 0, 0, NOW(), NOW())
       RETURNING *`,
      [
        goal.id,
        session.user.id,
        agentName,
        emoji ?? "🤖",
        "Dedicated agent — focused and proactive",
      ]
    )
    const agent = agentResult.rows[0]

    // Log activity
    await query(
      `INSERT INTO "ActivityLog"
         (id, "userId", "agentId", "goalId", "agentName", "goalTitle",
          action, type, details, "createdAt")
       VALUES
         (gen_random_uuid()::text, $1, $2, $3, $4, $5,
          'Commitment created', 'system', 'New commitment added to EnviroAgent', NOW())`,
      [session.user.id, agent.id, goal.id, agentName, title]
    )

    return NextResponse.json({ goal, agent }, { status: 201 })
  } catch (error) {
    console.error("Goal creation failed:", error)
    return NextResponse.json(
      { error: "Failed to create goal", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
