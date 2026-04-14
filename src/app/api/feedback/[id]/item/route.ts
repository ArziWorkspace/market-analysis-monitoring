import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LOCKED_STATUSES = ["RESOLVED", "ARCHIVED"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { phase, content } = body;

    const feedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 },
      );
    }

    if (LOCKED_STATUSES.includes(feedback.status)) {
      return NextResponse.json(
        { error: "Cannot add items when feedback is RESOLVED or ARCHIVED" },
        { status: 403 },
      );
    }

    if (!phase || !content) {
      return NextResponse.json(
        { error: "phase and content are required" },
        { status: 400 },
      );
    }

    const item = await prisma.feedbackItem.create({
      data: { feedbackId: id, phase, content },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/feedback/[id]/item error:", error);
    return NextResponse.json(
      { error: "Failed to add item" },
      { status: 500 },
    );
  }
}
