"use client"

import { FeedbackForm } from "@/components/feedback/FeedbackForm"

export default function NewFeedbackPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 space-y-6">
      <h1 className="text-2xl font-bold">Create Feedback</h1>
      <FeedbackForm mode="create" />
    </div>
  )
}
