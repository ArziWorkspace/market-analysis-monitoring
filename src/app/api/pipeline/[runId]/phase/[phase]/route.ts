import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ runId: string; phase: string }> }
) {
  try {
    const { runId, phase } = await params
    const decodedPhase = decodeURIComponent(phase)
    const run = await prisma.pipelineRun.findUnique({
      where: { runId },
      include: { phases: true },
    })

    if (!run) {
      return NextResponse.json({ error: "Pipeline run not found" }, { status: 404 })
    }

    const dbPhase = run.phases.find((p) => p.phase === decodedPhase)
    if (!dbPhase) {
      return NextResponse.json({ error: "Phase not found" }, { status: 404 })
    }

    const normalizeStatus = (status: string) => {
      const lower = status.toLowerCase()
      if (lower === "complete") return "completed"
      if (lower === "running") return "running"
      if (lower === "pending") return "pending"
      if (lower === "failed") return "failed"
      return "pending"
    }

    return NextResponse.json({
      run_id: run.runId,
      pipeline_id: run.id,
      date: run.date,
      status: run.status === "COMPLETE" ? "completed" : run.status.toLowerCase(),
      started_at: run.startedAt.toISOString(),
      completed_at: run.completedAt?.toISOString(),
      current_phase: {
        phase_id: dbPhase.id,
        phase: dbPhase.phase,
        status: normalizeStatus(dbPhase.status),
        timestamp: dbPhase.timestamp.toISOString(),
        details: dbPhase.details as Record<string, unknown> | null,
      },
    })
  } catch (err) {
    console.error("Phase detail API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
