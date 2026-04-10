import { FeedbackList } from "@/components/feedback/FeedbackList";

export default async function FeedbackPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 space-y-6">
      <h1 className="text-2xl font-bold">Feedback</h1>
      <FeedbackList />
    </div>
  );
}
