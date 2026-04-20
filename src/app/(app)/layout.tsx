"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app/sidebar"
import { AppShellContext } from "@/components/app/shell-context"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [ageMode, setAgeMode] = useState<"kid" | "adult" | "senior">("adult")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [density, setDensity] = useState<"compact" | "balanced" | "spacious">("balanced")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin")
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#070f1c" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" style={{ borderColor: "#3ecfc6", borderTopColor: "transparent" }} />
          <span style={{ color: "#6a90b8", fontSize: "0.875rem" }}>Loading your environment…</span>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") return null

  return (
    <AppShellContext.Provider value={{ theme, setTheme, ageMode, setAgeMode, density, setDensity, sidebarOpen, setSidebarOpen }}>
      <div
        className="app-shell flex min-h-screen"
        data-theme={theme}
        data-age={ageMode}
      >
        <AppSidebar />
        <main className="flex-1 min-w-0 transition-all duration-300" style={{ marginLeft: sidebarOpen ? "0" : "0" }}>
          {children}
        </main>
      </div>
    </AppShellContext.Provider>
  )
}
