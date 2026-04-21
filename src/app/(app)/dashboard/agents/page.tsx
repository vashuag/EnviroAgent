import { fetchAgents } from "@/lib/api"
import AgentsClient from "./_components/agents-client"

export default async function AgentsPage() {
  const agents = await fetchAgents()
  return <AgentsClient agents={agents} />
}
