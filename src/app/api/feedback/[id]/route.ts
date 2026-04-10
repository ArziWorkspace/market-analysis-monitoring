import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LOCKED_STATUSES = ["RESOLVED", "ARCHIVED"];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const feedback = await prisma.feedback.findUnique({
      where: { id },
      include: {
        pipeline: {
          select: { id: true, runId: true, date: true, status: true },
        },
        items: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("GET /api/feedback/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

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
        { error: "Cannot update feedback with status RESOLVED or ARCHIVED" },
        { status: 403 },
      );
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data: { status },
      include: {
        pipeline: {
          select: { id: true, runId: true, date: true, status: true },
        },
        items: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/feedback/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update feedback" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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
        { error: "Cannot delete feedback with status RESOLVED or ARCHIVED" },
        { status: 403 },
      );
    }

    await prisma.feedback.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/feedback/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete feedback" },
      { status: 500 },
    );
  }
}
