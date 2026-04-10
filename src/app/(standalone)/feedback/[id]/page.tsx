"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";

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

interface FeedbackData {
  id: string;
  pipelineId: string;
  status: FeedbackStatus;
  items: FeedbackItem[];
}

export default function EditFeedbackPage() {
  const params = useParams();
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = params.id;
    if (!id) return;

    fetch(`/api/feedback/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setFeedback({
          id: data.id,
          pipelineId: data.pipelineId,
          status: data.status,
          items: data.items ?? [],
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="container px-4 py-8">Loading...</div>;
  if (error)
    return <div className="container px-4 py-8 text-destructive">{error}</div>;
  if (!feedback) return <div className="container px-4 py-8">Not found</div>;

  const isLocked =
    feedback.status === "RESOLVED" || feedback.status === "ARCHIVED";

  return (
    <div className="container max-w-4xl mx-auto px-4 space-y-6">
      <h1 className="text-2xl font-bold">Edit Feedback</h1>
      <FeedbackForm mode="edit" initialData={feedback} readOnly={isLocked} />
    </div>
  );
}
