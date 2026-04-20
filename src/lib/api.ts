import "server-only"
import { auth } from "@/lib/auth"
import type { ApiGoal } from "@/lib/goal-types"

export type { ApiGoal, ApiAgent, ApiActivityItem } from "@/lib/goal-types"

const API_URL = process.env.API_URL ?? "http://localhost:8000"

async function internalHeaders(): Promise<HeadersInit | null> {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) return null
  return {
    "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
    "x-user-id": session.user.id,
    "x-user-email": session.user.email,
    ...(session.user.name ? { "x-user-name": session.user.name } : {}),
  }
}

export async function fetchGoals(): Promise<ApiGoal[]> {
  const headers = await internalHeaders()
  if (!headers) return []
  try {
    const res = await fetch(`${API_URL}/api/v1/goals`, { headers, cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function fetchGoal(id: string): Promise<ApiGoal | null> {
  const headers = await internalHeaders()
  if (!headers) return null
  try {
    const res = await fetch(`${API_URL}/api/v1/goals/${id}`, { headers, cache: "no-store" })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}
