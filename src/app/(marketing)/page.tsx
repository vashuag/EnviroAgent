"use client"

import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Target, Bot, Plug, Activity, Shield, Sparkles } from "lucide-react"

const TOOLS = ["📅 Calendar", "📧 Email", "🎵 Spotify", "🌐 Browser", "💬 WhatsApp", "✅ Todo", "📦 Amazon", "🍱 Zomato", "💡 Lights", "📝 Workspace"]

const FEATURES = [
  { icon: Target,   title: "Commitment with a horizon",   desc: "Every goal gets a deadline, a dedicated agent, and a live progress horizon — so you always know exactly where you stand." },
  { icon: Bot,      title: "One agent per goal",           desc: "Each commitment spawns its own AI agent, trained on your context and laser-focused on making that one goal happen." },
  { icon: Plug,     title: "Tools you actually use",       desc: "Your agent acts through calendar, email, Spotify, Zomato, and more — only the tools you explicitly permit." },
  { icon: Activity, title: "Full activity log",            desc: "Every action your agent takes is timestamped, categorised, and reversible. Total transparency, always." },
  { icon: Shield,   title: "Consent-based control",        desc: "Nothing happens without your permission. You own the tools, you own the agent, you own the results." },
  { icon: Sparkles, title: "Adapts to your age & style",   desc: "Kid, adult, or senior mode — the UI adapts font size, contrast, and complexity to match you." },
]

