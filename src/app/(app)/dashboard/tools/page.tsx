import { fetchIntegrations } from "@/lib/api"
import ToolsClient from "./_components/tools-client"

export default async function ToolsPage() {
  const integrations = await fetchIntegrations()
  return <ToolsClient integrations={integrations} />
}
