import { NextResponse } from "next/server"
import { getReports, getReportById, getLatestReport, createReport } from "@/features/report/dal/queries"

export async function GET() {
  try {
    const [reports, latest] = await Promise.all([
      getReports(),
      getLatestReport(),
    ])
    return NextResponse.json({ reports, latest })
  } catch (err) {
    console.error("Report API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const report = await createReport({
      type: body.type,
      title: body.title,
      weekDate: new Date(body.weekDate),
    })
    return NextResponse.json(report, { status: 201 })
  } catch (err) {
    console.error("Report POST error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
