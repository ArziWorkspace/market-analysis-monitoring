import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: {
        pipeline: {
          select: {
            id: true,
            runId: true,
            date: true,
            status: true,
          },
        },
        items: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("GET /api/feedback error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedbacks" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pipelineId, items } = body;

    if (!pipelineId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "pipelineId and at least one item are required" },
        { status: 400 },
      );
    }

    // Validate all items have phase
    for (const item of items) {
      if (!item.phase) {
        return NextResponse.json(
          { error: "Each item must have a phase" },
          { status: 400 },
        );
      }
    }

    // Verify pipeline exists
    const pipeline = await prisma.pipelineRun.findUnique({
      where: { id: pipelineId },
    });

    if (!pipeline) {
      return NextResponse.json(
        { error: "Pipeline not found" },
        { status: 404 },
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        pipelineId,
        items: {
          create: items.map((item: { phase: string; content: string }) => ({
            phase: item.phase,
            content: item.content?.trim() ?? "",
          })),
        },
      },
      include: {
        pipeline: {
          select: { id: true, runId: true, date: true, status: true },
        },
        items: true,
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("POST /api/feedback error:", error);
    return NextResponse.json(
      { error: "Failed to create feedback" },
      { status: 500 },
    );
  }
}
