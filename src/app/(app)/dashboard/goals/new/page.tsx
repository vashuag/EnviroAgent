"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { TOOLS } from "@/components/app/mock-data"

const STEPS = ["Define", "Horizon", "Tools", "Meet your agent"]

const CATEGORIES = [
  { emoji: "🏃", label: "Fitness & Health", value: "fitness" },
  { emoji: "💼", label: "Career & Work", value: "career" },
  { emoji: "💰", label: "Finance & Saving", value: "finance" },
  { emoji: "📚", label: "Learning & Skills", value: "learning" },
  { emoji: "🎨", label: "Creative & Projects", value: "creative" },
  { emoji: "🌱", label: "Personal growth", value: "general" },
]

const TODAY = new Date()

export default function NewGoalPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    emoji: "🌱",
    horizon: "90",
    toolIds: [] as string[],
  })

  function nextStep() { if (step < STEPS.length - 1) setStep(s => s + 1) }
  function prevStep() { if (step > 0) setStep(s => s - 1) }

  function toggleTool(id: string) {
    setForm(f => ({
      ...f,
      toolIds: f.toolIds.includes(id) ? f.toolIds.filter(t => t !== id) : [...f.toolIds, id],
    }))
  }

  const canNext = [
    form.title.trim().length > 3 && form.category,
    form.horizon && Number(form.horizon) > 0,
    true,
    true,
  ][step]

  return (
    <div style={{ minHeight: "100dvh", padding: "24px", maxWidth: "640px", margin: "0 auto" }}>
      <Link href="/dashboard/goals" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--app-text-3)", fontSize: "0.8rem", textDecoration: "none", marginBottom: "28px" }}>
        <ArrowLeft size={14} /> Back to commitments
      </Link>

      {/* Progress */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "32px" }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{
              height: "3px", borderRadius: "99px",
              background: i <= step ? "var(--app-teal)" : "var(--app-border)",
              transition: "background 0.3s",
            }} />
            <span style={{
              fontSize: "0.65rem", color: i === step ? "var(--app-teal)" : "var(--app-text-3)",
              fontWeight: i === step ? 600 : 400,
            }}>{s}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {/* Step 0: Define */}
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.75rem", fontWeight: 400, color: "var(--app-text-1)", margin: 0 }}>
                What&apos;s your commitment?
              </h1>
              <p style={{ fontSize: "0.875rem", color: "var(--app-text-3)", margin: 0, lineHeight: 1.6 }}>
                Think of this as a promise to yourself — specific, meaningful, with a clear horizon.
              </p>

              <div>
                <label style={labelStyle}>Commitment title</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Get fit in 3 months"
                  style={inputStyle}
                  autoFocus
                />
              </div>

              <div>
                <label style={labelStyle}>Why does this matter? <span style={{ opacity: 0.5 }}>(optional)</span></label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe what success looks like…"
                  rows={3}
                  style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }}
                />
              </div>

              <div>
                <label style={labelStyle}>Category</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {CATEGORIES.map(cat => (
                    <button key={cat.value} onClick={() => setForm(f => ({ ...f, category: cat.value, emoji: cat.emoji }))} style={{
                      padding: "12px 14px", display: "flex", alignItems: "center", gap: "8px",
                      background: form.category === cat.value ? "rgba(62,207,198,0.12)" : "var(--app-card)",
                      border: form.category === cat.value ? "1px solid rgba(62,207,198,0.4)" : "1px solid var(--app-border)",
                      borderRadius: "8px", cursor: "pointer", color: "var(--app-text-1)",
                      fontSize: "0.85rem", fontWeight: form.category === cat.value ? 500 : 400,
                    }}>
                      <span style={{ fontSize: "1.1rem" }}>{cat.emoji}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Horizon */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.75rem", fontWeight: 400, color: "var(--app-text-1)", margin: 0 }}>
                Set your horizon
              </h1>
              <p style={{ fontSize: "0.875rem", color: "var(--app-text-3)", margin: 0, lineHeight: 1.6 }}>
                A commitment needs a deadline to be real. How many days until you want to achieve this?
              </p>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {["30", "60", "90", "180", "365"].map(d => (
                  <button key={d} onClick={() => setForm(f => ({ ...f, horizon: d }))} style={{
                    padding: "10px 20px",
                    background: form.horizon === d ? "var(--app-teal)" : "var(--app-card)",
                    border: "1px solid var(--app-border)",
                    borderRadius: "8px", cursor: "pointer",
                    color: form.horizon === d ? "#070f1c" : "var(--app-text-1)",
                    fontWeight: form.horizon === d ? 600 : 400,
                    fontSize: "0.9rem",
                  }}>
                    {d} days
                  </button>
                ))}
              </div>

              <div>
                <label style={labelStyle}>Or enter custom days</label>
                <input
                  type="number"
                  value={form.horizon}
                  onChange={e => setForm(f => ({ ...f, horizon: e.target.value }))}
                  min="7" max="730"
                  style={{ ...inputStyle, width: "140px" }}
                />
              </div>

              {form.horizon && (
                <div style={{ background: "var(--app-card)", borderRadius: "10px", padding: "16px", border: "1px solid var(--app-border)" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--app-text-3)", marginBottom: "8px" }}>Your horizon</div>
                  <div style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.25rem", color: "var(--app-text-1)" }}>
                    {form.emoji} {form.title || "Your commitment"}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--app-text-2)", marginTop: "6px" }}>
                    {form.horizon} days · ends {new Date(TODAY.getTime() + Number(form.horizon) * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Tools */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.75rem", fontWeight: 400, color: "var(--app-text-1)", margin: 0 }}>
                Give your agent tools
              </h1>
              <p style={{ fontSize: "0.875rem", color: "var(--app-text-3)", margin: 0, lineHeight: 1.6 }}>
                Your agent can only act through tools you permit. Start with a few — you can add more later.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {TOOLS.map(tool => {
                  const selected = form.toolIds.includes(tool.id)
                  return (
                    <button key={tool.id} onClick={() => toggleTool(tool.id)} style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "12px 14px", textAlign: "left",
                      background: selected ? "rgba(62,207,198,0.08)" : "var(--app-card)",
                      border: selected ? "1px solid rgba(62,207,198,0.3)" : "1px solid var(--app-border)",
                      borderRadius: "8px", cursor: "pointer",
                    }}>
                      <span style={{ fontSize: "1.25rem", width: "32px", textAlign: "center" }}>{tool.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--app-text-1)" }}>{tool.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--app-text-3)" }}>{tool.description}</div>
                      </div>
                      <div style={{
                        width: "20px", height: "20px", borderRadius: "50%",
                        background: selected ? "var(--app-teal)" : "transparent",
                        border: selected ? "2px solid var(--app-teal)" : "2px solid var(--app-border)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {selected && <Check size={12} color="#070f1c" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Meet your agent */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.75rem", fontWeight: 400, color: "var(--app-text-1)", margin: 0 }}>
                Meet your agent
              </h1>
              <p style={{ fontSize: "0.875rem", color: "var(--app-text-3)", margin: 0, lineHeight: 1.6 }}>
                A dedicated AI agent has been assigned to your commitment. It will act on your behalf, within the tools you granted access to.
              </p>

              <div style={{
                background: "var(--app-card)", border: "1px solid var(--app-border)",
                borderRadius: "12px", padding: "24px", textAlign: "center",
              }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  background: "var(--app-surface)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2rem", margin: "0 auto 14px",
                  boxShadow: "0 0 0 3px rgba(62,207,198,0.3)",
                }} className="agent-active">
                  {form.emoji}
                </div>
                <div style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.25rem", color: "var(--app-text-1)", marginBottom: "6px" }}>
                  {form.title || "Your commitment"} Agent
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--app-text-2)", marginBottom: "16px" }}>
                  Dedicated · Available 24/7 · Consent-based
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>
                  {TOOLS.filter(t => form.toolIds.includes(t.id)).map(t => (
                    <span key={t.id} style={{
                      fontSize: "0.75rem", padding: "4px 10px",
                      background: "var(--app-surface)", borderRadius: "99px",
                      border: "1px solid var(--app-border)", color: "var(--app-text-2)",
                    }}>
                      {t.icon} {t.name}
                    </span>
                  ))}
                  {form.toolIds.length === 0 && (
                    <span style={{ fontSize: "0.8rem", color: "var(--app-text-3)" }}>No tools selected yet</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
        <button onClick={prevStep} disabled={step === 0} style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "10px 18px", background: "var(--app-card)",
          border: "1px solid var(--app-border)", borderRadius: "8px",
          color: "var(--app-text-2)", cursor: step === 0 ? "not-allowed" : "pointer",
          opacity: step === 0 ? 0.4 : 1, fontSize: "0.875rem",
        }}>
          <ArrowLeft size={15} /> Back
        </button>

        {step < STEPS.length - 1 ? (
          <button onClick={nextStep} disabled={!canNext} style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "10px 20px", background: canNext ? "var(--app-teal)" : "var(--app-border)",
            border: "none", borderRadius: "8px",
            color: canNext ? "#070f1c" : "var(--app-text-3)", cursor: canNext ? "pointer" : "not-allowed",
            fontSize: "0.875rem", fontWeight: 600,
          }}>
            Continue <ArrowRight size={15} />
          </button>
        ) : (
          <button onClick={() => router.push("/dashboard")} style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "10px 20px", background: "var(--app-teal)",
            border: "none", borderRadius: "8px",
            color: "#070f1c", cursor: "pointer",
            fontSize: "0.875rem", fontWeight: 600,
          }}>
            <Check size={15} /> Launch commitment
          </button>
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.78rem", fontWeight: 500,
  color: "var(--app-text-3)", marginBottom: "6px",
  textTransform: "uppercase", letterSpacing: "0.06em",
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px",
  background: "var(--app-card)", border: "1px solid var(--app-border)",
  borderRadius: "8px", color: "var(--app-text-1)", fontSize: "0.9rem",
  outline: "none", boxSizing: "border-box",
}
