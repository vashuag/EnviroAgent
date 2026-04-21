// Shared types and pure utilities — safe to import from both server and client components.
// Do NOT import auth, database, or any Node-only module here.

export interface ApiAgent {
  id: string
  goalId: string
  userId: string
  name: string
  avatar: string | null
  personality: string | null
  status: "active" | "idle" | "working"
  actionsToday: number
  totalActions: number
  lastAction: string | null
  lastActionTime: string | null
  createdAt: string
  updatedAt: string
}

export interface ApiGoal {
  id: string
  userId: string
  title: string
  description: string | null
  emoji: string | null
  category: string | null
  startDate: string
  endDate: string
  totalDays: number
  progress: number
  status: "active" | "paused" | "completed"
  color: string | null
  lastActivity: string | null
  healthScore: number
  streakCount: number
  lastCheckinAt: string | null
  createdAt: string
  updatedAt: string
  agent: ApiAgent | null
  activity?: ApiActivityItem[]
}

export interface ApiActivityItem {
  id: string
  userId: string
  agentId: string | null
  goalId: string | null
  agentName: string | null
  goalTitle: string | null
  action: string
  type: string
  details: string | null
  createdAt: string
}

export interface ApiAgentWithGoal extends ApiAgent {
  goalTitle: string
  goalEmoji: string | null
  goalColor: string | null
  goalStatus: "active" | "paused" | "completed"
  healthScore: number
}

export interface ApiActivityWithGoal extends ApiActivityItem {
  goalEmoji: string | null
}

export interface ApiIntegration {
  toolId: string
  name: string
  category: string
  icon: string
  description: string
  connected: boolean
}

export function daysElapsed(startDate: string): number {
  const diff = Date.now() - new Date(startDate).getTime()
  return Math.max(0, Math.floor(diff / 86_400_000))
}

export const DEFAULT_COLOR = "#3ecfc6"
