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

function normalizePhaseStatus(status: string): PhaseStatus {
  const lower = status.toLowerCase()
  if (lower === "complete") return "completed"
  if (lower === "running") return "running"
  if (lower === "pending") return "pending"
  if (lower === "failed") return "failed"
  return "pending"
}

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
      pipeline_id: run.id,
      date: run.date,
      status: run.status === "COMPLETE" ? "completed" : run.status.toLowerCase(),
      started_at: run.startedAt.toISOString(),
      completed_at: run.completedAt?.toISOString(),
      phases: run.phases.map((p) => ({
        phase_id: p.id,
        phase: p.phase,
        status: normalizePhaseStatus(p.status),
        timestamp: p.timestamp.toISOString(),
        details: p.details as Record<string, unknown> | undefined,
      })),
    }

    return NextResponse.json(formatted)
  } catch (err) {
    console.error("Pipeline detail API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
