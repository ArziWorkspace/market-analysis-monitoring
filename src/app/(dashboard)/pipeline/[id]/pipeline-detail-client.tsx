"use client"

import { useQuery } from "@tanstack/react-query"
import { pipelineDetailQuery } from "@/features/pipeline/queries"
import { PHASE_LABELS } from "@/features/pipeline/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Activity, CheckCircle2, Clock, XCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { PhaseStatus } from "@/features/pipeline/types"

function StatusBadge({ status }: { status: PhaseStatus }) {
  const config: Record<PhaseStatus, { label: string; className: string; icon: React.ElementType }> = {
    completed: { label: "Completed", className: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle2 },
    running: { label: "Running", className: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Activity },
    pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock },
    failed: { label: "Failed", className: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
  }
  const { label, className, icon: Icon } = config[status]
  return (
    <Badge className={cn("gap-1", className)}>
      <Icon className="size-3" />
      {label}
    </Badge>
  )
}

export default function PipelineDetailClient({ runId }: { runId: string }) {
  const { data: run, isLoading, error } = useQuery(pipelineDetailQuery(runId))

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
          <AlertCircle className="size-4" />
          Loading pipeline...
        </div>
      </div>
    )
  }

  if (error || !run) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>Failed to load pipeline run</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-sm text-muted-foreground">Run ID: {runId}</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completedPhases = run.phases.filter((p: any) => p.status === "completed").length
  const totalPhases = run.phases.length
  const pct = totalPhases > 0 ? (completedPhases / totalPhases) * 100 : 0
  const duration = run.completed_at
    ? (new Date(run.completed_at).getTime() - new Date(run.started_at).getTime()) / 1000
    : null
  const durationStr = duration
    ? duration > 60
      ? `${Math.round(duration / 60)}m ${Math.round(duration % 60)}s`
      : `${Math.round(duration)}s`
    : null

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center gap-2">
        <Link
          href="/pipeline"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Pipeline
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Pipeline Run
            <StatusBadge status={run.status as PhaseStatus} />
          </CardTitle>
          <CardDescription>
            <span className="font-mono text-xs">Run ID: {run.run_id}</span>
            {run.pipeline_id && (
              <span className="font-mono text-xs ml-2">| Pipeline ID: {run.pipeline_id}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Date</span>
              <p className="font-medium">{run.date}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Started</span>
              <p className="font-medium">
                {new Date(run.started_at).toLocaleString("id-ID")}
              </p>
            </div>
            {durationStr && (
              <div>
                <span className="text-muted-foreground">Duration</span>
                <p className="font-medium">{durationStr}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{completedPhases}/{totalPhases} phases</span>
              <span>{Math.round(pct)}%</span>
            </div>
            <Progress value={pct} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phases</CardTitle>
          <CardDescription>{totalPhases} phases in this run</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phase ID</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {run.phases.map((phase: any) => (
                <TableRow key={phase.phase_id || phase.phase}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {phase.phase_id || "-"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {PHASE_LABELS[phase.phase as keyof typeof PHASE_LABELS] ?? phase.phase}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={phase.status as PhaseStatus} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(phase.timestamp).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    {(phase.details || (phase as any).data_summary || (phase as any).report_link) ? (
                      <Link
                        href={`/pipeline/${runId}/phase/${encodeURIComponent(phase.phase)}`}
                        className="text-sm text-blue-500 hover:underline cursor-pointer"
                      >
                        View
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
