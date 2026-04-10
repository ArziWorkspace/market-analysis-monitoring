"use client";

import { MarketGathererDetails } from "./market-gatherer-details";
import { ReportGeneratorPhaseDetails } from "./report-generator-phase-details";
import { MacroAnalystPhaseDetails } from "./macro-analyst-phase-details";
import { IhsgAnalystPhaseDetails } from "./ihsg-analyst-phase-details";
import { SectorAnalystPhaseDetails } from "./sector-analyst-phase-details";
import { StockScreenerPhaseDetails } from "./stock-screener-phase-details";
import { StockAnalystPhaseDetails } from "./stock-analyst-phase-details";
import { FundamentalAnalystPhaseDetails } from "./fundamental-analyst-phase-details";
import { PendingPhaseDetails } from "./pending-phase-details";
import { GenericPhaseDetails } from "./generic-details";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PhaseDetailsRendererProps {
  phaseName: string;
  details: Record<string, unknown> | null;
  dataSummary?: {
    run_id: string;
    collected_at: string | null;
    status: string | null;
    records: {
      macro_data: number;
      companies_data: number;
      commodities_data: number;
      ihsg_news: number;
      news_data: number;
      world_indices: number;
      events_data: number;
    };
    total_records: number;
  } | null;
  reportLink?: {
    report_id: string;
    report_title: string;
    version: number;
    version_id: string;
    url: string;
  } | null;
  macroAnalysis?: {
    id: string;
    theme_name: string | null;
    theme_description: string | null;
    global_events_analysis: string | null;
    local_events_analysis: string | null;
    causality_chain: string | null;
    investment_implications: string | null;
    summary: string | null;
    status: string | null;
    created_at: string | null;
  } | null;
  macroIndicators?: Array<{
    id: string;
    indicator_name: string;
    indicator_value: string | null;
    interpretation: string | null;
    created_at: string | null;
  }>;
  ihsgAnalysis?: Record<string, unknown> | null;
  ihsgComponents?: Array<Record<string, unknown>>;
  sectorAnalysis?: {
    id: string;
    sector_performance_overview: string | null;
    sector_rotation_thesis: string | null;
    connection_to_theme: string | null;
    summary: string | null;
    winning_sectors: unknown | null;
    losing_sectors: unknown | null;
    top_picks: unknown | null;
    status: string | null;
    created_at: string | null;
  } | null;
  sectorComponents?: Array<{
    id: string;
    sector_name: string | null;
    verdict: string | null;
    performance: string | null;
    rationale: string | null;
    created_at: string | null;
  }>;
  stockScreener?: {
    id: string;
    summary: string | null;
    why_these_stocks: string | null;
    expected_performance: string | null;
    eliminated_stocks: unknown | null;
    status: string | null;
    created_at: string | null;
  } | null;
  stockPicks?: Array<{
    id: string;
    rank: number | null;
    ticker: string | null;
    company_name: string | null;
    sector: string | null;
    rationale: string | null;
    expected_performance: string | null;
    theme_alignment: string | null;
  }>;
  stockAnalysis?: Array<{
    id: string;
    ticker: string;
    company_name: string | null;
    executive_summary: string | null;
    core_business: string | null;
    stock_analysis: string | null;
    theme_connection: string | null;
    investment_recommendation: string | null;
    recommendation_rating: string | null;
    word_count: number | null;
    summary: string | null;
    financials: unknown | null;
    status: string | null;
    created_at: string | null;
  }>;
  fundamentalAnalysis?: {
    id: string;
    overall_market_assessment: string | null;
    theme_recap: string | null;
    portfolio_strategy: string | null;
    risk_factors: unknown | null;
    sector_allocation: unknown | null;
    summary: string | null;
    status: string | null;
    created_at: string | null;
  } | null;
  portfolioRecommendations?: Array<{
    id: string;
    ticker: string;
    recommendation_rating: string | null;
    conviction_level: string | null;
    reasoning: string | null;
    allocation_pct: number | null;
    position_size_rationale: string | null;
    entry_price_target: string | null;
    exit_criteria: string | null;
    risk_reward_ratio: string | null;
  }>;
  notConfigured?: boolean;
  phaseDefinitionName?: string | null;
}

function getPhaseType(phaseDefinitionName: string | null | undefined): string {
  if (!phaseDefinitionName) return "unknown";
  const lower = phaseDefinitionName.toLowerCase();
  if (lower.includes("market gatherer")) return "market_gatherer";
  if (lower.includes("macro analyst")) return "macro_analyst";
  if (lower.includes("ihsg analyst")) return "ihsg_analyst";
  if (lower.includes("sector analyst")) return "sector_analyst";
  if (lower.includes("stock screener")) return "stock_screener";
  if (lower.includes("stock analyst")) return "stock_analyst";
  if (
    lower.includes("portfolio synthesizer") ||
    lower.includes("fundamental analyst")
  )
    return "portfolio_synthesizer";
  if (lower.includes("report generator")) return "report_generator";
  if (lower.includes("phase")) return "pending";
  return "unknown";
}

