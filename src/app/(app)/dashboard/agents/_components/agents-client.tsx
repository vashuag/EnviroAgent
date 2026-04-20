"use client"

import { motion } from "framer-motion"
import { TYPE_COLORS } from "@/components/app/mock-data"
import type { ApiAgentWithGoal } from "@/lib/goal-types"
import Link from "next/link"

export default function AgentsClient({ agents }: { agents: ApiAgentWithGoal[] }) {
  return (
    <div style={{ minHeight: "100dvh", padding: "24px", maxWidth: "900px" }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.75rem", fontWeight: 400, color: "var(--app-text-1)", margin: 0 }}>
            Your agents
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--app-text-3)", marginTop: "4px" }}>
            One dedicated agent per commitment — always on, consent-based
          </p>
        </div>

        {/* How it works */}
        <div style={{
          background: "rgba(62,207,198,0.06)", border: "1px solid rgba(62,207,198,0.2)",
          borderRadius: "10px", padding: "14px 18px", marginBottom: "24px",
          display: "flex", gap: "12px", alignItems: "flex-start",
        }}>
          <span style={{ fontSize: "1.1rem" }}>🔮</span>
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#3ecfc6", marginBottom: "4px" }}>How agents work</div>
            <div style={{ fontSize: "0.8rem", color: "var(--app-text-2)", lineHeight: 1.6 }}>
              Each commitment spawns a dedicated agent. It can only use the tools you granted access to, and every action it takes is logged and reversible. Agents learn from your patterns over time.
            </div>
          </div>
        </div>

        {/* Agent cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                background: "var(--app-card)", border: "1px solid var(--app-border)",
                borderRadius: "var(--radius, 12px)", padding: "20px",
                borderLeft: `3px solid ${agent.goalColor ?? "#3ecfc6"}`,
              }}
            >
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                {/* Avatar */}
                <div style={{
                  width: "56px", height: "56px", borderRadius: "50%",
                  background: "var(--app-surface)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", flexShrink: 0,
                  boxShadow: agent.status === "working" ? `0 0 0 2px ${agent.goalColor ?? "#3ecfc6"}50` : "none",
                }} className={agent.status === "working" ? "agent-active" : ""}>
                  {agent.avatar ?? "🤖"}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--app-text-1)", margin: 0 }}>{agent.name}</h2>
                      <p style={{ fontSize: "0.78rem", color: "var(--app-text-2)", margin: "3px 0 0" }}>{agent.personality}</p>
                    </div>
                    <span style={{
                      fontSize: "0.65rem", padding: "3px 9px", borderRadius: "99px",
                      background: agent.status === "working" ? "rgba(62,207,198,0.15)" : "rgba(255,255,255,0.06)",
                      color: agent.status === "working" ? "#3ecfc6" : "var(--app-text-3)",
                      fontWeight: 500, textTransform: "capitalize",
                    }}>{agent.status}</span>
                  </div>

                  {/* Goal link */}
                  <Link href={`/dashboard/goals/${agent.goalId}`} style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    marginTop: "10px", fontSize: "0.8rem",
                    color: agent.goalColor ?? "#3ecfc6", textDecoration: "none",
                  }}>
                    {agent.goalEmoji} {agent.goalTitle}
                  </Link>

                  {/* Stats row */}
                  <div style={{ display: "flex", gap: "20px", marginTop: "14px" }}>
                    {[
                      { label: "Actions today", value: agent.actionsToday, color: TYPE_COLORS.scheduled },
                      { label: "Total actions", value: agent.totalActions, color: "var(--app-text-2)" },
                    ].map(stat => (
                      <div key={stat.label}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: stat.color }}>{stat.value}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--app-text-3)" }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Last action */}
                  {agent.lastAction && (
                    <div style={{
                      marginTop: "12px", padding: "8px 12px",
                      background: "var(--app-surface)", borderRadius: "6px",
                      fontSize: "0.78rem", color: "var(--app-text-2)",
                      borderLeft: `2px solid ${agent.goalColor ?? "#3ecfc6"}40`,
                    }}>
                      {agent.avatar ?? "🤖"} {agent.lastAction}{" "}
                      {agent.lastActionTime && (
                        <span style={{ color: "var(--app-text-3)" }}>
                          · {new Date(agent.lastActionTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {agents.length === 0 && (
            <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--app-text-3)", background: "var(--app-card)", borderRadius: "var(--radius, 12px)", border: "1px dashed var(--app-border)" }}>
              <span style={{ fontSize: "2rem", display: "block", marginBottom: "10px" }}>🤖</span>
              No agents yet. Create a commitment to spawn your first agent.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
