import { prisma } from "@/lib/prisma"
import type { PipelineRun, CurrentPipeline, PhaseName, PhaseStatus } from "../types"

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

export async function getPipelineRuns(): Promise<PipelineRun[]> {
  try {
    const runs = await prisma.pipelineRun.findMany({
      include: { phases: true },
      orderBy: { startedAt: "desc" },
    })

    return runs.map((run) => ({
      run_id: run.runId,
      pipeline_id: run.id,
      date: run.date,
      started_at: run.startedAt.toISOString(),
      completed_at: run.completedAt?.toISOString(),
      phases: run.phases.map((p) => ({
        phase_id: p.id,
        phase: p.phase as PhaseName,
        status: normalizePhaseStatus(p.status),
        timestamp: p.timestamp.toISOString(),
        details: p.details as Record<string, unknown> | undefined,
      })),
    }))
  } catch (err) {
    console.error("Error fetching pipeline runs:", err)
    return []
  }
}

export async function getCurrentPipeline(): Promise<CurrentPipeline | null> {
  try {
    const current = await prisma.pipelineRun.findFirst({
      where: { status: "RUNNING" },
      orderBy: { startedAt: "desc" },
    })

    if (!current) return null

    const phases = await prisma.phase.findMany({
      where: { pipelineId: current.id },
      orderBy: { timestamp: "desc" },
    })

    // Find current phase (most recent non-completed)
    const latestPhase = phases.find((p) => p.status !== "COMPLETE")
    const currentPhaseName = (latestPhase?.phase as PhaseName) || "data_gathering"

    return {
      run_id: current.runId,
      phase: currentPhaseName,
      status: current.status === "RUNNING" ? "running" : "paused",
      started_at: current.startedAt.toISOString(),
    }
  } catch (err) {
    console.error("Error fetching current pipeline:", err)
    return null
  }
}

export async function getLatestRun(): Promise<PipelineRun | null> {
  try {
    const latest = await prisma.pipelineRun.findFirst({
      include: { phases: true },
      orderBy: { startedAt: "desc" },
    })

    if (!latest) return null

    return {
      run_id: latest.runId,
      pipeline_id: latest.id,
      date: latest.date,
      started_at: latest.startedAt.toISOString(),
      completed_at: latest.completedAt?.toISOString(),
      phases: latest.phases.map((p) => ({
        phase_id: p.id,
        phase: p.phase as PhaseName,
        status: normalizePhaseStatus(p.status),
        timestamp: p.timestamp.toISOString(),
        details: p.details as Record<string, unknown> | undefined,
      })),
    }
  } catch (err) {
    console.error("Error fetching latest run:", err)
    return null
  }
}

export async function getRunCount(): Promise<number> {
  try {
    return await prisma.pipelineRun.count()
  } catch {
    return 0
  }
}
