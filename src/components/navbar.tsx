"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { signOut } from "@/lib/auth-client"
import { Menu, X, LayoutDashboard, LogOut, ChevronDown } from "lucide-react"
import { useState } from "react"

const NAV = [
  { name: "About",    href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact",  href: "/contact" },
]

export function Navbar() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)

  return (
    <nav style={{ background: "#0a1628", borderBottom: "1px solid rgba(255,255,255,0.07)", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}>
          <Image src="/enviroagent.png" alt="EnviroAgent" width={34} height={34} style={{ borderRadius: "6px" }} />
          <span style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.1rem", color: "#dce9f7" }}>EnviroAgent</span>
        </Link>

        {/* Desktop nav links */}
        <div className="ea-nav-links" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {NAV.map(item => (
            <Link key={item.name} href={item.href} style={{
              padding: "7px 14px", borderRadius: "6px",
              color: "#7fa8d4", fontSize: "0.875rem", textDecoration: "none",
              transition: "color 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "#dce9f7")}
              onMouseLeave={e => (e.currentTarget.style.color = "#7fa8d4")}
            >{item.name}</Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="ea-nav-links" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {status === "loading" ? (
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          ) : session ? (
            <div style={{ position: "relative" }}>
              <button onClick={() => setUserMenu(o => !o)} style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "6px 12px", borderRadius: "8px",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#dce9f7", cursor: "pointer", fontSize: "0.85rem",
              }}>
                <div style={{
                  width: "26px", height: "26px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #3ecfc6, #1e3a6e)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.72rem", fontWeight: 700, color: "#fff", flexShrink: 0,
                }}>{session.user?.name?.charAt(0).toUpperCase() ?? "Y"}</div>
                <span>{session.user?.name?.split(" ")[0]}</span>
                <ChevronDown size={12} color="#7fa8d4" />
              </button>
              {userMenu && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 6px)",
                  background: "#0f1f3a", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px", overflow: "hidden", minWidth: "180px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}>
                  <Link href="/dashboard" onClick={() => setUserMenu(false)} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "11px 16px", color: "#3ecfc6", textDecoration: "none",
                    fontSize: "0.85rem", fontWeight: 500,
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <button onClick={() => { setUserMenu(false); signOut() }} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "11px 16px", color: "#7fa8d4",
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "0.85rem", width: "100%", textAlign: "left",
                  }}>
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/signin" style={{
                padding: "7px 16px", borderRadius: "7px",
                color: "#7fa8d4", fontSize: "0.875rem", textDecoration: "none",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              }}>Sign in</Link>
              <Link href="/auth/signup" style={{
                padding: "7px 16px", borderRadius: "7px",
                background: "#3ecfc6", color: "#070f1c",
                fontSize: "0.875rem", fontWeight: 600, textDecoration: "none",
              }}>Get started</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="ea-hamburger" onClick={() => setMenuOpen(o => !o)}
          style={{ background: "none", border: "none", color: "#7fa8d4", cursor: "pointer", padding: "4px", display: "none" }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "#0a1628", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "16px 24px 20px" }}>
          {NAV.map(item => (
            <Link key={item.name} href={item.href} onClick={() => setMenuOpen(false)} style={{
              display: "block", padding: "10px 0",
              color: "#7fa8d4", fontSize: "0.9rem", textDecoration: "none",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>{item.name}</Link>
          ))}
          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{
                  padding: "10px 16px", background: "rgba(62,207,198,0.1)",
                  border: "1px solid rgba(62,207,198,0.3)", borderRadius: "8px",
                  color: "#3ecfc6", textDecoration: "none", textAlign: "center", fontSize: "0.875rem", fontWeight: 500,
                }}>Open Dashboard</Link>
                <button onClick={() => { setMenuOpen(false); signOut() }} style={{
                  padding: "10px 16px", background: "none", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px", color: "#7fa8d4", cursor: "pointer", fontSize: "0.875rem",
                }}>Sign out</button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" onClick={() => setMenuOpen(false)} style={{
                  padding: "10px 16px", background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
                  color: "#7fa8d4", textDecoration: "none", textAlign: "center", fontSize: "0.875rem",
                }}>Sign in</Link>
                <Link href="/auth/signup" onClick={() => setMenuOpen(false)} style={{
                  padding: "10px 16px", background: "#3ecfc6", borderRadius: "8px",
                  color: "#070f1c", textDecoration: "none", textAlign: "center", fontSize: "0.875rem", fontWeight: 600,
                }}>Get started</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .ea-nav-links { display: none !important; }
          .ea-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
