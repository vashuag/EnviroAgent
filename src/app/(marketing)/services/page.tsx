import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Bot, Target, Plug, Activity, Shield, Sparkles, CheckCircle } from "lucide-react"

const SERVICES = [
  {
    icon: Target, title: "Commitment architecture",
    desc: "Define goals with specific horizons, categories, and success criteria. Our system structures your intent into trackable, agent-ready commitments.",
    features: ["Horizon tracking", "Progress visualisation", "Category-based routing", "Milestone detection"],
  },
  {
    icon: Bot, title: "Dedicated AI agents",
    desc: "Each commitment gets its own AI agent — trained on your context, focused solely on that goal, and available 24/7.",
    features: ["One agent per goal", "Persistent context", "Personality adaptation", "Action logging"],
  },
  {
    icon: Plug, title: "Tool integrations",
    desc: "Your agent acts through the apps you already use — calendar, email, Spotify, WhatsApp, Zomato, Amazon, and more.",
    features: ["11+ integrations", "Consent-gated access", "Tool-specific reasoning", "Easy toggle on/off"],
  },
  {
    icon: Activity, title: "Activity timeline",
    desc: "Every agent action — scheduled, drafted, blocked, nudged — appears in a timestamped, colour-coded feed.",
    features: ["Typed action categories", "Per-goal filtering", "Full audit trail", "Reversible actions"],
  },
  {
    icon: Shield, title: "Consent & privacy",
    desc: "You control every permission. Agents cannot access tools you haven't connected, and all actions are visible and reversible.",
    features: ["Permission-based model", "No silent actions", "Full data ownership", "Revoke at any time"],
  },
  {
    icon: Sparkles, title: "Adaptive experience",
    desc: "Kid, adult, and senior modes adjust font size, contrast, motion, and layout complexity to match the user.",
    features: ["3 age modes", "Dark / light theme", "Density control", "Reduced motion option"],
  },
]

export default function ServicesPage() {
  return (
    <div style={{ background: "#070f1c", color: "#dce9f7", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "500px", height: "300px", background: "radial-gradient(ellipse, rgba(62,207,198,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "720px", margin: "0 auto", position: "relative" }}>
          <Image src="/enviroagent.png" alt="EnviroAgent" width={64} height={64} style={{ borderRadius: "14px", margin: "0 auto 24px", display: "block" }} />
          <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(2.2rem, 5vw, 3rem)", fontWeight: 400, color: "#dce9f7", margin: "0 0 16px", lineHeight: 1.2 }}>
            What EnviroAgent does
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#7fa8d4", lineHeight: 1.7, margin: 0 }}>
            A full-stack commitment OS — from goal definition to agent execution to transparent tracking.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section style={{ padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {SERVICES.map((s, i) => (
            <div key={s.title} style={{
              padding: "24px", background: "#0d1c32", borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.06)",
              borderTop: i < 3 ? "3px solid #3ecfc6" : "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(62,207,198,0.1)", border: "1px solid rgba(62,207,198,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                <s.icon size={18} color="#3ecfc6" />
              </div>
              <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#dce9f7", margin: "0 0 8px" }}>{s.title}</h2>
              <p style={{ fontSize: "0.83rem", color: "#4a6a8a", margin: "0 0 16px", lineHeight: 1.6 }}>{s.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "7px" }}>
                {s.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "#7fa8d4" }}>
                    <CheckCircle size={13} color="#3ecfc6" style={{ flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:900px){section > div{grid-template-columns:1fr 1fr!important;}} @media(max-width:600px){section > div{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 24px 100px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 400, color: "#dce9f7", margin: "0 0 16px" }}>
          Start with a single commitment
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#7fa8d4", maxWidth: "400px", margin: "0 auto 32px", lineHeight: 1.7 }}>
          No credit card. No complicated setup. Write your goal, choose your tools, meet your agent.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/auth/signup" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "13px 24px", background: "#3ecfc6", borderRadius: "10px",
            color: "#070f1c", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none",
          }}>
            Get started free <ArrowRight size={16} />
          </Link>
          <Link href="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "13px 24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", color: "#7fa8d4", fontSize: "0.95rem", textDecoration: "none",
          }}>
            Talk to us
          </Link>
        </div>
      </section>
    </div>
  )
}
