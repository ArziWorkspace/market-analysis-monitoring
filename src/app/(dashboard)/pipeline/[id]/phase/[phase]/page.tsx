import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import PhaseDetailClient from "./phase-detail-client"

export default async function PhaseDetailPage({
  params,
}: {
  params: Promise<{ id: string; phase: string }>
}) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }
  const { id, phase } = await params
  return <PhaseDetailClient runId={id} phase={phase} />
}
