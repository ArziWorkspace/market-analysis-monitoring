import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const LOCKED_STATUSES = ["RESOLVED", "ARCHIVED"]

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id, itemId } = await params
    const body = await request.json()
    const { content } = body

    // Get feedback to check status
    const feedback = await prisma.feedback.findUnique({
      where: { id },
    })

    if (!feedback) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    }

    if (LOCKED_STATUSES.includes(feedback.status)) {
      return NextResponse.json(
        { error: "Cannot edit items when feedback is RESOLVED or ARCHIVED" },
        { status: 403 }
      )
    }

    const updated = await prisma.feedbackItem.update({
      where: { id: itemId },
      data: { content },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("PATCH /api/feedback/[id]/item/[itemId] error:", error)
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id, itemId } = await params

    // Get feedback to check status
    const feedback = await prisma.feedback.findUnique({
      where: { id },
    })

    if (!feedback) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    }

    if (LOCKED_STATUSES.includes(feedback.status)) {
      return NextResponse.json(
        { error: "Cannot delete items when feedback is RESOLVED or ARCHIVED" },
        { status: 403 }
      )
    }

    await prisma.feedbackItem.delete({
      where: { id: itemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/feedback/[id]/item/[itemId] error:", error)
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}
