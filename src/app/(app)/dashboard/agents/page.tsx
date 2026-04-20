"use client"

import { motion } from "framer-motion"
import { AGENTS, GOALS, TOOLS, TYPE_COLORS } from "@/components/app/mock-data"
import Link from "next/link"

export default function AgentsPage() {
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
          {AGENTS.map((agent, i) => {
            const goal = GOALS.find(g => g.id === agent.goalId)
            const tools = TOOLS.filter(t => goal?.toolIds.includes(t.id))

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  background: "var(--app-card)", border: "1px solid var(--app-border)",
                  borderRadius: "var(--radius, 12px)", padding: "20px",
                  borderLeft: `3px solid ${goal?.color ?? "#3ecfc6"}`,
                }}
              >
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  {/* Avatar */}
                  <div style={{
                    width: "56px", height: "56px", borderRadius: "50%",
                    background: "var(--app-surface)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.5rem", flexShrink: 0,
                    boxShadow: agent.status === "working" ? `0 0 0 2px ${goal?.color ?? "#3ecfc6"}50` : "none",
                  }} className={agent.status === "working" ? "agent-active" : ""}>
                    {agent.avatar}
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
                    {goal && (
                      <Link href={`/dashboard/goals/${goal.id}`} style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        marginTop: "10px", fontSize: "0.8rem",
                        color: goal.color, textDecoration: "none",
                      }}>
                        {goal.emoji} {goal.title}
                      </Link>
                    )}

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
                    <div style={{
                      marginTop: "12px", padding: "8px 12px",
                      background: "var(--app-surface)", borderRadius: "6px",
                      fontSize: "0.78rem", color: "var(--app-text-2)",
                      borderLeft: `2px solid ${goal?.color ?? "#3ecfc6"}40`,
                    }}>
                      {agent.avatar} {agent.lastAction} <span style={{ color: "var(--app-text-3)" }}>· {agent.lastActionTime}</span>
                    </div>

                    {/* Tools */}
                    <div style={{ display: "flex", gap: "6px", marginTop: "12px", flexWrap: "wrap" }}>
                      {tools.map(t => (
                        <span key={t.id} style={{
                          fontSize: "0.72rem", padding: "3px 8px",
                          background: "var(--app-surface)", borderRadius: "4px",
                          border: "1px solid var(--app-border)", color: "var(--app-text-3)",
                        }}>
                          {t.icon} {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Orbit visualisation */}
                <AgentOrbit agent={agent} goal={goal} tools={tools} />
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

function AgentOrbit({ agent, goal, tools }: { agent: typeof AGENTS[0], goal: typeof GOALS[0] | undefined, tools: typeof TOOLS }) {
  if (tools.length === 0) return null

  return (
    <div style={{ marginTop: "16px", height: "80px", position: "relative", overflow: "hidden", opacity: 0.6 }}>
      {/* Center: agent */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        width: "36px", height: "36px", borderRadius: "50%",
        background: "var(--app-surface)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1rem",
        border: `1px solid ${goal?.color ?? "#3ecfc6"}40`,
      }}>
        {agent.avatar}
      </div>

      {/* Orbiting tools */}
      {tools.slice(0, 5).map((tool, i) => {
        const angle = (i / tools.length) * 360
        const r = 34
        const x = Math.cos((angle * Math.PI) / 180) * r
        const y = Math.sin((angle * Math.PI) / 180) * r
        return (
          <div
            key={tool.id}
            title={tool.name}
            style={{
              position: "absolute",
              left: `calc(50% + ${x}px - 12px)`,
              top: `calc(50% + ${y}px - 12px)`,
              width: "24px", height: "24px",
              borderRadius: "50%",
              background: "var(--app-surface)",
              border: "1px solid var(--app-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem",
            }}>
            {tool.icon}
          </div>
        )
      })}
    </div>
  )
}
