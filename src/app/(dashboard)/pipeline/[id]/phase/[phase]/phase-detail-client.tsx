"use client";

import { useQuery } from "@tanstack/react-query";
import { phaseDetailQuery } from "@/features/pipeline/queries";
import { PhaseDetailsRenderer } from "@/features/pipeline/components/phase-details";
import { PHASE_LABELS } from "@/features/pipeline/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import type { PhaseStatus } from "@/features/pipeline/types";

function StatusBadge({ status }: { status: PhaseStatus }) {
  const config: Record<
    PhaseStatus,
    { label: string; className: string; icon: React.ElementType }
  > = {
    completed: {
      label: "Completed",
      className: "bg-green-500/10 text-green-500 border-green-500/20",
      icon: CheckCircle2,
    },
    running: {
      label: "Running",
      className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      icon: Activity,
    },
    pending: {
      label: "Pending",
      className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      icon: Clock,
    },
    failed: {
      label: "Failed",
      className: "bg-red-500/10 text-red-500 border-red-500/20",
      icon: XCircle,
    },
  };
  const { label, className, icon: Icon } = config[status];
  return (
    <Badge className={cn("gap-1", className)}>
      <Icon className="size-3" />
      {label}
    </Badge>
  );
}

export default function PhaseDetailClient({
  runId,
  phase,
}: {
  runId: string;
  phase: string;
}) {
  const {
    data: phaseData,
    isLoading,
    error,
  } = useQuery(phaseDetailQuery(runId, phase));

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
          <AlertCircle className="size-4" />
          Loading phase...
        </div>
      </div>
    );
  }

  if (error || !phaseData) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>Failed to load phase details</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-sm text-muted-foreground">
              Run: {runId} | Phase: {phase}
            </span>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPhase = phaseData.current_phase;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center gap-2">
        <Link
          href={`/pipeline/${runId}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Pipeline
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentPhase.phase}
            <StatusBadge status={currentPhase.status as PhaseStatus} />
          </CardTitle>
          <CardDescription>
            <span className="font-mono text-xs">
              Phase ID: {currentPhase.phase_id}
            </span>
            <span className="mx-2">|</span>
            <span className="font-mono text-xs">
              Run ID: {phaseData.run_id}
            </span>
            {phaseData.pipeline_id && (
              <>
                <span className="mx-2">|</span>
                <span className="font-mono text-xs">
                  Pipeline ID: {phaseData.pipeline_id}
                </span>
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Date</span>
              <p className="font-medium">{phaseData.date || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Started</span>
              <p className="font-medium">
                {phaseData.started_at
                  ? new Date(phaseData.started_at).toLocaleString("id-ID")
                  : "-"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Phase Start</span>
              <p className="font-medium">
                {currentPhase.start_time
                  ? new Date(currentPhase.start_time).toLocaleString("id-ID")
                  : "-"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Phase End</span>
              <p className="font-medium">
                {currentPhase.end_time
                  ? new Date(currentPhase.end_time).toLocaleString("id-ID")
                  : "-"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Duration</span>
              <p className="font-medium">
                {(() => {
                  if (currentPhase.start_time && currentPhase.end_time) {
                    const ms =
                      new Date(currentPhase.end_time).getTime() -
                      new Date(currentPhase.start_time).getTime();
                    return ms > 60000
                      ? `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`
                      : `${Math.round(ms / 1000)}s`;
                  }
                  return "-";
                })()}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Attempts</span>
              <p className="font-medium">{currentPhase.attempt ?? "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phase Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PhaseDetailsRenderer
            phaseName={currentPhase.phase}
            details={currentPhase.details}
            dataSummary={(currentPhase as any).data_summary}
            reportLink={(currentPhase as any).report_link}
            macroAnalysis={(currentPhase as any).macro_analysis}
            macroIndicators={(currentPhase as any).macro_indicators}
            ihsgAnalysis={(currentPhase as any).ihsg_analysis}
            ihsgComponents={(currentPhase as any).ihsg_components}
            sectorAnalysis={(currentPhase as any).sector_analysis}
            sectorComponents={(currentPhase as any).sector_components}
            stockScreener={(currentPhase as any).stock_screener}
            stockPicks={(currentPhase as any).stock_picks}
            stockAnalysis={(currentPhase as any).stock_analysis}
            fundamentalAnalysis={(currentPhase as any).fundamental_analysis}
            portfolioRecommendations={
              (currentPhase as any).portfolio_recommendations
            }
            notConfigured={(currentPhase as any).not_configured}
          />
        </CardContent>
      </Card>
    </div>
  );
}
