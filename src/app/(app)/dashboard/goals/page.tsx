"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GoalCard } from "@/components/app/goal-card"
import { GOALS } from "@/components/app/mock-data"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

export default function GoalsPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "paused" | "completed">("all")
  const [cardStyle, setCardStyle] = useState<"horizon" | "ring" | "minimal">("horizon")

  const filtered = GOALS.filter(g =>
    (filter === "all" || g.status === filter) &&
    g.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: "100dvh", padding: "24px", maxWidth: "900px" }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.75rem", fontWeight: 400, color: "var(--app-text-1)", margin: 0 }}>
              Your commitments
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--app-text-3)", marginTop: "4px" }}>
              {GOALS.filter(g => g.status === "active").length} active · {GOALS.length} total
            </p>
          </div>
          <Link href="/dashboard/goals/new" style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 16px", background: "var(--app-teal)", color: "#070f1c",
            borderRadius: "8px", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600,
          }}>
            <Plus size={16} /> New commitment
          </Link>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--app-text-3)" }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search commitments…"
              style={{
                width: "100%", padding: "8px 10px 8px 32px",
                background: "var(--app-card)", border: "1px solid var(--app-border)",
                borderRadius: "8px", color: "var(--app-text-1)", fontSize: "0.875rem",
                outline: "none",
              }}
            />
          </div>

          {/* Status filter */}
          <div style={{ display: "flex", background: "var(--app-card)", borderRadius: "8px", border: "1px solid var(--app-border)", overflow: "hidden" }}>
            {(["all", "active", "paused", "completed"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "7px 12px", fontSize: "0.75rem", textTransform: "capitalize",
                background: filter === f ? "rgba(62,207,198,0.15)" : "transparent",
                color: filter === f ? "var(--app-teal)" : "var(--app-text-3)",
                border: "none", cursor: "pointer", fontWeight: filter === f ? 500 : 400,
              }}>{f}</button>
            ))}
          </div>

          {/* Card style */}
          <div style={{ display: "flex", background: "var(--app-card)", borderRadius: "8px", border: "1px solid var(--app-border)", overflow: "hidden" }}>
            {(["horizon", "ring", "minimal"] as const).map(s => (
              <button key={s} onClick={() => setCardStyle(s)} style={{
                padding: "7px 10px", fontSize: "0.75rem", textTransform: "capitalize",
                background: cardStyle === s ? "var(--app-teal)" : "transparent",
                color: cardStyle === s ? "#070f1c" : "var(--app-text-3)",
                border: "none", cursor: "pointer", fontWeight: cardStyle === s ? 600 : 400,
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Goals grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((goal, i) => (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <GoalCard goal={goal} style={cardStyle} />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div style={{
              padding: "60px 20px", textAlign: "center", color: "var(--app-text-3)",
              background: "var(--app-card)", borderRadius: "var(--radius, 12px)",
              border: "1px dashed var(--app-border)",
            }}>
              <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "12px" }}>🌱</span>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>No commitments found.</p>
              <Link href="/dashboard/goals/new" style={{ color: "var(--app-teal)", marginTop: "8px", display: "inline-block" }}>
                Make a new commitment →
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
