"use client"

import { DataGathererDetails } from "./data-gatherer-details"
import { MacroAnalystDetails } from "./macro-analyst-details"
import { StockScreenerDetails } from "./stock-screener-details"
import { ReportGeneratorDetails } from "./report-generator-details"
import { GenericPhaseDetails } from "./generic-details"
import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PhaseDetailsRendererProps {
  phaseName: string
  details: Record<string, unknown> | null
}

function getPhaseType(phaseName: string): string {
  const lower = phaseName.toLowerCase()
  if (lower.includes("market gatherer") || lower.includes("data_gathering")) return "data_gatherer"
  if (lower.includes("macro analyst") || lower.includes("macro_analysis")) return "macro_analyst"
  if (lower.includes("ihsg analyst") || lower.includes("ihsg_analysis")) return "ihsg_analyst"
  if (lower.includes("sector analyst") || lower.includes("sector_analysis")) return "sector_analyst"
  if (lower.includes("stock screener") || lower.includes("stock_screener")) return "stock_screener"
  if (lower.includes("stock analyst") || lower.includes("stock_analyst")) return "stock_analyst"
  if (lower.includes("fundamental analyst") || lower.includes("fundamental_analyst")) return "fundamental_analyst"
  if (lower.includes("report generator") || lower.includes("report_generation")) return "report_generator"
  return "unknown"
}

export function PhaseDetailsRenderer({ phaseName, details }: PhaseDetailsRendererProps) {
  if (!details) {
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
    )
  }

  const phaseType = getPhaseType(phaseName)

  switch (phaseType) {
    case "data_gatherer":
      return <DataGathererDetails details={details as Parameters<typeof DataGathererDetails>[0]["details"]} />
    case "macro_analyst":
      return <MacroAnalystDetails details={details as Parameters<typeof MacroAnalystDetails>[0]["details"]} />
    case "stock_screener":
      return <StockScreenerDetails details={details as Parameters<typeof StockScreenerDetails>[0]["details"]} />
    case "report_generator":
      return <ReportGeneratorDetails details={details as Parameters<typeof ReportGeneratorDetails>[0]["details"]} />
    default:
      return <GenericPhaseDetails details={details} />
  }
}

export { DataGathererDetails } from "./data-gatherer-details"
export { MacroAnalystDetails } from "./macro-analyst-details"
export { StockScreenerDetails } from "./stock-screener-details"
export { ReportGeneratorDetails } from "./report-generator-details"
export { GenericPhaseDetails } from "./generic-details"
