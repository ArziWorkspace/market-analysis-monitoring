import { NextResponse } from "next/server"
import { getPipelineRuns, getCurrentPipeline, getLatestRun } from "@/features/pipeline/dal/queries"

export async function GET() {
  try {
    const [runs, current, latest] = await Promise.all([
      getPipelineRuns(),
      getCurrentPipeline(),
      getLatestRun(),
    ])

    return NextResponse.json({
      runs,
      current,
      latest,
    })
  } catch (err) {
    console.error("Pipeline API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
