"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Archive, RotateCcw } from "lucide-react"

type FeedbackStatus = "DRAFT" | "SUBMITTED" | "RESOLVED" | "ARCHIVED" | "REJECTED"

interface Pipeline {
  id: string
  runId: string
  date: string
  status: string
}

interface Phase {
  phase: string
  status: string | null
}

interface FeedbackItem {
  id?: string
  phase: string
  content: string
}

interface FeedbackData {
  id?: string
  pipelineId: string
  status: FeedbackStatus
  items: FeedbackItem[]
}

interface FeedbackFormProps {
  mode: "create" | "edit"
  initialData?: FeedbackData
  readOnly?: boolean
}

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  RESOLVED: "Resolved",
  ARCHIVED: "Archived",
  REJECTED: "Rejected",
}

const STATUS_BADGE_VARIANT: Record<FeedbackStatus, "secondary" | "default" | "destructive" | "outline" | "success"> = {
  DRAFT: "secondary",
  SUBMITTED: "default",
  RESOLVED: "success",
  ARCHIVED: "outline",
  REJECTED: "destructive",
}

export function FeedbackForm({ mode, initialData, readOnly = false }: FeedbackFormProps) {
  const router = useRouter()
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [phases, setPhases] = useState<Phase[]>([])
  const [selectedPipelineId, setSelectedPipelineId] = useState(initialData?.pipelineId ?? "")
  const [items, setItems] = useState<FeedbackItem[]>(initialData?.items ?? [])
  const [status, setStatus] = useState<FeedbackStatus>(initialData?.status ?? "DRAFT")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch pipelines on mount
  useEffect(() => {
    fetch("/api/pipelines")
      .then((r) => r.json())
      .then((data) => setPipelines(Array.isArray(data) ? data : []))
      .catch(console.error)
  }, [])

  // Fetch phases when pipeline is selected
  useEffect(() => {
    if (!selectedPipelineId) {
      setPhases([])
      return
    }
    fetch(`/api/pipelines/${selectedPipelineId}/phases`)
      .then((r) => r.json())
      .then((data) => setPhases(Array.isArray(data) ? data : []))
      .catch(console.error)
  }, [selectedPipelineId])

  const isLocked = status === "RESOLVED" || status === "ARCHIVED"

  // Get phases not yet assigned to any item
  const availablePhases = phases.filter(
    (p) => !items.some((item) => item.phase === p.phase)
  )

  // Check if the last item has a phase selected (so we can show a new empty row)
  const lastItem = items[items.length - 1]
  const showNewRow = selectedPipelineId && mode === "create" && lastItem?.phase && availablePhases.length > 0

  // Add a new empty row
  const addNewRow = () => {
    setItems([...items, { phase: "", content: "" }])
  }

  // Check if we should show the add-row button (last item has phase, and there are more phases available)
  const canAddRow = selectedPipelineId && mode === "create" && lastItem?.phase && availablePhases.length > 0

  const handleSubmit = async (submitStatus?: FeedbackStatus) => {
    const validItems = items.filter((item) => item.phase)
    if (validItems.length === 0) {
      setError("Add at least one feedback item")
      return
    }

    setLoading(true)
    setError("")

    try {
      const url =
        mode === "edit" && initialData?.id
          ? `/api/feedback/${initialData.id}`
          : "/api/feedback"

      const method = mode === "edit" ? "PATCH" : "POST"

      const body: Record<string, unknown> =
        mode === "edit"
          ? { status: submitStatus ?? status }
          : { pipelineId: selectedPipelineId, items: validItems }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Failed to save")
      }

      router.push("/feedback")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (readOnly || isLocked) {
    return (
      <div className="space-y-4">
        {initialData?.pipelineId && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Pipeline:</span>
            <Badge variant="outline">{initialData.pipelineId}</Badge>
            <Badge
              variant={
                STATUS_BADGE_VARIANT[status] as
                  | "secondary"
                  | "default"
                  | "destructive"
                  | "outline"
                  | "success"
              }
            >
              {STATUS_LABELS[status]}
            </Badge>
          </div>
        )}
        <div className="space-y-3">
          {items.map((item, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-2" />
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl pb-12">
      {/* Pipeline Select */}
      {mode === "create" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Pipeline</label>
          <Select value={selectedPipelineId} onValueChange={(v) => {
            setSelectedPipelineId(v)
            setItems([{ phase: "", content: "" }])
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a pipeline..." />
            </SelectTrigger>
            <SelectContent>
              {pipelines.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.runId} — {p.date} ({p.status})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Status selector for edit mode */}
      {mode === "edit" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={status} onValueChange={(v) => setStatus(v as FeedbackStatus)}>
            <SelectTrigger className="w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                ["DRAFT", "SUBMITTED", "RESOLVED", "ARCHIVED", "REJECTED"] as FeedbackStatus[]
              ).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Unified phase rows */}
      {selectedPipelineId && mode === "create" && (
        <div className="space-y-3">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1
            // This row's dropdown shows all phases EXCEPT those selected by OTHER rows
            const otherSelectedPhases = items
              .filter((_, i) => i !== idx)
              .map((item) => item.phase)
              .filter(Boolean)
            const rowPhases = phases.filter((p) => !otherSelectedPhases.includes(p.phase))

            return (
              <Card key={idx}>
                <CardHeader className="pb-2 flex flex-row justify-end">
                  {!item.phase && (
                    <span className="text-sm text-muted-foreground">Choose a phase...</span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newItems = items.filter((_, i) => i !== idx)
                      if (newItems.length === 0) {
                        newItems.push({ phase: "", content: "" })
                      }
                      setItems(newItems)
                    }}
                  >
                    ✕
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select
                    value={item.phase}
                    onValueChange={(phase) => {
                      const newItems = [...items]
                      newItems[idx] = { ...newItems[idx], phase }
                      setItems(newItems)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a phase..." />
                    </SelectTrigger>
                    <SelectContent>
                      {rowPhases.map((p) => (
                        <SelectItem key={p.phase} value={p.phase}>
                          {p.phase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    value={item.content}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[idx] = { ...newItems[idx], content: e.target.value }
                      setItems(newItems)
                    }}
                    placeholder="Enter feedback..."
                    rows={3}
                  />
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add Phase button */}
      {selectedPipelineId && mode === "create" && (
        <Button
          variant="outline"
          onClick={() => setItems([...items, { phase: "", content: "" }])}
          className="w-full"
        >
          + Add Phase
        </Button>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Submit actions */}
      {mode === "create" && (
        <div className="flex gap-2">
          <Button onClick={() => handleSubmit("DRAFT")} disabled={loading}>
            Save Draft
          </Button>
          <Button onClick={() => handleSubmit("SUBMITTED")} disabled={loading}>
            <Send className="h-4 w-4" />
            Submit
          </Button>
        </div>
      )}

      {mode === "edit" && !isLocked && (
        <div className="flex gap-2">
          <Button onClick={() => handleSubmit()} disabled={loading}>
            Save Changes
          </Button>
          {status === "DRAFT" && (
            <Button variant="outline" onClick={() => handleSubmit("SUBMITTED")}>
              <Send className="h-4 w-4" />
              Submit
            </Button>
          )}
          {status === "SUBMITTED" && (
            <Button variant="outline" onClick={() => handleSubmit("RESOLVED")}>
              <RotateCcw className="h-4 w-4" />
              Resolve
            </Button>
          )}
          <Button variant="ghost" onClick={() => handleSubmit("ARCHIVED")}>
            <Archive className="h-4 w-4" />
            Archive
          </Button>
        </div>
      )}
    </div>
  )
}