const STEPS = [
  { n: "01", title: "Make a commitment", desc: "Write down your goal and give it a deadline. A promise to yourself with a real horizon." },
  { n: "02", title: "Connect your tools", desc: "Grant your agent access to the apps and services it needs — only what you choose." },
  { n: "03", title: "Agent gets to work", desc: "Your dedicated AI reshapes your environment — schedules, reminders, purchases, messages." },
  { n: "04", title: "Watch it happen",    desc: "Track progress on a live horizon bar. Every agent action is logged and transparent." },
]

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard")
  }, [status, router])

  if (status === "loading" || status === "authenticated") {
    return (
      <div style={{ minHeight: "100vh", background: "#070f1c", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid #3ecfc6", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ background: "#070f1c", color: "#dce9f7" }}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{ minHeight: "92vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "80px 24px 60px" }}>
        {/* Glow */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(62,207,198,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "5px 12px 5px 6px", borderRadius: "99px",
              background: "rgba(62,207,198,0.1)", border: "1px solid rgba(62,207,198,0.25)",
              fontSize: "0.78rem", color: "#3ecfc6", marginBottom: "24px",
            }}>
              <span style={{ background: "#3ecfc6", borderRadius: "99px", padding: "2px 8px", color: "#070f1c", fontWeight: 700, fontSize: "0.68rem" }}>NEW</span>
              Multi-agent goal OS · now in beta
            </div>

            <h1 style={{
              fontFamily: "var(--font-display, serif)",
              fontSize: "clamp(2.4rem, 5vw, 3.5rem)",
              fontWeight: 400, lineHeight: 1.15,
              color: "#dce9f7", margin: "0 0 20px",
            }}>
              Your AI that modifies<br />
              <span style={{ color: "#3ecfc6", fontStyle: "italic" }}>your world</span> to make<br />
              you win.
            </h1>

            <p style={{ fontSize: "1.05rem", color: "#7fa8d4", lineHeight: 1.7, maxWidth: "480px", margin: "0 0 36px" }}>
              Set long-term commitments. EnviroAgent deploys dedicated AI agents that reshape your environment — calendar, apps, tools — so your goals become inevitable.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/auth/signup" style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "13px 24px", background: "#3ecfc6", borderRadius: "10px",
                color: "#070f1c", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none",
                boxShadow: "0 4px 20px rgba(62,207,198,0.3)",
              }}>
                Start for free <ArrowRight size={17} />
              </Link>
              <Link href="/about" style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "13px 24px", background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
                color: "#7fa8d4", fontSize: "0.95rem", textDecoration: "none",
              }}>
                How it works
              </Link>
            </div>

            {/* Tool strip */}
            <div style={{ marginTop: "40px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {TOOLS.map(t => (
                <span key={t} style={{
                  padding: "4px 10px", background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px",
                  fontSize: "0.72rem", color: "#4a6a8a",
                }}>{t}</span>
              ))}
            </div>
          </motion.div>

          {/* Right — dashboard preview card */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              width: "100%", maxWidth: "400px",
              background: "#0f2040", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px", padding: "24px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(62,207,198,0.08)",
            }}>
              {/* Card header */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <Image src="/enviroagent.png" alt="" width={28} height={28} style={{ borderRadius: "6px" }} />
                <span style={{ fontSize: "0.8rem", color: "#7fa8d4" }}>EnviroAgent</span>
                <span style={{ marginLeft: "auto", fontSize: "0.65rem", padding: "2px 8px", background: "rgba(62,207,198,0.15)", color: "#3ecfc6", borderRadius: "99px", fontWeight: 600 }}>3 active</span>
              </div>

              {/* Sample goal cards */}
              {[
                { emoji: "🏃", title: "Get fit in 3 months",     progress: 12, color: "#34d399", day: 13, total: 90 },
                { emoji: "💼", title: "Career transition to PM",  progress: 4,  color: "#a78bfa", day: 6,  total: 183 },
                { emoji: "✈️", title: "Save ₹2L for Japan trip", progress: 22, color: "#fbbf24", day: 50, total: 245 },
              ].map(goal => (
                <div key={goal.title} style={{
                  padding: "12px 14px", background: "#132035",
                  borderRadius: "10px", marginBottom: "8px",
                  borderLeft: `3px solid ${goal.color}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "0.82rem", color: "#dce9f7", fontWeight: 500 }}>{goal.emoji} {goal.title}</span>
                    <span style={{ fontSize: "0.72rem", color: goal.color, fontWeight: 600 }}>{goal.progress}%</span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.07)", borderRadius: "99px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${goal.progress}%`, background: goal.color, borderRadius: "99px" }} />
                  </div>
                  <div style={{ fontSize: "0.67rem", color: "#3d6080", marginTop: "5px" }}>Day {goal.day} of {goal.total}</div>
                </div>
              ))}

              {/* Agent activity */}
              <div style={{ marginTop: "14px", padding: "10px 12px", background: "rgba(62,207,198,0.06)", borderRadius: "8px", border: "1px solid rgba(62,207,198,0.12)" }}>
                <div style={{ fontSize: "0.68rem", color: "#3ecfc6", fontWeight: 600, marginBottom: "4px" }}>🤖 FitBot · just now</div>
                <div style={{ fontSize: "0.75rem", color: "#7fa8d4" }}>Scheduled morning run for 6 AM tomorrow</div>
              </div>
            </div>
          </motion.div>
        </div>

        <style>{`@media(max-width:768px){section > div{grid-template-columns:1fr!important;} section > div > div:last-child{display:none!important;}}`}</style>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", textAlign: "center" }}>
          {[
            { value: "1K+",  label: "Goals committed" },
            { value: "95%",  label: "Completion rate" },
            { value: "24/7", label: "Agents running" },
            { value: "100%", label: "User-controlled" },
          ].map(s => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ fontFamily: "var(--font-display, serif)", fontSize: "2.25rem", color: "#3ecfc6", marginBottom: "4px" }}>{s.value}</div>
              <div style={{ fontSize: "0.82rem", color: "#4a6a8a" }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", color: "#3ecfc6", textTransform: "uppercase", marginBottom: "12px" }}>HOW IT WORKS</div>
            <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 400, color: "#dce9f7", margin: 0 }}>
              From commitment to completion
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {STEPS.map((step, i) => (
              <motion.div key={step.n} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                style={{ padding: "24px", background: "#0d1c32", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem", color: "#3ecfc6", marginBottom: "12px", opacity: 0.7 }}>{step.n}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#dce9f7", margin: "0 0 8px" }}>{step.title}</h3>
                <p style={{ fontSize: "0.83rem", color: "#4a6a8a", margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){section > div > div:last-child{grid-template-columns:1fr 1fr!important;}}`}</style>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", color: "#3ecfc6", textTransform: "uppercase", marginBottom: "12px" }}>FEATURES</div>
            <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 400, color: "#dce9f7", margin: 0 }}>
              Built for long-term winning
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} viewport={{ once: true }}
                style={{ padding: "24px", background: "#0d1c32", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: "rgba(62,207,198,0.1)", border: "1px solid rgba(62,207,198,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "14px",
                }}>
                  <f.icon size={18} color="#3ecfc6" />
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#dce9f7", margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: "0.83rem", color: "#4a6a8a", margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){section > div > div:last-child{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px 100px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Image src="/enviroagent.png" alt="EnviroAgent" width={64} height={64} style={{ borderRadius: "14px", margin: "0 auto 24px", display: "block" }} />
          <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 400, color: "#dce9f7", margin: "0 0 16px" }}>
            Ready to reshape your world?
          </h2>
          <p style={{ fontSize: "1rem", color: "#7fa8d4", maxWidth: "480px", margin: "0 auto 36px", lineHeight: 1.7 }}>
            Make your first commitment today. Your agent starts working immediately.
          </p>
          <Link href="/auth/signup" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "14px 28px", background: "#3ecfc6", borderRadius: "10px",
            color: "#070f1c", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none",
            boxShadow: "0 4px 24px rgba(62,207,198,0.3)",
          }}>
            Get started free <ArrowRight size={17} />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
