"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { TOOLS } from "@/components/app/mock-data"

const STEPS = [
  { title: "Welcome to EnviroAgent", subtitle: "Your AI that modifies your world to make you win" },
  { title: "Tell us about yourself", subtitle: "We adapt the experience to your needs" },
  { title: "Your first commitment", subtitle: "What do you want to achieve in the next few months?" },
  { title: "Connect your first tools", subtitle: "Your agent can only use tools you grant access to" },
  { title: "Your agent is ready", subtitle: "Meet the AI dedicated to your commitment" },
]

const EXAMPLE_GOALS = [
  { emoji: "🏃", text: "Get fit in 3 months" },
  { emoji: "💼", text: "Change careers" },
  { emoji: "💰", text: "Save money for travel" },
  { emoji: "📚", text: "Learn a new skill" },
  { emoji: "🌱", text: "Build a new habit" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [age, setAge] = useState<"kid" | "adult" | "senior">("adult")
  const [goal, setGoal] = useState("")
  const [customGoal, setCustomGoal] = useState("")
  const [tools, setTools] = useState<string[]>(["t1", "t4"])

  const effectiveGoal = customGoal || goal

  function next() {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else router.push("/dashboard")
  }

  const STARTER_TOOLS = TOOLS.slice(0, 6)

  return (
    <div style={{
      minHeight: "100dvh",
      background: "var(--app-bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }} data-theme="dark">

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "40px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "linear-gradient(135deg, #3ecfc6 0%, #1d8880 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <span style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", color: "var(--app-text-1)" }}>EnviroAgent</span>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "32px" }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            width: i === step ? "20px" : "6px", height: "6px",
            borderRadius: "99px",
            background: i <= step ? "#3ecfc6" : "rgba(255,255,255,0.12)",
            transition: "all 0.25s ease",
          }} />
        ))}
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "480px",
        background: "var(--app-card)", border: "1px solid var(--app-border)",
        borderRadius: "16px", padding: "32px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <h1 style={{
              fontFamily: "var(--font-display, serif)",
              fontSize: "1.6rem", fontWeight: 400,
              color: "var(--app-text-1)", margin: "0 0 6px",
              lineHeight: 1.25,
            }}>{STEPS[step].title}</h1>
            <p style={{ fontSize: "0.875rem", color: "var(--app-text-3)", margin: "0 0 24px", lineHeight: 1.5 }}>
              {STEPS[step].subtitle}
            </p>

            {/* Step 0: Welcome */}
            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{
                  background: "rgba(62,207,198,0.06)", border: "1px solid rgba(62,207,198,0.15)",
                  borderRadius: "10px", padding: "16px",
                  fontSize: "0.85rem", color: "var(--app-text-2)", lineHeight: 1.6,
                }}>
                  <strong style={{ color: "#3ecfc6", display: "block", marginBottom: "6px" }}>How it works</strong>
                  You make a commitment with a deadline. EnviroAgent deploys a dedicated AI agent for it. The agent uses your connected tools — calendar, apps, messages — to reshape your environment so your goal becomes inevitable.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                  {[
                    { emoji: "🎯", label: "One agent per goal" },
                    { emoji: "🔒", label: "Consent-based" },
                    { emoji: "📊", label: "Fully tracked" },
                  ].map(f => (
                    <div key={f.label} style={{
                      background: "var(--app-surface)", borderRadius: "8px", padding: "12px",
                      textAlign: "center", border: "1px solid var(--app-border)",
                    }}>
                      <span style={{ fontSize: "1.25rem", display: "block", marginBottom: "4px" }}>{f.emoji}</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--app-text-3)" }}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Profile */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>How old are you? <span style={{ opacity: 0.5 }}>(adapts the UI)</span></label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {(["kid", "adult", "senior"] as const).map(a => (
                      <button key={a} onClick={() => setAge(a)} style={{
                        flex: 1, padding: "12px", borderRadius: "8px",
                        background: age === a ? "rgba(62,207,198,0.12)" : "var(--app-surface)",
                        border: age === a ? "1px solid rgba(62,207,198,0.4)" : "1px solid var(--app-border)",
                        color: age === a ? "#3ecfc6" : "var(--app-text-2)",
                        cursor: "pointer", fontWeight: age === a ? 600 : 400, fontSize: "0.85rem",
                        textTransform: "capitalize",
                      }}>
                        <span style={{ display: "block", fontSize: "1.25rem", marginBottom: "4px" }}>
                          {a === "kid" ? "🧒" : a === "adult" ? "👤" : "👴"}
                        </span>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: First commitment */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {EXAMPLE_GOALS.map(g => (
                    <button key={g.text} onClick={() => { setGoal(g.text); setCustomGoal("") }} style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      padding: "10px 12px", borderRadius: "8px", textAlign: "left",
                      background: goal === g.text ? "rgba(62,207,198,0.12)" : "var(--app-surface)",
                      border: goal === g.text ? "1px solid rgba(62,207,198,0.4)" : "1px solid var(--app-border)",
                      color: "var(--app-text-1)", cursor: "pointer",
                      fontSize: "0.82rem",
                    }}>
                      <span style={{ fontSize: "1.1rem" }}>{g.emoji}</span>
                      {g.text}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1, height: "1px", background: "var(--app-border)" }} />
                  <span style={{ fontSize: "0.72rem", color: "var(--app-text-3)" }}>or write your own</span>
                  <div style={{ flex: 1, height: "1px", background: "var(--app-border)" }} />
                </div>
                <input
                  value={customGoal}
                  onChange={e => { setCustomGoal(e.target.value); setGoal("") }}
                  placeholder="Describe your commitment…"
                  style={inputStyle}
                />
              </div>
            )}

            {/* Step 3: Tools */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {STARTER_TOOLS.map(tool => {
                  const selected = tools.includes(tool.id)
                  return (
                    <button key={tool.id} onClick={() => setTools(prev => selected ? prev.filter(t => t !== tool.id) : [...prev, tool.id])} style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "10px 12px", textAlign: "left",
                      background: selected ? "rgba(62,207,198,0.08)" : "var(--app-surface)",
                      border: selected ? "1px solid rgba(62,207,198,0.3)" : "1px solid var(--app-border)",
                      borderRadius: "8px", cursor: "pointer",
                    }}>
                      <span style={{ fontSize: "1.1rem" }}>{tool.icon}</span>
                      <span style={{ flex: 1, fontSize: "0.82rem", color: "var(--app-text-1)" }}>{tool.name}</span>
                      {selected && <Check size={14} color="#3ecfc6" />}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Step 4: Agent ready */}
            {step === 4 && (
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  background: "var(--app-surface)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2rem", margin: "0 auto 16px",
                  boxShadow: "0 0 0 3px rgba(62,207,198,0.25), 0 0 24px rgba(62,207,198,0.1)",
                }} className="agent-active">
                  🤖
                </div>
                <div style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.15rem", color: "var(--app-text-1)", marginBottom: "8px" }}>
                  {effectiveGoal ? `Your ${effectiveGoal.toLowerCase().split(" ")[0]} agent` : "Your personal agent"}
                </div>
                {effectiveGoal && (
                  <div style={{ fontSize: "0.8rem", color: "var(--app-text-2)", marginBottom: "16px" }}>
                    Committed to: <em style={{ color: "#3ecfc6" }}>{effectiveGoal}</em>
                  </div>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>
                  {TOOLS.filter(t => tools.includes(t.id)).map(t => (
                    <span key={t.id} style={{
                      fontSize: "0.72rem", padding: "3px 9px",
                      background: "var(--app-surface)", borderRadius: "99px",
                      border: "1px solid var(--app-border)", color: "var(--app-text-2)",
                    }}>{t.icon} {t.name}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <button
          onClick={next}
          style={{
            marginTop: "24px", width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            padding: "13px 20px", background: "var(--app-teal)", border: "none",
            borderRadius: "10px", color: "#070f1c", fontSize: "0.95rem",
            fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 16px rgba(62,207,198,0.25)",
          }}
        >
          {step < STEPS.length - 1 ? (
            <>{step === 0 ? "Get started" : "Continue"} <ArrowRight size={16} /></>
          ) : (
            <><Check size={16} /> Open my dashboard</>
          )}
        </button>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.75rem", fontWeight: 500,
  color: "var(--app-text-3)", marginBottom: "8px",
  textTransform: "uppercase", letterSpacing: "0.06em",
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px",
  background: "var(--app-surface)", border: "1px solid var(--app-border)",
  borderRadius: "8px", color: "var(--app-text-1)", fontSize: "0.875rem",
  outline: "none", boxSizing: "border-box",
}
