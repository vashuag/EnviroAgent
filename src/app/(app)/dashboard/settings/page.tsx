"use client"

import { motion } from "framer-motion"
import { useShell } from "@/components/app/shell-context"
import { useSession } from "next-auth/react"
import { Sun, Moon } from "lucide-react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const { theme, setTheme, ageMode, setAgeMode, density, setDensity } = useShell()

  return (
    <div style={{ minHeight: "100dvh", padding: "24px", maxWidth: "640px" }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.75rem", fontWeight: 400, color: "var(--app-text-1)", margin: 0 }}>
            Settings
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Profile */}
          <SettingsSection title="Profile">
            <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: "linear-gradient(135deg, #3ecfc6, #1e3a6e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.25rem", color: "#fff",
              }}>
                {session?.user?.name?.charAt(0).toUpperCase() ?? "Y"}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--app-text-1)" }}>{session?.user?.name ?? "Your name"}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--app-text-3)", marginTop: "2px" }}>{session?.user?.email ?? ""}</div>
              </div>
            </div>
          </SettingsSection>

          {/* Appearance */}
          <SettingsSection title="Appearance">
            <SettingRow label="Theme" description="Choose between dark and light mode">
              <div style={{ display: "flex", gap: "6px" }}>
                {(["dark", "light"] as const).map(t => (
                  <button key={t} onClick={() => setTheme(t)} style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "7px 14px", borderRadius: "7px",
                    background: theme === t ? "rgba(62,207,198,0.15)" : "var(--app-surface)",
                    border: theme === t ? "1px solid rgba(62,207,198,0.4)" : "1px solid var(--app-border)",
                    color: theme === t ? "#3ecfc6" : "var(--app-text-2)",
                    cursor: "pointer", fontSize: "0.8rem", fontWeight: theme === t ? 600 : 400,
                    textTransform: "capitalize",
                  }}>
                    {t === "dark" ? <Moon size={13} /> : <Sun size={13} />}
                    {t}
                  </button>
                ))}
              </div>
            </SettingRow>

            <Divider />

            <SettingRow label="Age mode" description="Adapts font size, contrast, and interface complexity">
              <div style={{ display: "flex", gap: "6px" }}>
                {(["kid", "adult", "senior"] as const).map(a => (
                  <button key={a} onClick={() => setAgeMode(a)} style={{
                    padding: "7px 14px", borderRadius: "7px",
                    background: ageMode === a ? "rgba(62,207,198,0.15)" : "var(--app-surface)",
                    border: ageMode === a ? "1px solid rgba(62,207,198,0.4)" : "1px solid var(--app-border)",
                    color: ageMode === a ? "#3ecfc6" : "var(--app-text-2)",
                    cursor: "pointer", fontSize: "0.8rem", fontWeight: ageMode === a ? 600 : 400,
                    textTransform: "capitalize",
                  }}>{a}</button>
                ))}
              </div>
            </SettingRow>

            <Divider />

            <SettingRow label="Density" description="Controls spacing and information density throughout the app">
              <div style={{ display: "flex", gap: "6px" }}>
                {(["compact", "balanced", "spacious"] as const).map(d => (
                  <button key={d} onClick={() => setDensity(d)} style={{
                    padding: "7px 14px", borderRadius: "7px",
                    background: density === d ? "rgba(62,207,198,0.15)" : "var(--app-surface)",
                    border: density === d ? "1px solid rgba(62,207,198,0.4)" : "1px solid var(--app-border)",
                    color: density === d ? "#3ecfc6" : "var(--app-text-2)",
                    cursor: "pointer", fontSize: "0.8rem", fontWeight: density === d ? 600 : 400,
                    textTransform: "capitalize",
                  }}>{d}</button>
                ))}
              </div>
            </SettingRow>
          </SettingsSection>

          {/* Privacy */}
          <SettingsSection title="Privacy & permissions">
            <SettingRow label="Consent-based actions" description="All agent actions require tools you explicitly connected">
              <span style={{ fontSize: "0.75rem", padding: "3px 10px", borderRadius: "99px", background: "rgba(52,211,153,0.12)", color: "#34d399", fontWeight: 500 }}>
                Always on
              </span>
            </SettingRow>
            <Divider />
            <SettingRow label="Action logging" description="Full audit log of every agent action">
              <ToggleSwitch checked />
            </SettingRow>
            <Divider />
            <SettingRow label="Analytics" description="Anonymous usage data to improve EnviroAgent">
              <ToggleSwitch />
            </SettingRow>
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection title="Notifications">
            <SettingRow label="Daily summary" description="Morning recap of agent activity">
              <ToggleSwitch checked />
            </SettingRow>
            <Divider />
            <SettingRow label="Nudges" description="Reminders when you fall off track">
              <ToggleSwitch checked />
            </SettingRow>
            <Divider />
            <SettingRow label="Milestone alerts" description="Celebrate progress milestones">
              <ToggleSwitch checked />
            </SettingRow>
          </SettingsSection>
        </div>
      </motion.div>
    </div>
  )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--app-card)", border: "1px solid var(--app-border)", borderRadius: "var(--radius, 12px)", overflow: "hidden" }}>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--app-border)" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--app-text-3)" }}>{title}</span>
      </div>
      <div style={{ padding: "4px 0" }}>{children}</div>
    </div>
  )
}

function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", gap: "16px" }}>
      <div>
        <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--app-text-1)" }}>{label}</div>
        <div style={{ fontSize: "0.75rem", color: "var(--app-text-3)", marginTop: "2px", lineHeight: 1.4 }}>{description}</div>
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

function Divider() {
  return <div style={{ height: "1px", background: "var(--app-border)", margin: "0 18px" }} />
}

function ToggleSwitch({ checked = false }: { checked?: boolean }) {
  return (
    <div style={{
      width: "38px", height: "22px", borderRadius: "11px",
      background: checked ? "#3ecfc6" : "var(--app-border)",
      position: "relative", cursor: "pointer", transition: "background 0.2s",
    }}>
      <div style={{
        width: "16px", height: "16px", borderRadius: "50%",
        background: "#fff",
        position: "absolute", top: "3px",
        left: checked ? "19px" : "3px",
        transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }} />
    </div>
  )
}
