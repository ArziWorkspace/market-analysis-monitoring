import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { PhaseName, PhaseStatus } from "@/features/pipeline/types"

const PHASE_ORDER: PhaseName[] = [
  "data_gathering",
  "macro_analysis",
  "ihsg_analysis",
  "sector_analysis",
  "stock_screener",
  "stock_analyst",
  "fundamental_analyst",
  "report_generation",
]

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const { runId } = await params
    const run = await prisma.pipelineRun.findUnique({
      where: { runId },
      include: { phases: true },
    })

    if (!run) {
      return NextResponse.json({ error: "Pipeline run not found" }, { status: 404 })
    }

    const formatted = {
      run_id: run.runId,
      date: run.date,
      status: run.status.toLowerCase(),
      started_at: run.startedAt.toISOString(),
      completed_at: run.completedAt?.toISOString(),
      phases: PHASE_ORDER.map((phaseName) => {
        const dbPhase = run.phases.find((p) => p.phase === phaseName)
        return {
          phase: phaseName,
          status: (dbPhase?.status.toLowerCase() as PhaseStatus) || "pending",
          timestamp: dbPhase?.timestamp.toISOString() || run.startedAt.toISOString(),
          details: dbPhase?.details as Record<string, unknown> | undefined,
        }
      }),
    }

    return NextResponse.json(formatted)
  } catch (err) {
    console.error("Pipeline detail API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
