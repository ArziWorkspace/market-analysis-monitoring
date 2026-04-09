import { NextResponse } from "next/server"
import { getReportById } from "@/features/report/dal/queries"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const report = await getReportById(id)

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    return NextResponse.json(report)
  } catch (err) {
    console.error("Report detail API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
