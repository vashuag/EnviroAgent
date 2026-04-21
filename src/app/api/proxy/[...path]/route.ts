import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.API_URL ?? "http://localhost:8000"

async function proxy(req: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const downstreamPath = req.nextUrl.pathname.replace(/^\/api\/proxy/, "")
  const targetUrl = `${API_URL}${downstreamPath}${req.nextUrl.search}`

  // Build a clean header set — no cookie or host leakage
  const headers = new Headers()
  headers.set("content-type", req.headers.get("content-type") ?? "application/json")
  headers.set("x-internal-secret", process.env.INTERNAL_API_SECRET ?? "")
  headers.set("x-user-id", session.user.id)
  headers.set("x-user-email", session.user.email)
  if (session.user.name) headers.set("x-user-name", session.user.name)

  let body: BodyInit | null = null
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.blob()
  }

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
  })

  const responseHeaders = new Headers(upstream.headers)
  responseHeaders.delete("content-encoding")
  responseHeaders.delete("content-length")

  const responseBody = await upstream.arrayBuffer()
  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: responseHeaders,
  })
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const PATCH = proxy
export const DELETE = proxy
