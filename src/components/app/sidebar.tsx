"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { signOut } from "@/lib/auth-client"
import { useShell } from "./shell-context"
import {
  Home, Target, Bot, Plug, Activity, Settings, LogOut,
  Sun, Moon, ChevronLeft, ChevronRight, User
} from "lucide-react"

const NAV = [
  { href: "/dashboard",           icon: Home,     label: "Home" },
  { href: "/dashboard/goals",     icon: Target,   label: "Commitments" },
  { href: "/dashboard/agents",    icon: Bot,      label: "Agents" },
  { href: "/dashboard/tools",     icon: Plug,     label: "Tools" },
  { href: "/dashboard/activity",  icon: Activity, label: "Activity" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { theme, setTheme, ageMode, setAgeMode, sidebarOpen, setSidebarOpen } = useShell()

  const isDark = theme === "dark"

  const s = {
    sidebar: {
      width: sidebarOpen ? "220px" : "64px",
      background: "var(--app-sidebar)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column" as const,
      transition: "width 0.2s ease",
      flexShrink: 0,
      position: "sticky" as const,
      top: 0,
      height: "100dvh",
      overflowY: "auto" as const,
      overflowX: "hidden" as const,
    },
    logo: {
      padding: sidebarOpen ? "24px 20px 20px" : "24px 0 20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      justifyContent: sidebarOpen ? "flex-start" : "center",
    },
    logoIcon: {
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      background: "linear-gradient(135deg, #3ecfc6 0%, #1d8880 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    logoText: {
      fontFamily: "var(--font-display, serif)",
      fontSize: "1rem",
      color: "#dce9f7",
      fontWeight: 400,
      whiteSpace: "nowrap" as const,
      overflow: "hidden",
      opacity: sidebarOpen ? 1 : 0,
      transition: "opacity 0.15s ease",
    },
    nav: {
      flex: 1,
      padding: "8px 0",
      display: "flex",
      flexDirection: "column" as const,
      gap: "2px",
    },
    navItem: (active: boolean) => ({
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: sidebarOpen ? "10px 16px" : "10px 0",
      margin: "0 8px",
      borderRadius: "8px",
      color: active ? "var(--app-sidebar-active)" : "var(--app-sidebar-text)",
      background: active ? "rgba(62,207,198,0.12)" : "transparent",
      textDecoration: "none",
      fontSize: "0.875rem",
      fontWeight: active ? 500 : 400,
      cursor: "pointer",
      transition: "background 0.15s, color 0.15s",
      justifyContent: sidebarOpen ? "flex-start" : "center",
      whiteSpace: "nowrap" as const,
      overflow: "hidden",
    }),
    navLabel: {
      opacity: sidebarOpen ? 1 : 0,
      transition: "opacity 0.15s ease",
      overflow: "hidden",
    },
    divider: {
      height: "1px",
      background: "rgba(255,255,255,0.05)",
      margin: "8px 16px",
    },
    bottom: {
      padding: "12px 8px 16px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "2px",
    },
    ageModeRow: {
      display: sidebarOpen ? "flex" : "none",
      gap: "4px",
      padding: "4px 8px 8px",
      justifyContent: "center",
    },
    ageModeBtn: (active: boolean) => ({
      flex: 1,
      padding: "4px",
      borderRadius: "6px",
      background: active ? "rgba(62,207,198,0.2)" : "transparent",
      border: active ? "1px solid rgba(62,207,198,0.4)" : "1px solid transparent",
      color: active ? "#3ecfc6" : "#6a90b8",
      fontSize: "0.65rem",
      cursor: "pointer",
      textAlign: "center" as const,
      fontWeight: active ? 500 : 400,
    }),
    themeBtn: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: sidebarOpen ? "9px 16px" : "9px 0",
      margin: "0",
      borderRadius: "8px",
      color: "var(--app-sidebar-text)",
      background: "transparent",
      border: "none",
      fontSize: "0.875rem",
      cursor: "pointer",
      width: "100%",
      justifyContent: sidebarOpen ? "flex-start" : "center",
    },
    collapseBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px",
      color: "#3d6080",
      cursor: "pointer",
      background: "none",
      border: "none",
      width: "100%",
    },
    avatar: {
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #3ecfc6, #1e3a6e)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
  }

  return (
    <aside style={s.sidebar}>
      {/* Logo */}
      <div style={s.logo}>
        <Image src="/enviroagent.png" alt="EnviroAgent" width={32} height={32} style={{ borderRadius: "7px", flexShrink: 0 }} />
        <span style={s.logoText}>EnviroAgent</span>
      </div>

      {/* Navigation */}
      <nav style={s.nav}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <Link key={href} href={href} style={s.navItem(active)}>
              <Icon size={18} />
              <span style={s.navLabel}>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div style={s.divider} />

      {/* Bottom */}
      <div style={s.bottom}>
        {/* Age mode */}
        <div style={s.ageModeRow}>
          {(["kid", "adult", "senior"] as const).map((mode) => (
            <button key={mode} style={s.ageModeBtn(ageMode === mode)} onClick={() => setAgeMode(mode)}>
              {mode === "kid" ? "Kid" : mode === "adult" ? "Adult" : "Senior"}
            </button>
          ))}
        </div>

        {/* Theme toggle */}
        <button style={s.themeBtn} onClick={() => setTheme(isDark ? "light" : "dark")}>
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          <span style={s.navLabel}>{isDark ? "Light mode" : "Dark mode"}</span>
        </button>

        {/* Settings */}
        <Link href="/dashboard/settings" style={s.navItem(pathname === "/dashboard/settings")}>
          <Settings size={18} />
          <span style={s.navLabel}>Settings</span>
        </Link>

        {/* User */}
        {session && (
          <div style={{ ...s.navItem(false), cursor: "default" }}>
            <div style={s.avatar}>
              <User size={14} color="#fff" />
            </div>
            <span style={{ ...s.navLabel, fontSize: "0.8rem", overflow: "hidden", textOverflow: "ellipsis" }}>
              {session.user?.name?.split(" ")[0] ?? "You"}
            </span>
          </div>
        )}

        {/* Sign out */}
        <button
          style={{ ...s.navItem(false), background: "none", border: "none", width: "100%" }}
          onClick={() => signOut()}
        >
          <LogOut size={18} />
          <span style={s.navLabel}>Sign out</span>
        </button>

        {/* Collapse toggle */}
        <button style={s.collapseBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </aside>
  )
}
