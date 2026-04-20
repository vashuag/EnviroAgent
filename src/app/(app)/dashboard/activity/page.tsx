"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ACTIVITY, GOALS, TYPE_COLORS, TYPE_BG } from "@/components/app/mock-data"
import Link from "next/link"

const TYPES = ["all", "scheduled", "drafted", "blocked", "nudged", "logged", "updated"] as const
type ActivityType = typeof TYPES[number]

function groupByDate(items: typeof ACTIVITY) {
  const groups: Record<string, typeof ACTIVITY> = {}
  for (const item of items) {
    const date = new Date(item.timestamp).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })
    if (!groups[date]) groups[date] = []
    groups[date].push(item)
  }
  return groups
}

export default function ActivityPage() {
  const [filter, setFilter] = useState<ActivityType>("all")
  const [goalFilter, setGoalFilter] = useState<string>("all")

  const filtered = ACTIVITY.filter(a =>
    (filter === "all" || a.type === filter) &&
    (goalFilter === "all" || a.goalId === goalFilter)
  )

  const grouped = groupByDate(filtered)

  return (
    <div style={{ minHeight: "100dvh", padding: "24px", maxWidth: "800px" }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.75rem", fontWeight: 400, color: "var(--app-text-1)", margin: 0 }}>
            Activity timeline
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--app-text-3)", marginTop: "4px" }}>
            Every action your agents take, timestamped and transparent
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {/* Type filter */}
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {TYPES.map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{
                padding: "5px 11px", borderRadius: "99px", fontSize: "0.72rem",
                background: filter === t ? (t === "all" ? "var(--app-teal)" : TYPE_BG[t]) : "var(--app-card)",
                border: filter === t ? (t === "all" ? "1px solid var(--app-teal)" : `1px solid ${TYPE_COLORS[t]}40`) : "1px solid var(--app-border)",
                color: filter === t ? (t === "all" ? "#070f1c" : TYPE_COLORS[t]) : "var(--app-text-3)",
                cursor: "pointer", fontWeight: filter === t ? 600 : 400, textTransform: "capitalize",
              }}>{t}</button>
            ))}
          </div>

          {/* Goal filter */}
          <select value={goalFilter} onChange={e => setGoalFilter(e.target.value)} style={{
            padding: "5px 10px", background: "var(--app-card)", border: "1px solid var(--app-border)",
            borderRadius: "8px", color: "var(--app-text-2)", fontSize: "0.78rem", cursor: "pointer", outline: "none",
          }}>
            <option value="all">All commitments</option>
            {GOALS.map(g => <option key={g.id} value={g.id}>{g.emoji} {g.title}</option>)}
          </select>
        </div>

        {/* Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              {/* Date header */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", color: "var(--app-text-3)", textTransform: "uppercase" }}>{date}</span>
                <div style={{ flex: 1, height: "1px", background: "var(--app-border)" }} />
                <span style={{ fontSize: "0.68rem", color: "var(--app-text-3)" }}>{items.length} action{items.length !== 1 ? "s" : ""}</span>
              </div>

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      display: "flex", gap: "12px", alignItems: "flex-start",
                      padding: "12px 14px",
                      background: "var(--app-card)", borderRadius: "8px",
                      border: "1px solid var(--app-border)",
                    }}
                  >
                    {/* Type badge */}
                    <span style={{
                      fontSize: "0.62rem", padding: "2px 7px", borderRadius: "99px",
                      background: TYPE_BG[item.type], color: TYPE_COLORS[item.type],
                      flexShrink: 0, marginTop: "1px", fontWeight: 600,
                      textTransform: "capitalize", whiteSpace: "nowrap",
                    }}>{item.type}</span>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.85rem", color: "var(--app-text-1)", margin: 0, lineHeight: 1.4, fontWeight: 500 }}>
                        {item.action}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "var(--app-text-3)", margin: "3px 0 0", lineHeight: 1.4 }}>
                        {item.details}
                      </p>
                      <div style={{ display: "flex", gap: "10px", marginTop: "6px", alignItems: "center" }}>
                        <span style={{ fontSize: "0.68rem", color: "var(--app-text-3)" }}>{item.agentName}</span>
                        <span style={{ width: "2px", height: "2px", borderRadius: "50%", background: "var(--app-text-3)" }} />
                        <Link href={`/dashboard/goals/${item.goalId}`} style={{ fontSize: "0.68rem", color: "var(--app-teal)", textDecoration: "none" }}>
                          {GOALS.find(g => g.id === item.goalId)?.emoji} {item.goalTitle}
                        </Link>
                      </div>
                    </div>

                    {/* Time */}
                    <span style={{ fontSize: "0.68rem", color: "var(--app-text-3)", flexShrink: 0, fontFamily: "var(--font-mono, monospace)" }}>
                      {new Date(item.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--app-text-3)", background: "var(--app-card)", borderRadius: "var(--radius, 12px)", border: "1px dashed var(--app-border)" }}>
              <span style={{ fontSize: "2rem", display: "block", marginBottom: "10px" }}>🔍</span>
              No activity matching this filter.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
