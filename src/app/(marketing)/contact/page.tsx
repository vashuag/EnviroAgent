"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Send, Loader2, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")
      setSent(true)
      setForm({ name: "", email: "", subject: "", message: "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    background: "#0d1c32", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px", color: "#dce9f7", fontSize: "0.9rem",
    outline: "none", boxSizing: "border-box",
  }
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.75rem", fontWeight: 500,
    color: "#4a6a8a", marginBottom: "6px",
    textTransform: "uppercase", letterSpacing: "0.06em",
  }

  return (
    <div style={{ background: "#070f1c", color: "#dce9f7", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "500px", height: "300px", background: "radial-gradient(ellipse, rgba(62,207,198,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "640px", margin: "0 auto", position: "relative" }}>
          <Image src="/enviroagent.png" alt="EnviroAgent" width={60} height={60} style={{ borderRadius: "12px", margin: "0 auto 20px", display: "block" }} />
          <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 400, color: "#dce9f7", margin: "0 0 14px", lineHeight: 1.2 }}>
            Get in touch
          </h1>
          <p style={{ fontSize: "1rem", color: "#7fa8d4", lineHeight: 1.7, margin: 0 }}>
            Questions, feedback, or partnership ideas — we read everything and reply within 24 hours.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "20px 24px 100px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>

          {/* Form */}
          <div style={{ background: "#0d1c32", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.07)", padding: "28px" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <CheckCircle size={24} color="#34d399" />
                </div>
                <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.5rem", fontWeight: 400, color: "#dce9f7", margin: "0 0 8px" }}>Message sent!</h2>
                <p style={{ fontSize: "0.875rem", color: "#7fa8d4", margin: "0 0 20px" }}>We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} style={{
                  padding: "9px 20px", background: "rgba(62,207,198,0.1)",
                  border: "1px solid rgba(62,207,198,0.3)", borderRadius: "8px",
                  color: "#3ecfc6", cursor: "pointer", fontSize: "0.875rem",
                }}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <h2 style={{ fontWeight: 600, color: "#dce9f7", margin: 0, fontSize: "1rem" }}>Send us a message</h2>

                {error && (
                  <div style={{ padding: "10px 14px", background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.3)", borderRadius: "8px", fontSize: "0.83rem", color: "#fb7185" }}>
                    {error}
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={labelStyle}>Full name</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" style={fieldStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" style={fieldStyle} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Subject</label>
                  <input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="What's this about?" style={fieldStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={5} placeholder="Tell us more…" style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.6 }} />
                </div>

                <button type="submit" disabled={loading} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  padding: "12px 20px", background: loading ? "rgba(62,207,198,0.5)" : "#3ecfc6",
                  border: "none", borderRadius: "8px", color: "#070f1c",
                  fontWeight: 700, fontSize: "0.9rem", cursor: loading ? "not-allowed" : "pointer",
                }}>
                  {loading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Sending…</> : <><Send size={15} /> Send message</>}
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "#0d1c32", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.07)", padding: "20px 22px" }}>
              <h3 style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3ecfc6", margin: "0 0 16px" }}>Contact info</h3>
              {[
                { icon: "📧", label: "Email",  value: "vashu.agarwal@enviroagent.org" },
                { icon: "📞", label: "Phone",  value: "+91 7303571379" },
                { icon: "📍", label: "Based",  value: "India" },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "rgba(62,207,198,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.9rem" }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#4a6a8a", marginBottom: "2px" }}>{label}</div>
                    <div style={{ fontSize: "0.83rem", color: "#dce9f7" }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(62,207,198,0.06)", borderRadius: "14px", border: "1px solid rgba(62,207,198,0.15)", padding: "20px 22px" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#3ecfc6", marginBottom: "8px" }}>⚡ Response time</div>
              <p style={{ fontSize: "0.8rem", color: "#4a6a8a", margin: 0, lineHeight: 1.6 }}>
                We reply within 24 hours on weekdays. For urgent matters, reach us directly via email.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width:768px){section > div{grid-template-columns:1fr!important;}}
      `}</style>
    </div>
  )
}
