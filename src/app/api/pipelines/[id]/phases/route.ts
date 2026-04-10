import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const phases = await prisma.phase.findMany({
      where: { pipelineId: id },
      select: {
        phase: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(phases);
  } catch (error) {
    console.error("GET /api/pipelines/[id]/phases error:", error);
    return NextResponse.json(
      { error: "Failed to fetch phases" },
      { status: 500 },
    );
  }
}
