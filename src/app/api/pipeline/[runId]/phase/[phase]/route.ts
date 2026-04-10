import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ runId: string; phase: string }> },
) {
  try {
    const { runId, phase } = await params;
    const decodedPhase = decodeURIComponent(phase);
    const run = await prisma.pipelineRun.findUnique({
      where: { runId },
      include: { phases: true },
    });

    if (!run) {
      return NextResponse.json(
        { error: "Pipeline run not found" },
        { status: 404 },
      );
    }

    const dbPhase = run.phases.find((p) => p.phase === decodedPhase);
    if (!dbPhase) {
      return NextResponse.json({ error: "Phase not found" }, { status: 404 });
    }

    // Find the phase_definition by matching phase_id
    const phaseDefinition = await prisma.phase_definition.findFirst({
      where: { phase_id: decodedPhase },
    });

    const normalizeStatus = (status: string) => {
      const lower = status.toLowerCase();
      if (lower === "complete") return "completed";
      if (lower === "running") return "running";
      if (lower === "pending") return "pending";
      if (lower === "failed") return "failed";
      return "pending";
    };

    // Get phase type from phase name
    // Supports "Phase X", "PHASE_X", "PHASE_8A", "PHASE_8B" formats
    const normalizedPhase = decodedPhase.toUpperCase();
    const isPhase8A = normalizedPhase === "PHASE_8A";
    const isPhase8B = normalizedPhase === "PHASE_8B";
    const phaseNum =
      decodedPhase.match(/Phase\s*(\d+)/i)?.[1] ||
      normalizedPhase.match(/^PHASE_(\d+)$/)?.[1];

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
      });

      return NextResponse.json({
        run_id: run.runId,
        pipeline_id: run.id,
        date: run.date,
        status:
          run.status === "COMPLETED" ? "completed" : run.status.toLowerCase(),
        started_at: run.startedAt.toISOString(),
        completed_at: run.completedAt?.toISOString(),
        current_phase: {
          phase_id: dbPhase.id,
          phase: dbPhase.phase,
          status: normalizeStatus(dbPhase.status),
          timestamp: dbPhase.timestamp.toISOString(),
          details: null,
          data_summary: marketDataRun
            ? {
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
              }
            : null,
        },
      });
    }

    // Phase 8A and 8B: Report Generator - link to report
    if (isPhase8A || isPhase8B) {
      const latestReport = await prisma.reportVersion.findFirst({
        orderBy: { createdAt: "desc" },
        include: { report: true },
      });

      return NextResponse.json({
        run_id: run.runId,
        pipeline_id: run.id,
        date: run.date,
        status:
          run.status === "COMPLETED" ? "completed" : run.status.toLowerCase(),
        started_at: run.startedAt.toISOString(),
        completed_at: run.completedAt?.toISOString(),
        current_phase: {
          phase_id: dbPhase.id,
          phase: dbPhase.phase,
          status: normalizeStatus(dbPhase.status),
          timestamp: dbPhase.timestamp.toISOString(),
          details: null,
          start_time: dbPhase.startTime?.toISOString() || null,
          end_time: dbPhase.endTime?.toISOString() || null,
          attempt: dbPhase.attempt,
          user_input: dbPhase.userInput || null,
          phase_definition: phaseDefinition
            ? {
                id: phaseDefinition.id,
                name: phaseDefinition.name,
                phase_id: phaseDefinition.phase_id,
              }
            : null,
          report_link: latestReport
            ? {
                report_id: latestReport.report.id,
                report_title: latestReport.report.title,
                version: latestReport.version,
                version_id: latestReport.id,
                url: `/reports/${latestReport.report.id}`,
              }
            : null,
        },
      });
    }

    // Phase 8: Report Generator - link to report
    if (phaseNum === "8") {
      // Find the latest report (could match by date or just get most recent)
      const latestReport = await prisma.reportVersion.findFirst({
        orderBy: { createdAt: "desc" },
        include: { report: true },
      });

      return NextResponse.json({
        run_id: run.runId,
        pipeline_id: run.id,
        date: run.date,
        status:
          run.status === "COMPLETED" ? "completed" : run.status.toLowerCase(),
        started_at: run.startedAt.toISOString(),
        completed_at: run.completedAt?.toISOString(),
        current_phase: {
          phase_id: dbPhase.id,
          phase: dbPhase.phase,
          status: normalizeStatus(dbPhase.status),
          timestamp: dbPhase.timestamp.toISOString(),
          details: null,
          start_time: dbPhase.startTime?.toISOString() || null,
          end_time: dbPhase.endTime?.toISOString() || null,
          attempt: dbPhase.attempt,
          user_input: dbPhase.userInput || null,
          phase_definition: phaseDefinition
            ? {
                id: phaseDefinition.id,
                name: phaseDefinition.name,
                phase_id: phaseDefinition.phase_id,
              }
            : null,
          report_link: latestReport
            ? {
                report_id: latestReport.report.id,
                report_title: latestReport.report.title,
                version: latestReport.version,
                version_id: latestReport.id,
                url: `/reports/${latestReport.report.id}`,
              }
            : null,
        },
      });
    }

    // Phase 2: Macro Analyst - get macro_analysis and macro_indicators
    if (phaseNum === "2") {
      const macroAnalysis = await prisma.macro_analysis.findFirst({
        where: { pipeline_id: run.id },
        orderBy: { created_at: "desc" },
      });

      const macroIndicators = await prisma.macro_indicators.findMany({
        where: { pipeline_id: run.id },
        orderBy: { created_at: "desc" },
      });

      return NextResponse.json({
        run_id: run.runId,
        pipeline_id: run.id,
        date: run.date,
        status:
          run.status === "COMPLETED" ? "completed" : run.status.toLowerCase(),
        started_at: run.startedAt.toISOString(),
        completed_at: run.completedAt?.toISOString(),
        current_phase: {
          phase_id: dbPhase.id,
          phase: dbPhase.phase,
          status: normalizeStatus(dbPhase.status),
          timestamp: dbPhase.timestamp.toISOString(),
          details: null,
          start_time: dbPhase.startTime?.toISOString() || null,
          end_time: dbPhase.endTime?.toISOString() || null,
          attempt: dbPhase.attempt,
          user_input: dbPhase.userInput || null,
          phase_definition: phaseDefinition
            ? {
                id: phaseDefinition.id,
                name: phaseDefinition.name,
                phase_id: phaseDefinition.phase_id,
              }
            : null,
          macro_analysis: macroAnalysis
            ? {
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
              }
            : null,
          macro_indicators: macroIndicators.map((ind) => ({
            id: ind.id,
            indicator_name: ind.indicator_name,
            indicator_value: ind.indicator_value,
            interpretation: ind.interpretation,
            created_at: ind.created_at?.toISOString(),
          })),
        },
      });
    }

    // Phase 3: Sector Analyst - get sector_analysis
    if (phaseNum === "3") {
      const sectorAnalysis = await prisma.sector_analysis.findFirst({
        where: { pipeline_id: run.id },
        orderBy: { created_at: "desc" },
      });

      return NextResponse.json({
        run_id: run.runId,
        pipeline_id: run.id,
        date: run.date,
        status:
          run.status === "COMPLETED" ? "completed" : run.status.toLowerCase(),
        started_at: run.startedAt.toISOString(),
        completed_at: run.completedAt?.toISOString(),
        current_phase: {
          phase_id: dbPhase.id,
          phase: dbPhase.phase,
          status: normalizeStatus(dbPhase.status),
          timestamp: dbPhase.timestamp.toISOString(),
          details: null,
          start_time: dbPhase.startTime?.toISOString() || null,
          end_time: dbPhase.endTime?.toISOString() || null,
          attempt: dbPhase.attempt,
          user_input: dbPhase.userInput || null,
          phase_definition: phaseDefinition
            ? {
                id: phaseDefinition.id,
                name: phaseDefinition.name,
                phase_id: phaseDefinition.phase_id,
              }
            : null,
          sector_analysis: sectorAnalysis
            ? {
                id: sectorAnalysis.id,
                sector_performance_overview:
                  sectorAnalysis.sector_performance_overview,
                sector_rotation_thesis: sectorAnalysis.sector_rotation_thesis,
                connection_to_theme: sectorAnalysis.connection_to_theme,
                summary: sectorAnalysis.summary,
                winning_sectors: sectorAnalysis.winning_sectors,
                losing_sectors: sectorAnalysis.losing_sectors,
                top_picks: sectorAnalysis.top_picks,
                status: sectorAnalysis.status,
                created_at: sectorAnalysis.created_at?.toISOString(),
              }
            : null,
        },
      });
    }

    // Phase 4: Stock Screener - get stock_screener and stock_picks
    if (phaseNum === "4") {
      const stockScreener = await prisma.stock_screener.findFirst({
        where: { pipeline_id: run.id },
        orderBy: { created_at: "desc" },
      });

      const stockPicks = await prisma.stock_picks.findMany({
        where: { pipeline_id: run.id },
        orderBy: { rank: "asc" },
      });

      return NextResponse.json({
        run_id: run.runId,
        pipeline_id: run.id,
        date: run.date,
        status:
          run.status === "COMPLETED" ? "completed" : run.status.toLowerCase(),
        started_at: run.startedAt.toISOString(),
        completed_at: run.completedAt?.toISOString(),
        current_phase: {
          phase_id: dbPhase.id,
          phase: dbPhase.phase,
          status: normalizeStatus(dbPhase.status),
          timestamp: dbPhase.timestamp.toISOString(),
          details: null,
          start_time: dbPhase.startTime?.toISOString() || null,
          end_time: dbPhase.endTime?.toISOString() || null,
          attempt: dbPhase.attempt,
          user_input: dbPhase.userInput || null,
          phase_definition: phaseDefinition
            ? {
                id: phaseDefinition.id,
                name: phaseDefinition.name,
                phase_id: phaseDefinition.phase_id,
              }
            : null,
          stock_screener: stockScreener
            ? {
                id: stockScreener.id,
                summary: stockScreener.summary,
                why_these_stocks: stockScreener.why_these_stocks,
                expected_performance: stockScreener.expected_performance,
                eliminated_stocks: stockScreener.eliminated_stocks,
                status: stockScreener.status,
                created_at: stockScreener.created_at?.toISOString(),
              }
            : null,
          stock_picks: stockPicks.map((pick) => ({
            id: pick.id,
            rank: pick.rank,
            ticker: pick.ticker,
            company_name: pick.company_name,
            sector: pick.sector,
            rationale: pick.rationale,
            expected_performance: pick.expected_performance,
            theme_alignment: pick.theme_alignment,
          })),
        },
      });
    }

    // Phase 5: Stock Analyst - get stock_analysis
    if (phaseNum === "5") {
      const stockScreener = await prisma.stock_screener.findFirst({
        where: { pipeline_id: run.id },
        orderBy: { created_at: "desc" },
      });

      const stockPicks = await prisma.stock_picks.findMany({
        where: { pipeline_id: run.id },
        orderBy: { rank: "asc" },
      });

      return NextResponse.json({
        run_id: run.runId,
        pipeline_id: run.id,
        date: run.date,
        status:
          run.status === "COMPLETED" ? "completed" : run.status.toLowerCase(),
        started_at: run.startedAt.toISOString(),
        completed_at: run.completedAt?.toISOString(),
        current_phase: {
          phase_id: dbPhase.id,
          phase: dbPhase.phase,
          status: normalizeStatus(dbPhase.status),
          timestamp: dbPhase.timestamp.toISOString(),
          details: null,
          start_time: dbPhase.startTime?.toISOString() || null,
          end_time: dbPhase.endTime?.toISOString() || null,
          attempt: dbPhase.attempt,
          user_input: dbPhase.userInput || null,
          phase_definition: phaseDefinition
            ? {
                id: phaseDefinition.id,
                name: phaseDefinition.name,
                phase_id: phaseDefinition.phase_id,
              }
            : null,
          stock_screener: stockScreener
            ? {
                id: stockScreener.id,
                summary: stockScreener.summary,
                why_these_stocks: stockScreener.why_these_stocks,
                expected_performance: stockScreener.expected_performance,
                eliminated_stocks: stockScreener.eliminated_stocks,
                status: stockScreener.status,
                created_at: stockScreener.created_at?.toISOString(),
              }
            : null,
          stock_picks: stockPicks.map((pick) => ({
            id: pick.id,
            rank: pick.rank,
            ticker: pick.ticker,
            company_name: pick.company_name,
            sector: pick.sector,
            market_cap: pick.market_cap,
            reason: pick.reason,
            status: pick.status,
            created_at: pick.created_at?.toISOString(),
          })),
        },
      });
    }

    // Phase 6: Stock Analyst - get stock_analysis
    if (phaseNum === "6") {
      const stockAnalyses = await prisma.stock_analysis.findMany({
        where: { pipeline_id: run.id },
        orderBy: { ticker: "asc" },
      });

      return NextResponse.json({
        run_id: run.runId,
        pipeline_id: run.id,
        date: run.date,
        status:
          run.status === "COMPLETED" ? "completed" : run.status.toLowerCase(),
        started_at: run.startedAt.toISOString(),
        completed_at: run.completedAt?.toISOString(),
        current_phase: {
          phase_id: dbPhase.id,
          phase: dbPhase.phase,
          status: normalizeStatus(dbPhase.status),
          timestamp: dbPhase.timestamp.toISOString(),
          details: null,
          start_time: dbPhase.startTime?.toISOString() || null,
          end_time: dbPhase.endTime?.toISOString() || null,
          attempt: dbPhase.attempt,
          user_input: dbPhase.userInput || null,
          phase_definition: phaseDefinition
            ? {
                id: phaseDefinition.id,
                name: phaseDefinition.name,
                phase_id: phaseDefinition.phase_id,
              }
            : null,
          stock_analysis: stockAnalyses.map((analysis) => ({
            id: analysis.id,
            ticker: analysis.ticker,
            company_name: analysis.company_name,
            executive_summary: analysis.executive_summary,
            core_business: analysis.core_business,
            stock_analysis: analysis.stock_analysis,
            theme_connection: analysis.theme_connection,
            investment_recommendation: analysis.investment_recommendation,
            recommendation_rating: analysis.recommendation_rating,
            word_count: analysis.word_count,
            summary: analysis.summary,
            financials: analysis.financials,
            status: analysis.status,
            created_at: analysis.created_at?.toISOString(),
          })),
        },
      });
    }

    // Phase 7: Portfolio Synthesizer - get fundamental_analysis and portfolio_recommendations
    if (phaseNum === "7") {
      const fundamentalAnalysis = await prisma.fundamental_analysis.findFirst({
        where: { pipeline_id: run.id },
        orderBy: { created_at: "desc" },
      });

      const portfolioRecommendations =
        await prisma.portfolio_recommendations.findMany({
          where: { pipeline_id: run.id },
          orderBy: { ticker: "asc" },
        });

      return NextResponse.json({
        run_id: run.runId,
        pipeline_id: run.id,
        date: run.date,
        status:
          run.status === "COMPLETED" ? "completed" : run.status.toLowerCase(),
        started_at: run.startedAt.toISOString(),
        completed_at: run.completedAt?.toISOString(),
        current_phase: {
          phase_id: dbPhase.id,
          phase: dbPhase.phase,
          status: normalizeStatus(dbPhase.status),
          timestamp: dbPhase.timestamp.toISOString(),
          details: null,
          start_time: dbPhase.startTime?.toISOString() || null,
          end_time: dbPhase.endTime?.toISOString() || null,
          attempt: dbPhase.attempt,
          user_input: dbPhase.userInput || null,
          phase_definition: phaseDefinition
            ? {
                id: phaseDefinition.id,
                name: phaseDefinition.name,
                phase_id: phaseDefinition.phase_id,
              }
            : null,
          fundamental_analysis: fundamentalAnalysis
            ? {
                id: fundamentalAnalysis.id,
                overall_market_assessment:
                  fundamentalAnalysis.overall_market_assessment,
                theme_recap: fundamentalAnalysis.theme_recap,
                portfolio_strategy: fundamentalAnalysis.portfolio_strategy,
                risk_factors: fundamentalAnalysis.risk_factors,
                sector_allocation: fundamentalAnalysis.sector_allocation,
                summary: fundamentalAnalysis.summary,
                status: fundamentalAnalysis.status,
                created_at: fundamentalAnalysis.created_at?.toISOString(),
              }
            : null,
          portfolio_recommendations: portfolioRecommendations.map((rec) => ({
            id: rec.id,
            ticker: rec.ticker,
            recommendation_rating: rec.recommendation_rating,
            conviction_level: rec.conviction_level,
            reasoning: rec.reasoning,
            allocation_pct: rec.allocation_pct,
            position_size_rationale: rec.position_size_rationale,
            entry_price_target: rec.entry_price_target,
            exit_criteria: rec.exit_criteria,
            risk_reward_ratio: rec.risk_reward_ratio,
          })),
        },
      });
    }

    // Phase 8 handled above
    return NextResponse.json({
      run_id: run.runId,
      pipeline_id: run.id,
      date: run.date,
      status:
        run.status === "COMPLETED" ? "completed" : run.status.toLowerCase(),
      started_at: run.startedAt.toISOString(),
      completed_at: run.completedAt?.toISOString(),
      current_phase: {
        phase_id: dbPhase.id,
        phase: dbPhase.phase,
        status: normalizeStatus(dbPhase.status),
        timestamp: dbPhase.timestamp.toISOString(),
        details: null,
        start_time: dbPhase.startTime?.toISOString() || null,
        end_time: dbPhase.endTime?.toISOString() || null,
        attempt: dbPhase.attempt,
        user_input: dbPhase.userInput || null,
        phase_definition: phaseDefinition
          ? {
              id: phaseDefinition.id,
              name: phaseDefinition.name,
              phase_id: phaseDefinition.phase_id,
            }
          : null,
        not_configured: true,
        message: "Phase data not yet connected",
      },
    });
  } catch (err) {
    console.error("Phase detail API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
