import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Target, Eye, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div style={{ background: "#070f1c", color: "#dce9f7", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", width: "500px", height: "300px", background: "radial-gradient(ellipse, rgba(62,207,198,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative" }}>
          <Image src="/enviroagent.png" alt="EnviroAgent" width={72} height={72} style={{ borderRadius: "16px", margin: "0 auto 24px", display: "block" }} />
          <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(2.2rem, 5vw, 3rem)", fontWeight: 400, color: "#dce9f7", margin: "0 0 16px", lineHeight: 1.2 }}>
            About EnviroAgent
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#7fa8d4", lineHeight: 1.7, margin: 0 }}>
            We believe the gap between intention and execution is an environment problem — and AI can close it.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: "60px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {[
            {
              Icon: Target, label: "Our Mission",
              text: "To give every person a personal AI that actively reshapes their digital environment — making their goals inevitable rather than aspirational. We're building the operating layer between human intent and the tools of everyday life.",
            },
            {
              Icon: Eye, label: "Our Vision",
              text: "A world where setting a commitment means it will happen. Where your AI understands the gap between who you are and who you want to be, and quietly works to close it — one scheduled block, one nudge, one environment change at a time.",
            },
          ].map(({ Icon, label, text }) => (
            <div key={label} style={{ padding: "28px", background: "#0d1c32", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(62,207,198,0.1)", border: "1px solid rgba(62,207,198,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                <Icon size={18} color="#3ecfc6" />
              </div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#dce9f7", margin: "0 0 10px" }}>{label}</h2>
              <p style={{ fontSize: "0.875rem", color: "#4a6a8a", margin: 0, lineHeight: 1.7 }}>{text}</p>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:768px){section > div{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* Values */}
      <section style={{ padding: "60px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", color: "#3ecfc6", textTransform: "uppercase", marginBottom: "40px", textAlign: "center" }}>
            WHAT WE STAND FOR
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { emoji: "🔒", title: "Consent first",        desc: "Every agent action requires a tool you explicitly connected. We will never act beyond your permission." },
              { emoji: "👁",  title: "Full transparency",   desc: "Every agent action is logged with a timestamp, a description, and a category. Nothing is hidden." },
              { emoji: "🌍", title: "Inclusive by design",  desc: "Kid, adult, senior modes. High-contrast options. We build for everyone, not just power users." },
              { emoji: "⚡", title: "Speed & reliability",  desc: "Agents that act within minutes, not days. Your environment should respond as fast as life moves." },
              { emoji: "🎯", title: "One goal, one agent",  desc: "No shared context, no dilution. A dedicated agent per commitment means undivided focus." },
              { emoji: "♻️", title: "Reversibility",        desc: "Every scheduled item, drafted email, or blocked purchase can be reviewed and reversed by you." },
            ].map(v => (
              <div key={v.title} style={{ padding: "20px", background: "#0d1c32", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "10px" }}>{v.emoji}</span>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#dce9f7", margin: "0 0 6px" }}>{v.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "#4a6a8a", margin: 0, lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){section:nth-of-type(3) > div > div{grid-template-columns:1fr 1fr!important;}}`}</style>
      </section>

      {/* Team */}
      <section style={{ padding: "60px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", color: "#3ecfc6", textTransform: "uppercase", marginBottom: "40px" }}>
            THE TEAM
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ padding: "28px 32px", background: "#0d1c32", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", maxWidth: "340px", textAlign: "center" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, #3ecfc6, #1e3a6e)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "1.5rem", color: "#fff", fontWeight: 700 }}>V</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#dce9f7", margin: "0 0 4px" }}>Vashu Agarwal</h3>
              <div style={{ fontSize: "0.78rem", color: "#3ecfc6", marginBottom: "12px" }}>Founder & CEO</div>
              <p style={{ fontSize: "0.82rem", color: "#4a6a8a", margin: 0, lineHeight: 1.6 }}>
                Building EnviroAgent from India — passionate about making AI work for real human commitments, not just conversations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 400, color: "#dce9f7", margin: "0 0 16px" }}>
          Ready to make your first commitment?
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#7fa8d4", maxWidth: "400px", margin: "0 auto 32px", lineHeight: 1.7 }}>
          Join the beta and get a dedicated AI agent working toward your goals today.
        </p>
        <Link href="/auth/signup" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "13px 24px", background: "#3ecfc6", borderRadius: "10px",
          color: "#070f1c", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none",
        }}>
          Get started free <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}