export function PhaseDetailsRenderer({
  phaseName,
  details,
  dataSummary,
  reportLink,
  macroAnalysis,
  macroIndicators,
  ihsgAnalysis,
  ihsgComponents,
  sectorAnalysis,
  sectorComponents,
  stockScreener,
  stockPicks,
  stockAnalysis,
  fundamentalAnalysis,
  portfolioRecommendations,
  notConfigured,
  phaseDefinitionName,
}: PhaseDetailsRendererProps) {
  const phaseType = getPhaseType(phaseDefinitionName);

  // If no details at all, show generic empty state
  if (
    !details &&
    !dataSummary &&
    !reportLink &&
    !macroAnalysis &&
    (!macroIndicators || macroIndicators.length === 0) &&
    !ihsgAnalysis &&
    (!ihsgComponents || ihsgComponents.length === 0) &&
    !sectorAnalysis &&
    (!sectorComponents || sectorComponents.length === 0) &&
    !stockScreener &&
    (!stockPicks || stockPicks.length === 0) &&
    (!stockAnalysis || stockAnalysis.length === 0) &&
    !fundamentalAnalysis &&
    (!portfolioRecommendations || portfolioRecommendations.length === 0) &&
    !notConfigured
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertCircle className="size-4 text-yellow-500" />
            No Details Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This phase does not have any stored details yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Phase 1: Market Gatherer - show data summary
  if (phaseType === "market_gatherer" && dataSummary) {
    return <MarketGathererDetails dataSummary={dataSummary} />;
  }

  // Phase 2: Macro Analyst - show macro analysis and indicators
  if (
    phaseType === "macro_analyst" &&
    (macroAnalysis || (macroIndicators && macroIndicators.length > 0))
  ) {
    return (
      <MacroAnalystPhaseDetails
        macroAnalysis={macroAnalysis || null}
        macroIndicators={macroIndicators || []}
      />
    );
  }

  // Phase 3: IHSG Analyst
  if (
    phaseType === "ihsg_analyst" &&
    (ihsgAnalysis || (ihsgComponents && ihsgComponents.length > 0))
  ) {
    return (
      <IhsgAnalystPhaseDetails
        ihsgAnalysis={ihsgAnalysis || null}
        ihsgComponents={ihsgComponents || []}
      />
    );
  }

  // Phase 4: Sector Analyst
  if (phaseType === "sector_analyst") {
    return (
      <SectorAnalystPhaseDetails
        sectorAnalysis={sectorAnalysis || null}
        sectorComponents={sectorComponents || []}
      />
    );
  }

  // Phase 4: Stock Screener
  if (phaseType === "stock_screener") {
    return (
      <StockScreenerPhaseDetails
        stockScreener={stockScreener || null}
        stockPicks={stockPicks || []}
      />
    );
  }

  // Phase 5: Stock Analyst
  if (phaseType === "stock_analyst") {
    return (
      <StockAnalystPhaseDetails
        analysisData={
          stockAnalysis
            ? {
                stocksAnalyzed: stockAnalysis.map((s) => s.ticker),
                recommendations: stockAnalysis.map((s) => ({
                  ticker: s.ticker,
                  companyName: s.company_name || "",
                  rating: s.recommendation_rating || "",
                  targetPrice: "-",
                  rationale: s.summary || s.stock_analysis || "",
                })),
              }
            : null
        }
      />
    );
  }

  // Phase 7: Portfolio Synthesizer
  if (phaseType === "portfolio_synthesizer") {
    return (
      <PortfolioSynthesizerPhaseDetails
        fundamentalAnalysis={fundamentalAnalysis || null}
        portfolioRecommendations={portfolioRecommendations || []}
      />
    );
  }

  // Phase 8: Report Generator - show report link
  if (phaseType === "report_generator" && reportLink) {
    return <ReportGeneratorPhaseDetails reportLink={reportLink} />;
  }

  // Phase 2-7: Not configured yet
  if (notConfigured || phaseType === "pending") {
    return <PendingPhaseDetails />;
  }

  // Fallback: generic JSON view
  if (details) {
    return <GenericPhaseDetails details={details} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <AlertCircle className="size-4 text-yellow-500" />
          No Details Available
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This phase does not have any stored details yet.
        </p>
      </CardContent>
    </Card>
  );
}

export { MarketGathererDetails } from "./market-gatherer-details";
export { ReportGeneratorPhaseDetails } from "./report-generator-phase-details";
export { MacroAnalystPhaseDetails } from "./macro-analyst-phase-details";
export { IhsgAnalystPhaseDetails } from "./ihsg-analyst-phase-details";
export { SectorAnalystPhaseDetails } from "./sector-analyst-phase-details";
export { StockScreenerPhaseDetails } from "./stock-screener-phase-details";
export { StockAnalystPhaseDetails } from "./stock-analyst-phase-details";
export { FundamentalAnalystPhaseDetails } from "./fundamental-analyst-phase-details";
export { PendingPhaseDetails } from "./pending-phase-details";
export { GenericPhaseDetails } from "./generic-details";
export { PortfolioSynthesizerPhaseDetails } from "./portfolio-synthesizer-phase-details";
