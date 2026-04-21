"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { ApiIntegration } from "@/lib/goal-types"
import { Check, Plus } from "lucide-react"

const CATEGORIES = ["all", "productivity", "health", "social", "commerce", "home", "communication"] as const
type Category = typeof CATEGORIES[number]

export default function ToolsClient({ integrations }: { integrations: ApiIntegration[] }) {
  const [category, setCategory] = useState<Category>("all")
  const [tools, setTools] = useState(integrations)

  const filtered = tools.filter(t => category === "all" || t.category === category)
  const connected = tools.filter(t => t.connected).length

  function toggle(toolId: string) {
    setTools(prev => prev.map(t => t.toolId === toolId ? { ...t, connected: !t.connected } : t))
  }

  return (
    <div style={{ minHeight: "100dvh", padding: "24px", maxWidth: "900px" }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.75rem", fontWeight: 400, color: "var(--app-text-1)", margin: 0 }}>
            Tools & integrations
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--app-text-3)", marginTop: "4px" }}>
            {connected} connected · {tools.length} available — agents can only use tools you permit
          </p>
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              padding: "7px 14px", borderRadius: "99px", fontSize: "0.78rem",
              background: category === c ? "var(--app-teal)" : "var(--app-card)",
              border: "1px solid var(--app-border)",
              color: category === c ? "#070f1c" : "var(--app-text-2)",
              cursor: "pointer", fontWeight: category === c ? 600 : 400,
              textTransform: "capitalize", flexShrink: 0,
            }}>
              {c}
            </button>
          ))}
        </div>

        {/* Tools grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
          {filtered.map((tool, i) => (
            <motion.div
              key={tool.toolId}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              style={{
                background: "var(--app-card)",
                border: tool.connected ? "1px solid rgba(62,207,198,0.25)" : "1px solid var(--app-border)",
                borderRadius: "var(--radius, 12px)", padding: "16px",
                display: "flex", flexDirection: "column", gap: "12px",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                  fontSize: "1.5rem", width: "44px", height: "44px",
                  background: "var(--app-surface)", borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>{tool.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--app-text-1)" }}>{tool.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--app-text-3)", marginTop: "2px", textTransform: "capitalize" }}>
                    {tool.category}
                  </div>
                </div>
                <button onClick={() => toggle(tool.toolId)} style={{
                  padding: "6px 12px", borderRadius: "6px",
                  background: tool.connected ? "rgba(62,207,198,0.12)" : "var(--app-surface)",
                  border: tool.connected ? "1px solid rgba(62,207,198,0.3)" : "1px solid var(--app-border)",
                  color: tool.connected ? "#3ecfc6" : "var(--app-text-3)",
                  cursor: "pointer", fontSize: "0.72rem", fontWeight: 600,
                  display: "flex", alignItems: "center", gap: "4px",
                }}>
                  {tool.connected ? <><Check size={11} /> On</> : <><Plus size={11} /> Add</>}
                </button>
              </div>

              {/* Description */}
              <p style={{ fontSize: "0.78rem", color: "var(--app-text-2)", margin: 0, lineHeight: 1.5 }}>
                {tool.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
