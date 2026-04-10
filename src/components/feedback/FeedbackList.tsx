"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MessageSquare, Plus, Pencil, Trash2 } from "lucide-react";

type FeedbackStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "RESOLVED"
  | "ARCHIVED"
  | "REJECTED";

interface FeedbackItem {
  id: string;
  phase: string;
  content: string;
}

interface Pipeline {
  id: string;
  runId: string;
  date: string;
  status: string;
}

interface Feedback {
  id: string;
  pipelineId: string;
  status: FeedbackStatus;
  createdAt: string;
  items: FeedbackItem[];
  pipeline: Pipeline;
}

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  RESOLVED: "Resolved",
  ARCHIVED: "Archived",
  REJECTED: "Rejected",
};

const STATUS_BADGE_VARIANT: Record<
  FeedbackStatus,
  "secondary" | "default" | "destructive" | "outline" | "success"
> = {
  DRAFT: "secondary",
  SUBMITTED: "default",
  RESOLVED: "success",
  ARCHIVED: "outline",
  REJECTED: "destructive",
};

export function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((data) => setFeedbacks(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-8 text-center text-muted-foreground">Loading...</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Feedback</h2>
        <Button asChild>
          <Link href="/feedback/new">
            <Plus className="h-4 w-4" />
            Create New Feedback
          </Link>
        </Button>
      </div>

      {feedbacks.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>No feedback yet.</p>
          <Button variant="link" asChild className="mt-2">
            <Link href="/feedback/new">Create the first one →</Link>
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pipeline</TableHead>
              <TableHead>Phases</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((fb) => (
              <TableRow key={fb.id}>
                <TableCell className="font-mono text-xs">
                  <div>{fb.pipeline?.runId ?? fb.pipelineId}</div>
                  <div className="text-xs text-muted-foreground">
                    {fb.pipeline?.date}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {fb.items.map((item) => (
                      <Badge
                        key={item.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {item.phase}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      STATUS_BADGE_VARIANT[fb.status] as
                        | "secondary"
                        | "default"
                        | "destructive"
                        | "outline"
                        | "success"
                    }
                  >
                    {STATUS_LABELS[fb.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(fb.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/feedback/${fb.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={
                        fb.status === "RESOLVED" || fb.status === "ARCHIVED"
                      }
                      onClick={async () => {
                        if (!confirm("Delete this feedback?")) return;
                        await fetch(`/api/feedback/${fb.id}`, {
                          method: "DELETE",
                        });
                        setFeedbacks(feedbacks.filter((f) => f.id !== fb.id));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
