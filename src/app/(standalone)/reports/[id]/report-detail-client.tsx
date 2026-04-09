"use client"

import { useParams } from "next/navigation"
import { ReportDetail } from "@/features/report/components/report-detail"

export default function ReportDetailClient() {
  const params = useParams()
  const reportId = params.id as string

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <ReportDetail reportId={reportId} />
    </div>
  )
}
