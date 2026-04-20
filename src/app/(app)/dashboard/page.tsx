import { fetchGoals } from "@/lib/api"
import { DashboardClient } from "./_components/dashboard-client"

export default async function DashboardHome() {
  const goals = await fetchGoals()
  return <DashboardClient goals={goals} />
}
