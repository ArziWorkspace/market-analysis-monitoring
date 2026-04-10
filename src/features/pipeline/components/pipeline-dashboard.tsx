"use client";

import { useQuery } from "@tanstack/react-query";
import {
  pipelineHistoryQuery,
  currentPipelineQuery,
  latestRunQuery,
} from "../queries";
import type { PipelineRun, CurrentPipeline, PhaseStatus } from "../types";
import { PHASE_LABELS } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

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

function PhaseProgress({ phases }: { phases: PipelineRun["phases"] }) {
  const completed = phases.filter((p) => p.status === "completed").length;
  const total = phases.length;
  const pct = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          {completed}/{total} phases
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}

function CurrentStatusCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Status</CardTitle>
        <CardDescription>Live pipeline run</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
}

function LatestRunCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Run</CardTitle>
        <CardDescription>Most recent completed run</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

function CurrentStatusCard({ current }: { current: CurrentPipeline | null }) {
  if (!current) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
          <CardDescription>Live pipeline run</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="size-4" />
            <span>No pipeline running</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="border-blue-500/30 bg-blue-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="size-5 text-blue-500 animate-pulse" />
          Pipeline Running
        </CardTitle>
        <CardDescription>Run ID: {current.run_id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Phase</span>
          <span className="font-medium">
            {PHASE_LABELS[current.phase] ?? current.phase}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Started {new Date(current.started_at).toLocaleString("id-ID")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function LatestRunCard({ run }: { run: PipelineRun | null }) {
  if (!run) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest Run</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-muted-foreground">No runs yet</span>
        </CardContent>
      </Card>
    );
  }
  const completedPhases = run.phases.filter(
    (p) => p.status === "completed",
  ).length;
  const totalPhases = run.phases.length;
  const duration = run.completed_at
    ? (new Date(run.completed_at).getTime() -
        new Date(run.started_at).getTime()) /
      1000
    : null;
  const durationStr = duration
    ? duration > 60
      ? `${Math.round(duration / 60)}m ${Math.round(duration % 60)}s`
      : `${Math.round(duration)}s`
    : null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Run</CardTitle>
        <CardDescription>Run ID: {run.run_id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PhaseProgress phases={run.phases} />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {completedPhases}/{totalPhases} phases
          </span>
          {durationStr && (
            <span className="text-muted-foreground">
              Duration: {durationStr}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RunHistoryTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Run History</CardTitle>
        <CardDescription>Loading...</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RunHistoryTable({ runs }: { runs: PipelineRun[] }) {
  if (runs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Run History</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-muted-foreground">No runs yet</span>
        </CardContent>
      </Card>
    );
  }
  const sorted = [...runs].sort(
    (a, b) =>
      new Date(b.started_at).getTime() - new Date(a.started_at).getTime(),
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Run History</CardTitle>
        <CardDescription>{runs.length} total runs</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Run ID</TableHead>
              <TableHead>Pipeline ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started At</TableHead>
              <TableHead>Completed At</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Phases</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((run) => {
              const allCompleted = run.phases.every(
                (p) => p.status === "completed",
              );
              const hasFailed = run.phases.some((p) => p.status === "failed");
              const status: PhaseStatus = hasFailed
                ? "failed"
                : allCompleted
                  ? "completed"
                  : "running";
              const completedCount = run.phases.filter(
                (p) => p.status === "completed",
              ).length;
              const duration = run.completed_at
                ? (new Date(run.completed_at).getTime() -
                    new Date(run.started_at).getTime()) /
                  1000
                : null;
              const durationStr = duration
                ? duration > 60
                  ? `${Math.round(duration / 60)}m ${Math.round(duration % 60)}s`
                  : `${Math.round(duration)}s`
                : null;

              return (
                <TableRow
                  key={run.run_id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-mono text-sm">
                    <Link
                      href={`/pipeline/${run.run_id}`}
                      className="hover:underline"
                    >
                      {run.run_id}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {run.pipeline_id || "-"}
                  </TableCell>
                  <TableCell>{run.date || "-"}</TableCell>
                  <TableCell>
                    <StatusBadge status={status} />
                  </TableCell>
                  <TableCell className="text-sm">
                    {run.started_at
                      ? new Date(run.started_at).toLocaleString("id-ID")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {run.completed_at
                      ? new Date(run.completed_at).toLocaleString("id-ID")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {durationStr || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {completedCount}/{run.phases.length} completed
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function PipelineDashboard() {
  const { data: current, isLoading: currentLoading } =
    useQuery(currentPipelineQuery);
  const { data: latest, isLoading: latestLoading } = useQuery(latestRunQuery);
  const { data: history, isLoading: historyLoading } =
    useQuery(pipelineHistoryQuery);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        {currentLoading ? (
          <CurrentStatusCardSkeleton />
        ) : (
          <CurrentStatusCard current={current ?? null} />
        )}
        {latestLoading ? (
          <LatestRunCardSkeleton />
        ) : (
          <LatestRunCard run={latest ?? null} />
        )}
      </div>
      {historyLoading ? (
        <RunHistoryTableSkeleton />
      ) : (
        <RunHistoryTable runs={history ?? []} />
      )}
    </div>
  );
}
