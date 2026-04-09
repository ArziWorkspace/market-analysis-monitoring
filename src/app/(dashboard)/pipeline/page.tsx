import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PipelineDashboard } from "@/features/pipeline/components/pipeline-dashboard"

export default async function PipelinePage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return <PipelineDashboard />
}
