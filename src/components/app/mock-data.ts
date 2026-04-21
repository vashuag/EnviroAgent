export interface Goal {
  id: string
  title: string
  description: string
  emoji: string
  category: "fitness" | "career" | "finance" | "learning" | "creative" | "general"
  startDate: string
  endDate: string
  totalDays: number
  daysElapsed: number
  progress: number
  agentId: string
  toolIds: string[]
  status: "active" | "paused" | "completed"
  lastActivity: string
  color: string
}

export interface Agent {
  id: string
  name: string
  goalId: string
  avatar: string
  personality: string
  status: "active" | "idle" | "working"
  actionsToday: number
  totalActions: number
  lastAction: string
  lastActionTime: string
}

export interface Tool {
  id: string
  name: string
  category: "productivity" | "health" | "social" | "commerce" | "home" | "communication"
  icon: string
  connected: boolean
  description: string
  usedBy: string[]
}

export interface ActivityItem {
  id: string
  agentId: string
  agentName: string
  goalId: string
  goalTitle: string
  action: string
  type: "scheduled" | "drafted" | "blocked" | "nudged" | "logged" | "updated"
  timestamp: string
  details: string
}

export const GOALS: Goal[] = [
  {
    id: "g1",
    title: "Get fit in 3 months",
    description: "Build a consistent workout routine, improve endurance, lose 8kg, and feel energetic every day.",
    emoji: "🏃",
    category: "fitness",
    startDate: "2026-04-07",
    endDate: "2026-07-07",
    totalDays: 90,
    daysElapsed: 13,
    progress: 12,
    agentId: "a1",
    toolIds: ["t1", "t4", "t9"],
    status: "active",
    lastActivity: "Scheduled morning run for 6 AM tomorrow",
    color: "#34d399",
  },
  {
    id: "g2",
    title: "Transition to product management",
    description: "Complete PM certification, build a portfolio of case studies, and land a PM role within 6 months.",
    emoji: "💼",
    category: "career",
    startDate: "2026-04-14",
    endDate: "2026-10-14",
    totalDays: 183,
    daysElapsed: 6,
    progress: 4,
    agentId: "a2",
    toolIds: ["t2", "t3", "t5"],
    status: "active",
    lastActivity: "Drafted outreach email to 3 product leads",
    color: "#a78bfa",
  },
  {
    id: "g3",
    title: "Save ₹2L for Japan trip",
    description: "Cut discretionary spending, automate savings, and hit ₹2 lakh in 8 months.",
    emoji: "✈️",
    category: "finance",
    startDate: "2026-03-01",
    endDate: "2026-11-01",
    totalDays: 245,
    daysElapsed: 50,
    progress: 22,
    agentId: "a3",
    toolIds: ["t6", "t7", "t8"],
    status: "active",
    lastActivity: "Flagged ₹3,200 impulse purchase on Amazon",
    color: "#fbbf24",
  },
]

export const AGENTS: Agent[] = [
  {
    id: "a1",
    name: "FitBot",
    goalId: "g1",
    avatar: "🤸",
    personality: "Energetic coach — firm but encouraging",
    status: "working",
    actionsToday: 4,
    totalActions: 47,
    lastAction: "Scheduled morning run for tomorrow",
    lastActionTime: "2 min ago",
  },
  {
    id: "a2",
    name: "CareerBot",
    goalId: "g2",
    avatar: "🧭",
    personality: "Strategic advisor — data-driven and precise",
    status: "active",
    actionsToday: 2,
    totalActions: 12,
    lastAction: "Drafted networking email for PM community",
    lastActionTime: "1 hr ago",
  },
  {
    id: "a3",
    name: "FinBot",
    goalId: "g3",
    avatar: "💰",
    personality: "Frugal guardian — watchful and analytical",
    status: "working",
    actionsToday: 7,
    totalActions: 89,
    lastAction: "Flagged impulse purchase on Amazon",
    lastActionTime: "30 min ago",
  },
]

