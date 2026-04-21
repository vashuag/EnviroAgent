"use client"

import { createContext, useContext } from "react"

interface ShellContextValue {
  theme: "dark" | "light"
  setTheme: (t: "dark" | "light") => void
  ageMode: "kid" | "adult" | "senior"
  setAgeMode: (a: "kid" | "adult" | "senior") => void
  density: "compact" | "balanced" | "spacious"
  setDensity: (d: "compact" | "balanced" | "spacious") => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const AppShellContext = createContext<ShellContextValue>({
  theme: "dark",
  setTheme: () => {},
  ageMode: "adult",
  setAgeMode: () => {},
  density: "balanced",
  setDensity: () => {},
  sidebarOpen: true,
  setSidebarOpen: () => {},
})

export function useShell() {
  return useContext(AppShellContext)
}
