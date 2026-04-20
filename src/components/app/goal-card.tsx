"use client"

import Link from "next/link"
import { HorizonBar } from "./horizon-bar"
import { AGENTS, TOOLS, type Goal } from "./mock-data"

interface GoalCardProps {
  goal: Goal
  style?: "horizon" | "ring" | "minimal"
  compact?: boolean
}

export function GoalCard({ goal, style = "horizon", compact }: GoalCardProps) {
  const agent = AGENTS.find(a => a.goalId === goal.id)
  const tools = TOOLS.filter(t => goal.toolIds.includes(t.id))

  const cardStyle: React.CSSProperties = {
    background: "var(--app-card)",
    border: "1px solid var(--app-border)",
    borderRadius: "var(--radius, 12px)",
    padding: compact ? "16px" : "20px",
    display: "flex",
    flexDirection: "column",
    gap: compact ? "12px" : "16px",
    cursor: "pointer",
    transition: "border-color 0.15s, transform 0.15s",
    borderLeft: `3px solid ${goal.color}`,
    textDecoration: "none",
    color: "inherit",
  }

  if (style === "ring") {
    return (
      <Link href={`/dashboard/goals/${goal.id}`} style={cardStyle}>
        <RingCard goal={goal} agent={agent} tools={tools} compact={compact} />
      </Link>
    )
  }

  if (style === "minimal") {
    return (
      <Link href={`/dashboard/goals/${goal.id}`} style={{ ...cardStyle, padding: "14px 16px", gap: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.25rem" }}>{goal.emoji}</span>
            <div>
              <div style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--app-text-1)", lineHeight: 1.3 }}>{goal.title}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--app-text-3)", marginTop: "2px" }}>
                Day {goal.daysElapsed} of {goal.totalDays}
              </div>
            </div>
          </div>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: goal.color }}>{goal.progress}%</span>
        </div>
        <HorizonBar {...goal} compact />
      </Link>
    )
  }

  return (
    <Link href={`/dashboard/goals/${goal.id}`} style={cardStyle}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: compact ? "1.5rem" : "2rem" }}>{goal.emoji}</span>
          <div>
            <h3 style={{
              fontFamily: "var(--font-display, serif)",
              fontSize: compact ? "1rem" : "1.15rem",
              fontWeight: 400,
              color: "var(--app-text-1)",
              lineHeight: 1.3,
              margin: 0,
            }}>
              {goal.title}
            </h3>
            {!compact && (
              <p style={{ fontSize: "0.8rem", color: "var(--app-text-2)", marginTop: "4px", lineHeight: 1.4 }}>
                {goal.description}
              </p>
            )}
          </div>
        </div>
        <StatusBadge status={goal.status} />
      </div>

      {/* Horizon bar */}
      <HorizonBar {...goal} compact={compact} />

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Agent */}
        {agent && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{
              fontSize: "0.9rem",
              background: "var(--app-surface)",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>{agent.avatar}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--app-text-2)" }}>{agent.name}</span>
            {agent.status === "working" && (
              <span style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: "#3ecfc6",
                boxShadow: "0 0 4px #3ecfc6",
              }} />
            )}
          </div>
        )}

        {/* Tools */}
        <div style={{ display: "flex", gap: "4px" }}>
          {tools.slice(0, 4).map(t => (
            <span key={t.id} title={t.name} style={{
              fontSize: "0.75rem",
              background: "var(--app-surface)",
              borderRadius: "4px",
              padding: "2px 4px",
              border: "1px solid var(--app-border)",
            }}>{t.icon}</span>
          ))}
          {tools.length > 4 && (
            <span style={{ fontSize: "0.7rem", color: "var(--app-text-3)", padding: "2px 4px" }}>+{tools.length - 4}</span>
          )}
        </div>
      </div>

      {/* Last activity */}
      {!compact && (
        <div style={{
          fontSize: "0.75rem",
          color: "var(--app-text-3)",
          background: "var(--app-surface)",
          borderRadius: "6px",
          padding: "6px 10px",
          borderLeft: `2px solid ${goal.color}40`,
        }}>
          {agent?.avatar} {goal.lastActivity}
        </div>
      )}
    </Link>
  )
}

function RingCard({ goal, agent, tools, compact }: { goal: Goal, agent: ReturnType<typeof AGENTS.find>, tools: typeof TOOLS, compact?: boolean }) {
  const circumference = 2 * Math.PI * 28
  const dashOffset = circumference - (goal.progress / 100) * circumference

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Ring progress */}
        <div style={{ position: "relative", width: "64px", height: "64px", flexShrink: 0 }}>
          <svg width="64" height="64" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--app-border)" strokeWidth="4" />
            <circle
              cx="32" cy="32" r="28" fill="none"
              stroke={goal.color} strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 4px ${goal.color})` }}
            />
          </svg>
          <span style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem",
          }}>{goal.emoji}</span>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1rem", margin: 0, color: "var(--app-text-1)" }}>
            {goal.title}
          </h3>
          <div style={{ fontSize: "0.75rem", color: "var(--app-text-3)", marginTop: "4px" }}>
            Day {goal.daysElapsed}/{goal.totalDays} · <span style={{ color: goal.color, fontWeight: 600 }}>{goal.progress}%</span>
          </div>
        </div>
        <StatusBadge status={goal.status} />
      </div>
      {!compact && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {agent && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "0.9rem" }}>{agent.avatar}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--app-text-2)" }}>{agent.name}</span>
            </div>
          )}
          <div style={{ display: "flex", gap: "4px" }}>
            {tools.slice(0, 4).map(t => (
              <span key={t.id} title={t.name} style={{ fontSize: "0.75rem" }}>{t.icon}</span>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function StatusBadge({ status }: { status: Goal["status"] }) {
  const colors = { active: "#3ecfc6", paused: "#fbbf24", completed: "#34d399" }
  const labels = { active: "Active", paused: "Paused", completed: "Done" }
  return (
    <span style={{
      fontSize: "0.65rem",
      fontWeight: 600,
      padding: "2px 8px",
      borderRadius: "99px",
      background: `${colors[status]}20`,
      color: colors[status],
      border: `1px solid ${colors[status]}40`,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      flexShrink: 0,
    }}>
      {labels[status]}
    </span>
  )
}