export const TOOLS: Tool[] = [
  { id: "t1", name: "Calendar", category: "productivity", icon: "📅", connected: true,  description: "Schedules workouts and recovery blocks", usedBy: ["a1", "a2"] },
  { id: "t2", name: "Email",    category: "communication", icon: "📧", connected: true,  description: "Drafts and sends outreach messages",  usedBy: ["a2"] },
  { id: "t3", name: "Browser",  category: "productivity", icon: "🌐", connected: true,  description: "Researches opportunities and content",  usedBy: ["a2"] },
  { id: "t4", name: "Spotify",  category: "health",       icon: "🎵", connected: true,  description: "Curates workout playlists",             usedBy: ["a1"] },
  { id: "t5", name: "Workspace",category: "productivity", icon: "📝", connected: false, description: "Organises notes and project docs",      usedBy: [] },
  { id: "t6", name: "Zomato",   category: "commerce",     icon: "🍱", connected: true,  description: "Tracks food spend vs. budget",         usedBy: ["a3"] },
  { id: "t7", name: "Amazon",   category: "commerce",     icon: "📦", connected: true,  description: "Monitors impulse purchases",           usedBy: ["a3"] },
  { id: "t8", name: "WhatsApp", category: "social",       icon: "💬", connected: false, description: "Sends commitment check-in nudges",     usedBy: [] },
  { id: "t9", name: "Todo",     category: "productivity", icon: "✅", connected: true,  description: "Creates and tracks daily micro-tasks",  usedBy: ["a1", "a3"] },
  { id: "t10",name: "Instagram",category: "social",       icon: "📸", connected: false, description: "Posts progress updates (optional)",    usedBy: [] },
  { id: "t11",name: "Lights",   category: "home",         icon: "💡", connected: false, description: "Sets focus lighting for deep work",    usedBy: [] },
]

export const ACTIVITY: ActivityItem[] = [
  { id: "ac1", agentId: "a1", agentName: "FitBot",   goalId: "g1", goalTitle: "Get fit in 3 months",        action: "Scheduled morning run for 6 AM",          type: "scheduled", timestamp: "2026-04-20T17:45:00Z", details: "Added 45-min run block to calendar for tomorrow" },
  { id: "ac2", agentId: "a3", agentName: "FinBot",   goalId: "g3", goalTitle: "Save ₹2L for Japan trip",    action: "Flagged ₹3,200 Amazon purchase",           type: "blocked",   timestamp: "2026-04-20T17:15:00Z", details: "Impulse purchase outside weekly budget of ₹1,500" },
  { id: "ac3", agentId: "a2", agentName: "CareerBot",goalId: "g2", goalTitle: "Transition to PM",           action: "Drafted networking email",                 type: "drafted",   timestamp: "2026-04-20T16:30:00Z", details: "Email to 3 product leads at Series B startups" },
  { id: "ac4", agentId: "a1", agentName: "FitBot",   goalId: "g1", goalTitle: "Get fit in 3 months",        action: "Nudge: skipped gym 2 days in a row",       type: "nudged",    timestamp: "2026-04-20T08:00:00Z", details: "Sent WhatsApp reminder at 8 AM" },
  { id: "ac5", agentId: "a3", agentName: "FinBot",   goalId: "g3", goalTitle: "Save ₹2L for Japan trip",    action: "Logged weekly food spend ₹2,100",          type: "logged",    timestamp: "2026-04-19T20:00:00Z", details: "Below ₹2,500 target — great week!" },
  { id: "ac6", agentId: "a1", agentName: "FitBot",   goalId: "g1", goalTitle: "Get fit in 3 months",        action: "Created Spotify workout playlist",         type: "updated",   timestamp: "2026-04-19T09:15:00Z", details: "High-BPM playlist for interval training" },
  { id: "ac7", agentId: "a2", agentName: "CareerBot",goalId: "g2", goalTitle: "Transition to PM",           action: "Found 4 open PM roles matching profile",   type: "logged",    timestamp: "2026-04-18T15:00:00Z", details: "Companies: Razorpay, CRED, Zepto, Groww" },
]

export const TYPE_COLORS: Record<string, string> = {
  scheduled: "#3ecfc6",
  drafted:   "#a78bfa",
  blocked:   "#fb7185",
  nudged:    "#fbbf24",
  logged:    "#34d399",
  updated:   "#38bdf8",
}

export const TYPE_BG: Record<string, string> = {
  scheduled: "rgba(62,207,198,0.12)",
  drafted:   "rgba(167,139,250,0.12)",
  blocked:   "rgba(251,113,133,0.12)",
  nudged:    "rgba(251,191,36,0.12)",
  logged:    "rgba(52,211,153,0.12)",
  updated:   "rgba(56,189,248,0.12)",
}
