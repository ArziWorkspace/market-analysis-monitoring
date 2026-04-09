import type { PipelineRun, CurrentPipeline } from "../types"

export const pipelineHistoryQuery = {
  queryKey: ["pipeline", "history"],
  queryFn: async (): Promise<PipelineRun[]> => {
    const res = await fetch("/api/pipeline")
    if (!res.ok) return []
    const data = await res.json()
    return data.runs || []
  },
}

export const currentPipelineQuery = {
  queryKey: ["pipeline", "current"],
  queryFn: async (): Promise<CurrentPipeline | null> => {
    const res = await fetch("/api/pipeline")
    if (!res.ok) return null
    const data = await res.json()
    return data.current || null
  },
}

export const latestRunQuery = {
  queryKey: ["pipeline", "latest"],
  queryFn: async (): Promise<PipelineRun | null> => {
    const res = await fetch("/api/pipeline")
    if (!res.ok) return null
    const data = await res.json()
    return data.latest || null
  },
}

export const pipelineDetailQuery = (runId: string) => ({
  queryKey: ["pipeline", "detail", runId],
  queryFn: async () => {
    const res = await fetch(`/api/pipeline/${runId}`)
    if (!res.ok) throw new Error("Failed to fetch pipeline")
    return res.json()
  },
})

export const phaseDetailQuery = (runId: string, phase: string) => ({
  queryKey: ["pipeline", "detail", runId, "phase", phase],
  queryFn: async () => {
    const res = await fetch(`/api/pipeline/${runId}/phase/${phase}`)
    if (!res.ok) throw new Error("Failed to fetch phase")
    return res.json()
  },
})
