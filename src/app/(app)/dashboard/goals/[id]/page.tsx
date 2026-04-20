import { notFound } from "next/navigation"
import { fetchGoal } from "@/lib/api"
import { GoalDetailClient } from "./_components/goal-detail-client"

export default async function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const goal = await fetchGoal(id)
  if (!goal) notFound()
  return <GoalDetailClient goal={goal} />
}
