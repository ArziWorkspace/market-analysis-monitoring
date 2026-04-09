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

function getPhaseNum(phaseName: string): string | null {
  return phaseName.match(/Phase\s*(\d+)/i)?.[1] || null
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

    // Get market data run for Phase 1
    const marketDataRun = await prisma.market_data_runs.findFirst({
      where: { pipeline_run_id: run.id },
      include: {
        macro_data: { select: { id: true } },
        companies_data: { select: { id: true } },
        commodities_data: { select: { id: true } },
        ihsg_news: { select: { id: true } },
        news_data: { select: { id: true } },
        world_indices: { select: { id: true } },
        events_data: { select: { id: true } },
      },
    })

    // Get latest report for Phase 8
    const latestReport = await prisma.reportVersion.findFirst({
      orderBy: { createdAt: "desc" },
      include: { report: true },
    })

    const formatted = {
      run_id: run.runId,
      pipeline_id: run.id,
      date: run.date,
      status: run.status === "COMPLETED" ? "completed" : run.status.toLowerCase(),
      started_at: run.startedAt.toISOString(),
      completed_at: run.completedAt?.toISOString(),
      phases: run.phases.map((p) => {
        const phaseNum = getPhaseNum(p.phase)
        const base = {
          phase_id: p.id,
          phase: p.phase,
          status: normalizePhaseStatus(p.status),
          timestamp: p.timestamp.toISOString(),
          details: p.details as Record<string, unknown> | undefined,
        }

        // Phase 1: Add data_summary
        if (phaseNum === "1" && marketDataRun) {
          return {
            ...base,
            data_summary: {
              run_id: marketDataRun.run_id,
              collected_at: marketDataRun.collected_at?.toISOString(),
              status: marketDataRun.status,
              records: {
                macro_data: marketDataRun.macro_data.length,
                companies_data: marketDataRun.companies_data.length,
                commodities_data: marketDataRun.commodities_data.length,
                ihsg_news: marketDataRun.ihsg_news.length,
                news_data: marketDataRun.news_data.length,
                world_indices: marketDataRun.world_indices.length,
                events_data: marketDataRun.events_data.length,
              },
              total_records: [
                marketDataRun.macro_data.length,
                marketDataRun.companies_data.length,
                marketDataRun.commodities_data.length,
                marketDataRun.ihsg_news.length,
                marketDataRun.news_data.length,
                marketDataRun.world_indices.length,
                marketDataRun.events_data.length,
              ].reduce((a, b) => a + b, 0),
            },
          }
        }

        // Phase 8: Add report_link
        if (phaseNum === "8" && latestReport) {
          return {
            ...base,
            report_link: {
              report_id: latestReport.report.id,
              report_title: latestReport.report.title,
              version: latestReport.version,
              version_id: latestReport.id,
              url: `/reports/${latestReport.report.id}`,
            },
          }
        }

        return base
      }),
    }

    return NextResponse.json(formatted)
  } catch (err) {
    console.error("Pipeline detail API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
