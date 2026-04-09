import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import PipelineDetailClient from "./pipeline-detail-client"

export default async function PipelineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }
  const { id } = await params
  return <PipelineDetailClient runId={id} />
}
