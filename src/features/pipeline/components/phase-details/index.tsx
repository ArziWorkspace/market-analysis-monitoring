"use client"

import { MarketGathererDetails } from "./market-gatherer-details"
import { ReportGeneratorPhaseDetails } from "./report-generator-phase-details"
import { PendingPhaseDetails } from "./pending-phase-details"
import { GenericPhaseDetails } from "./generic-details"
import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PhaseDetailsRendererProps {
  phaseName: string
  details: Record<string, unknown> | null
  dataSummary?: {
    run_id: string
    collected_at: string | null
    status: string | null
    records: {
      macro_data: number
      companies_data: number
      commodities_data: number
      ihsg_news: number
      news_data: number
      world_indices: number
      events_data: number
    }
    total_records: number
  } | null
  reportLink?: {
    report_id: string
    report_title: string
    version: number
    version_id: string
    url: string
  } | null
  notConfigured?: boolean
}

function getPhaseType(phaseName: string): string {
  const lower = phaseName.toLowerCase()
  if (lower.includes("phase 1") || lower.includes("market gatherer")) return "market_gatherer"
  if (lower.includes("phase 8") || lower.includes("report generator")) return "report_generator"
  if (lower.includes("phase")) return "pending"
  return "unknown"
}

export function PhaseDetailsRenderer({ 
  phaseName, 
  details, 
  dataSummary,
  reportLink,
  notConfigured 
}: PhaseDetailsRendererProps) {
  const phaseType = getPhaseType(phaseName)

  // If no details at all, show generic empty state
  if (!details && !dataSummary && !reportLink && !notConfigured) {
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

  // Phase 1: Market Gatherer - show data summary
  if (phaseType === "market_gatherer" && dataSummary) {
    return <MarketGathererDetails dataSummary={dataSummary} />
  }

  // Phase 8: Report Generator - show report link
  if (phaseType === "report_generator" && reportLink) {
    return <ReportGeneratorPhaseDetails reportLink={reportLink} />
  }

  // Phase 2-7: Not configured yet
  if (notConfigured || phaseType === "pending") {
    return <PendingPhaseDetails />
  }

  // Fallback: generic JSON view
  if (details) {
    return <GenericPhaseDetails details={details} />
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
  )
}

export { MarketGathererDetails } from "./market-gatherer-details"
export { ReportGeneratorPhaseDetails } from "./report-generator-phase-details"
export { PendingPhaseDetails } from "./pending-phase-details"
export { GenericPhaseDetails } from "./generic-details"
