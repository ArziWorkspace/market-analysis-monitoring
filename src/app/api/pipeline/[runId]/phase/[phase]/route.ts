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

    // Get phase type from phase name (Phase 1, Phase 2, etc.)
    const phaseNum = decodedPhase.match(/Phase\s*(\d+)/i)?.[1]
    
    // Phase 1: Get market data run details
    if (phaseNum === "1") {
      const marketDataRun = await prisma.market_data_runs.findFirst({
        where: { phase_id: dbPhase.id },
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
          details: null,
          data_summary: marketDataRun ? {
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
          } : null,
        },
      })
    }

    // Phase 8: Report Generator - link to report
    if (phaseNum === "8") {
      // Find the latest report (could match by date or just get most recent)
      const latestReport = await prisma.reportVersion.findFirst({
        orderBy: { createdAt: "desc" },
        include: { report: true },
      })

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
          details: null,
          report_link: latestReport ? {
            report_id: latestReport.report.id,
            report_title: latestReport.report.title,
            version: latestReport.version,
            version_id: latestReport.id,
            url: `/reports/${latestReport.report.id}`,
          } : null,
        },
      })
    }

    // Phase 2-7: Not configured yet
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
        details: null,
        not_configured: true,
        message: "Phase data not yet connected",
      },
    })
  } catch (err) {
    console.error("Phase detail API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
