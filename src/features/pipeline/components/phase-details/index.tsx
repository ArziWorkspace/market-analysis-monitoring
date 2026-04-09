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
  notConfigured?: boolean;
}

function getPhaseType(phaseName: string): string {
  const lower = phaseName.toLowerCase();
  if (lower.includes("phase 1") || lower.includes("market gatherer"))
    return "market_gatherer";
  if (lower.includes("phase 2") || lower.includes("macro analyst"))
    return "macro_analyst";
  if (lower.includes("phase 3") || lower.includes("ihsg analyst"))
    return "ihsg_analyst";
  if (lower.includes("phase 4") || lower.includes("sector analyst"))
    return "sector_analyst";
  if (lower.includes("phase 5") || lower.includes("stock screener"))
    return "stock_screener";
  if (lower.includes("phase 6") || lower.includes("stock analyst"))
    return "stock_analyst";
  if (lower.includes("phase 7") || lower.includes("fundamental analyst"))
    return "fundamental_analyst";
  if (lower.includes("phase 8") || lower.includes("report generator"))
    return "report_generator";
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
  notConfigured,
}: PhaseDetailsRendererProps) {
  const phaseType = getPhaseType(phaseName);

  // If no details at all, show generic empty state
  if (
    !details &&
    !dataSummary &&
    !reportLink &&
    !macroAnalysis &&
    (!macroIndicators || macroIndicators.length === 0) &&
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
  if (phaseType === "ihsg_analyst") {
    return <IhsgAnalystPhaseDetails />;
  }

  // Phase 4: Sector Analyst
  if (phaseType === "sector_analyst") {
    return <SectorAnalystPhaseDetails />;
  }

  // Phase 5: Stock Screener
  if (phaseType === "stock_screener") {
    return <StockScreenerPhaseDetails />;
  }

  // Phase 6: Stock Analyst
  if (phaseType === "stock_analyst") {
    return <StockAnalystPhaseDetails />;
  }

  // Phase 7: Fundamental Analyst
  if (phaseType === "fundamental_analyst") {
    return <FundamentalAnalystPhaseDetails />;
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
