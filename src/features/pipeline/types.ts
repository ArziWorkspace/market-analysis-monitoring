export type PhaseName =
  | "data_gathering"
  | "macro_analysis"
  | "ihsg_analysis"
  | "sector_analysis"
  | "stock_screener"
  | "stock_analyst"
  | "fundamental_analyst"
  | "report_generation"

export type PhaseStatus = "pending" | "running" | "completed" | "failed"

export interface Phase {
  phase_id?: string
  phase: PhaseName
  status: PhaseStatus
  timestamp: string
  details?: Record<string, unknown>
}

export interface PipelineRun {
  run_id: string
  pipeline_id?: string
  date: string
  started_at: string
  completed_at?: string
  phases: Phase[]
  report_url?: string
}

export interface CurrentPipeline {
  run_id: string
  phase: PhaseName
  status: "running" | "paused"
  started_at: string
}

export interface RunSummary {
  run_id: string
  date: string
  duration?: string
  phase_count: number
  completed_count: number
  status: "completed" | "failed" | "in_progress"
  report_url?: string
}

export const PHASE_LABELS: Record<PhaseName, string> = {
  data_gathering: "Data Gathering",
  macro_analysis: "Macro Analyst",
  ihsg_analysis: "IHSG Analyst",
  sector_analysis: "Sector Analyst",
  stock_screener: "Stock Screener",
  stock_analyst: "Stock Analyst",
  fundamental_analyst: "Fundamental Analyst",
  report_generation: "Report Generator",
} as const
