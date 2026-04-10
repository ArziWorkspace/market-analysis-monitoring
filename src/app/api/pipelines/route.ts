import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const pipelines = await prisma.pipelineRun.findMany({
      select: {
        id: true,
        runId: true,
        date: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(pipelines)
  } catch (error) {
    console.error("GET /api/pipelines error:", error)
    return NextResponse.json({ error: "Failed to fetch pipelines" }, { status: 500 })
  }
}
