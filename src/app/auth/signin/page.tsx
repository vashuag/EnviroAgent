"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { Eye, EyeOff, Loader2 } from "lucide-react"

function SignInForm() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const m = searchParams.get("message")
    if (m) setMessage(m)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false })
      if (result?.error) {
        setError("Invalid email or password")
      } else {
        const session = await getSession()
        if (session) router.push("/dashboard")
      }
    } catch {
      setError("Something went wrong. Please try again.")
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
      {/* Glow */}
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
            Welcome back
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#4a6a8a", textAlign: "center", margin: "0 0 28px" }}>
            Sign in to your EnviroAgent account
          </p>

          {message && (
            <div style={{ padding: "10px 14px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "8px", fontSize: "0.83rem", color: "#34d399", marginBottom: "18px" }}>
              {message}
            </div>
          )}
          {error && (
            <div style={{ padding: "10px 14px", background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.3)", borderRadius: "8px", fontSize: "0.83rem", color: "#fb7185", marginBottom: "18px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Email address</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" style={fieldStyle} />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Your password" style={{ ...fieldStyle, paddingRight: "44px" }} />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#4a6a8a" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <Link href="/auth/forgot-password" style={{ fontSize: "0.8rem", color: "#3ecfc6", textDecoration: "none" }}>Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "12px 20px", background: loading ? "rgba(62,207,198,0.5)" : "#3ecfc6",
              border: "none", borderRadius: "8px", color: "#070f1c",
              fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer",
              marginTop: "4px",
            }}>
              {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Signing in…</> : "Sign in"}
            </button>
          </form>

          <p style={{ fontSize: "0.83rem", color: "#4a6a8a", textAlign: "center", marginTop: "20px" }}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" style={{ color: "#3ecfc6", textDecoration: "none", fontWeight: 500 }}>Sign up</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#070f1c", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #3ecfc6", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}
