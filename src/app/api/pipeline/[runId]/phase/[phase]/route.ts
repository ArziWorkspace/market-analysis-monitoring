import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ runId: string; phase: string }> }
) {
  try {
    const { runId, phase } = await params
    const run = await prisma.pipelineRun.findUnique({
      where: { runId },
      include: { phases: true },
    })

    if (!run) {
      return NextResponse.json({ error: "Pipeline run not found" }, { status: 404 })
    }

    const dbPhase = run.phases.find((p) => p.phase === phase)
    if (!dbPhase) {
      return NextResponse.json({ error: "Phase not found" }, { status: 404 })
    }

    return NextResponse.json({
      run_id: run.runId,
      date: run.date,
      status: run.status.toLowerCase(),
      started_at: run.startedAt.toISOString(),
      completed_at: run.completedAt?.toISOString(),
      current_phase: {
        phase: dbPhase.phase,
        status: dbPhase.status.toLowerCase(),
        timestamp: dbPhase.timestamp.toISOString(),
        details: dbPhase.details,
      },
    })
  } catch (err) {
    console.error("Phase detail API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
