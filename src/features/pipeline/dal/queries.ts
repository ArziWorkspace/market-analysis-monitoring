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

export async function getPipelineRuns(): Promise<PipelineRun[]> {
  try {
    const runs = await prisma.pipelineRun.findMany({
      include: { phases: true },
      orderBy: { startedAt: "desc" },
    })

    return runs.map((run) => ({
      run_id: run.runId,
      date: run.date,
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
    const latestPhase = phases.find((p) => p.status !== "COMPLETED")
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
      date: latest.date,
      started_at: latest.startedAt.toISOString(),
      completed_at: latest.completedAt?.toISOString(),
      phases: PHASE_ORDER.map((phaseName) => {
        const dbPhase = latest.phases.find((p) => p.phase === phaseName)
        return {
          phase: phaseName,
          status: (dbPhase?.status.toLowerCase() as PhaseStatus) || "pending",
          timestamp: dbPhase?.timestamp.toISOString() || latest.startedAt.toISOString(),
          details: dbPhase?.details as Record<string, unknown> | undefined,
        }
      }),
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
