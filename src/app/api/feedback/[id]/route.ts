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

    return NextResponse.json({
      ...feedback,
      pipelineId: feedback.pipelineId,
    });
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
    const { status, items } = body;

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

    // Update data object
    const data: Record<string, unknown> = {};
    if (status !== undefined) data.status = status;

    // Handle items if provided: update existing, add new, remove deleted
    if (items !== undefined) {
      const incoming = items as Array<{
        id?: string;
        phase: string;
        content: string;
      }>;
      const existingItems = await prisma.feedbackItem.findMany({
        where: { feedbackId: id },
        select: { id: true },
      });
      const existingIds = new Set(existingItems.map((i) => i.id));
      const incomingIds = new Set(
        incoming.filter((i) => i.id).map((i) => i.id),
      );

      // Delete items not in payload
      const toDelete = [...existingIds].filter((eid) => !incomingIds.has(eid));
      if (toDelete.length > 0) {
        await prisma.feedbackItem.deleteMany({
          where: { id: { in: toDelete } },
        });
      }

      // Upsert incoming items
      for (const item of incoming) {
        if (item.id) {
          // Update existing
          await prisma.feedbackItem.update({
            where: { id: item.id },
            data: { phase: item.phase, content: item.content },
          });
        } else {
          // Create new
          await prisma.feedbackItem.create({
            data: { feedbackId: id, phase: item.phase, content: item.content },
          });
        }
      }
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data,
      include: {
        pipeline: {
          select: { id: true, runId: true, date: true, status: true },
        },
        items: { orderBy: { createdAt: "asc" } },
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
