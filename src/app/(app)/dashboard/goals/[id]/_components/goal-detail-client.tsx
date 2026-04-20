"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { HorizonBar } from "@/components/app/horizon-bar"
import { TYPE_COLORS, TYPE_BG } from "@/components/app/mock-data"
import { type ApiGoal, daysElapsed, DEFAULT_COLOR } from "@/lib/goal-types"
import { ArrowLeft, MessageSquare, Send } from "lucide-react"
import Link from "next/link"

const SUGGESTED_PROMPTS = [
  "What did my agent do this week?",
  "Am I on track to hit my goal?",
  "What's blocking my progress?",
  "Adjust my plan for next week",
]

interface Props {
  goal: ApiGoal
}

export function GoalDetailClient({ goal }: Props) {
  const [message, setMessage] = useState("")
  const agent = goal.agent ?? null
  const activity = goal.activity ?? []
  const color = goal.color ?? DEFAULT_COLOR
  const elapsed = daysElapsed(goal.startDate)

  return (
    <div style={{ minHeight: "100dvh", padding: "24px", maxWidth: "900px" }}>
      {/* Back */}
      <Link href="/dashboard/goals" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--app-text-3)", fontSize: "0.8rem", textDecoration: "none", marginBottom: "20px" }}>
        <ArrowLeft size={14} /> Commitments
      </Link>

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
            <span style={{ fontSize: "2.5rem" }}>{goal.emoji ?? "🎯"}</span>
            <div>
              <h1 style={{
                fontFamily: "var(--font-display, serif)",
                fontSize: "1.75rem", fontWeight: 400,
                color: "var(--app-text-1)", margin: 0,
              }}>{goal.title}</h1>
              <p style={{ fontSize: "0.85rem", color: "var(--app-text-2)", marginTop: "4px" }}>{goal.description}</p>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Horizon */}
            <Section title="Commitment horizon">
              <div style={{ padding: "4px 0" }}>
                <HorizonBar daysElapsed={elapsed} totalDays={goal.totalDays} progress={goal.progress} color={color} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "16px" }}>
                {[
                  { label: "Started", value: fmtDate(goal.startDate) },
                  { label: "Horizon", value: fmtDate(goal.endDate) },
                  { label: "Progress", value: `${goal.progress}%`, color },
                ].map(m => (
                  <div key={m.label} style={{ background: "var(--app-surface)", borderRadius: "8px", padding: "12px 14px" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--app-text-3)", marginBottom: "4px" }}>{m.label}</div>
                    <div style={{ fontSize: "1rem", fontWeight: 600, color: m.color ?? "var(--app-text-1)" }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Agent */}
            {agent && (
              <Section title="Your agent">
                <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                  <div style={{
                    width: "52px", height: "52px", borderRadius: "50%",
                    background: "var(--app-surface)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.5rem",
                    boxShadow: "0 0 0 2px rgba(62,207,198,0.3)",
                  }} className="agent-active">
                    {agent.avatar ?? "🤖"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--app-text-1)", fontSize: "1rem" }}>{agent.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--app-text-2)", marginTop: "2px" }}>{agent.personality}</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#3ecfc6" }}>{agent.actionsToday}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--app-text-3)" }}>today</div>
                  </div>
                </div>
                {agent.lastAction && (
                  <div style={{
                    marginTop: "12px", padding: "10px 12px",
                    background: "var(--app-surface)", borderRadius: "8px",
                    fontSize: "0.78rem", color: "var(--app-text-2)",
                    borderLeft: "2px solid #3ecfc6",
                  }}>
                    {agent.avatar} {agent.lastAction}
                    {agent.lastActionTime && (
                      <span style={{ color: "var(--app-text-3)" }}> · {fmtTime(agent.lastActionTime)}</span>
                    )}
                  </div>
                )}
              </Section>
            )}

            {/* Activity */}
            <Section title={`Activity (${activity.length})`}>
              {activity.length === 0 ? (
                <p style={{ fontSize: "0.8rem", color: "var(--app-text-3)", margin: 0 }}>No activity yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {activity.map(item => (
                    <div key={item.id} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <span style={{
                        fontSize: "0.65rem", padding: "2px 7px", borderRadius: "99px",
                        background: TYPE_BG[item.type as keyof typeof TYPE_BG] ?? "rgba(255,255,255,0.05)",
                        color: TYPE_COLORS[item.type as keyof typeof TYPE_COLORS] ?? "var(--app-text-3)",
                        flexShrink: 0, marginTop: "2px", fontWeight: 500,
                        textTransform: "capitalize" as const,
                      }}>{item.type}</span>
                      <div>
                        <p style={{ fontSize: "0.8rem", color: "var(--app-text-1)", margin: 0, lineHeight: 1.4 }}>{item.action}</p>
                        <p style={{ fontSize: "0.7rem", color: "var(--app-text-3)", margin: "2px 0 0" }}>{item.details}</p>
                      </div>
                      <span style={{ fontSize: "0.68rem", color: "var(--app-text-3)", marginLeft: "auto", flexShrink: 0 }}>
                        {fmtTime(item.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* Right: Ask agent */}
          <div style={{
            background: "var(--app-card)", border: "1px solid var(--app-border)",
            borderRadius: "var(--radius, 12px)", padding: "16px",
            position: "sticky", top: "24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <MessageSquare size={15} color="var(--app-teal)" />
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--app-text-1)" }}>Ask {agent?.name ?? "your agent"}</span>
            </div>

            {/* Suggested prompts */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
              {SUGGESTED_PROMPTS.map(p => (
                <button key={p} onClick={() => setMessage(p)} style={{
                  textAlign: "left", padding: "8px 10px",
                  background: "var(--app-surface)", border: "1px solid var(--app-border)",
                  borderRadius: "6px", fontSize: "0.75rem", color: "var(--app-text-2)",
                  cursor: "pointer", lineHeight: 1.4,
                }}>{p}</button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Ask anything…"
                style={{
                  flex: 1, padding: "8px 10px",
                  background: "var(--app-surface)", border: "1px solid var(--app-border)",
                  borderRadius: "6px", fontSize: "0.8rem",
                  color: "var(--app-text-1)", outline: "none",
                }}
              />
              <button style={{
                padding: "8px 10px", background: "var(--app-teal)", border: "none",
                borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center",
              }}>
                <Send size={14} color="#070f1c" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--app-card)", border: "1px solid var(--app-border)", borderRadius: "var(--radius, 12px)", padding: "16px 20px" }}>
      <h2 style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--app-text-3)", margin: "0 0 14px" }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
}
