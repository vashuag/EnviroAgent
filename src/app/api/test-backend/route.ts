import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const API_URL = process.env.API_URL ?? "http://localhost:8000"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "No active session" }, { status: 401 })
  }

  const upstream = await fetch(`${API_URL}/api/v1/auth/me`, {
    headers: {
      "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
      "x-user-id": session.user.id,
      "x-user-email": session.user.email,
      ...(session.user.name ? { "x-user-name": session.user.name } : {}),
    },
  })

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}
