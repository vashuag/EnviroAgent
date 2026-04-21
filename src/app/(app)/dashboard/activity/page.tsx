import { fetchActivity } from "@/lib/api"
import ActivityClient from "./_components/activity-client"

export default async function ActivityPage() {
  const activity = await fetchActivity()

  const seen = new Set<string>()
  const goals = activity
    .filter(a => a.goalId && !seen.has(a.goalId) && seen.add(a.goalId))
    .map(a => ({ id: a.goalId!, title: a.goalTitle ?? "", emoji: a.goalEmoji }))

  return <ActivityClient activity={activity} goals={goals} />
}
