import type { PipelineRun, CurrentPipeline } from "../types"
import { getPipelineRuns, getCurrentPipeline, getLatestRun } from "../dal/queries"

export const pipelineHistoryQuery = {
  queryKey: ["pipeline", "history"],
  queryFn: getPipelineRuns,
}

export const currentPipelineQuery = {
  queryKey: ["pipeline", "current"],
  queryFn: getCurrentPipeline,
}

export const latestRunQuery = {
  queryKey: ["pipeline", "latest"],
  queryFn: getLatestRun,
}
