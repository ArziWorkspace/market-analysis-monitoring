import type { PipelineRun, CurrentPipeline } from "./types"

const SHARED_DATA_PATH = "/root/.openclaw/shared-data"

export async function getPipelineRuns(): Promise<PipelineRun[]> {
  try {
    const { readFile } = await import("fs/promises")
    const content = await readFile(`${SHARED_DATA_PATH}/pipeline_tracker.json`, "utf-8")
    const data = JSON.parse(content)
    return data.runs ?? []
  } catch {
    return []
  }
}

export async function getCurrentPipeline(): Promise<CurrentPipeline | null> {
  try {
    const { readFile } = await import("fs/promises")
    const content = await readFile(`${SHARED_DATA_PATH}/pipeline_tracking.json`, "utf-8")
    const data = JSON.parse(content)
    if (!data || Object.keys(data).length === 0) return null
    return data as CurrentPipeline
  } catch {
    return null
  }
}

export async function getLatestRun(): Promise<PipelineRun | null> {
  const runs = await getPipelineRuns()
  if (runs.length === 0) return null
  return runs[runs.length - 1]
}

export async function getRunCount(): Promise<number> {
  try {
    const { readFile } = await import("fs/promises")
    const count = await readFile(`${SHARED_DATA_PATH}/run_counter.txt`, "utf-8")
    return parseInt(count.trim(), 10) || 0
  } catch {
    return 0
  }
}
