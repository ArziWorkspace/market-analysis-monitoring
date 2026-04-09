"use client"

import { useParams } from "next/navigation"
import { ReportDetail } from "@/features/report/components/report-detail"

export default function ReportDetailClient() {
  const params = useParams()
  const reportId = params.id as string

  return <ReportDetail reportId={reportId} />
}
