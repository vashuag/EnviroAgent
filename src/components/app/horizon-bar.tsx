"use client"

interface HorizonBarProps {
  daysElapsed: number
  totalDays: number
  progress: number
  color: string
  compact?: boolean
}

export function HorizonBar({ daysElapsed, totalDays, progress, color, compact }: HorizonBarProps) {
  const timePercent = Math.round((daysElapsed / totalDays) * 100)
  const daysRemaining = totalDays - daysElapsed

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? "6px" : "8px" }}>
      {!compact && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--app-text-3)" }}>
          <span>Day {daysElapsed} <span style={{ color: "var(--app-text-3)", opacity: 0.6 }}>of {totalDays}</span></span>
          <span style={{ color: "var(--app-text-2)" }}>{daysRemaining} days left</span>
        </div>
      )}

      {/* Time elapsed track */}
      <div style={{ position: "relative" }}>
        <div style={{
          height: compact ? "4px" : "6px",
          borderRadius: "99px",
          background: "var(--app-border, rgba(255,255,255,0.08))",
          overflow: "visible",
          position: "relative",
        }}>
          {/* Time bar (muted) */}
          <div style={{
            position: "absolute",
            inset: 0,
            width: `${timePercent}%`,
            borderRadius: "99px",
            background: `${color}30`,
          }} />
          {/* Progress bar (bright) */}
          <div
            className="horizon-bar-fill"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: `${progress}%`,
              borderRadius: "99px",
              background: color,
              boxShadow: `0 0 8px ${color}80`,
            }}
          />
          {/* Horizon marker (current day) */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: `${timePercent}%`,
            transform: "translate(-50%, -50%)",
            width: compact ? "8px" : "10px",
            height: compact ? "8px" : "10px",
            borderRadius: "50%",
            background: "var(--app-bg)",
            border: `2px solid ${color}`,
            boxShadow: `0 0 6px ${color}`,
            zIndex: 2,
          }} />
        </div>
      </div>

      {!compact && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--app-text-3)" }}>
          <span>Progress: <span style={{ color, fontWeight: 600 }}>{progress}%</span></span>
          <span style={{ opacity: 0.5 }}>Time used: {timePercent}%</span>
        </div>
      )}
    </div>
  )
}
