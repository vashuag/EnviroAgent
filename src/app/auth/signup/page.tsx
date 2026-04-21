"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function SignUpPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")
      router.push("/auth/signin?message=Account created! Please sign in.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
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
    <div style={{ minHeight: "100vh", background: "#070f1c", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: "500px", height: "300px", background: "radial-gradient(ellipse, rgba(62,207,198,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "420px", position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <Image src="/enviroagent.png" alt="EnviroAgent" width={40} height={40} style={{ borderRadius: "10px" }} />
            <span style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", color: "#dce9f7" }}>EnviroAgent</span>
          </Link>
        </div>

        <div style={{ background: "#0d1c32", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.07)", padding: "32px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
          <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.75rem", fontWeight: 400, color: "#dce9f7", margin: "0 0 6px", textAlign: "center" }}>
            Create your account
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#4a6a8a", textAlign: "center", margin: "0 0 28px" }}>
            Join EnviroAgent and start winning
          </p>

          {error && (
            <div style={{ padding: "10px 14px", background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.3)", borderRadius: "8px", fontSize: "0.83rem", color: "#fb7185", marginBottom: "18px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Full name</label>
              <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" style={fieldStyle} />
            </div>

            <div>
              <label style={labelStyle}>Email address</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" style={fieldStyle} />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Create a password" style={{ ...fieldStyle, paddingRight: "44px" }} />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#4a6a8a" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "12px 20px", background: loading ? "rgba(62,207,198,0.5)" : "#3ecfc6",
              border: "none", borderRadius: "8px", color: "#070f1c",
              fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer",
              marginTop: "4px",
            }}>
              {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Creating…</> : "Create account"}
            </button>
          </form>

          <p style={{ fontSize: "0.83rem", color: "#4a6a8a", textAlign: "center", marginTop: "20px" }}>
            Already have an account?{" "}
            <Link href="/auth/signin" style={{ color: "#3ecfc6", textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
