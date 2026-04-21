import { fetchGoals } from "@/lib/api"
import { GoalsClient } from "./_components/goals-client"

export default async function GoalsPage() {
  const goals = await fetchGoals()
  return <GoalsClient goals={goals} />
}
