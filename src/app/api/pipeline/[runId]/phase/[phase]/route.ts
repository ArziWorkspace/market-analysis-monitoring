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
    
    // Phase 1: Get market data run details with actual data
    if (phaseNum === "1") {
      const marketDataRun = await prisma.market_data_runs.findFirst({
        where: { pipeline_run_id: run.id },
        include: {
          macro_data: { take: 5, orderBy: { id: "desc" } },
          companies_data: { take: 5, orderBy: { id: "desc" } },
          commodities_data: { take: 5, orderBy: { id: "desc" } },
          ihsg_news: { take: 5, orderBy: { id: "desc" } },
          news_data: { take: 5, orderBy: { id: "desc" } },
          world_indices: { take: 5, orderBy: { id: "desc" } },
          events_data: { take: 5, orderBy: { id: "desc" } },
        },
      })

      return NextResponse.json({
        run_id: run.runId,
        pipeline_id: run.id,
        date: run.date,
        status: run.status === "COMPLETED" ? "completed" : run.status.toLowerCase(),
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
              marketDataRun.companies_data.length,
              marketDataRun.ihsg_news.length,
              marketDataRun.news_data.length,
              marketDataRun.world_indices.length,
              marketDataRun.events_data.length,
            ].reduce((a, b) => a + b, 0),
            samples: {
              macro_data: marketDataRun.macro_data,
              companies_data: marketDataRun.companies_data,
              commodities_data: marketDataRun.commodities_data,
              ihsg_news: marketDataRun.ihsg_news,
              news_data: marketDataRun.news_data,
              world_indices: marketDataRun.world_indices,
              events_data: marketDataRun.events_data,
            },
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
        status: run.status === "COMPLETED" ? "completed" : run.status.toLowerCase(),
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

    // Phase 2: Macro Analyst - get macro_analysis and macro_indicators
    if (phaseNum === "2") {
      const macroAnalysis = await prisma.macro_analysis.findFirst({
        where: { pipeline_id: run.id },
        orderBy: { created_at: "desc" },
      })

      const macroIndicators = await prisma.macro_indicators.findMany({
        where: { pipeline_id: run.id },
        orderBy: { created_at: "desc" },
      })

      return NextResponse.json({
        run_id: run.runId,
        pipeline_id: run.id,
        date: run.date,
        status: run.status === "COMPLETED" ? "completed" : run.status.toLowerCase(),
        started_at: run.startedAt.toISOString(),
        completed_at: run.completedAt?.toISOString(),
        current_phase: {
          phase_id: dbPhase.id,
          phase: dbPhase.phase,
          status: normalizeStatus(dbPhase.status),
          timestamp: dbPhase.timestamp.toISOString(),
          details: null,
          macro_analysis: macroAnalysis ? {
            id: macroAnalysis.id,
            theme_name: macroAnalysis.theme_name,
            theme_description: macroAnalysis.theme_description,
            global_events_analysis: macroAnalysis.global_events_analysis,
            local_events_analysis: macroAnalysis.local_events_analysis,
            causality_chain: macroAnalysis.causality_chain,
            investment_implications: macroAnalysis.investment_implications,
            summary: macroAnalysis.summary,
            status: macroAnalysis.status,
            created_at: macroAnalysis.created_at?.toISOString(),
          } : null,
          macro_indicators: macroIndicators.map((ind) => ({
            id: ind.id,
            indicator_name: ind.indicator_name,
            indicator_value: ind.indicator_value,
            interpretation: ind.interpretation,
            created_at: ind.created_at?.toISOString(),
          })),
        },
      })
    }

    // Phase 3-7: Not configured yet
    return NextResponse.json({
      run_id: run.runId,
      pipeline_id: run.id,
      date: run.date,
      status: run.status === "COMPLETED" ? "completed" : run.status.toLowerCase(),
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
