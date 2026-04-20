"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { GoalCard } from "@/components/app/goal-card"
import { useShell } from "@/components/app/shell-context"
import { GOALS, AGENTS, ACTIVITY, TYPE_COLORS, TYPE_BG } from "@/components/app/mock-data"
import { Plus, LayoutGrid, AlignLeft, Columns3 } from "lucide-react"
import Link from "next/link"

const LAYOUTS = [
  { id: "magazine", icon: LayoutGrid,  label: "Magazine" },
  { id: "focus",    icon: AlignLeft,   label: "Focus" },
  { id: "stream",   icon: Columns3,    label: "Stream" },
] as const

type Layout = "magazine" | "focus" | "stream"
type CardStyle = "horizon" | "ring" | "minimal"

export default function DashboardHome() {
  const { data: session } = useSession()
  const { ageMode } = useShell()
  const [layout, setLayout] = useState<Layout>("magazine")
  const [cardStyle, setCardStyle] = useState<CardStyle>("horizon")

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
  const firstName = session?.user?.name?.split(" ")[0] ?? "there"

  const activeGoals = GOALS.filter(g => g.status === "active")
  const totalActionsToday = AGENTS.reduce((s, a) => s + a.actionsToday, 0)
  const recentActivity = ACTIVITY.slice(0, 5)

  return (
    <div style={{ minHeight: "100dvh", padding: ageMode === "senior" ? "32px" : "24px", maxWidth: "1100px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: "28px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{
              fontFamily: "var(--font-display, serif)",
              fontSize: ageMode === "senior" ? "2.25rem" : ageMode === "kid" ? "2rem" : "1.875rem",
              fontWeight: 400,
              color: "var(--app-text-1)",
              margin: 0,
              lineHeight: 1.2,
            }}>
              {greeting}, {firstName}.
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--app-text-3)", marginTop: "4px" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Card style toggle */}
            <div style={{ display: "flex", background: "var(--app-card)", borderRadius: "8px", border: "1px solid var(--app-border)", overflow: "hidden" }}>
              {(["horizon", "ring", "minimal"] as CardStyle[]).map(s => (
                <button key={s} onClick={() => setCardStyle(s)} style={{
                  padding: "6px 12px",
                  fontSize: "0.75rem",
                  background: cardStyle === s ? "var(--app-teal)" : "transparent",
                  color: cardStyle === s ? "#070f1c" : "var(--app-text-3)",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: cardStyle === s ? 600 : 400,
                  transition: "all 0.15s",
                  textTransform: "capitalize",
                }}>
                  {s}
                </button>
              ))}
            </div>

            {/* Layout toggle */}
            <div style={{ display: "flex", background: "var(--app-card)", borderRadius: "8px", border: "1px solid var(--app-border)", overflow: "hidden" }}>
              {LAYOUTS.map(({ id, icon: Icon }) => (
                <button key={id} onClick={() => setLayout(id)} title={id} style={{
                  padding: "6px 10px",
                  background: layout === id ? "rgba(62,207,198,0.15)" : "transparent",
                  color: layout === id ? "var(--app-teal)" : "var(--app-text-3)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}>
                  <Icon size={15} />
                </button>
              ))}
            </div>

            {/* New commitment */}
            <Link href="/dashboard/goals/new" style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: "var(--app-teal)",
              color: "#070f1c",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}>
              <Plus size={16} />
              New commitment
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}
      >
        {[
          { label: "Active commitments", value: activeGoals.length, color: "#3ecfc6" },
          { label: "Agent actions today", value: totalActionsToday, color: "#a78bfa" },
          { label: "Tools connected", value: 6, color: "#fbbf24" },
        ].map((stat, i) => (
          <div key={i} style={{
            background: "var(--app-card)",
            border: "1px solid var(--app-border)",
            borderRadius: "var(--radius, 12px)",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}>
            <span style={{ fontSize: ageMode === "senior" ? "2rem" : "1.75rem", fontWeight: 700, color: stat.color, lineHeight: 1 }}>
              {stat.value}
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--app-text-3)" }}>{stat.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Main content */}
      <div style={{
        display: "grid",
        gridTemplateColumns: layout === "focus" ? "1fr" : layout === "stream" ? "1fr 1fr 1fr" : "1fr 1fr",
        gap: "16px",
        alignItems: "start",
      }}>
        {/* Goals */}
        <div style={{ gridColumn: layout === "magazine" ? "1" : layout === "focus" ? "1" : "1 / -1", display: "flex", flexDirection: "column", gap: "12px" }}>
          {layout !== "stream" && (
            <SectionHeader>Your commitments</SectionHeader>
          )}
          {layout === "stream"
            ? activeGoals.map((goal, i) => (
                <motion.div key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                  <GoalCard goal={goal} style={cardStyle} compact />
                </motion.div>
              ))
            : activeGoals.map((goal, i) => (
                <motion.div key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.07 }}>
                  <GoalCard goal={goal} style={cardStyle} compact={layout === "focus"} />
                </motion.div>
              ))
          }

          {/* Empty state */}
          {activeGoals.length === 0 && (
            <div style={{
              background: "var(--app-card)",
              border: "1px dashed var(--app-border)",
              borderRadius: "var(--radius, 12px)",
              padding: "40px",
              textAlign: "center",
              color: "var(--app-text-3)",
            }}>
              <span style={{ fontSize: "2rem", display: "block", marginBottom: "12px" }}>🌱</span>
              <p style={{ margin: 0 }}>No active commitments yet.</p>
              <Link href="/dashboard/goals/new" style={{ color: "var(--app-teal)", marginTop: "8px", display: "inline-block", fontSize: "0.875rem" }}>
                Create your first one →
              </Link>
            </div>
          )}
        </div>

        {/* Right panel — Activity + Agents (magazine layout) */}
        {layout === "magazine" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Agents status */}
            <div style={{
              background: "var(--app-card)",
              border: "1px solid var(--app-border)",
              borderRadius: "var(--radius, 12px)",
              padding: "16px 20px",
            }}>
              <SectionHeader>Agents</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                {AGENTS.map(agent => {
                  const goal = GOALS.find(g => g.id === agent.goalId)
                  return (
                    <div key={agent.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: "var(--app-surface)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.1rem",
                        ...(agent.status === "working" ? { boxShadow: `0 0 0 2px #3ecfc630` } : {}),
                      }} className={agent.status === "working" ? "agent-active" : ""}>
                        {agent.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--app-text-1)" }}>{agent.name}</span>
                          <span style={{
                            fontSize: "0.65rem", padding: "1px 6px", borderRadius: "99px",
                            background: agent.status === "working" ? "rgba(62,207,198,0.15)" : "rgba(255,255,255,0.05)",
                            color: agent.status === "working" ? "#3ecfc6" : "var(--app-text-3)",
                          }}>{agent.status}</span>
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--app-text-3)", marginTop: "1px" }}>
                          {goal?.emoji} {goal?.title}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent activity */}
            <div style={{
              background: "var(--app-card)",
              border: "1px solid var(--app-border)",
              borderRadius: "var(--radius, 12px)",
              padding: "16px 20px",
            }}>
              <SectionHeader>Today&apos;s activity</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                {recentActivity.map(item => (
                  <div key={item.id} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{
                      fontSize: "0.65rem", padding: "2px 7px", borderRadius: "99px",
                      background: TYPE_BG[item.type],
                      color: TYPE_COLORS[item.type],
                      flexShrink: 0,
                      marginTop: "2px",
                      fontWeight: 500,
                      textTransform: "capitalize",
                    }}>{item.type}</span>
                    <div>
                      <p style={{ fontSize: "0.78rem", color: "var(--app-text-1)", margin: 0, lineHeight: 1.4 }}>{item.action}</p>
                      <p style={{ fontSize: "0.7rem", color: "var(--app-text-3)", margin: "2px 0 0" }}>{item.agentName} · {formatTime(item.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/activity" style={{ fontSize: "0.78rem", color: "var(--app-teal)", display: "block", marginTop: "14px" }}>
                View all activity →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: "0.7rem",
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--app-text-3)",
      margin: 0,
    }}>{children}</h2>
  )
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
}
